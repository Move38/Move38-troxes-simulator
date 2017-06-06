/**
 * Created by aghassaei on 4/9/15.
 */

TroxHeader = Backbone.View.extend({

    el: "body",

    events: {
        "click #troxMainLogo":                                            "_showAboutModal",
        "click #moreInfoTrox":                                            "_showAboutModal",
        "click #clearTroxCells":                                          "_clearCells"
    },

    initialize: function(){

    },

    _showAboutModal: function(e){
        e.preventDefault();
        $("#aboutTroxModal").modal('show').css({
            'margin-top': function () {
                return -500;//if these change, don't forget to change TroxUI
            },
            'margin-left': function () {
                return -600;
            }
        });
    },

    _clearCells: function(e){
        e.preventDefault();
        dmaGlobals.lattice.clearCells();
        $("#resetTroxModal").modal("hide");
    }

});