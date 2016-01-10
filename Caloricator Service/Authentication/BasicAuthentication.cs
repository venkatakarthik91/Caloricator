﻿using System;
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
    class BasicAuthentication:IHttpModule
    {
        private const string Realm = "My Realm";
        static bool newUser = false;

        public void Init(HttpApplication context)
        {
            // Register event handlers
            newUser = false;
            context.AuthenticateRequest += OnApplicationAuthenticateRequest;
            context.EndRequest += OnApplicationEndRequest;
        }

        private static void SetPrincipal(IPrincipal principal)
        {
            Thread.CurrentPrincipal = principal;
            if (HttpContext.Current != null)
            {
                HttpContext.Current.User = principal;
            }
        }

        // TODO: Here is where you would validate the username and password.
        private static bool CheckPassword(string username, string password)
        {
            return username == "user" && password == "password";
        }

        private static void AuthenticateUser(string token)
        {
            try
            {
                var encoding = Encoding.GetEncoding("iso-8859-1");
                credentials = encoding.GetString(Convert.FromBase64String(credentials));

                int separator = credentials.IndexOf(':');
                string name = credentials.Substring(0, separator);
                string password = credentials.Substring(separator + 1);

                if (CheckPassword(name, password))
                {
                    var identity = new GenericIdentity(name);
                    SetPrincipal(new GenericPrincipal(identity, null));
                }
                else
                {
                    // Invalid username or password.
                    HttpContext.Current.Response.StatusCode = 401;
                }
            }
            catch (FormatException)
            {
                // Credentials were not formatted correctly.
                HttpContext.Current.Response.StatusCode = 401;
            }
        }

        private static void OnApplicationAuthenticateRequest(object sender, EventArgs e)
        {
            var request = HttpContext.Current.Request;
            var token = request.Headers["AppAuthorization"];
            if (token != null)
            {
                AuthenticateUser(token);
            }
            else
            {
                //Implies new user
                newUser = true;
            }
        }

        // If the request was unauthorized, add the WWW-Authenticate header 
        // to the response.
        private static void OnApplicationEndRequest(object sender, EventArgs e)
        {
            var response = HttpContext.Current.Response;
            if (response.StatusCode == 401)
            {
                //response.Headers.Add("WWW-Authenticate",
                //    string.Format("Basic realm=\"{0}\"", Realm));
                response.Headers.Add("newUser", "true");
            }
            if (newUser)
            {
                response.Headers.Add("newUser", "true");
            }
        }

        public void Dispose()
        {
        }
    }
}