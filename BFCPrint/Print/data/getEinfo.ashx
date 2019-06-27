<%@ WebHandler Language="C#" Class="getEinfo" %>


using System;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Text;
using System.Data.OleDb;

public class getEinfo : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string SeaKey = context.Request.Form["SeaKey"] != null ? context.Request.Form["SeaKey"].ToString() : "";
        string Infotxt = "";

        if (SeaKey != "")
        {
            string sql = "select * from badges where barcode='" + SeaKey + "'";
            DataTable dtv = ESqlHelper.ExecuteDataSet(sql).Tables[0];
            if (dtv.Rows.Count > 0)
            {
                string Category = "展商 EXHIBITOR";


                Infotxt = "@" + dtv.Rows[0]["barcode"].ToString() + "@" + dtv.Rows[0]["Ename"].ToString() + "@" + dtv.Rows[0]["Company"].ToString() + "@" + dtv.Rows[0]["BoothNo"].ToString() + "@" + Category;

            }
            else
            {

                Infotxt = "1";

            }
        }
        else
        {
            Infotxt = "1";

        }

        context.Response.Write(Infotxt);
        context.Response.End();
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}