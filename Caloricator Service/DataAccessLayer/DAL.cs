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
        private static MySqlConnection connection = null;
        static DAL()
        {
            string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["DB_Conn"].ConnectionString;
            connection = new MySqlConnection(connectionString);
        }
        private static byte ConvertToBit(bool value)
        {
            if (value)
            {
                return 1;
            }
            return 0;
        }
        internal static User GetUserObject(string token)
        {
            User user = new User();
            MySqlCommand cmd = null;
            MySqlDataReader reader = null;
            user.Uid = -1;
            try
            {
                string sql = "SELECT ID, LastName, FirstName, Email, Sex, DOB FROM Users WHERE Token = \""+token+"\"";
                cmd = new MySqlCommand(sql, connection);
                //cmd.Parameters.AddWithValue("@token", token);
                connection.Open();
                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    user.Uid = reader.GetInt32("ID");
                    user.LastName = reader.GetString("LastName");
                    user.FirstName = reader.GetString("FirstName");
                    user.Email = reader.GetString("Email");
                    user.Sex = true;
                    if (reader.GetInt32("Sex") == 0)
                    {
                        user.Sex = false;
                    }
                    user.Dob = reader.GetDateTime("DOB");
                    user.Token = token;
                }
            }
            catch (Exception ex)
            {

            }
            finally
            {
                if (reader != null) reader.Close();
                if (connection != null) connection.Close();
            }
            return user;
        }
        internal static bool InsertNewUserInDB(User user)
        {
            try
            {
                string query = @"INSERT INTO Users (LastName,FirstName,Email,Password,Sex,DOB,Token)
                    VALUES(@lastName,@firstName,@email,@password,@sex,@dob,@token);";
                using (MySqlCommand cmd = new MySqlCommand(query, connection))
                {
                    cmd.Parameters.AddWithValue("@lastName", user.LastName);
                    cmd.Parameters.AddWithValue("@firstName", user.FirstName);
                    cmd.Parameters.AddWithValue("@email", user.Email);
                    cmd.Parameters.AddWithValue("@password", user.Password);
                    cmd.Parameters.AddWithValue("@sex",ConvertToBit(user.Sex));
                    cmd.Parameters.AddWithValue("@dob", user.Dob);
                    cmd.Parameters.AddWithValue("@token", user.Token);

                    connection.Open();
                    cmd.ExecuteNonQuery();
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                connection.Close();
                return false;
            }
            return true;
        }
        internal static bool CheckIfEmailExists(string email)
        {
            MySqlCommand cmd = null;
            MySqlDataReader reader = null;
            try
            {
                string sql = "SELECT ID FROM Users WHERE Email = \"" + email + "\"";
                cmd = new MySqlCommand(sql, connection);
                //cmd.Parameters.AddWithValue("@token", token);
                connection.Open();
                reader = cmd.ExecuteReader();
                while (reader.Read())
                {                   
                    return true;
                }
            }
            catch (Exception ex)
            {

            }
            finally
            {
                if (reader != null) reader.Close();
                if (connection != null) connection.Close();
            }
            return false;
        }
    }
}
