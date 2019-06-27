<%@ WebHandler Language="C#" Class="RegList" %>

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


public class RegList : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        if (context.Request.QueryString["SeaKey"] != null && context.Request.QueryString["SeaKey"].ToString() != "")
        {
            string SeaKey = context.Server.UrlDecode(context.Request.QueryString["SeaKey"].ToString());
            ArrayList eventList = new ArrayList();
            string sql = "";
            try
            {
                int gg = int.Parse(SeaKey);
                sql = "select  * from [UserTable] where (RegistrationNumber='" + gg + "' or username like '%" + SeaKey + "%'  or company like '%" + SeaKey + "%') and RegistrationNumber<>'' and InfoStatu=0 order by username asc";
            }
            catch (Exception)
            {

                sql = "select  * from [UserTable] where (username like '%" + SeaKey + "%'  or company like '%" + SeaKey + "%') and RegistrationNumber<>'' and InfoStatu=0 order by username asc";
            }


            DataTable dtv = SqlHelper.ExecuteDataSet(sql).Tables[0];

            if (dtv.Rows.Count > 0)
            {
                foreach (DataRow dr in dtv.Rows)
                {
                    Hashtable ht = new Hashtable();


                    if (dr["PrintStatu"].ToString() == "1")
                    {

                        ht.Add("printStatus", "1");
                    }
                    else
                    {
                        ht.Add("printStatus", "0");
                    }

                    if (dr["OnLinePre"].ToString() == "1" && (dr["PrintStatu"].ToString() == "" || dr["PrintStatu"].ToString() == "0"))
                    {
                        ht.Add("pre", "Pre");
                    }
                    else
                    {
                        ht.Add("pre", "");
                    }

                    ht.Add("fname", dr["UserName"].ToString());
                    ht.Add("Jobtitle", "");
                    ht.Add("company", dr["Company"].ToString());


                    ht.Add("barcode", dr["RegistrationNumber"]);

                    string Category = dr["Category"].ToString();
                    if (Category == "")
                    {
                        Category = "专业观众 TRADE VISITOR";
                    }


                    ht.Add("category", Category.ToString().ToUpper());

                    eventList.Add(ht);
                }
                JavaScriptSerializer ser = new JavaScriptSerializer();
                String jsonStr = ser.Serialize(eventList);

                context.Response.Write(jsonStr);

            }
            else
            {
                context.Response.Write("0");
            }
            context.Response.End();
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}