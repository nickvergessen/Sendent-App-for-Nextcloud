class SettingFormHandler {

    constructor() {

    }

    LoopThroughSettings() {
        var that = this;
        var calls = new SettingKeyAjaxCalls();
        var valuecalls = new SettingGroupValueAjaxCalls();

        $.when(valuecalls.list()).done(function (allSettings) {

            $(".section").each(function () {
                var personalsettingboxes = $(this).find(".personal-settings-setting-box");
                personalsettingboxes.each(function (settingboxIndex, settingbox) {

                    var settingkeyvalues = $(this).find(".settingkeyvalue");
                    settingkeyvalues.each(function () {
                        var settingkeyname = $(this).find("#settingkeyname")[0].value;
                        var settingkeykey = $(this).find("#settingkeykey")[0].value;
                        var settingkeytemplateid = $(this).find("#settingkeytemplateid")[0].value;
                        var settinggroupid = $(this).find("#settinggroupid")[0].value;
                        var settingkeykey = $(this).find("#settingkeykey")[0].value;
                        var settingkeyvalue = $(this).find(".settingkeyvalueinput")[0].value;

                        var settingkeyvaluetype = $(this).find(".settingkeyvalueinput")[0].type;
                        if (settingkeyvaluetype == 'select-one') {
                            settingkeyvalue = $(this).find(".settingkeyvalueinput option:selected").val();
                        }
                        var settingkeyvaluethis = this;
                        console.log("settingkeyname = " + settingkeyname);
                        console.log("   settingkeykey = " + settingkeykey);
                        console.log("   settingkeyvalue = " + settingkeyvalue);



                        var setting = $.grep(allSettings, function (element, index) {
                            return (element.settingkeyid.toString() === settingkeykey);
                        });

                        if (setting.length < 1) {
                            that.SaveSetting(settingbox);
                        }
                        //when settingkey is present: populate UI
                        try {
                            $(settingkeyvaluethis).find("#settingkeyid")[0].value = setting[0].settingkeyid;
                            if (settingkeyvaluetype == 'select-one') {
                                $(settingkeyvaluethis).find(".settingkeyvalueinput option[value='" + setting[0].value + "']").prop("selected", true);
                            }
                            else {
                                $(settingkeyvaluethis).find(".settingkeyvalueinput")[0].value = setting[0].value;
                                    try{
                                    var jscolor = new window.jscolor($(settingkeyvaluethis).find(".settingkeyvalueinput.theming-color")[0], {hash: true});
                                    }
                                    catch(errr)
                                    {
                                        
                                    }
                            }
                        }
                        catch (err) {
                            console.warn(settingkeykey);
                            console.warn(settingkeyname);
                            console.warn(setting[0]);
                            console.warn(err.message);
                            //when no settingkey is present
                            $.when(calls.create(settingkeykey, settingkeyname, settingkeyvaluetype, settingkeytemplateid)).done(function (data) {
                                //when no settingkey is present: create settingkey
                                $(settingkeyvaluethis).find("#settingkeyid")[0].value = data.key;
                                $.when(valuecalls.showBySettingKeyId(settingkeykey)).fail(function (failedvalueget) {
                                    //when no settinggroupvalue is present
                                    $.when(valuecalls.create(data.key, settingkeyvalue, settinggroupid)).done(function (data2) {
                                        //when no settinggroupvalue is present: create settinggroupvalue
                                        //TODO: We have to check if settingkeyvaluetype is indicating DOM element is supposed to contain HTML without rendering it.
                                        if (settingkeyvaluetype == 'select-one') {
                                            $(settingkeyvaluethis).find(".settingkeyvalueinput option[value='" + data2.value + "']").prop("selected", true);
                                        }
                                        else {
                                            $(settingkeyvaluethis).find(".settingkeyvalueinput")[0].value = data2.value;
                                        }
                                    });
                                });
                            });
                        }

                    });
                });
            });
        that.setShowHideAllSettings();
        });
    }


    SaveSettingsForm() {
        var that = this;
        $(".section").each(function () {
            var personalsettingboxes = $(this).find(".personal-settings-setting-box");
            personalsettingboxes.each(function (settingboxIndex, settingbox) {
                that.SaveSetting(settingbox);

            });

        });
    }

    SaveSetting(settingbox) {
        var that = this;
        var valuecalls = new SettingGroupValueAjaxCalls();
        var settingkeyvalueblock = $(settingbox).find(".settingkeyvalue")[0];
        var settingkeyname = $(settingkeyvalueblock).find("#settingkeyname")[0].value;
        var settingkeyid = $(settingkeyvalueblock).find("#settingkeyid")[0].value;
        var settingkeykey = $(settingkeyvalueblock).find("#settingkeykey")[0].value;
        var settingkeytemplateid = $(settingkeyvalueblock).find("#settingkeytemplateid")[0].value;
        var settinggroupid = $(settingkeyvalueblock).find("#settinggroupid")[0].value;
        var settingkeyvalue = $(settingkeyvalueblock).find(".settingkeyvalueinput")[0].value;
        var settingkeyvaluetype = $(settingkeyvalueblock).find(".settingkeyvalueinput")[0].type;
        if (settingkeyvaluetype == 'select-one') {
            settingkeyvalue = $(settingkeyvalueblock).find(".settingkeyvalueinput option:selected").val();
        }
        console.log("settingkeyname     = " + settingkeyname);
        console.log("settingkeykey      = " + settingkeykey);
        console.log("settingkeyvalue    = " + settingkeyvalue);

        $.when(valuecalls.showBySettingKeyId(settingkeyid)).fail(function (failedvalueget) {
            //when no settinggroupvalue is present
            $.when(valuecalls.create(settingkeyid, settingkeyvalue, settinggroupid)).done(function (data3) {
                //when no settinggroupvalue is present: create settinggroupvalue
                if (settingkeyvaluetype == 'select-one') {
                    $(settingkeyvalueblock).find(".settingkeyvalueinput option[value='" + data3.value + "']").prop("selected", true);
                    var statusspan = $(settingkeyvalueblock).find("#status-ok")[0];
                    $(statusspan).removeClass("hidden").addClass("shown").delay(1000).queue(function (next) {
                        $(this).addClass("hidden");
                        $(this).removeClass("shown")
                        next();
                    });
                    return true;
                }
                else {
                    $(settingkeyvalueblock).find(".settingkeyvalueinput")[0].value = data3.value;
                    var statusspan = $(settingkeyvalueblock).find("#status-ok")[0];
                    $(statusspan).removeClass("hidden").addClass("shown").delay(1000).queue(function (next) {
                        $(this).addClass("hidden");
                        $(this).removeClass("shown")
                        next();
                    });
                    return true;
                }
            });
        }).done(function (valuedata) {
            $.when(valuecalls.update(settingkeyid, settingkeyid, settingkeyvalue, settinggroupid)).done(function (data3) {
                //when settinggroupvalue is present: update settinggroupvalue
                if (settingkeyvaluetype == 'select-one') {
                    $(settingkeyvalueblock).find(".settingkeyvalueinput option[value='" + data3.value + "']").prop("selected", true);
                    var statusspan = $(settingkeyvalueblock).find("#status-ok")[0];
                    $(statusspan).removeClass("hidden").addClass("shown").delay(1000).queue(function (next) {
                        $(this).addClass("hidden");
                        $(this).removeClass("shown")
                        next();
                    });
                    return true;
                }
                else {
                    $(settingkeyvalueblock).find(".settingkeyvalueinput")[0].value = data3.value;
                    var statusspan = $(settingkeyvalueblock).find("#status-ok")[0];
                    $(statusspan).removeClass("hidden").addClass("shown").delay(1000).queue(function (next) {
                        $(this).addClass("hidden");
                        $(this).removeClass("shown")
                        next();
                    });
                    return true;
                }
            });
        });
    }
    sleep(miliseconds) {
        var currentTime = new Date().getTime();

        while (currentTime + miliseconds >= new Date().getTime()) {
        }
    }
    setShowHideAllSettings() {
        var that = this;
        $(".section").each(function () {
            var personalsettingboxes = $(this).find(".personal-settings-setting-box");
            personalsettingboxes.each(function (settingboxIndex, settingbox) {
                var settingkeyvalues = $(settingbox).find(".settingkeyvalueinput");
                var settingkeyid = $(settingbox).find("#settingkeyname")[0].value;
                settingkeyvalues.each(function (settingkeyvalueIndex, settingkeyvaluebox) {
                    that.showHideAttachmentSize(settingkeyvalues, settingkeyid);
                    that.showHideAdvancedTheming(settingkeyvalues, settingkeyid);
                });
            });
        });
    }
    showHideAttachmentSize(settingkeyvalues, settingkeyid) {
        var settingkeyvalue = settingkeyvalues[0].value;
        if (settingkeyid == "attachmentmode") {
            if (settingkeyvalue == "MaximumAttachmentSize") {
                $(".personal-settings-setting-box#attachmentsize").removeClass("hidden").addClass("shown");
            }
            else {
                $(".personal-settings-setting-box#attachmentsize").addClass("hidden").removeClass("shown");
            }
        }
        else if (settingkeyid == "sendmode") {
            if(settingkeyvalue == "Separate")
            {
              $(".personal-settings-setting-box#htmlsnippetpassword").removeClass("hidden").addClass("shown");
            }
            else{
              $(".personal-settings-setting-box#htmlsnippetpassword").addClass("hidden").removeClass("shown");
            }
          }
    }
    showHideAdvancedTheming(settingkeyvalues, settingkeyid)
{
          var settingkeyvalue = settingkeyvalues[0].value;
          if (settingkeyid == "AdvancedThemingEnabled") {
            if(settingkeyvalue == "true")
            {
              $(".personal-settings-setting-box#GeneralIconColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#DialogFooterIconBackgroundColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#TaskpaneActivityTrackerColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#TaskpaneActivityTrackerFontColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#DialogHeaderColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#DialogHeaderFontColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#ButtonPrimaryIconColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#ButtonSecondaryIconColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#ButtonPrimaryColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#ButtonPrimaryFontColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#ButtonPrimaryHoverColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#ButtonSecondaryColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#ButtonSecondaryHoverColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#ButtonSecondaryFontColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#TaskpaneSecureMailColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#TaskpaneSecureMailFontColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#TaskpaneSecureMailControlColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#SecureMailControlColorHex").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#PopupBackgroundColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#GeneralFontColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#DialogFooterBackgroundColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#DialogFooterFontColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#DialogFooterHoverColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#DialogFooterIconColor").removeClass("hidden").addClass("shown");
              $(".personal-settings-setting-box#VendorName").removeClass("hidden").addClass("shown");
            }
            else{
              $(".personal-settings-setting-box#GeneralIconColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#DialogFooterIconBackgroundColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#TaskpaneActivityTrackerColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#TaskpaneActivityTrackerFontColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#DialogHeaderColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#DialogHeaderFontColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#ButtonPrimaryColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#ButtonPrimaryIconColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#ButtonSecondaryIconColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#ButtonPrimaryFontColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#ButtonPrimaryHoverColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#ButtonSecondaryColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#ButtonSecondaryHoverColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#ButtonSecondaryFontColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#TaskpaneSecureMailColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#TaskpaneSecureMailFontColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#SecureMailControlColorHex").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#PopupBackgroundColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#GeneralFontColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#DialogFooterBackgroundColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#DialogFooterFontColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#DialogFooterHoverColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#DialogFooterIconColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#TaskpaneSecureMailControlColor").addClass("hidden").removeClass("shown");
              $(".personal-settings-setting-box#VendorName").addClass("hidden").removeClass("shown");

            }
          }
        }
    }

$(document).ready(function () {
    var that = this;
    that.settingGroupId = 0;
    that.settingTemplateId = 0;
    that.handler;
    that.handler = new SettingFormHandler();
    that.handler.LoopThroughSettings();
    $('#settingsform').on('submit', function (e) {
        e.preventDefault();
        //I had an issue that the forms were submitted in geometrical progression after the next submit. 
        // This solved the problem.
        e.stopImmediatePropagation();
        //that.handler.SaveSettingsForm();
    });

    // $('#settingTemplateCreateEditForm').on('submit', function (e) {
    //     e.preventDefault();
    //     //I had an issue that the forms were submitted in geometrical progression after the next submit. 
    //     // This solved the problem.
    //     e.stopImmediatePropagation();
    //     if(document.getElementById("templateid").value == '')
    //     {
    //         that.settingTemplateCalls.create(document.getElementById("templatename").value);
    //     }
    //     else
    //     {
    //         that.settingTemplateCalls.update(document.getElementById("templateid").value, document.getElementById("templatename").value);
    //         var modal = document.getElementById("settingTemplateCreateModal");
    //         modal.style.display = "none";
    //         document.getElementById("templateid").value ='';
    //         document.getElementById("templatename").value ='';
    //     }
    // });
    
});