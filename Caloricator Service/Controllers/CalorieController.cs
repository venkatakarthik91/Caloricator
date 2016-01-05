using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Caloricator_Service.Models;
using Caloricator_Service.DataAccessLayer;
using System.Web.Http.Cors;

namespace Caloricator_Service.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*",exposedHeaders:"*")]
    public class CalorieController : ApiController
    {
        // GET: api/Calorie
        public IEnumerable<Object> Get()
        {
            //return new string[] { "value1", "value2" };
            return (new UserData(1)).GetBenefitsData();
            
        }

        // GET: api/Calorie/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Calorie
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Calorie/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Calorie/5
        public void Delete(int id)
        {
        }
    }
}
