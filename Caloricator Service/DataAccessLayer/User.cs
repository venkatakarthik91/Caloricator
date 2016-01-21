using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Caloricator_Service.DataAccessLayer
{
    public class User
    {
        private string password;

        private int uid;
        public int Uid
        {
            get
            {
                return uid;
            }

            set
            {
                uid = value;
            }
        }

        public string LastName
        {
            get
            {
                return lastName;
            }

            set
            {
                lastName = value;
            }
        }

        public string FirstName
        {
            get
            {
                return firstName;
            }

            set
            {
                firstName = value;
            }
        }

        public bool Sex
        {
            get
            {
                return sex;
            }

            set
            {
                sex = value;
            }
        }

        

        public string Token
        {
            get
            {
                return token;
            }

            set
            {
                token = value;
            }
        }

        public string Email
        {
            get
            {
                return email;
            }

            set
            {
                email = value;
            }
        }

        public string Password
        {
            get
            {
                return password;
            }

            set
            {
                password = value;
            }
        }

        public int Age
        {
            get
            {
                return Convert.ToInt32(((DateTime.Now - dob).TotalDays) / 365);
            }       
        }
        public DateTime Dob
        {
            get
            {
                return dob;
            }
            set
            {
                dob = value;
            }
        }

        private string lastName;
        private string firstName;
        private bool sex;
        private DateTime dob;
        private string token;
        private string email;

    }
}
