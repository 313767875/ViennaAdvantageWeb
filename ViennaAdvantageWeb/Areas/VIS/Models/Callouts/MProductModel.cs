﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using VAdvantage.Model;
using VAdvantage.Utility;

namespace VIS.Models
{
    public class MProductModel
    {
        public Dictionary<string, string> GetProduct(Ctx ctx,string fields)
        {
            string[] paramValue = fields.Split(',');

            //Assign parameter value
            int M_Product_ID = Util.GetValueOfInt(paramValue[0].ToString());
            int M_Warehouse_ID = 0;
            if (paramValue.Length > 1)
            {
                M_Warehouse_ID = Util.GetValueOfInt(paramValue[1].ToString());
            }
            //End Assign parameter value

            MProduct product = MProduct.Get(ctx, M_Product_ID);
            Dictionary<string, string> result = new Dictionary<string, string>();
            result["C_UOM_ID"] = product.GetC_UOM_ID().ToString();
            result["IsStocked"] = product.IsStocked() ? "Y" : "N";
            if (M_Product_ID > 0)
            {
                if(M_Warehouse_ID>0)
                result["M_Locator_ID"] = MProductLocator.GetFirstM_Locator_ID(product, M_Warehouse_ID).ToString();
            }
            return result;
        }
        public string GetProductType(Ctx ctx, string fields)
        {
            string[] paramValue = fields.Split(',');

            //Assign parameter value
            int M_Product_ID = Util.GetValueOfInt(paramValue[0].ToString());
          
             MProduct prod = new MProduct(ctx, M_Product_ID, null);
             return prod.GetProductType(); ;
            
            
        }  
        /// <summary>
        /// Get UPM Precision
        /// </summary>
        /// <param name="ctx"></param>
        /// <param name="fields"></param>
        /// <returns></returns>
        public int GetUOMPrecision(Ctx ctx,string fields)
        {
            string[] paramValue = fields.Split(',');
            int M_Product_ID;
            M_Product_ID = Util.GetValueOfInt(paramValue[0].ToString());
            return MProduct.Get(ctx, M_Product_ID).GetUOMPrecision();
            
        }
        /// <summary>
        /// Get C
        /// </summary>
        /// <param name="fields"></param>
        /// <returns></returns>
        public int GetC_UOM_ID(Ctx ctx,string fields)
        {
            string[] paramValue = fields.Split(',');
            int M_Product_ID;
            M_Product_ID = Util.GetValueOfInt(paramValue[0].ToString());
            return MProduct.Get(ctx, M_Product_ID).GetC_UOM_ID();
           
        }


    }
}