using Caloricator_Service.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Caloricator_Service.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*", exposedHeaders: "*")]
    public class UserController : ApiController
    {
        // GET api/<controller>
        CustomIdentity identity = HttpContext.Current.User.Identity as CustomIdentity;
        [Authorize]
        public Caloricator_Service.DataAccessLayer.User Get()
        {
            return identity.User;
        }
        [Authorize]
        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public string Post([FromBody]dynamic userData)
        {
            string emailId = userData.email;
            string password = userData.password;
            string cookie =  BusinessLogic.CoreBusinessLogic.ValidateCredentials(emailId, password);
            if (cookie==string.Empty)
            {
                throw new HttpException("The credentials are invalid");
            }
            else
            {
                return cookie;
            }
        }
        [Authorize]
        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }
        [Authorize]
        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}