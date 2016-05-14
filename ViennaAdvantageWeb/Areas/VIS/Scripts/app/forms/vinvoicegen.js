﻿
; (function (VIS, $) {
    VIS.Apps.AForms = VIS.Apps.AForms || {};

    function VInvoiceGen() {
        this.frame;
        this.windowNo;
        var $self = this;
        this.arrListColumns = [];
        this.dGrid = null;
        var whereClause = null;
        var AD_Org_ID = null;
        var C_BPartner_ID = null;

        var toggle = false;
        var toggleGen = false;
        var toggleside = false;

        this.lblOrg = new VIS.Controls.VLabel();
        this.lblBPartner = new VIS.Controls.VLabel();
        this.lblStatusInfo = new VIS.Controls.VLabel();
        this.tabSelect = new VIS.Controls.VLabel();
        this.tabGenrate = new VIS.Controls.VLabel();
        this.cmbOrg = new VIS.Controls.VComboBox('', false, false, true);
        this.vSearchBPartner = null;

        this.$root = $("<div style='width: 100%; height: 100%; background-color: white;'>");
        this.$busyDiv = $("<div class='vis-apanel-busy'>");

        this.topDiv = null;
        this.sideDiv = null;
        this.gridSelectDiv = null;
        this.gridGenerateDiv = null;
        this.bottumDiv = null;

        this.div = null;

        this.okBtn = null;
        this.cancelBtn = null;
        this.btnRefresh = null;
        this.btnToggel = null;
        this.spnSelect = null;
        this.spnGenerate = null;
        this.btnSpaceDiv = null;
        this.lblGenrate = null;
        this.lblSelect = null;

        var sideDivWidth = 260;
        var minSideWidth = 50;
        //window with-(sidediv with_margin from left+ space)
        var selectDivWidth = $(window).width() - (sideDivWidth + 20 + 5);
        var selectDivFullWidth = $(window).width() - (20 + minSideWidth);
        var selectDivToggelWidth = selectDivWidth + sideDivWidth + 5;
        var sideDivHeight = $(window).height() - 210;


        function initializeComponent() {

            var topDivId = "topDiv_" + $self.windowNo;
            var btnSpaceDivId = "btnSpaceDiv_" + $self.windowNo;
            var btnSpaceId = "btnSpace_" + $self.windowNo;
            var spnSelectid = "spnSelect_" + $self.windowNo;
            var spnGenerateid = "spnGenerate_" + $self.windowNo;

            var lblGenerateid = "lblGenerate_" + $self.windowNo;
            var lblSelectid = "lblSelect_" + $self.windowNo;

            var src = VIS.Application.contextUrl + "Areas/VIS/Images/base/arrow-left.png";

            $self.topDiv = $("<div id='" + topDivId + "' style='float: left; width: 100%; height: 45px; margin-bottom: 2px;margin-left: 0px;'>" +
                       "<div id='" + btnSpaceDivId + "' style='width: 260px; height: 45px;float: left;padding-left: 11px; padding-top: 11px;; background-color: #F1F1F1;'>" +
                       "<button id='" + btnSpaceId + "' style='border: 0px;background-color: transparent; padding: 0px;' >" +
                       "<img src='" + src + "' /></button></div>" +
                       "<div id='" + spnSelectid + "'style='display: inline-block;  padding-left: 15px;margin-right: 15px;' >" +
                       "<label id='" + lblSelectid + "' class='VIS_Pref_Label_Font' style='vertical-align: middle;font-size: 28px;color: #19A0ED;'>" + VIS.Msg.translate(VIS.Env.getCtx(), "Select") + "</label></div>" +
                       "<div id='" + spnGenerateid + "' style='display: inline-block; width: 160px;'>" +
                       "<label id='" + lblGenerateid + "' class='VIS_Pref_Label_Font' style='vertical-align: middle; font-size: 17px;'>" + VIS.Msg.translate(VIS.Env.getCtx(), "Generate") + "</label></div></div>");

            var sideDivId = "sideDiv_" + $self.windowNo;
            var parameterDivId = "parameterDiv_" + $self.windowNo;

            $self.btnSpaceDiv = $self.topDiv.find("#" + btnSpaceDivId);
            this.lblGenrate = $self.topDiv.find("#" + lblGenerateid);
            this.lblSelect = $self.topDiv.find("#" + lblSelectid);

            $self.sideDiv = $("<div id='" + sideDivId + "' style='float: left; margin-left: 0px; background-color: #F1F1F1;'>");
            $self.sideDiv.css("width", sideDivWidth);
            $self.sideDiv.css("height", sideDivHeight);

            $self.div = $("<div style='float: left; width: 100%;' id='" + parameterDivId + "'>");
            $self.sideDiv.append($self.div);

            var tble = $("<table style='width: 100%;'>");

            var tr = $("<tr>");
            var td = $("<td style='padding: 4px 15px 2px;'>");
            $self.div.append(tble);
            tble.append(tr);
            tr.append(td);
            td.append($self.lblOrg.getControl().css("display", "inline-block").addClass("VIS_Pref_Label_Font"));

            tr = $("<tr>");
            td = $("<td style='padding: 4px 15px 2px;'>");
            tble.append(tr);
            tr.append(td);
            td.append($self.cmbOrg.getControl().css("display", "inline-block").css("width", "236px").css("height", "30px"));

            tr = $("<tr>");
            td = $("<td style='padding: 4px 15px 2px;'>");
            tble.append(tr);
            tr.append(td);

            td.append($self.lblBPartner.getControl().css("display", "inline-block").addClass("VIS_Pref_Label_Font"));
            tr = $("<tr>");
            td = $("<td style='padding: 0px 15px 0px;'>");
            tble.append(tr);
            tr.append(td);
            // var ctrl = $("<div style='float: left; width: 100%;' class='VIS_Pref_slide-show pp'>");
            //ctrl.removeClass("VIS_Pref_slide-show pp");
            td.append($self.vSearchBPartner.getControl().css('width', '206px')).append($self.vSearchBPartner.getBtn(0).css('width', '30px').css('height', '30px').css('padding', '0px').css('border-color', '#BBBBBB'));
            //td.append(ctrl);

            var gridSelectDivId = "gridSelectDiv_" + $self.windowNo;
            var gridGenerateDivId = "gridGenerateDiv_" + $self.windowNo;

            $self.gridSelectDiv = $("<div id='" + gridSelectDivId + "' style='float: right; margin-right: 15px;border: 1px solid darkgray;'>");
            $self.gridSelectDiv.css("width", selectDivWidth);
            $self.gridSelectDiv.css("height", sideDivHeight);

            $self.gridGenerateDiv = $("<div id='" + gridGenerateDivId + "' style='height: 85%; float: right; display: none; background-color: #F1F1F1; margin-left: 15px;;margin-right: 15px;'>");
            $self.gridGenerateDiv.css("width", $(window).width() - 30);


            var name = "btnOk_" + $self.windowNo;
            $self.okBtn = $("<input id='" + name + "' class='VIS_Pref_btn-2' style='margin-bottom: 1px; margin-top: 1px; float: right; margin-right: 15px ;width: 70px;height: 38px;' type='button' value='Ok'>");

            //name = "btnCancel_" + $self.windowNo;
            //$self.cancelBtn = $("<input id='" + name + "' class='VIS_Pref_btn-2' style='margin-bottom: 0px; margin-top: 6px; float: right;margin-right: 4px;' type='button' value='Cancel'>");

            name = "btnRefresh_" + $self.windowNo;
            var src = VIS.Application.contextUrl + "Areas/VIS/Images/base/Refresh24.png";
            $self.btnRefresh = $("<button id='" + name + "' style='margin-bottom: 1px; margin-top: 0px; float: left; margin-left: 15px;height: 38px; ' class='VIS_Pref_btn-2'>" +
                       "<img src='" + src + "'></button>");

            var discriptionDivId = "discriptionDiv_" + $self.windowNo;
            $self.bottumDiv = $("<div style='width: 100%; height: 50px; float: left; margin-bottom: 0px;margin-top: 5px;'>");
            var mdg = $("<div id='" + discriptionDivId + "' style='width: 69%; float: left; margin-bottom: 0px; padding-top: 8px;padding-left: 10px; text-align: left;'>");
            mdg.append($self.lblStatusInfo.getControl().addClass("VIS_Pref_Label_Font"));
            var buttonDiv = $("<div style='width: 175px; float: right; text-align: right; margin-bottom: 0px;'>");
            //buttonDiv.append($self.cancelBtn);
            buttonDiv.append($self.okBtn);

            $self.bottumDiv.append($self.btnRefresh).append(mdg).append(buttonDiv);

            //Add to root
            $self.$root.append($self.$busyDiv);
            $self.$root.append($self.topDiv).append($self.sideDiv).append($self.gridSelectDiv).append($self.gridGenerateDiv).append($self.bottumDiv);
        }

        function jbInit() {
            $self.lblOrg.getControl().text(VIS.Msg.translate(VIS.Env.getCtx(), "AD_Org_ID"));
            $self.lblBPartner.getControl().text(VIS.Msg.translate(VIS.Env.getCtx(), "C_BPartner_ID"));
            $self.tabSelect.getControl().text(VIS.Msg.getMsg("Select", false, false));
            $self.tabGenrate.getControl().text(VIS.Msg.getMsg("Generate", false, false));
            $self.lblStatusInfo.getControl().text(VIS.Msg.getMsg("InvGenerateSel", false, false));
        }

        function fillPicks() {
            var lookup = VIS.MLookupFactory.getMLookUp(VIS.Env.getCtx(), $self.windowNo, 2163, VIS.DisplayType.TableDir);
            $self.cmbOrg = new VIS.Controls.VComboBox("AD_Org_ID", true, false, true, lookup, 150, VIS.DisplayType.TableDir, 0);

            var value = VIS.MLookupFactory.getMLookUp(VIS.Env.getCtx(), $self.windowNo, 2762, VIS.DisplayType.Search);
            $self.vSearchBPartner = new VIS.Controls.VTextBoxButton("C_BPartner_ID", true, false, true, VIS.DisplayType.Search, value);
        }

        function dynInit(data) {

            if ($self.dGrid != null) {
                $self.dGrid.destroy();
                $self.dGrid = null;
            }
            if ($self.arrListColumns.length == 0) {
                // this.arrListColumns.push({ field: "Select", caption: VIS.Msg.getMsg("Select"), sortable: true, size: '50px', hidden: false });
                $self.arrListColumns.push({ field: "AD_Org_ID", caption: VIS.Msg.translate(VIS.Env.getCtx(), "AD_Org_ID"), sortable: true, size: '16%', min: 150, hidden: false });
                $self.arrListColumns.push({ field: "C_DocType_ID", caption: VIS.Msg.translate(VIS.Env.getCtx(), "C_DocType_ID"), sortable: true, size: '16%', min: 150, hidden: false });
                $self.arrListColumns.push({ field: "DocumentNo", caption: VIS.Msg.getElement(VIS.Env.getCtx(), "DocumentNo"), sortable: true, size: '16%', min: 150, hidden: false });
                $self.arrListColumns.push({ field: "C_BPartner_ID", caption: VIS.Msg.getElement(VIS.Env.getCtx(), "C_BPartner_ID"), sortable: true, size: '16%', min: 150, hidden: false });
                $self.arrListColumns.push({ field: "DateOrdered", caption: VIS.Msg.getElement(VIS.Env.getCtx(), "DateOrdered"), sortable: true, size: '16%', min: 150, hidden: false, render: 'date' });
                $self.arrListColumns.push({ field: "TotalLines", caption: VIS.Msg.getElement(VIS.Env.getCtx(), "TotalLines"), sortable: true, size: '20%', min: 150, hidden: false });

                $self.arrListColumns.push({ field: "C_Order_ID", caption: VIS.Msg.translate(VIS.Env.getCtx(), "C_UOM_ID"), sortable: true, size: '150px', hidden: true });
            }

            w2utils.encodeTags(data);
            $self.dGrid = $($self.gridSelectDiv).w2grid({
                name: "gridGenForm" + $self.windowNo,
                recordHeight: 40,
                show: { selectColumn: true },
                multiSelect: true,
                columns: $self.arrListColumns,
                records: data
            });
        }

        function executeQuery() {
            var data = [];

            var AD_Client_ID = VIS.Env.getCtx().getAD_Client_ID();
            //  Create SQL
            var sql = (
                "SELECT C_Order_ID, o.Name, dt.Name, DocumentNo, bp.Name, DateOrdered, TotalLines "
                + "FROM C_Invoice_Candidate_v ic, AD_Org o, C_BPartner bp, C_DocType dt "
                + "WHERE ic.AD_Org_ID=o.AD_Org_ID"
                + " AND ic.C_BPartner_ID=bp.C_BPartner_ID"
                + " AND ic.C_DocType_ID=dt.C_DocType_ID"
                + " AND ic.AD_Client_ID=" + AD_Client_ID);

            if (AD_Org_ID != null) {
                if (AD_Org_ID.toString() != "-1") {
                    sql = sql.concat(" AND ic.AD_Org_ID=").concat(AD_Org_ID);
                }
            }
            if (C_BPartner_ID != null) {
                sql = sql.concat(" AND ic.C_BPartner_ID=").concat(C_BPartner_ID);
            }
            sql = sql.concat(" ORDER BY o.Name,bp.Name,DateOrdered");

            try {
                var dr = VIS.DB.executeReader(sql.toString(), null, null);
                var count = 1;
                while (dr.read()) {
                    var line = {};
                    line['C_Order_ID'] = dr.getInt(0);
                    line['AD_Org_ID'] = dr.getString(1);
                    line['C_DocType_ID'] = dr.getString(2);
                    line['DocumentNo'] = dr.getString(3);
                    line['C_BPartner_ID'] = dr.getString(4);
                    line['DateOrdered'] = dr.getString(5);
                    line['TotalLines'] = dr.getString(6);
                    line['recid'] = count;
                    count++;
                    data.push(line);
                }
            }
            catch (e) {
            }
            dynInit(data);

            return data;
        }

        function saveSelection() {
            if ($self.dGrid == null) {
                return false;
            }
            var results = [];
            var selectedItems = $self.dGrid.getSelection();

            if (selectedItems == null) {
                return;
            }
            if (selectedItems.length <= 0) {
                return;
            }
            var splitValue = selectedItems.toString().split(',');
            for (var i = 0; i < splitValue.length; i++) {
                results[i] = ($self.dGrid.get(splitValue[0])).C_Order_ID;//($self.dGrid.get(splitValue[i]));// //  ID in column 0
            }

            if (results.length == 0) {
                return "";
            }

            //	Query String
            var keyColumn = "C_Order_ID";
            var sb = keyColumn;
            if (results.length > 1) {
                sb = sb.concat(" IN (");
            }
            else {
                sb = sb.concat("=");
            }
            //	Add elements
            for (var i = 0; i < results.length; i++) {
                if (i > 0) {
                    sb = sb.concat(",");
                }
                if (keyColumn.endsWith("_ID")) {
                    sb = sb.concat(results[i].toString());
                }
                else {
                    sb = sb.concat("'").concat(results[i].toString());
                }
            }

            if (results.length > 1) {
                sb = sb.concat(")");
            }

            return sb.toString();
        }

        function generateInvoices(whereClause) {
            var obj = $self;

            $.ajax({
                url: VIS.Application.contextUrl + "Common/GenerateInvoices",
                dataType: "json",
                data: {
                    whereClause: whereClause
                },
                success: function (data) {
                    if (data.DocumentText != null) {
                        //show Generate table with message
                        generatetab(true);
                        obj.gridGenerateDiv.html(data.DocumentText);
                        obj.lblStatusInfo.getControl().text(data.lblStatusInfo);
                    }
                    if (data.ErrorMsg != null) {
                        //show Message in pop up
                        alert(data.ErrorMsg);
                    }
                    obj.$busyDiv[0].style.visibility = "hidden";
                }
            });
        }

        function generatetab(toggleside) {
            if (toggleside) {
                $self.btnRefresh.hide();
                $self.okBtn.hide();
                $self.btnToggel.animate({ borderSpacing: 0 }, {
                    step: function (now, fx) {
                        $(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
                        $(this).css('-moz-transform', 'rotate(' + now + 'deg)');
                        $(this).css('transform', 'rotate(' + now + 'deg)');
                    },
                    duration: 'slow'
                }, 'linear');

                toggleside = false;

                $self.gridSelectDiv.animate({ width: selectDivWidth }, "fast");
                $self.sideDiv.animate({ width: 'toggle', height: 'toggle' }, "slow");
            }
            $self.gridSelectDiv.css("display", "none");
            $self.sideDiv.css("display", "none");
            $self.gridGenerateDiv.css("display", "block");
            //$self.btnToggel.attr('disabled', 'disabled');
            $self.btnToggel.hide();

            lblSelect.css("font-size", "17px").css("color", "#333333");
            lblGenrate.css("font-size", "28px").css("color", "#19A0ED");
        }

        this.vetoablechange = function (evt) {
            C_BPartner_ID = $self.vSearchBPartner.getValue();
            executeQuery();
        };

        this.Initialize = function () {
            fillPicks();
            jbInit();
            initializeComponent();
            this.btnToggel = this.$root.find("#btnSpace_" + $self.windowNo);
            this.spnSelect = this.$root.find("#spnSelect_" + $self.windowNo);
            this.spnGenerate = this.$root.find("#spnGenerate_" + $self.windowNo)
            //display grid


            //Events

            if (this.okBtn != null)
                this.okBtn.on(VIS.Events.onTouchStartOrClick, function () {
                    $self.$busyDiv[0].style.visibility = 'visible';
                    $self.okBtn.attr('disabled', 'disabled');
                    whereClause = saveSelection();
                    if (whereClause != null) {
                        generateInvoices(whereClause);
                    }
                    $self.$busyDiv[0].style.visibility = "hidden";
                });

            if (this.cancelBtn != null)
                this.cancelBtn.on(VIS.Events.onTouchStartOrClick, function () {
                    $self.$root.dialog('close');
                });

            if (this.btnRefresh != null)
                this.btnRefresh.on(VIS.Events.onTouchStartOrClick, function () {
                    $self.okBtn.removeAttr('disabled');

                    AD_Org_ID = $self.cmbOrg.getControl().find('option:selected').val();
                    C_BPartner_ID = $self.vSearchBPartner.getValue();
                    executeQuery();

                });

            if (this.btnToggel != null)
                this.btnToggel.on(VIS.Events.onTouchStartOrClick, function () {
                    if (toggleside) {
                        // $self.btnRefresh.hide();
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
                        $self.div.css("display", "block");
                        $self.sideDiv.animate({ width: sideDivWidth }, "slow", null, function () {
                            $self.dGrid.resize();
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
                        $self.gridSelectDiv.animate({ width: selectDivFullWidth }, "slow", null, function () {
                            $self.dGrid.resize();
                        });
                    }
                });

            if (this.spnGenerate != null)
                this.spnGenerate.on(VIS.Events.onTouchStartOrClick, function () {
                    $self.btnRefresh.hide();
                    $self.okBtn.hide();
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

                        $self.gridSelectDiv.animate({ width: selectDivWidth }, "fast");
                        $self.sideDiv.animate({ width: sideDivWidth }, "fast");
                        $self.btnSpaceDiv.animate({ width: sideDivWidth }, "fast");

                    }

                    $self.gridSelectDiv.css("display", "none");
                    $self.sideDiv.css("display", "none");
                    $self.gridGenerateDiv.css("display", "block");
                    //$self.btnToggel.attr('disabled', 'disabled');
                    $self.btnToggel.hide();
                    lblSelect.css("font-size", "17px").css("color", "#333333");
                    lblGenrate.css("font-size", "28px").css("color", "#19A0ED");
                });

            if (this.spnSelect != null)
                this.spnSelect.on(VIS.Events.onTouchStartOrClick, function () {
                    if (!toggleside) {
                        $self.btnRefresh.show();
                        $self.okBtn.show();
                        $self.gridGenerateDiv.css("display", "none");
                        $self.gridSelectDiv.css("display", "block");
                        $self.sideDiv.css("display", "block");
                        $self.div.css("display", "block");

                        $self.gridSelectDiv.animate({ width: selectDivWidth }, "fast");

                        //$self.btnToggel.removeAttr('disabled');
                        $self.btnToggel.show();

                        lblSelect.css("font-size", "28px").css("color", "#19A0ED");
                        lblGenrate.css("font-size", "17px").css("color", "#333333");
                    }
                });

            if (this.cmbOrg != null)
                this.cmbOrg.getControl().change(function () {

                    AD_Org_ID = $self.cmbOrg.getControl().find('option:selected').val();
                    executeQuery();
                });

            if (this.vSearchBPartner != null)
                this.vSearchBPartner.addVetoableChangeListener(this);

        }

        this.display = function () {
            dynInit(null);
        }

        //Privilized function
        this.getRoot = function () {
            return this.$root;
        };

        this.disposeComponent = function () {

            if (this.okBtn)
                this.okBtn.off(VIS.Events.onTouchStartOrClick);
            if (this.cancelBtn)
                this.cancelBtn.off(VIS.Events.onTouchStartOrClick);

            $self = null;
            this.frame = null;
            this.windowNo = null;
            this.arrListColumns = null;
            this.dGrid = null;
            whereClause = null;
            AD_Org_ID = null;
            C_BPartner_ID = null;

            toggle = null;
            toggleGen = null;
            toggleside = null;

            this.lblOrg = null;
            this.lblBPartner = null;
            this.lblStatusInfo = null;
            this.tabSelect = null;
            this.tabGenrate = null;
            this.cmbOrg = null;
            this.vSearchBPartner = null;

            this.$root = null;
            this.$busyDiv = null;

            this.topDiv = null;
            this.sideDiv = null;
            this.gridSelectDiv = null;
            this.gridGenerateDiv = null;
            this.bottumDiv = null;
            this.okBtn = null;
            this.cancelBtn = null;
            this.btnRefresh = null;
            this.btnToggel = null;
            this.spnSelect = null;
            this.spnGenerate = null;

            sideDivWidth = null;
            selectDivWidth = null;
            selectDivFullWidth = null;
            selectDivToggelWidth = null;
            sideDivHeight = null;

            this.getRoot = null;
            this.disposeComponent = null;
        };
    };

    //Must Implement with same parameter
    VInvoiceGen.prototype.init = function (windowNo, frame) {
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
        this.cmbOrg.getControl().focus();
    };

    //Must implement dispose
    VInvoiceGen.prototype.dispose = function () {
        /*CleanUp Code */
        //dispose this component
        this.disposeComponent();

        //call frame dispose function
        if (this.frame)
            this.frame.dispose();
        this.frame = null;
    };

    VIS.Apps.AForms.VInvoiceGen = VInvoiceGen;


})(VIS, jQuery);