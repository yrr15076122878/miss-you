<%@ WebHandler Language="C#" Class="Ereprint" %>


using System;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Text;
using System.Data.OleDb;
public class Ereprint : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string FamilyName = context.Request.Form["FamilyName"] != null ? context.Request.Form["FamilyName"].ToString() : "";
        string company = context.Request.Form["company"] != null ? context.Request.Form["company"].ToString() : "";
        string barcode = context.Request.Form["barcode"] != null ? context.Request.Form["barcode"].ToString() : "";
        string sql1 = "select  * from badges where barcode='" + barcode + "'";

        DataTable dtv1 = ESqlHelper.ExecuteDataSet(sql1).Tables[0];
        if (dtv1.Rows.Count > 0)
        {

            DataRow dr = dtv1.Rows[0];

            string str = "update badges set Ename=@Ename,Company=@Company,letter=@letter where barcode='" + barcode + "'";

                OleDbParameter[] orderparms ={                                                              
                        
                                  new OleDbParameter("@Ename",OleDbType.VarChar),
                                  new OleDbParameter("@company",OleDbType.VarChar),
                                  new OleDbParameter("@letter",OleDbType.VarChar),
                 
                               };

                orderparms[0].Value = FamilyName;
                orderparms[1].Value = company;
             
                orderparms[2].Value = "1";

                int cmdCount1 = ESqlHelper.ExecuteNonQuery(str.ToString(), orderparms);
                if (cmdCount1 > 0)
                {

                    context.Response.Write("1");
                }
            }


        
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}