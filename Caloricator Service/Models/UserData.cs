using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Caloricator_Service.DataAccessLayer;
using System.Data;

namespace Caloricator_Service.Models
{
    public class UserData
    {
        DataAccessLayer.DataAccessLayer csDAL;
        public  UserData(int uid)
        {
            csDAL = new DataAccessLayer.DataAccessLayer(uid);
        }public UserData() { }
        public IEnumerable<object> GetBenefitsData()
        {
            return csDAL.GetBenefitsData();
        }
    }
}
