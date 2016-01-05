using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Caloricator_Service.DataAccessLayer
{
    public class DataAccessLayer
    {
        int uid;
        public DataAccessLayer(int uid)
        {
            this.uid = uid;
        }
        public DataAccessLayer() { }
        public IEnumerable<object> GetBenefitsData()
        {
            var arrayOfBenefits = new[]{
                new {title="Increased Confidence",description="When we are healthy and looking good , people will be attracted to us and our chances of success increases",importance=3},
                new {title="Better Health",description="We reduce on the junk food as we will be conscious of what we are eating",importance=1},
                new {title="Become Thinner",description="We can reduce the intake and increase the expenditure to get thinner",importance=2}
            };
            return arrayOfBenefits;
        }
    }
}
