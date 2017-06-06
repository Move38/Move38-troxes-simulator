/**
 * Created by aghassaei on 4/9/15.
 */


TroxUI = Backbone.View.extend({

    el: "#navRibbon",

    events: {
        "click .troxCellButton":                                       "_selectCellType",
        "click #troxDeleteButton":                                     "_updateDeleteMode",
        "click .aboutTrox":                                            "_showAboutModal",
        "click #troxReset":                                            "_showResetModal",
        "click #troxColorRed":                                         "_colorRed",
        "click #troxColorBlue":                                        "_colorBlue",
        "click #troxColorOrange":                                      "_colorOrange",
        "click #troxColorBlack":                                       "_colorBlack",
        "click #troxColorWhite":                                       "_colorWhite",
    },

    initialize: function(){

//        _.bindAll(this, "render");

        this.listenTo(this.model, "change:deleteMode", this.render);
        this.listenTo(dmaGlobals.lattice, "change:freeformCellType", function(){
            var self = this;
            $(".troxHighlight").hide();
            $(".troxNoHighlight").show();
            var button  = $(".trox" + dmaGlobals.lattice.get("freeformCellType"));
            button.filter(".troxHighlight").show();
            button.filter(".troxNoHighlight").hide();
            button.css({"margin-top": "0"});
            button.animate({"margin-bottom":"20px"}, 100, function(){
                button.animate({"margin-bottom":"0"}, 300, function(){
                    button.css({"margin-top": "20"});
                    self.render();
                });
            });
        });
        this.render();
    },

    _selectCellType: function(e){
        e.preventDefault();
        var $target = $(e.target);
        if (!$(e.target).hasClass("troxCellButton")) $target = $($target.parent());
        var newType = $target.data("type");
        if (newType == "icosa") return;
        dmaGlobals.lattice.set("freeformCellType", newType);
        dmaGlobals.appState.set("deleteMode", false); // don't delete after we have selected a cell type
    },

    _updateDeleteMode: function(e){
        e.preventDefault();
        dmaGlobals.appState.set("deleteMode", !dmaGlobals.appState.get("deleteMode"));
        // deselect Tetra, Octa, and icosa
        $(".troxHighlight").hide();
        $(".troxNoHighlight").show();
    },

    _showAboutModal: function(e){
        e.preventDefault();
        // link to Kickstarter
        window.location.href = "https://www.kickstarter.com/projects/1059262388/troxes-origami-building-blocks?ref=772yzt";
        // $("#aboutTroxModal").modal('show').css({
        //     'margin-top': function () {
        //         return -500;//if these change, don't forget to change TroxHeader
        //     },
        //     'margin-left': function () {
        //         return -600;
        //     }
        // });
    },

    _showResetModal: function(e){
        e.preventDefault();
        $("#resetTroxModal").modal('show').css({
            'margin-top': function () {
                return -200;//if these change, don't forget to change TroxUI
            },
            'margin-left': function () {
                return -300;
            }
        });
    },

    render: function(){
        this.$el.html(this.template());
        var cellType = dmaGlobals.lattice.get("freeformCellType");
        var highlighted = this.$el.find("[data-type='" + cellType + "']");
        highlighted.children(".troxHighlight").show();
        highlighted.children(".troxNoHighlight").hide();
        if (this.model.get("deleteMode")){
            var deleteButton = $("#troxDeleteButton");
            deleteButton.children(".troxDeleteHighlight").show();
            deleteButton.children(".troxDeleteNoHighlight").hide();
        }
    },

    template: _.template('\
        <div class="btn-toolbar">\
              <a data-type="tetra" class="troxCellButton" href="#">\
                <img class="troxHighlight troxtetra" src="assets/imgs/trox_highlighted_07.png">\
                <img class="troxNoHighlight troxtetra" src="assets/imgs/trox_assets_07.png">\
                <br/><span>Tetra</span>\
                </a>\
              <a data-type="octa" class="troxCellButton" href="#">\
                <img class="troxHighlight troxocta" src="assets/imgs/trox_highlighted_09.png">\
                <img class="troxNoHighlight troxocta" src="assets/imgs/trox_assets_09.png">\
                <br/><span>Octa</span>\
              </a>\
              <a data-type="icosa" class="troxCellButton" href="#">\
                <img class="troxHighlight troxicosa" src="assets/imgs/trox_highlighted_11.png">\
                <img class="troxNoHighlight troxicosa" src="assets/imgs/trox_assets_11.png">\
                <br/><span>Icosa</span>\
                </a>\
              <a id="troxDeleteButton" href="#">\
                <img class="troxDeleteHighlight" src="assets/imgs/trox_highlighted_13.png">\
                <img class="troxDeleteNoHighlight" src="assets/imgs/trox_assets_13.png">\
                <br/><span>Erase</span>\
                </a>\
        </div>\
        <div id="troxColors">\
          <a data-type="red" class="troxColorButton" href="#">red</a>\
          <a data-type="orange" class="troxColorButton" href="#">orange</a>\
          <a data-type="blue" class="troxColorButton" href="#">blue</a>\
          <a data-type="white" class="troxColorButton" href="#">white</a>\
          <a data-type="black" class="troxColorButton" href="#">black</a>\
        </div>\
        \
        <div id="troxFooter">\
            <a class="aboutTrox pull-left" href="#"><img class="troxLogo" src="assets/imgs/trox_assets_15.png"></a>\
            <a id="troxReset" href="#">Reset</a>\
        </div>\
        ')

});
