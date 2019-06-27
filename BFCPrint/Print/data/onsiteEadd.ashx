<%@ WebHandler Language="C#" Class="onsiteEadd" %>

using System;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Text;
using System.Data.OleDb;

public class onsiteEadd : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        string FamilyName = context.Request.Form["FamilyName"] != null ? context.Request.Form["FamilyName"].ToString() : "";
        string company = context.Request.Form["company"] != null ? context.Request.Form["company"].ToString() : "";
        string BoothNo = context.Request.Form["boothNumb"] != null ? context.Request.Form["boothNumb"].ToString() : "";

        string barcode = "";




        //string sql = "select * from badges  where Ename='" + FamilyName + "' and Company='" + company + "'";
        //DataTable dtv = ESqlHelper.ExecuteDataSet(sql).Tables[0];
        //if (dtv.Rows.Count > 0)
        //{
        //    context.Response.Write("0");
        //}
        //else
        //{
        int counts = ESqlHelper.GetRecordCount("badges", " Ename='" + FamilyName + "' and Company='" + company + "'");

        //if (counts == 0)
        //{
            string Category = "";





            barcode = "E" + GetRegno();


            string str = "insert into badges (barcode,Ename,Company,BoothNo,letter) values (@barcode,@Ename,@Company,@BoothNo,@letter)";

            OleDbParameter[] orderparms ={                                                              
                                  new OleDbParameter("@barcode",OleDbType.VarChar),
                                  new OleDbParameter("@Ename",OleDbType.VarChar),
                                
                                  new OleDbParameter("@Company",OleDbType.VarChar),
                                
                                  new OleDbParameter("@BoothNo",OleDbType.VarChar),
                                  new OleDbParameter("@letter",OleDbType.VarChar),
                                
                                 
                               };
            orderparms[0].Value = barcode;
            orderparms[1].Value = FamilyName;
            orderparms[2].Value = company;

            orderparms[3].Value = BoothNo;
            orderparms[4].Value = "1";

            int cmdCount1 = ESqlHelper.ExecuteNonQuery(str.ToString(), orderparms);
            if (cmdCount1 > 0)
            {

                context.Response.Write(barcode);
            }
            else
            {
                context.Response.Write("0");
            }
        //}
        //else
        //{
        //    context.Response.Write("0");

        //}

        //}

    }
    public string GetRegno()
    {
        string regno = "";

        string sqlreg = "SELECT id from tblregId";
        string reId = Convert.ToString(Convert.ToInt32(ESqlHelper.ExecuteScalar(sqlreg)) + 1);//累加1
        //更新
        string sqlUpregId = "update tblregId set id='" + reId + "'";
        int cmdCount = ESqlHelper.ExecuteNonQuery(sqlUpregId);
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