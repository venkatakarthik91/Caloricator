using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Collections.Specialized;
using System.Web;
using Caloricator_Service.BusinessLogic;
using Caloricator_Service.Authentication;
using System.Data;

namespace Caloricator_Service.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*", exposedHeaders: "*")]
    [Authorize]
    public class CalorieController : ApiController
    {
        CustomIdentity identity = HttpContext.Current.User.Identity as CustomIdentity;
        // GET: api/Calorie
        public object Get()
        {
            NameValueCollection nvc = HttpUtility.ParseQueryString(Request.RequestUri.Query);
            string operation = nvc["operation"];
            object returnData = null;
            if (operation.Equals("GetCaloireCountForToday", StringComparison.OrdinalIgnoreCase))
            {
                DateTime todaysDate = Convert.ToDateTime(nvc["todaysDate"]);
                returnData = CoreBusinessLogic.GetCaloireCountForToday(identity.User.Uid,todaysDate);
            }
            //if (operation.Equals("GetDaysFailedAndPassedInPast1Week", StringComparison.OrdinalIgnoreCase))
            //{
            //    returnData = CoreBusinessLogic.GetDaysFailedAndPassedInPast1Week(identity.User.Uid);
            //}
            //if (operation.Equals("GetDaysFailedAndPassedCustom", StringComparison.OrdinalIgnoreCase))
            //{
            //    DateTime startDate = Convert.ToDateTime(nvc["startDate"]);
            //    DateTime endDate = Convert.ToDateTime(nvc["endDate"]);
            //    returnData = CoreBusinessLogic.GetDaysFailedAndPassedCustom(identity.User.Uid, startDate, endDate);
            //}
            return returnData;
        }

        // GET: api/Calorie/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST: api/Calorie
        public void Post([FromBody]dynamic value)
        {
            int amountofCalories = value.AmountofCalories;
            int timeZoneOffset = value.timeZoneOffset;
            DateTime currentDateTime = value.dateTime;
            DateTime dateTimeAccordingToUserTimeZone = currentDateTime.AddMinutes(-1 * timeZoneOffset);
            string comments = value.comments;
            CoreBusinessLogic.Addcalories(identity.User.Uid, amountofCalories, dateTimeAccordingToUserTimeZone,comments);
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
