using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using Caloricator_Service.DataAccessLayer;
using System.Web;

namespace Caloricator_Service.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*", exposedHeaders: "*")]
    public class NewUserController : ApiController
    {
        //// GET: api/NewUser
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        //// GET: api/NewUser/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST: api/NewUser
        public string Post([FromBody] User user)
        {
            string token = Guid.NewGuid().ToString();
            user.Token = token;
            bool insertResult = DAL.InsertNewUserInDB(user);
            if (insertResult == false)
            {
                throw new HttpUnhandledException();
            }
            return token;
        }

    //    // PUT: api/NewUser/5
    //    public void Put(int id, [FromBody]string value)
    //    {
    //    }

    //    // DELETE: api/NewUser/5
    //    public void Delete(int id)
    //    {
    //    }
    }
}
