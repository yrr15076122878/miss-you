<%@ WebHandler Language="C#" Class="getinfo" %>

using System;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Text;
using System.Data.OleDb;

public class getinfo : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string SeaKey = context.Request.Form["SeaKey"] != null ? context.Request.Form["SeaKey"].ToString() : "";
        string Infotxt = "";

        if (SeaKey != "")
        {
            string sql = "select * from UserTable where RegistrationNumber='" + SeaKey + "' and InfoStatu=0 ";
            DataTable dtv = SqlHelper.ExecuteDataSet(sql).Tables[0];
            if (dtv.Rows.Count > 0)
            {
                string Category = dtv.Rows[0]["Category"].ToString();
                if (Category == "")
                {
                    Category = "专业观众 TRADE VISITOR";
                }


                Infotxt = "@@" + dtv.Rows[0]["RegistrationNumber"].ToString() + "@@" + dtv.Rows[0]["UserName"].ToString() + "@@" + "" + "@@" + dtv.Rows[0]["Company"].ToString() + "@@" + Category + "@@" + dtv.Rows[0]["PrintStatu"].ToString() + "@@" + dtv.Rows[0]["Mobilephone"].ToString() + "@@" + dtv.Rows[0]["Email"].ToString();

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