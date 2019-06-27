<%@ WebHandler Language="C#" Class="EReglist" %>

using System;
using System.Collections.Generic;
using System.Linq;
using System.Collections;
using System.Web;
using System.Collections;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Text;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.Web.Script.Serialization;

public class EReglist : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        if (context.Request.QueryString["SeaKey"] != null && context.Request.QueryString["SeaKey"].ToString() != "")
        {
            string SeaKey = context.Server.UrlDecode(context.Request.QueryString["SeaKey"].ToString());
            ArrayList eventList = new ArrayList();

            string sql = "select  * from [badges] where (barcode='" + SeaKey + "' or Ename like '%" + SeaKey + "%'  or company like '%" + SeaKey + "%' or BoothNo like '%" + SeaKey + "%') order by Ename asc";
            DataTable dtv = ESqlHelper.ExecuteDataSet(sql).Tables[0];

            if (dtv.Rows.Count > 0)
            {
                foreach (DataRow dr in dtv.Rows)
                {
                    Hashtable ht = new Hashtable();


                    if (dr["letter"].ToString() == "1")
                    {

                        ht.Add("printStatus", "1");
                    }
                    else
                    {
                        ht.Add("printStatus", "0");
                    }
                    ht.Add("barcode", dr["barcode"].ToString().ToUpper());

                    ht.Add("name", dr["Ename"].ToString());


                    ht.Add("boothNum", dr["BoothNo"]);
                    ht.Add("company", dr["company"]);

                    ht.Add("category", "展商 EXHIBITOR");

                    eventList.Add(ht);
                }
                JavaScriptSerializer ser = new JavaScriptSerializer();
                String jsonStr = ser.Serialize(eventList);

                context.Response.Write(jsonStr);
                //context.Response.Write("{ \"data\":" + jsonStr + "}");
            }
            else
            {
                context.Response.Write("0");
            }
            context.Response.End();
        }
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}