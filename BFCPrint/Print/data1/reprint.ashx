<%@ WebHandler Language="C#" Class="reprint" %>

using System;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Text;
using System.Data.OleDb;
using System.Data.SqlClient;
public class reprint : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string FamilyName = context.Request.Form["FamilyName"] != null ? context.Request.Form["FamilyName"].ToString() : "";
        string company = context.Request.Form["company"] != null ? context.Request.Form["company"].ToString() : "";
        string barcode = context.Request.Form["barcode"] != null ? context.Request.Form["barcode"].ToString() : "";
        string position = context.Request.Form["position"] != null ? context.Request.Form["position"].ToString() : "";
        string phone = context.Request.Form["phone"] != null ? context.Request.Form["phone"].ToString() : "";
        string Email = context.Request.Form["email"] != null ? context.Request.Form["email"].ToString() : "";

        //string FamilyName = context.Request.QueryString["FamilyName"] != null ? context.Request.QueryString["FamilyName"].ToString() : "";
        //string company = context.Request.QueryString["company"] != null ? context.Request.QueryString["company"].ToString() : "";
        //string barcode = context.Request.QueryString["barcode"] != null ? context.Request.QueryString["barcode"].ToString() : "";
        //string position = context.Request.QueryString["position"] != null ? context.Request.QueryString["position"].ToString() : "";
        //string phone = context.Request.QueryString["phone"] != null ? context.Request.QueryString["phone"].ToString() : "";
        //string Email = context.Request.QueryString["email"] != null ? context.Request.QueryString["email"].ToString() : "";
        string sql1 = "select  * from UserTable where RegistrationNumber='" + barcode + "' and InfoStatu=0";

        DataTable dtv1 = SqlHelper.ExecuteDataSet(sql1).Tables[0];
        if (dtv1.Rows.Count > 0)
        {

            DataRow dr = dtv1.Rows[0];
            if (dr["PrintStatu"].ToString() == "1")
            {
                string str = "update UserTable set UserName=@fname,Company=@company,Mobilephone='"+phone+"',Email='"+Email+"' where RegistrationNumber='" + barcode + "'";
                System.Data.SqlClient.SqlParameter[] orderparms ={                                                              
                        
                                  new System.Data.SqlClient.SqlParameter("@fname",SqlDbType.VarChar),
                                  new System.Data.SqlClient.SqlParameter("@company",SqlDbType.VarChar),
                     
                               };

                orderparms[0].Value = FamilyName;
                orderparms[1].Value = company;
      

                int cmdCount1 = SqlHelper.ExecuteNonQuery(str.ToString(), orderparms);
                if (cmdCount1 > 0)
                {

                    context.Response.Write("1");
                }
            }
            else
            {
                string str = "update UserTable set UserName=@fname,Company=@company,PrintTime=@PTime,PrintStatu=@printStatus,Mobilephone='" + phone + "',Email='" + Email + "'  where RegistrationNumber='" + barcode + "'";

                SqlParameter[] orderparms ={                                                              
                        
                                  new SqlParameter("@fname",SqlDbType.VarChar),
                                  new SqlParameter("@company",SqlDbType.VarChar),
                                  new SqlParameter("@PTime",SqlDbType.VarChar),
                                  new SqlParameter("@printStatus",SqlDbType.VarChar),
                                  
                               };

                orderparms[0].Value = FamilyName;
                orderparms[1].Value = company;
                orderparms[2].Value = DateTime.Now;
                orderparms[3].Value = "1";
        
                int cmdCount1 = SqlHelper.ExecuteNonQuery(str.ToString(), orderparms);
                if (cmdCount1 > 0)
                {

                    context.Response.Write("1");
                }
            }
            StringBuilder qrcode = new StringBuilder();
            qrcode.Append("BEGIN:VCARD");
            qrcode.Append("\r\nVERSION:3.0");
            qrcode.Append("\r\nFN:" + FamilyName + "");
            qrcode.Append("\r\nTEL;CELL;VOICE:" + phone + "");
            // str.Append("\r\nTEL;WORK;VOICE:86-021-65433627");
            //str.Append("\r\nTEL;WORK;FAX:86-21-65439914");
            qrcode.Append("\r\nEMAIL;PREF;INTERNET:" + Email + "");
            // str.Append("\r\nURL:http://www.corpit.com.sg");
            qrcode.Append("\r\nORG:" + company + "");
            // str.Append("\r\nROLE:开发部");
            // str.Append("\r\nTITLE:程序员");
            // str.Append("\r\nADR;WORK;POSTAL:上海市杨浦区黄兴路一号中通大厦1107室");
            // str.Append("\r\nREV:2017-09-18T15:49:02Z ");
            qrcode.Append("END:VCARD ");
            //SqlHelper.create_two(qrcode.ToString(), barcode.ToString());

        }
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}