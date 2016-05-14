﻿; (function (VIS, $) {
    VIS.Apps.AForms = VIS.Apps.AForms || {};

    function VMatch() {
        this.frame;
        this.windowNo;
        var $self = this;
        this.arrListColumns = [];
        this.vdgvInvoice = null;
        this.vdgvReceipt = null;

        this.lblMatchFrom = new VIS.Controls.VLabel();
        this.lblMatchTo = new VIS.Controls.VLabel();
        this.lblMatchMode = new VIS.Controls.VLabel();
        this.lblBPartner = new VIS.Controls.VLabel();
        this.lblProduct = new VIS.Controls.VLabel();
        this.lblDateFrom = new VIS.Controls.VLabel();
        this.lblDateTo = new VIS.Controls.VLabel();

        this.lblInvoice = new VIS.Controls.VLabel();
        this.lblReceipt = new VIS.Controls.VLabel();
        this.lblMatched = new VIS.Controls.VLabel();
        this.lblMatchedTo = new VIS.Controls.VLabel();
        this.lblDifference = new VIS.Controls.VLabel();
        this.lblStatusInfo = new VIS.Controls.VLabel();
        this.lblStatusCount = new VIS.Controls.VLabel();
        this.lblSearch = new VIS.Controls.VLabel();

        this.cmbMatchFrom = new VIS.Controls.VComboBox('', false, false, true);
        this.cmbMatchTo = new VIS.Controls.VComboBox('', false, false, true);
        this.cmbMatchMode = new VIS.Controls.VComboBox('', false, false, true);

        this.chkIsReturnTrx = null;
        this.chkSameBPartner = null;
        this.chkSameProduct = null;
        this.chkSameQty = null;

        this.onlyVendor = null;
        this.onlyProduct = null;

        this.dtpFrom = null;
        this.dtpTo = null;

        this.btnSearch = null;
        this.btnProcess = null;
        this.btnToggel = null;

        this.txtMatched = new VIS.Controls.VTextBox("", false, true, false);
        this.txtMatchedTo = new VIS.Controls.VTextBox("", false, true, false);
        this.txtDifference = new VIS.Controls.VTextBox("", false, true, false);

        this.$root = $("<div style='width: 100%; height: 100%; background-color: white;'>");
        this.$busyDiv = $("<div id='testBesy' style='height: 100%;' class='vis-apanel-busy'>");

        this.sideDiv = null;
        this.gridSelectDiv = null;
        this.gridInvoiceDiv = null;
        this.gridReciptDiv = null;
        this.processlDiv = null;
        this.bottumDiv = null;
        this.bottumButtonDiv = null;

        this.btnSpaceDiv = null;
        this.topDiv = null;
        this.div = null;
        this.divForGrid = null;
        this.invoicegrd = null;
        this.reciptgrd = null;
        this.invoiceTopDiv = null;

        var toggleside = false;

        var sideDivWidth = 260;
        var minSideWidth = 50;
        //window with-(sidediv with_margin from left+ space)
        var selectDivWidth = $(window).width() - (sideDivWidth + 30);
        var selectDivFullWidth = $(window).width() - (30 + minSideWidth);
        var selectDivHeight = $(window).height() - 240;

        var _AD_Client_ID = VIS.Env.getCtx().getAD_Client_ID();
        var _AD_Org_ID = VIS.Env.getCtx().getAD_Org_ID();
        var _by = VIS.Env.getCtx().getAD_User_ID();

        var MATCH_INVOICE = 0;
        var MATCH_SHIPMENT = 1;
        var MATCH_ORDER = 2;
        var MODE_NOTMATCHED = 0;
        var MODE_MATCHED = 1;

        var _sql = null;
        var _dateColumn = "";
        var _qtyColumn = "";
        var _groupBy = "";
        var _xMatched = 0;
        var _xMatchedTo = 0;

        //Match Options  
        var _matchOptions = [];
        _matchOptions.push(VIS.Msg.getElement3(VIS.Env.getAD_Language(VIS.Env.getCtx()), "C_Invoice_ID", false));
        _matchOptions.push(VIS.Msg.getElement3(VIS.Env.getAD_Language(VIS.Env.getCtx()), "M_InOut_ID", false));
        _matchOptions.push(VIS.Msg.getElement3(VIS.Env.getAD_Language(VIS.Env.getCtx()), "C_Order_ID", false));

        // Match Mode 
        var _matchMode = [];
        //VIS.Msg.translate(VIS.Env.getCtx(), "NotMatched");
        //VIS.Msg.translate(VIS.Env.getCtx(), "Matched");
        _matchMode.push(VIS.Msg.getMsg("NotMatched"));
        _matchMode.push(VIS.Msg.getMsg("Matched"));

        function initializeComponent() {

            var src = VIS.Application.contextUrl + "Areas/VIS/Images/base/arrow-left.png";
            //Top Div
            $self.topDiv = $("<div id='" + "topDiv_" + $self.windowNo + "' style='float: left; width: 100%; height: 45px; margin-bottom: 2px;margin-left: 0px;'>" +
                       "<div id='" + "btnSpaceDiv_" + $self.windowNo + "' style='width: 260px; height: 45px;float: left;padding-left: 11px; padding-top: 11px;; background-color: #F1F1F1;'>" +
                       "<button id='" + "btnToggelDiv_" + $self.windowNo + "' style='border: 0px;background-color: transparent; padding: 0px;' >" +
                       "<img src='" + src + "' /></button></div></div>");

            var invoicecol = $("<div style='float: left;  margin-right: 15px;padding-top: 10px;'>");//width: 100%;
            invoicecol.append($self.lblInvoice.getControl().css("display", "inline-block").css("font-size", "24px").css("margin-left", "15px").css("color", "#19A0ED").addClass("VIS_Pref_Label_Font"));
            invoicecol.append(chkSameBPartnerDiv);
            invoicecol.append(chkSameProductDiv);
            invoicecol.append(chkSameQtyDiv);
            invoicecol.css("width", selectDivWidth);
            invoicecol.css("height", "45px");
            $self.topDiv.append(invoicecol);
            $self.invoiceTopDiv = invoicecol;


            $self.btnSpaceDiv = $self.topDiv.find("#" + "btnSpaceDiv_" + $self.windowNo);

            //Left side Div designing
            $self.sideDiv = $("<div id='" + "sideDiv_" + $self.windowNo + "' style='float: left; margin-left: 0px;background-color: #F1F1F1; '>");//background-color: #F1F1F1;
            $self.sideDiv.css("width", sideDivWidth);
            $self.sideDiv.css("height", selectDivHeight - 3);

            $self.div = $("<div style='float: left;overflow-y: scroll;height: 100%;' id='" + "parameterDiv_" + $self.windowNo + "'>");

            $self.sideDiv.append($self.div);


            var tble = $("<table style='width: 100%;height: 100%;'>");

            //line1
            var tr = $("<tr>");
            var td = $("<td style='padding: 4px 15px 2px;'>");
            $self.div.append(tble);
            tble.append(tr);
            tr.append(td);
            td.append($self.lblMatchFrom.getControl().css("display", "inline-block").addClass("VIS_Pref_Label_Font"));

            //line2
            tr = $("<tr>");
            td = $("<td style='padding: 0px 15px 0px;'>");
            tble.append(tr);
            tr.append(td);
            td.append($self.cmbMatchFrom.getControl().css("display", "inline-block").css("width", "236px").css("height", "32px"));

            //line3
            tr = $("<tr>");
            td = $("<td style='padding: 4px 15px 2px;'>");
            tble.append(tr);
            tr.append(td);
            td.append($self.lblMatchTo.getControl().css("display", "inline-block").addClass("VIS_Pref_Label_Font"));
            //line4
            tr = $("<tr>");
            td = $("<td style='padding: 0px 15px 0px;'>");
            tble.append(tr);
            tr.append(td);
            td.append($self.cmbMatchTo.getControl().css("display", "inline-block").css("width", "236px").css("height", "32px"));

            //line5
            tr = $("<tr>");
            td = $("<td style='padding: 4px 15px 2px;'>");
            tble.append(tr);
            tr.append(td);
            td.append($self.lblMatchMode.getControl().css("display", "inline-block").addClass("VIS_Pref_Label_Font"));

            //line6
            tr = $("<tr>");
            td = $("<td style='padding: 0px 15px 0px;'>");
            tble.append(tr);
            tr.append(td);
            td.append($self.cmbMatchMode.getControl().css("display", "inline-block").css("width", "236px").css("height", "32px"));

            //line7
            tr = $("<tr>");
            td = $("<td style='padding: 4px 15px 2px;'>");
            tble.append(tr);
            tr.append(td);
            td.append($self.lblBPartner.getControl().css("display", "inline-block").addClass("VIS_Pref_Label_Font"));

            //line8
            tr = $("<tr>");
            td = $("<td style='padding: 0px 15px 0px;'>");
            tble.append(tr);
            tr.append(td);
            td.append($self.onlyVendor.getControl().css('width', '206px')).append($self.onlyVendor.getBtn(0).css('width', '30px').css('height', '30px').css('padding', '0px').css('border-color', '#BBBBBB'));

            //line9
            tr = $("<tr>");
            td = $("<td style='padding: 4px 15px 2px;'>");
            tble.append(tr);
            tr.append(td);
            td.append($self.lblProduct.getControl().css("display", "inline-block").addClass("VIS_Pref_Label_Font"));

            //line10
            tr = $("<tr>");
            td = $("<td style='padding: 0px 15px 0px;'>");
            tble.append(tr);
            tr.append(td);
            td.append($self.onlyProduct.getControl().css('width', '206px')).append($self.onlyProduct.getBtn(0).css('width', '30px').css('height', '30px').css('padding', '0px').css('border-color', '#BBBBBB'));

            //line11
            tr = $("<tr>");
            td = $("<td style='padding: 4px 15px 2px;'>");
            tble.append(tr);
            tr.append(td);
            td.append($self.lblDateFrom.getControl().css("display", "inline-block").addClass("VIS_Pref_Label_Font"));

            //line12
            tr = $("<tr>");
            td = $("<td style='padding: 0px 15px 0px;'>");
            tble.append(tr);
            tr.append(td);
            td.append($self.dtpFrom);

            //line13
            tr = $("<tr>");
            td = $("<td style='padding: 4px 15px 2px;'>");
            tble.append(tr);
            tr.append(td);
            td.append($self.lblDateTo.getControl().css("display", "inline-block").addClass("VIS_Pref_Label_Font"));

            //line14
            tr = $("<tr>");
            td = $("<td style='padding: 0px 15px 0px;'>");
            tble.append(tr);
            tr.append(td);
            td.append($self.dtpTo);

            //line15
            tr = $("<tr>");
            td = $("<td style='padding: 10px 15px 0px;'>");
            tble.append(tr);
            tr.append(td);
            td.append(chkIsReturnTrxDiv);

            //line15
            //tr = $("<tr>");
            //td = $("<td style='padding: 0px 15px 0px;'>");
            //tble.append(tr);
            //tr.append(td);
            //td.append($self.btnSearch);


            //Right side Div designing
            $self.divForGrid = $("<div id='" + "divForGrid_" + $self.windowNo + "' style='float: left;margin-left: 15px;margin-right: 15px'>");//border: 1px solid darkgray;
            $self.divForGrid.css("width", selectDivWidth);
            $self.divForGrid.css("height", selectDivHeight - 3);

            //Invoice Div
            $self.gridInvoiceDiv = $("<div id='" + "gridInvoiceDiv_" + $self.windowNo + "' style='width: 100%;float: left; '>");
            $self.gridInvoiceDiv.css("height", "47%");

            //var invoicelable = $("<div style='float: left; width: 100%; padding-left: 15px;margin-top: 0px;'>");
            //invoicelable.append($self.lblInvoice.getControl().css("display", "inline-block").css("color", "#19A0ED").addClass("VIS_Pref_Label_Font"));
            //$self.gridInvoiceDiv.append(invoicelable);

            $self.invoicegrd = $("<div style='float: left; width: 100%;height: 99%;'>");
            $self.gridInvoiceDiv.append($self.invoicegrd);

            //var invoicecol = $("<div style='float: left; width: 100%; padding-left: 15px;margin-top: 5px;'>");
            //invoicecol.append(chkSameBPartnerDiv);
            //invoicecol.append(chkSameProductDiv);
            //invoicecol.append(chkSameQtyDiv);
            //$self.gridInvoiceDiv.append(invoicecol);

            //Recipt Div
            $self.gridReciptDiv = $("<div id='" + "gridReciptDiv_" + $self.windowNo + "' style='width: 100%;float: left;'>");
            $self.gridReciptDiv.css("height", "46%");

            var recipt = $("<div style='float: left; width: 100%; margin-top: 0px;'>");
            recipt.append($self.lblReceipt.getControl().css("display", "inline-block").css("font-size", "24px").css("color", "#19A0ED").addClass("VIS_Pref_Label_Font"));
            // $self.gridReciptDiv.append(recipt);

            $self.reciptgrd = $("<div style='float: left; width: 100%;height: 99%;'>");
            $self.gridReciptDiv.append($self.reciptgrd);

            //var reciptcol = $("<div style='float: left; width: 100%; padding-left: 15px;margin-top: 5px;'>");

            //var divMatched = $("<div style='float: left;width: 33%;'>");
            //divMatched.append($self.lblMatched.getControl().css("display", "block").addClass("VIS_Pref_Label_Font"));
            //divMatched.append($self.txtMatched.getControl().css("width", "100%"));
            //reciptcol.append(divMatched);

            //var divMatching = $("<div style='float: left; padding-left: 15px;margin-top: 0px;width: 33%;'>");
            //divMatching.append($self.lblMatchedTo.getControl().css("display", "block").addClass("VIS_Pref_Label_Font"));
            //divMatching.append($self.txtMatchedTo.getControl().css("width", "100%"));
            //reciptcol.append(divMatching);

            ////var divdiffrence = $("<div style='float: left; padding-left: 15px;margin-top: 0px;width: 33.3%; '>");
            ////divdiffrence.append($self.lblDifference.getControl().css("display", "block").addClass("VIS_Pref_Label_Font"));
            ////divdiffrence.append($self.txtDifference.getControl().css("width", "100%"));
            ////reciptcol.append(divdiffrence);
            ////$self.gridReciptDiv.append(reciptcol);

            //$self.processlDiv = $("<div id='" + "gridReciptDiv_" + $self.windowNo + "' style='width: 100%; padding-right: 6px; '>");
            //$self.processlDiv.css("height", "50px");
            //$self.processlDiv.append($self.btnProcess);


            //Bottum Div
            var reciptcol = $("<div style='float: left; width: 60%; margin-left: 185px;margin-top: 3px;'>");

            var divMatched = $("<div style='float: left;width: 33%;'>");
            divMatched.append($self.lblMatched.getControl().css("display", "block").addClass("VIS_Pref_Label_Font"));
            divMatched.append($self.txtMatched.getControl().css("width", "100%"));
            reciptcol.append(divMatched);

            var divMatching = $("<div style='float: left; padding-left: 15px;margin-top: 0px;width: 33%;'>");
            divMatching.append($self.lblMatchedTo.getControl().css("display", "block").addClass("VIS_Pref_Label_Font"));
            divMatching.append($self.txtMatchedTo.getControl().css("width", "100%"));
            reciptcol.append(divMatching);

            var divdiffrence = $("<div style='float: left; padding-left: 15px;margin-top: 0px;width: 33.3%; '>");
            divdiffrence.append($self.lblDifference.getControl().css("display", "block").addClass("VIS_Pref_Label_Font"));
            divdiffrence.append($self.txtDifference.getControl().css("width", "100%"));
            reciptcol.append(divdiffrence);

            $self.bottumButtonDiv = $("<div style='float: left;margin-top: 5px; width:100%'>");
            $self.bottumButtonDiv.css("height", 55);
            $self.bottumButtonDiv.append($self.btnSearch);
            $self.bottumButtonDiv.append(reciptcol);
            $self.bottumButtonDiv.append($self.btnProcess);





            $self.bottumDiv = $("<div style='float: left;background-color: #F1F1F1; width:100%'>");
            $self.bottumDiv.css("height", 30);

            $self.bottumDiv.append($self.lblStatusInfo.getControl().addClass("VIS_Pref_Label_Font"));
            $self.bottumDiv.append($self.lblStatusCount.getControl().css("float", "right").addClass("VIS_Pref_Label_Font"));


            //Add to root

            $self.divForGrid.append($self.gridInvoiceDiv).append(recipt).append($self.gridReciptDiv);
            $self.$root.append($self.topDiv).append($self.sideDiv).append($self.divForGrid).append($self.bottumButtonDiv).append($self.bottumDiv);
            $self.$root.append($self.$busyDiv);
        }

        function initDesign() {
            var src = VIS.Application.contextUrl + "Areas/VIS/Images/base/arrow-left.png";
            //Date controls initialization
            $self.dtpFrom = $("<input id='" + "dateFrom_" + $self.windowNo + "' type='date' name='DateOrdered' style='display: inline-block;line-height: 23px;width:236px'>");
            $self.dtpTo = $("<input id='" + "dateTo_" + $self.windowNo + "' type='date' name='DateOrdered' style='display: inline-block;line-height: 23px;width:236px'>");

            //chkbox controls initialization
            this.chkIsReturnTrxDiv = $("<div>");
            $self.chkIsReturnTrx = $("<input id='" + "chkIsReturnTrx_" + $self.windowNo + "' type='checkbox' class='VIS_Pref_automatic'>" +
                "<span><label id='" + "lblIsReturnTrx_" + $self.windowNo + "' class='VIS_Pref_Label_Font'>Return Transaction</label></span>");

            this.chkIsReturnTrxDiv.append($self.chkIsReturnTrx);

            this.chkSameBPartnerDiv = $("<div style='float: right; margin-right: 15px;'>");

            if (VIS.Application.isRTL) {
                this.chkSameBPartnerDiv = $("<div style='float: left; margin-right: 15px;margin-left: 15px;'>");
            }

            $self.chkSameBPartner = $("<input id='" + "chkSameBPartner_" + $self.windowNo + "' type='checkbox' class='VIS_Pref_automatic'>" +
               "<span><label id='" + "lblSameBPartner_" + $self.windowNo + "' class='VIS_Pref_Label_Font'>Same BPartner</label></span>");

            this.chkSameBPartnerDiv.append($self.chkSameBPartner);

            this.chkSameProductDiv = $("<div style='float: right; margin-right: 15px;' >");
            if (VIS.Application.isRTL) {
                this.chkSameProductDiv = $("<div style='float: left; margin-right: 15px;'>");
            }
            $self.chkSameProduct = $("<input id='" + "chkSameProduct_" + $self.windowNo + "' type='checkbox' class='VIS_Pref_automatic'>" +
               "<span><label id='" + "lblSameProduct_" + $self.windowNo + "' class='VIS_Pref_Label_Font'>Same Product</label></span>");

            this.chkSameProductDiv.append($self.chkSameProduct);

            this.chkSameQtyDiv = $("<div style='float: right; margin-right: 15px;' >");
            if (VIS.Application.isRTL) {
                this.chkSameQtyDiv = $("<div style='float: left; margin-right: 15px;'>");
            }
            $self.chkSameQty = $("<input id='" + "chkSameQty_" + $self.windowNo + "' type='checkbox' class='VIS_Pref_automatic'>" +
               "<span><label id='" + "lblSameQty_" + $self.windowNo + "' class='VIS_Pref_Label_Font'>Same Quantity</label></span>");

            this.chkSameQtyDiv.append($self.chkSameQty);

            //Button controls initialization
            $self.btnSearch = $("<input id='" + "btnSearch_" + $self.windowNo + "' class='VIS_Pref_pass-btn' style='margin-top: 10px;margin-left: 15px;  float: left;' type='button' value='Search'>");
            $self.btnProcess = $("<Button id='" + "btnProcess_" + $self.windowNo + "' style='margin-top: 10px; float: right;margin-right: 15px;' class='VIS_Pref_btn-2'>Process</Button>");


            $self.lblInvoice.getControl().text(VIS.Msg.translate(VIS.Env.getCtx(), "Invoice"));
            $self.lblReceipt.getControl().text(VIS.Msg.translate(VIS.Env.getCtx(), "Receipt"));

            $self.lblMatchFrom.getControl().text(VIS.Msg.translate(VIS.Env.getCtx(), "MatchFrom"));
            $self.lblMatchTo.getControl().text(VIS.Msg.translate(VIS.Env.getCtx(), "MatchTo"));
            $self.lblMatchMode.getControl().text(VIS.Msg.translate(VIS.Env.getCtx(), "MatchMode"));
            $self.lblBPartner.getControl().text(VIS.Msg.translate(VIS.Env.getCtx(), "C_BPartner_ID"));
            $self.lblProduct.getControl().text(VIS.Msg.translate(VIS.Env.getCtx(), "M_Product_ID"));
            $self.lblDateFrom.getControl().text(VIS.Msg.translate(VIS.Env.getCtx(), "DateFrom"));
            $self.lblDateTo.getControl().text(VIS.Msg.translate(VIS.Env.getCtx(), "DateTo"));
            $self.lblMatched.getControl().text(VIS.Msg.translate(VIS.Env.getCtx(), "ToBeMatched"));
            $self.lblMatchedTo.getControl().text(VIS.Msg.translate(VIS.Env.getCtx(), "Matching"));
            $self.lblDifference.getControl().text(VIS.Msg.translate(VIS.Env.getCtx(), "Difference"));

            $self.chkIsReturnTrx.prop("checked", false);
            $self.btnProcess.attr('disabled', 'disabled');
            $self.chkSameProduct.prop("checked", true);
            $self.chkSameBPartner.prop("checked", true);
            $self.chkSameQty.prop("checked", false);

            $self.chkIsReturnTrx.next("label").text(VIS.Msg.translate(VIS.Env.getCtx(), "isReturnTrx"));
            $self.chkSameProduct.next("label").text(VIS.Msg.translate(VIS.Env.getCtx(), "SameProduct"));
            $self.chkSameBPartner.next("label").text(VIS.Msg.translate(VIS.Env.getCtx(), "SameBPartner"));
            $self.chkSameQty.next("label").text(VIS.Msg.translate(VIS.Env.getCtx(), "SameQty"));
            $self.lblSearch.getControl().text(VIS.Msg.translate(VIS.Env.getCtx(), "Search"));
            $self.btnSearch.text(VIS.Msg.translate(VIS.Env.getCtx(), "Search"));
        }

        function dynInit(data) {
            addColumns();
            cmd_MatchFrom();
            $self.lblStatusInfo.getControl().text("");
            $self.lblStatusCount.getControl().text(0);
        }

        function fillPicks() {
            //BPartners
            var value = VIS.MLookupFactory.getMLookUp(VIS.Env.getCtx(), $self.windowNo, 3499, VIS.DisplayType.Search);
            $self.onlyVendor = new VIS.Controls.VTextBoxButton("C_BPartner_ID", true, false, true, VIS.DisplayType.Search, value);

            //Product
            value = VIS.MLookupFactory.getMLookUp(VIS.Env.getCtx(), $self.windowNo, 3840, VIS.DisplayType.Search);
            $self.onlyProduct = new VIS.Controls.VTextBoxButton("M_Product_ID", true, false, true, VIS.DisplayType.Search, value);


            //var lookup = VIS.MLookupFactory.getMLookUp(VIS.Env.getCtx(), $self.windowNo, 2163, VIS.DisplayType.TableDir);
            //$self.cmbMatchFrom = new VIS.Controls.VComboBox("AD_Org_ID", true, false, true, lookup, 150, VIS.DisplayType.TableDir, 0);

        }

        function cmd_MatchFrom() {
            $self.cmbMatchTo.getControl().empty();
            var selection = null;
            if ($self.cmbMatchFrom.getControl().find('option').length > 0) {
                selection = $self.cmbMatchFrom.getControl().find('option:selected').val();
                if (selection.equals(_matchOptions[MATCH_INVOICE])) {
                    $self.cmbMatchTo.getControl().append(" <option value=" + _matchOptions[MATCH_SHIPMENT] + ">" + _matchOptions[MATCH_SHIPMENT] + "</option>");
                }
                else if (selection.equals(_matchOptions[MATCH_ORDER])) {
                    $self.cmbMatchTo.getControl().append(" <option value=" + _matchOptions[MATCH_SHIPMENT] + ">" + _matchOptions[MATCH_SHIPMENT] + "</option>");
                }
                else    //  shipment
                {
                    $self.cmbMatchTo.getControl().append(" <option value=" + _matchOptions[MATCH_INVOICE] + ">" + _matchOptions[MATCH_INVOICE] + "</option>");
                    $self.cmbMatchTo.getControl().append(" <option value=" + _matchOptions[MATCH_ORDER] + ">" + _matchOptions[MATCH_ORDER] + "</option>");
                }

                $self.cmbMatchTo.getControl().prop('selectedIndex', 0);
                //  Set Title
                $self.lblInvoice.getControl().text(selection);
            }
            //  sync To
            cmd_MatchTo();
        }

        function cmd_MatchTo() {
            // log.Fine("VMatch.cmd_matchTo");
            selection = $self.cmbMatchTo.getControl().find('option:selected').val();
            $self.lblReceipt.getControl().text(selection);
        }

        function cmd_Search() {
            //Create SQL 
            var display = $self.cmbMatchFrom.getControl()[0].selectedIndex;// $self.cmbMatchFrom.getControl().find('option:selected').val();
            var matchToString = $self.cmbMatchTo.getControl().find('option:selected').val();

            var matchToType = MATCH_INVOICE;
            if (matchToString.equals(_matchOptions[MATCH_SHIPMENT])) {
                matchToType = MATCH_SHIPMENT;
            }
            else if (matchToString.equals(_matchOptions[MATCH_ORDER])) {
                matchToType = MATCH_ORDER;
            }

            tableInit(display, matchToType);	//	sets _sql

            //Add Where Clause 
            //  Product
            if ($self.onlyProduct.getValue() != null) {
                var Product = $self.onlyProduct.getValue();
                _sql = _sql.concat(" AND lin.M_Product_ID=").concat(Product);
            }
            //  BPartner
            if ($self.onlyVendor.getValue() != null) {
                var Vendor = $self.onlyVendor.getValue();
                _sql = _sql.concat(" AND hdr.C_BPartner_ID=").concat(Vendor);
            }
            //  Date
            var from = $self.dtpFrom.val();
            var to = $self.dtpTo.val();

            if (from != "" && to != "") {
                _sql = _sql.concat(" AND ").concat(_dateColumn).concat(" BETWEEN ")
                    .concat(VIS.DB.to_date(from)).concat(" AND ").concat(VIS.DB.to_date(to));
            }
            else if (from != "") {
                _sql = _sql.concat(" AND ").concat(_dateColumn).concat(" >= ").concat(DB.to_date(from));
            }
            else if (to != "") {
                _sql = _sql.concat(" AND ").concat(_dateColumn).concat(" <= ").concat(VIS.DB.to_date(to));
            }

            tableLoad($self.vdgvInvoice);
            $self.txtMatched.getControl().val(0);

            //  Status Info

            $self.lblStatusInfo.getControl().text($self.cmbMatchFrom.getControl().find('option:selected').val()
                + "# = " + $self.vdgvInvoice.records.length + " -" + $self.cmbMatchTo.getControl().find('option:selected').val() + "# = " + $self.vdgvReceipt.records.length);

            $self.lblStatusCount.getControl().text(0);
        }

        function cmd_SearchTo(recid) {

            var row = -1;

            //if ($self.vdgvInvoice.selectAll() != null) {
            //    row = $self.vdgvInvoice.selectAll();
            //}
            if (recid != null) {
                row = recid;
            }
            else if ($self.vdgvInvoice.getSelection().length > 0) {
                row = Number($self.vdgvInvoice.getSelection().toString());
            }

            var qty = 0.0;

            if (row < 0) {

            }
            else {
                //  ** Create SQL **
                var displayString = $self.cmbMatchTo.getControl().find('option:selected').val();
                var display = MATCH_INVOICE;
                if (displayString.equals(_matchOptions[MATCH_SHIPMENT])) {
                    display = MATCH_SHIPMENT;
                }
                else if (displayString.equals(_matchOptions[MATCH_ORDER])) {
                    display = MATCH_ORDER;
                }
                var matchToType = $self.cmbMatchFrom.getControl()[0].selectedIndex;
                tableInit(display, matchToType);	//	sets _sql
                //  ** Add Where Clause **
                //var BPartner = ($self.vdgvInvoice.get(row)).I_BPartner;
                var BPartner = { 'key': $self.vdgvInvoice.get(row).C_BPartner_ID_K, 'value': $self.vdgvInvoice.get(row).C_BPartner_ID };
                var Product = { 'key': $self.vdgvInvoice.get(row).M_Product_ID_K, 'value': $self.vdgvInvoice.get(row).M_Product_ID };

                //log.Fine("BPartner=" + BPartner + " - Product=" + Product);
                if ($self.chkSameBPartner.prop("checked")) {
                    _sql = _sql.concat(" AND hdr.C_BPartner_ID=").concat(BPartner.key);
                }
                if ($self.chkSameProduct.prop("checked")) {
                    _sql = _sql.concat(" AND lin.M_Product_ID=").concat(Product.key);
                }

                //  calculate qty
                var docQty = $self.vdgvInvoice.get(row).Qty;
                var matchedQty = $self.vdgvInvoice.get(row).Matched;

                qty = docQty - matchedQty;
                if ($self.chkSameQty.prop("checked")) {
                    _sql = _sql.concat(" AND ").concat(_qtyColumn).concat("=").concat(docQty);
                }
                //Load Table Recipt table
                tableLoad($self.vdgvReceipt);
            }

            //  Display To be Matched Qty
            _xMatched = qty;
            $self.txtMatched.setValue(_xMatched);
            $self.txtMatchedTo.setValue(0);
            $self.txtDifference.setValue(_xMatched);
            //  Status Info
            $self.lblStatusInfo.getControl().text($self.cmbMatchFrom.getControl().find('option:selected').val()
              + "# = " + $self.vdgvInvoice.records.length + " -" + $self.cmbMatchTo.getControl().find('option:selected').val() + "# = " + $self.vdgvReceipt.records.length);
            $self.lblStatusCount.getControl().text(0);
        }

        function cmd_Process() {
            //  Matched From
            var row = -1;
            if ($self.vdgvInvoice.getSelection().length > 0) {
                row = Number($self.vdgvInvoice.getSelection().toString());
            }

            if (row < 0) {
                return;
            }

            var BPartner = { 'key': $self.vdgvInvoice.get(row).C_BPartner_ID_K, 'value': $self.vdgvInvoice.get(row).C_BPartner_ID };
            var lineMatched = { 'key': $self.vdgvInvoice.get(row).Line_K, 'value': $self.vdgvInvoice.get(row).Line };
            var Product = { 'key': $self.vdgvInvoice.get(row).M_Product_ID_K, 'value': $self.vdgvInvoice.get(row).M_Product_ID };


            var toMatchQty = _xMatched;
            var matchedQty = $self.vdgvInvoice.get(row).Matched;

            var val = 1;
            //  Matched To
            var selectedItems = $self.vdgvReceipt.getSelection().toString();

            if (selectedItems == null) {
                return;
            }
            if (selectedItems.length <= 0) {
                return;
            }
            var splitValue = selectedItems.toString().split(',');
            for (var row = 0; row < splitValue.length; row++) {

                var id = ($self.vdgvReceipt.get(splitValue[0]))._ID;
                if (id != null) {
                    //  need to be the same product
                    var ProductCompare = { 'key': $self.vdgvReceipt.get(splitValue[row]).M_Product_ID_K, 'value': $self.vdgvReceipt.get(splitValue[row]).M_Product_ID };
                    if (Product.key != ProductCompare.key) {
                        continue;
                    }

                    var lineMatchedTo = { 'key': $self.vdgvReceipt.get(splitValue[row]).Line_K, 'value': $self.vdgvReceipt.get(splitValue[row]).Line };
                    //	Qty
                    var qty = 0.0;

                    // If we are doing not matched, qty will be the total remaining to match.
                    // If we are doing matched, qty will be the total matched, negative.
                    if ($self.cmbMatchMode.getControl()[0].selectedIndex == MODE_NOTMATCHED) {
                        qty = $self.vdgvReceipt.get(splitValue[row]).Qty;// doc
                    }
                    qty = qty - Number($self.vdgvReceipt.get(splitValue[row]).Matched);

                    // If we are doing not matched, allow matching up to toMatchQty.
                    // If we are doing matched, allow matching up to matchedQty in the negative direction.
                    if ($self.cmbMatchMode.getControl()[0].selectedIndex == MODE_NOTMATCHED) {
                        if (qty > toMatchQty) {
                            qty = toMatchQty;
                        }
                        toMatchQty = toMatchQty - qty;
                    }
                    else {
                        if (qty > matchedQty)
                            qty = qty - matchedQty;
                        matchedQty = matchedQty + qty;
                    }

                    //  Invoice or PO
                    var invoice = true;
                    if ($self.cmbMatchFrom.getControl().find('option:selected').val().equals(_matchOptions[MATCH_ORDER]) ||
                        $self.cmbMatchTo.getControl().find('option:selected').val().equals(_matchOptions[MATCH_ORDER])) {
                        invoice = false;
                    }

                    //  Get Shipment_ID
                    var M_InOutLine_ID = 0;
                    var Line_ID = 0;
                    if ($self.cmbMatchFrom.getControl()[0].selectedIndex == MATCH_SHIPMENT) {
                        M_InOutLine_ID = lineMatched.key;      //  upper table
                        Line_ID = lineMatchedTo.key;
                    }
                    else {
                        M_InOutLine_ID = lineMatchedTo.key;    //  lower table
                        Line_ID = lineMatched.key;
                    }

                    //  Create it
                    createMatchRecord(invoice, M_InOutLine_ID, Line_ID, qty, lineMatched.key, selectedItems);
                }
            }

        }

        function tableInit(display, matchToType) {
            var matched = $self.cmbMatchMode.getControl()[0].selectedIndex == MODE_MATCHED;
            //log.Config("Display=" + _matchOptions[display]
            //    + ", MatchTo=" + _matchOptions[matchToType]
            //    + ", Matched=" + matched);

            _sql = "";
            if (display == MATCH_INVOICE) {
                _dateColumn = "hdr.DateInvoiced";
                _qtyColumn = "lin.QtyInvoiced";
                _sql = _sql.concat("SELECT hdr.C_Invoice_ID,hdr.DocumentNo, hdr.DateInvoiced, bp.Name,hdr.C_BPartner_ID,"
                    + " lin.Line,lin.C_InvoiceLine_ID, p.Name,lin.M_Product_ID,"
                    + " lin.QtyInvoiced,SUM(NVL(mi.Qty,0)) as match "
                    + "FROM C_Invoice hdr"
                    + " INNER JOIN C_BPartner bp ON (hdr.C_BPartner_ID=bp.C_BPartner_ID)"
                    + " INNER JOIN C_InvoiceLine lin ON (hdr.C_Invoice_ID=lin.C_Invoice_ID)"
                    + " INNER JOIN M_Product p ON (lin.M_Product_ID=p.M_Product_ID)"
                    + " INNER JOIN C_DocType dt ON (hdr.C_DocType_ID=dt.C_DocType_ID and dt.DocBaseType in ('API','APC') AND dt.IsReturnTrx = ")
                    .concat($self.chkIsReturnTrx.prop('checked') ? "'Y')" : "'N')")
                    .concat(" FULL JOIN M_MatchInv mi ON (lin.C_InvoiceLine_ID=mi.C_InvoiceLine_ID) "
                    + "WHERE hdr.DocStatus IN ('CO','CL')");

                _groupBy = " GROUP BY hdr.C_Invoice_ID,hdr.DocumentNo,hdr.DateInvoiced,bp.Name,hdr.C_BPartner_ID,"
                    + " lin.Line,lin.C_InvoiceLine_ID,p.Name,lin.M_Product_ID,lin.QtyInvoiced "
                    + "HAVING "
                    + (matched ? "0" : "lin.QtyInvoiced")
                    + "<>SUM(NVL(mi.Qty,0))";
            }
            else if (display == MATCH_ORDER) {
                _dateColumn = "hdr.DateOrdered";
                _qtyColumn = "lin.QtyOrdered";
                _sql = _sql.concat("SELECT hdr.C_Order_ID,hdr.DocumentNo, hdr.DateOrdered, bp.Name,hdr.C_BPartner_ID,"
                    + " lin.Line,lin.C_OrderLine_ID, p.Name,lin.M_Product_ID,"
                    + " lin.QtyOrdered,SUM(COALESCE(mo.Qty,0)) as match "
                    + "FROM C_Order hdr"
                    + " INNER JOIN C_BPartner bp ON (hdr.C_BPartner_ID=bp.C_BPartner_ID)"
                    + " INNER JOIN C_OrderLine lin ON (hdr.C_Order_ID=lin.C_Order_ID)"
                    + " INNER JOIN M_Product p ON (lin.M_Product_ID=p.M_Product_ID)"
                    + " INNER JOIN C_DocType dt ON (hdr.C_DocType_ID=dt.C_DocType_ID AND dt.DocBaseType='POO'AND dt.isReturnTrx = ")
                    .concat($self.chkIsReturnTrx.prop('checked') ? "'Y')" : "'N')")
                    .concat(" FULL JOIN M_MatchPO mo ON (lin.C_OrderLine_ID=mo.C_OrderLine_ID) "
                    + "WHERE mo.")
                    .concat(matchToType == MATCH_SHIPMENT ? "M_InOutLine_ID" : "C_InvoiceLine_ID")
                    .concat(matched ? " IS NOT NULL" : " IS NULL"
                    + " AND hdr.DocStatus IN ('CO','CL')");

                _groupBy = " GROUP BY hdr.C_Order_ID,hdr.DocumentNo,hdr.DateOrdered,bp.Name,hdr.C_BPartner_ID,"
                    + " lin.Line,lin.C_OrderLine_ID,p.Name,lin.M_Product_ID,lin.QtyOrdered "
                    + "HAVING "
                    + (matched ? "0" : "lin.QtyOrdered")
                    + "<>SUM(COALESCE(mo.Qty,0))";
            }
            else    //  Shipment
            {
                _dateColumn = "hdr.MovementDate";
                _qtyColumn = "lin.MovementQty";
                _sql = _sql.concat("SELECT hdr.M_InOut_ID,hdr.DocumentNo, hdr.MovementDate, bp.Name,hdr.C_BPartner_ID,"
                    + " lin.Line,lin.M_InOutLine_ID, p.Name,lin.M_Product_ID,"
                    + " lin.MovementQty,SUM(NVL(m.Qty,0)) as match"
                    + " FROM M_InOut hdr"
                    + " INNER JOIN C_BPartner bp ON (hdr.C_BPartner_ID=bp.C_BPartner_ID)"
                    + " INNER JOIN M_InOutLine lin ON (hdr.M_InOut_ID=lin.M_InOut_ID)"
                    + " INNER JOIN M_Product p ON (lin.M_Product_ID=p.M_Product_ID)"
                    + " INNER JOIN C_DocType dt ON (hdr.C_DocType_ID = dt.C_DocType_ID AND dt.DocBaseType='MMR' AND dt.isReturnTrx = ")
                    .concat($self.chkIsReturnTrx.prop('checked') ? "'Y')" : "'N')")
                    .concat(" FULL JOIN ")
                    .concat(matchToType == MATCH_ORDER ? "M_MatchPO" : "M_MatchInv")
                    .concat(" m ON (lin.M_InOutLine_ID=m.M_InOutLine_ID) "
                    + "WHERE hdr.DocStatus IN ('CO','CL')");
                _groupBy = " GROUP BY hdr.M_InOut_ID,hdr.DocumentNo,hdr.MovementDate,bp.Name,hdr.C_BPartner_ID,"
                    + " lin.Line,lin.M_InOutLine_ID,p.Name,lin.M_Product_ID,lin.MovementQty "
                    + "HAVING "
                    + (matched ? "0" : "lin.MovementQty")
                    + "<>SUM(NVL(m.Qty,0))";
            }
            //	Log.trace(7, "VMatch.tableInit", _sql + "\n" + _groupBy);
        }

        function tableLoad(tableName) {
            var sql = VIS.MRole.getDefault().addAccessSQL(
                _sql.toString(), "hdr", VIS.MRole.SQL_FULLYQUALIFIED, VIS.MRole.SQL_RO)
                + _groupBy;

            try {
                var dr = VIS.DB.executeReader(sql.toString(), null, null);
                var data = []

                var count = 1;
                while (dr.read()) {
                    var line = {};
                    line['_ID'] = dr.getInt(0);
                    line['DocumentNo'] = dr.getString(1);
                    line['Date'] = dr.getString(2);
                    line['C_BPartner_ID'] = dr.getString(3);
                    line['C_BPartner_ID_K'] = dr.getInt(4);
                    line['Line'] = dr.getString(5);
                    line['Line_K'] = dr.getInt(6);
                    line['M_Product_ID'] = dr.getString(7);
                    line['M_Product_ID_K'] = dr.getInt(8);
                    line['Qty'] = dr.getString(9);
                    line['Matched'] = dr.getString(10);
                    line['recid'] = count;
                    count++;
                    data.push(line);
                }
                dr.close();

                if (tableName.columns.length > 0) {
                    //tableName.Columns.Clear();
                }
                if (data.length < 1) {

                    addColumns(tableName.name.contains("vdgvReceipt"));
                    return;
                }

                if (tableName.name.contains("vdgvReceipt")) {
                    loadvdgvReceipt($self.arrListColumns, data);
                }
                else if (tableName.name.contains("vdgvInvoice")) {
                    loadvdgvInvoice($self.arrListColumns, data);
                    cmd_SearchTo();
                }
            }
            catch (e) {
                // log.Log(Level.SEVERE, sql, e);
            }
        }

        function createMatchRecord(invoice, M_InOutLine_ID, Line_ID, qty, lineMatched, selectedItems) {
            if (qty == 0) {
                return true;
            }
            var obj = $self;

            $.ajax({
                url: VIS.Application.contextUrl + "Common/CreateMatchRecord",
                dataType: "json",
                data: {
                    invoice: invoice,
                    M_InOutLine_ID: M_InOutLine_ID,
                    Line_ID: Line_ID,
                    qty: qty
                },
                success: function (data) {
                    //  requery
                    cmd_Search();
                   // $self.vdgvReceipt.select(selectedItems);
                    $self.vdgvReceipt.delete(true);
                    VIS.ADialog.info("Processed Line No: " + lineMatched.toString(), null, null, null);

                    //w2ui.grid.select(selectedItems);
                    //w2ui.grid.delete(true);


                }
            });
        }

        function requery(lineMatched) {
            cmd_Search();
            VIS.ADialog.info("Processed Line No: " + lineMatched.toString(), null, null, null);
        }

        function addColumns(isReceipt) {
            if ($self.arrListColumns.length == 0) {
                $self.arrListColumns.push({ field: "_ID", caption: "_ID", sortable: true, size: '11%', hidden: true });
                $self.arrListColumns.push({ field: "DocumentNo", caption: VIS.Msg.translate(VIS.Env.getCtx(), "DocumentNo"), sortable: true, size: '11%', hidden: false });
                $self.arrListColumns.push({ field: "Date", caption: VIS.Msg.translate(VIS.Env.getCtx(), "Date"), sortable: true, size: '11%', hidden: false, render: 'date' });
                $self.arrListColumns.push({ field: "C_BPartner_ID", caption: VIS.Msg.translate(VIS.Env.getCtx(), "C_BPartner_ID"), sortable: true, size: '11%', hidden: false });
                $self.arrListColumns.push({ field: "C_BPartner_ID_K", caption: VIS.Msg.translate(VIS.Env.getCtx(), "C_BPartner_ID"), sortable: true, size: '11%', hidden: true });
                $self.arrListColumns.push({ field: "Line", caption: VIS.Msg.translate(VIS.Env.getCtx(), "Line"), sortable: true, size: '11%', hidden: false });
                $self.arrListColumns.push({ field: "Line_K", caption: VIS.Msg.translate(VIS.Env.getCtx(), "Line"), sortable: true, size: '11%', hidden: true });
                $self.arrListColumns.push({ field: "M_Product_ID", caption: VIS.Msg.translate(VIS.Env.getCtx(), "M_Product_ID"), sortable: true, size: '11%', hidden: false });
                $self.arrListColumns.push({ field: "M_Product_ID_K", caption: VIS.Msg.translate(VIS.Env.getCtx(), "M_Product_ID"), sortable: true, size: '11%', hidden: true });
                $self.arrListColumns.push({ field: "Qty", caption: VIS.Msg.translate(VIS.Env.getCtx(), "Qty"), sortable: true, size: '11%', hidden: false });
                $self.arrListColumns.push({ field: "Matched", caption: VIS.Msg.translate(VIS.Env.getCtx(), "Matched"), sortable: true, size: '11%', hidden: false });
            }

            if (isReceipt == null) {

                if ($self.vdgvInvoice != null) {
                    $self.vdgvInvoice.destroy();
                    $self.vdgvInvoice = null;
                }


                $self.vdgvInvoice = $($self.invoicegrd).w2grid({
                    name: "vdgvInvoice" + $self.windowNo,
                    recordHeight: 30,
                    show: { selectColumn: false },
                    onSelect: function (event) {
                        cmd_SearchTo(event.recid);
                    },
                    multiSelect: false,
                    columns: $self.arrListColumns,
                    records: null
                });

                if ($self.vdgvReceipt != null) {
                    $self.vdgvReceipt.destroy();
                    $self.vdgvReceipt = null;
                }

                $self.vdgvReceipt = $($self.reciptgrd).w2grid({
                    name: "vdgvReceipt" + $self.windowNo,
                    recordHeight: 30,
                    show: { selectColumn: true },
                    onSelect: function (event) {
                        this.multiSelect = true;
                        tableChanged(event.recid, true);
                    },
                    onUnselect: function (event) {
                        tableChanged(event.recid, false);
                    },
                    multiSelect: false,
                    columns: $self.arrListColumns,
                    records: null
                });
            }
            else if (!isReceipt) {
                if ($self.vdgvInvoice != null) {
                    $self.vdgvInvoice.destroy();
                    $self.vdgvInvoice = null;
                }

                $self.vdgvInvoice = $($self.invoicegrd).w2grid({
                    name: "vdgvInvoice" + $self.windowNo,
                    recordHeight: 30,
                    show: { selectColumn: false },
                    onSelect: function (event) {
                        cmd_SearchTo(event.recid);
                    },
                    multiSelect: false,
                    columns: $self.arrListColumns,
                    records: null
                });

                //vdgvInvoice.ReadOnly = true;
            }
            else if (isReceipt) {
                if ($self.vdgvReceipt != null) {
                    $self.vdgvReceipt.destroy();
                    $self.vdgvReceipt = null;
                }

                $self.vdgvReceipt = $($self.reciptgrd).w2grid({
                    name: "vdgvReceipt" + $self.windowNo,
                    recordHeight: 30,
                    show: { selectColumn: true },
                    onSelect: function (event) {
                        this.multiSelect = true;
                        tableChanged(event.recid, true);
                    },
                    onUnselect: function (event) {
                        tableChanged(event.recid, false);
                    },
                    multiSelect: false,
                    columns: $self.arrListColumns,
                    records: null
                });
            }
        }

        function loadvdgvInvoice(columns, data) {
            if ($self.vdgvInvoice != null) {
                $self.vdgvInvoice.destroy();
                $self.vdgvInvoice = null;
            }

            w2utils.encodeTags(data);

            $self.vdgvInvoice = $($self.invoicegrd).w2grid({
                name: "vdgvInvoice" + $self.windowNo,
                recordHeight: 30,
                show: { selectColumn: false },
                onSelect: function (event) {
                    cmd_SearchTo(event.recid);
                },
                multiSelect: false,
                columns: columns,
                records: data
            });

        }

        function loadvdgvReceipt(columns, data) {

            if ($self.vdgvReceipt != null) {
                $self.vdgvReceipt.destroy();
                $self.vdgvReceipt = null;
            }

            w2utils.encodeTags(data);

            $self.vdgvReceipt = $($self.reciptgrd).w2grid({
                name: "vdgvReceipt" + $self.windowNo,
                recordHeight: 30,
                show: { selectColumn: true },
                onSelect: function (event) {
                    this.multiSelect = true;
                    tableChanged(event.recid, true);
                },
                onUnselect: function (event) {
                    tableChanged(event.recid, false);
                },
                multiSelect: false,
                columns: columns,
                records: data
            });

        }

        function tableChanged(recid, select) {

            if ($self.vdgvInvoice.records.length < 1) {
                return;
            }

            if (!$self.chkSameProduct.prop("checked")) {
                setTimeout(function () { $self.vdgvReceipt.unselect(Number(recid)) }, 10);
                return;
            }


            var matchedRow = -1;
            if ($self.vdgvInvoice.getSelection().length > 0) {
                matchedRow = Number($self.vdgvInvoice.getSelection().toString());
            }

            var Product = { 'key': $self.vdgvInvoice.get(matchedRow).M_Product_ID_K, 'value': $self.vdgvInvoice.get(matchedRow).M_Product_ID };

            //  Matched To
            var qty = 0.0;
            var noRows = 0;
            var newColumn = 0;

            var selectedItems = recid + "," + $self.vdgvReceipt.getSelection().toString().replace(recid, '');

            if (select && selectedItems != null) {
                if (selectedItems.length > 0) {

                    //remove last comma if string have
                    selectedItems = selectedItems.replace(/,$/, "");

                    var splitValue = selectedItems.toString().split(',');
                    for (var row = 0; row < splitValue.length; row++) {
                        var id = ($self.vdgvReceipt.get(splitValue[0]))._ID;
                        if (id != null) {
                            var ProductCompare = { 'key': $self.vdgvReceipt.get(splitValue[row]).M_Product_ID_K, 'value': $self.vdgvReceipt.get(splitValue[row]).M_Product_ID };
                            if (Product.key != ProductCompare.key) {
                                setTimeout(function () { $self.vdgvReceipt.unselect(Number(recid)) }, 10);
                                return;
                            }
                            else {
                                if ($self.cmbMatchMode.getControl()[0].selectedIndex == MODE_NOTMATCHED) {
                                    qty = qty + Number(($self.vdgvReceipt.get(splitValue[row])).Qty);
                                }
                                qty = qty - Number(($self.vdgvReceipt.get(splitValue[row])).Matched);//xMatchedToTable.getValueAt(row, I_MATCHED)); // matched
                                noRows++;
                            }
                        }
                    }
                }
            }

            _xMatchedTo = qty;
            $self.txtMatchedTo.setValue(_xMatchedTo.toString());
            $self.txtDifference.setValue(_xMatched - _xMatchedTo);
            if (noRows <= 0) {
                $self.btnProcess.removeAttr("disabled");
            }
            $self.lblStatusCount.getControl().text(noRows);
        }


        this.Initialize = function () {

            for (var i = 0; i < _matchOptions.length; i++) {
                this.cmbMatchFrom.getControl().append(" <option value='" + _matchOptions[i] + "'>" + _matchOptions[i] + "</option>");
            }

            for (var i = 0; i < _matchMode.length; i++) {
                this.cmbMatchMode.getControl().append(" <option value='" + _matchMode[i] + "'>" + _matchMode[i] + "</option>");
            }

            this.cmbMatchFrom.getControl().prop('selectedIndex', 0);
            this.cmbMatchMode.getControl().prop('selectedIndex', 0);

            fillPicks();
            initDesign();
            initializeComponent();

            this.btnToggel = this.$root.find("#btnToggelDiv_" + $self.windowNo);
            this.gridSelectDiv = this.$root.find("#divForGrid_" + $self.windowNo);

            //Events
            if (this.cmbMatchFrom.getControl() != null)
                this.cmbMatchFrom.getControl().change(function () {
                    $self.$busyDiv[0].style.visibility = 'visible';
                    dynInit();
                    cmd_MatchFrom();
                    $self.$busyDiv[0].style.visibility = "hidden";
                });

            if (this.cmbMatchTo.getControl() != null)
                this.cmbMatchTo.getControl().change(function () {
                    $self.$busyDiv[0].style.visibility = 'visible';
                    cmd_MatchTo();
                    $self.$busyDiv[0].style.visibility = "hidden";
                });

            //if (this.cmbMatchMode.getControl() != null)
            //    this.cmbMatchMode.getControl().change(function () {

            //    });

            if (this.btnSearch != null)
                this.btnSearch.on(VIS.Events.onTouchStartOrClick, function () {
                    $self.$busyDiv[0].style.visibility = 'visible';
                    cmd_Search();
                    $self.$busyDiv[0].style.visibility = "hidden";
                });

            if (this.btnProcess != null)
                this.btnProcess.on(VIS.Events.onTouchStartOrClick, function () {
                    $self.$busyDiv[0].style.visibility = 'visible';
                    cmd_Process();
                    $self.$busyDiv[0].style.visibility = "hidden";
                });

            if (this.btnToggel != null)
                this.btnToggel.on(VIS.Events.onTouchStartOrClick, function () {
                    if (toggleside) {
                        $self.btnToggel.animate({ borderSpacing: 0 }, {
                            step: function (now, fx) {
                                $(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
                                $(this).css('-moz-transform', 'rotate(' + now + 'deg)');
                                $(this).css('transform', 'rotate(' + now + 'deg)');
                            },
                            duration: 'slow'
                        }, 'linear');

                        toggleside = false;
                        $self.btnSpaceDiv.animate({ width: sideDivWidth }, "slow");
                        $self.gridSelectDiv.animate({ width: selectDivWidth }, "slow");
                        $self.invoiceTopDiv.animate({ width: selectDivWidth }, "slow");
                        $self.div.css("display", "block");
                        $self.sideDiv.animate({ width: sideDivWidth }, "slow", null, function () {
                            $self.vdgvInvoice.resize();
                            $self.vdgvReceipt.resize();
                        });
                    }
                    else {
                        // $self.btnRefresh.show();
                        $self.btnToggel.animate({ borderSpacing: 180 }, {
                            step: function (now, fx) {
                                $(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
                                $(this).css('-moz-transform', 'rotate(' + now + 'deg)');
                                $(this).css('transform', 'rotate(' + now + 'deg)');
                            },
                            duration: 'slow'
                        }, 'linear');

                        toggleside = true;
                        $self.btnSpaceDiv.animate({ width: minSideWidth }, "slow");
                        $self.sideDiv.animate({ width: minSideWidth }, "slow");
                        $self.div.css("display", "none");
                        $self.invoiceTopDiv.animate({ width: selectDivFullWidth }, "slow");
                        $self.gridSelectDiv.animate({ width: selectDivFullWidth }, "slow", null, function () {
                            $self.vdgvInvoice.resize();
                            $self.vdgvReceipt.resize();
                        });
                    }
                });

            this.chkSameBPartner.change(function () {
                $self.$busyDiv[0].style.visibility = 'visible';
                cmd_SearchTo();
                $self.$busyDiv[0].style.visibility = "hidden";
            });

            this.chkSameQty.change(function () {
                $self.$busyDiv[0].style.visibility = 'visible';
                cmd_SearchTo();
                $self.$busyDiv[0].style.visibility = "hidden";
            });

            this.chkSameProduct.change(function () {
                $self.$busyDiv[0].style.visibility = 'visible';
                cmd_SearchTo();
                $self.$busyDiv[0].style.visibility = "hidden";
            });

            //if (this.onlyProduct != null)
            //    this.onlyProduct.addVetoableChangeListener(this);

            //if (this.onlyVendor != null)
            //    this.onlyVendor.addVetoableChangeListener(this);
            $self.$busyDiv[0].style.visibility = "hidden";
        }

        this.display = function () {
            dynInit();
        }

        this.getRoot = function () {
            return this.$root;
        };

        this.callConsolidate = function () {
            $.ajax({
                url: VIS.Application.contextUrl + "Common/Consolidate",
                dataType: "json",
                async: true,
                success: function (data) {
                }
            });

            $self.vdgvReceipt.multiSelect = true;
            var name = "vdgvReceipt" + $self.windowNo;
            w2ui[name].multiSelect = true;
        }

        this.disposeComponent = function () {

            if (this.btnSearch)
                this.btnSearch.off(VIS.Events.onTouchStartOrClick);
            if (this.btnProcess)
                this.btnProcess.off(VIS.Events.onTouchStartOrClick);
            if (this.btnToggel)
                this.btnToggel.off(VIS.Events.onTouchStartOrClick);



            this.frame = null;
            this.windowNo = null;
            this.arrListColumns = null;
            this.vdgvInvoice = null;
            this.vdgvReceipt = null;

            this.lblMatchFrom = null;
            this.lblMatchTo = null;
            this.lblMatchMode = null;
            this.lblBPartner = null;
            this.lblProduct = null;
            this.lblDateFrom = null;
            this.lblDateTo = null;

            this.lblInvoice = null;
            this.lblReceipt = null;
            this.lblMatched = null;
            this.lblMatchedTo = null;
            this.lblDifference = null;
            this.lblStatusInfo = null;
            this.lblStatusCount = null;
            this.lblSearch = null;

            this.cmbMatchFrom = null;
            this.cmbMatchTo = null;
            this.cmbMatchMode = null;

            this.chkIsReturnTrx = null;
            this.chkSameBPartner = null;
            this.chkSameProduct = null;
            this.chkSameQty = null;

            this.onlyVendor = null;
            this.onlyProduct = null;

            this.dtpFrom = null;
            this.dtpTo = null;

            this.btnSearch = null;
            this.btnProcess = null;
            this.btnToggel = null;

            this.txtMatched = null;
            this.txtMatchedTo = null;
            this.txtDifference = null;

            this.$root = null;
            this.$busyDiv = null;

            this.sideDiv = null;
            this.gridSelectDiv = null;
            this.gridInvoiceDiv = null;
            this.gridReciptDiv = null;
            this.processlDiv = null;
            this.bottumDiv = null;
            this.btnSpaceDiv = null;

            toggleside = null;
            sideDivWidth = null;;
            minSideWidth = null;

            selectDivWidth = null;
            selectDivFullWidth = null;
            selectDivHeight = null;

            _AD_Client_ID = null;
            _AD_Org_ID = null;
            _by = null;

            MATCH_INVOICE = null;
            MATCH_SHIPMENT = null;
            MATCH_ORDER = null;
            MODE_NOTMATCHED = null;
            MODE_MATCHED = null;

            _sql = null;
            _dateColumn = null;
            _qtyColumn = null;
            _groupBy = null;
            _xMatched = null;
            _xMatchedTo = null;
            $self = null;
            _matchOptions = null;
            _matchMode = null;
            this.disposeComponent = null;
        };
    };

    //Must Implement with same parameter
    VMatch.prototype.init = function (windowNo, frame) {
        this.frame = frame;
        this.windowNo = windowNo;
        VIS.Env.getCtx().setContext(this.windowNo, "IsSOTrx", "Y");

        try {
            var obj = this.Initialize();
        }
        catch (ex) {
            //log.Log(Level.SEVERE, "init", ex);
        }

        this.frame.getContentGrid().append(this.getRoot());
        this.display();
        this.callConsolidate();


    };

    //Must implement dispose
    VMatch.prototype.dispose = function () {
        /*CleanUp Code */
        //dispose this component
        this.disposeComponent();

        //call frame dispose function
        if (this.frame)
            this.frame.dispose();
        this.frame = null;
    };

    VIS.Apps.AForms.VMatch = VMatch;

})(VIS, jQuery);