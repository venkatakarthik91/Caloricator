using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using System.Web;
using System.Threading;

namespace Caloricator_Service.Authentication
{
    class BasicAuthentication : IHttpModule
    {
        private const string Realm = "My Realm";
        internal DataAccessLayer.User user = null;

        public void Init(HttpApplication context)
        {
            // Register event handlers
            context.AuthenticateRequest += OnApplicationAuthenticateRequest;
            context.EndRequest += OnApplicationEndRequest;
        }

        private void Context_BeginRequest(object sender, EventArgs e)
        {
        }

        private static void SetPrincipal(IPrincipal principal)
        {
            Thread.CurrentPrincipal = principal;
            if (HttpContext.Current != null)
            {
                HttpContext.Current.User = principal;
            }
        }
        private void AuthenticateUser(string token)
        {
            try
            {
                user = DataAccessLayer.DAL.GetUserObject(token);
                if (user.Uid != -1)
                {
                    var identity = new CustomIdentity(user);
                    SetPrincipal(new GenericPrincipal(identity, null));
                    //
                }
                else
                {
                    // Invalid User
                    HttpContext.Current.Response.StatusCode = 401;
                }
            }
            catch (Exception)
            {
                HttpContext.Current.Response.StatusCode = 401;
            }
        }

        private void OnApplicationAuthenticateRequest(object sender, EventArgs e)
        {
            var request = HttpContext.Current.Request;
            var token = request.Headers["AppAuth"];
            if (token != null)
            {
                AuthenticateUser(token);
            }
        }

        // If the request was unauthorized, add the WWW-Authenticate header 
        // to the response.
        private void OnApplicationEndRequest(object sender, EventArgs e)
        { 
        }

        public void Dispose()
        {
        }
    }
}
