using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Caloricator_Service.DataAccessLayer;

namespace Caloricator_Service.Authentication
{
    class CustomIdentity : IIdentity
    {
        User user = null;
        public CustomIdentity(User user)
        {
            this.user = user;
        }
        public string AuthenticationType
        {
            get
            {
                return "Custom Authentication";
            }
        }

        public bool IsAuthenticated
        {
            get
            {
                if (User.Uid>-1)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public string Name
        {
            get
            {
                return User.FirstName;
            }
        }

        public User User
        {
            get
            {
                return user;
            }
        }
    }
}
