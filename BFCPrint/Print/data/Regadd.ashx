<%@ WebHandler Language="C#" Class="Regadd" %>
using System;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Text;
using System.Data.OleDb;

public class Regadd : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        if (context.Request.Form["Barcode"] != null)
        {
            string barcode = context.Request.Form["Barcode"].ToString();



            string sql = "select * from UserTable  where RegistrationNumber='" + barcode + "' and InfoStatu=0";
            DataTable dtv = SqlHelper.ExecuteDataSet(sql).Tables[0];
            if (dtv.Rows.Count > 0)
            {

                int cmdCount = SqlHelper.ExecuteNonQuery("update UserTable set PrintTime='" + DateTime.Now + "',PrintStatu='1' where RegistrationNumber='" + barcode + "'");


            }






            context.Response.Write("1");
        }
        else
        {
            context.Response.Write("0");
        }
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}