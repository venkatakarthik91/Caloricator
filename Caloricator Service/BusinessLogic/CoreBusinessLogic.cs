using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Caloricator_Service.DataAccessLayer;
namespace Caloricator_Service.BusinessLogic
{
    class CoreBusinessLogic
    {
        internal static int GetCaloireCountForToday(int uid,DateTime date)
        {
            return DAL.GetCaloriesConsumed(uid, date);
        }
        //internal static DataTable GetDaysFailedAndPassedInPast1Week(int uid)
        //{

        //}
        //internal static DataTable GetDaysFailedAndPassedCustom(int uid, DateTime startDate, DateTime endDate)
        //{

        //}
        internal static bool Addcalories(int uid, int calories, DateTime timeStamp,string comments)
        {
            return DAL.InsertCaloriesData(uid, calories, timeStamp,comments);
        }
    }
}
