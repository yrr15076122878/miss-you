<%@ WebHandler Language="C#" Class="ERegadd" %>

using System;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Text;
using System.Data.OleDb;

public class ERegadd : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        if (context.Request.Form["Barcode"] != null)
        {
            string barcode = context.Request.Form["Barcode"].ToString();



            string sql = "select * from badges  where barcode='" + barcode + "'";
            DataTable dtv = ESqlHelper.ExecuteDataSet(sql).Tables[0];
            if (dtv.Rows.Count > 0)
            {

                int cmdCount = ESqlHelper.ExecuteNonQuery("update badges set letter='1' where barcode='" + barcode + "'");


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