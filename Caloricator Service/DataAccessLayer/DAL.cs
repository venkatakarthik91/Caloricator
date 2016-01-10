using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace Caloricator_Service.DataAccessLayer
{
    public class DAL
    {
        private int uid;
        private MySqlConnection connection = null;

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

        public DAL(int uid)
        {
            Uid = uid;
            string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["DB_Conn"].ConnectionString;
            connection = new MySqlConnection(connectionString);
        }
        public DAL()
        {
            string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["DB_Conn"].ConnectionString;
            connection = new MySqlConnection(connectionString);
        }
        public IEnumerable<object> GetBenefitsData()
        {
            var arrayOfBenefits = new[]{
                new {title="Increased Confidence",description="When we are healthy and looking good , people will be attracted to us and our chances of success increases",importance=3},
                new {title="Better Health",description="We reduce on the junk food as we will be conscious of what we are eating",importance=1},
                new {title="Become Thinner",description="We can reduce the intake and increase the expenditure to get thinner",importance=2}
            };
            return arrayOfBenefits;
        }
        internal void StoreTokenInDB(string token,string userName)
        {
            MySqlCommand cmd = new MySqlCommand("Insert into contacts values(@name , @email , @message)");
            cmd.Connection = connection;
            cmd.CommandType = System.Data.CommandType.Text;
            cmd.Parameters.AddWithValue("@name", name);
            cmd.Parameters.AddWithValue("@email", email);
            cmd.Parameters.AddWithValue("@message", message);
            connection.Open();
            cmd.ExecuteNonQuery();
            connection.Close();
        }
    }
}
