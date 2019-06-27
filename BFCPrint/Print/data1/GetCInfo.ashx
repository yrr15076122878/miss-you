<%@ WebHandler Language="C#" Class="GetCInfo" %>

using System;
using System.Web;

public class GetCInfo : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string SeaKey = context.Request.Form["SeaKey"] != null ? context.Request.Form["SeaKey"].ToString() : "";
        string Infotxt = "";

        if (SeaKey != "")
        {
            string sql = "select * from UserTable where RegistrationNumber='" + SeaKey + "' and (Upper(Category)='专业观众 TRADE VISITOR' or Upper(Category)='普通观众 CONSUMER') and InfoStatu=0 ";
            System.Data.DataTable dtv = SqlHelper.ExecuteDataSet(sql).Tables[0];
            if (dtv.Rows.Count > 0)
            {
                string Category = dtv.Rows[0]["Category"].ToString().ToUpper();
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