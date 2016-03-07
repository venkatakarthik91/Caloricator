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
        internal static DataTable GetCalorieData(int uid, DateTime startDate, DateTime endDate)
        {
            return DAL.GetCalorieData(uid, startDate, endDate);
        }
        //internal static DataTable GetDaysFailedAndPassedCustom(int uid, DateTime startDate, DateTime endDate)
        //{

        //}
        internal static bool Addcalories(int uid, int calories, DateTime timeStamp,string comments)
        {
            return DAL.InsertCaloriesData(uid, calories, timeStamp,comments);
        }
        internal static string ValidateCredentials(string emailId, string password)
        {
            return DAL.ValidateCredentials(emailId, password);
        } 
        internal static string GetSecurityQuestion(string email)
        {
            return DAL.GetSecurityQuestion(email);
        }
        internal static string CheckIfAnswerIsCorrect(string answer,string email)
        {
            string answerFromDB = DAL.GetAnswerForEmail(email);
            if (answer.Equals(answerFromDB, StringComparison.OrdinalIgnoreCase))
            {
                return "true";
            }
            return "false";
        }
        internal static string UpdatePassword(string emailId, string password)
        {
            if (DAL.UpdatePassword(emailId, password))
            {
                return "true";
            }
            return "false";
        }
    }
}
