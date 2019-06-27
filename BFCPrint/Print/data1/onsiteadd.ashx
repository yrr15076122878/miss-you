<%@ WebHandler Language="C#" Class="onsiteadd" %>

using System;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Text;
using System.Data.OleDb;
using System.Data.SqlClient;
public class onsiteadd : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        string Fname = context.Request.Form["FamilyName"] != null ? context.Request.Form["FamilyName"].ToString() : "";
        string Lname = context.Request.Form["lname"] != null ? context.Request.Form["lname"].ToString() : "";
        string Company = context.Request.Form["company"] != null ? context.Request.Form["company"].ToString() : "";
        string Jobtitle = context.Request.Form["position"] != null ? context.Request.Form["position"].ToString() : "";
        string Countrycode = context.Request.Form["country"] != null ? context.Request.Form["country"].ToString() : "";
        string Countryname = "";
        string barcode = "";
        string provincename = "";
        string provincecode = context.Request.Form["province"] != null ? context.Request.Form["province"].ToString() : "";
        string Category = context.Request.Form["category"] != null ? context.Request.Form["category"].ToString() : "";
        string remark = context.Request.Form["remark"] != null ? context.Request.Form["remark"].ToString() : "";
        string phone = context.Request.Form["phone"] != null ? context.Request.Form["phone"].ToString() : "";
        string Email = context.Request.Form["email"] != null ? context.Request.Form["email"].ToString() : "";

        if (!string.IsNullOrEmpty(phone))
        {
            var phonecheck = "select * from usertable where Mobilephone='" + phone + "' and InfoStatu=0";
            var gg = SqlHelper.ExecuteDataSet(phonecheck);
            if (gg.Tables[0].Rows.Count > 0)
            {
                context.Response.Write("2");
                context.Response.End();
            }
        }
        if (!string.IsNullOrEmpty(Email))
        {
            var emailcheck = "select * from usertable where Email='" + Email + "' and InfoStatu=0";
            var ee = SqlHelper.ExecuteDataSet(emailcheck);
            if (ee.Tables[0].Rows.Count > 0)
            {
                context.Response.Write("3");
                context.Response.End();
            }
        }



        if (Countrycode != "")
        {

            string sqlname = "select countryen from Country where countrycode='" + Countrycode + "'";
            Countryname = SqlHelper.ExecuteScalar(sqlname).ToString();
        }
        string Provincecode = "";
        if (Countrycode == "86" && provincecode != "")
        {

            string sqlname = "select province from Province where p_code='" + provincecode + "'";
            provincename = SqlHelper.ExecuteScalar(sqlname).ToString();
            Provincecode = provincecode;
        }

        if (Company.Contains("'"))
        {
            Company = Company.Replace("'", ":\'");
        }


        string ss = "select * from UserTable where UserName=@UserName and Company=@Company  and InfoStatu=0";


        //int counts = SqlHelper.GetRecordCount("UserTable", " UserName='" + Fname + "' and Company=@Company");
        SqlParameter[] orderparmcs ={   
                                         new SqlParameter("@UserName",SqlDbType.VarChar),
                                        new SqlParameter("@Company",SqlDbType.VarChar)       
                                    };
        orderparmcs[0].Value = Fname;
        orderparmcs[1].Value = Company;
        DataTable dts = SqlHelper.ExecuteDataSet(ss.ToString(), orderparmcs).Tables[0];
        int counts = dts.Rows.Count;
        if (counts == 0)
        {
            // barcode = GetRegno(Category);
            //string str = "insert into tblreg (regno,Fname,Lname,Company,Jobtitle,email,mob,Category,PTime,PrintStatus,CountryCode,ProvinceCode,Countryname,provincename,remark) values (@regno,@Fname,@Lname,@Company,@Jobtitle,@email,@mob,@Category,@PTime,@PrintStatus,@CountryCode,@ProvinceCode,@Countryname,@provincename,@remark)";
            string str = "insert into UserTable(id,uid,isdelete,CreateTime,InfoStatu,IsSend,UserName,Company,Country,Province,Category,Remark,PrintTime,PrintStatu,Mobilephone,Email,OnSite) values(NEWID(),'" + Guid.NewGuid() + "',0,'" + DateTime.Now + "','0',0,@Fname,@Company,@CountryCode,@ProvinceCode,@Category,@remark,'" + DateTime.Now + "','1','" + phone + "','" + Email + "','1')Select @@Identity";
            SqlParameter[] orderparms ={                                                              
                                  //new SqlParameter("@regno",SqlDbType.VarChar),
                                  //new SqlParameter("@Fname",SqlDbType.VarChar),
                                  //new SqlParameter("@Lname",SqlDbType.VarChar),
                                  //new SqlParameter("@Company",SqlDbType.VarChar),
                                  //new SqlParameter("@Jobtitle",SqlDbType.VarChar),
                                  //new SqlParameter("@email",SqlDbType.VarChar),
                                  //new SqlParameter("@mob",SqlDbType.VarChar),
                                  //new SqlParameter("@Category",SqlDbType.VarChar),
                                  //new SqlParameter("@PTime",SqlDbType.VarChar),
                                  //new SqlParameter("@PrintStatus",SqlDbType.VarChar),
                                  //new SqlParameter("@CountryCode",SqlDbType.VarChar),
                                  //new SqlParameter("@ProvinceCode",SqlDbType.VarChar),
                                  //new SqlParameter("@Countryname",SqlDbType.VarChar),
                                  //new SqlParameter("@provincename",SqlDbType.VarChar),
                                  //new SqlParameter("@remark",SqlDbType.VarChar),
                           
                                  new SqlParameter("@Fname",SqlDbType.VarChar),
                                  new SqlParameter("@Company",SqlDbType.VarChar),
                                  new SqlParameter("@CountryCode",SqlDbType.VarChar),
                                  new SqlParameter("@ProvinceCode",SqlDbType.VarChar),
                                  new SqlParameter("@Category",SqlDbType.VarChar),
                                  new SqlParameter("@remark",SqlDbType.VarChar),
                                  
                                 
                               };
            //orderparms[0].Value = barcode;
            //orderparms[1].Value = Fname;
            //orderparms[2].Value = Lname;
            //orderparms[3].Value = Company;
            //orderparms[4].Value = Jobtitle;
            //orderparms[5].Value = "";
            //orderparms[6].Value = "";
            //orderparms[7].Value = Category;
            //orderparms[8].Value = DateTime.Now; ;
            //orderparms[9].Value = "1";
            //orderparms[10].Value = Countrycode;
            //orderparms[11].Value = Provincecode;
            //orderparms[12].Value = Countryname;
            //orderparms[13].Value = provincename;
            //orderparms[14].Value = remark;


            orderparms[0].Value = Fname;
            orderparms[1].Value = Company;
            orderparms[2].Value = Countrycode;
            orderparms[3].Value = provincecode;
            orderparms[4].Value = Category;
            orderparms[5].Value = remark;
            int cmdCount1 = SqlHelper.ExecuteNonQueryReturn(str.ToString(), orderparms);
            if (cmdCount1 > 0)
            {
                StringBuilder qrcode = new StringBuilder();
                qrcode.Append("BEGIN:VCARD");
                qrcode.Append("\r\nVERSION:3.0");
                qrcode.Append("\r\nFN:" + Fname + "");
                qrcode.Append("\r\nTEL;CELL;VOICE:" + phone + "");
                // str.Append("\r\nTEL;WORK;VOICE:86-021-65433627");
                //str.Append("\r\nTEL;WORK;FAX:86-21-65439914");
                qrcode.Append("\r\nEMAIL;PREF;INTERNET:" + Email + "");
                // str.Append("\r\nURL:http://www.corpit.com.sg");
                qrcode.Append("\r\nORG:" + Company + "");
                // str.Append("\r\nROLE:开发部");
                // str.Append("\r\nTITLE:程序员");
                // str.Append("\r\nADR;WORK;POSTAL:上海市杨浦区黄兴路一号中通大厦1107室");
                // str.Append("\r\nREV:2017-09-18T15:49:02Z ");
                qrcode.Append("END:VCARD ");
                //SqlHelper.create_two(qrcode.ToString(), cmdCount1.ToString());
                context.Response.Write(cmdCount1);
            }
            else
            {
                context.Response.Write("0");

            }
        }
        else
        {
            context.Response.Write("0");

        }


    }

    public string GetRegno(string Category)
    {
        string regno = "";

        string sqlreg = "SELECT id from tblregId where PType='" + Category + "'";
        string reId = Convert.ToString(Convert.ToInt32(SqlHelper.ExecuteScalar(sqlreg)) + 1);//累加1
        //更新
        string sqlUpregId = "update tblregId set id='" + reId + "' where PType='" + Category + "'";
        int cmdCount = SqlHelper.ExecuteNonQuery(sqlUpregId);
        if (cmdCount >= 1)
        {
            regno = reId;
        }


        return regno;
    }




    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}