/**
 * Created by aghassaei on 1/16/15.
 */

ThreeView = Backbone.View.extend({

    events: {
        "mousemove":                            "_mouseMoved",
        "mouseup":                              "_mouseUp",
        "mousedown":                            "_mouseDown",
        "mouseout":                             "_mouseOut"
    },

    mouseIsDown: false,//store state of mouse click inside this el

    //intersections/object highlighting
    mouseProjection: new THREE.Raycaster(),
    highlighter: null,

    el: "#threeContainer",

    controls: null,

    initialize: function(options){

        this.appState = options.appState;

        _.bindAll(this, "_mouseMoved", "_animate", "_controlsChange");

        //bind events
        this.listenTo(this.appState, "change:deleteMode change:extrudeMode change:shift", this._setControlsEnabled);
        this.listenTo(dmaGlobals.lattice, "change:highlighter", this._saveHighlighter);

        this._saveHighlighter();//need a reference to the highlighter

        this.controls = new THREE.OrbitControls(this.model.camera, this.$el.get(0));
        this.controls.minDistance = 0;
        this.controls.maxDistance = 2500;
        this.controls.addEventListener('change', this._controlsChange);

        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(this.model.camera.position.x, this.model.camera.position.y, this.model.camera.position.z+20);
        this.model.sceneAdd(light);
        this.movingLight = light;

        this.$el.append(this.model.domElement);//render only once

        this.model.render();
        this._animate();
    },

    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////CONTROLS/////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    _animate: function(){
//        requestAnimationFrame(this._animate);
//        this.controls.update();
    },

    _controlsChange: function(){
        this.movingLight.position.set(this.model.camera.position.x, this.model.camera.position.y, this.model.camera.position.z+20);
        this.model.render();
    },

    _setControlsEnabled: function(){
        var state = this.appState.get("deleteMode") || this.appState.get("shift") || this.appState.get("extrudeMode");
        this.controls.noRotate = state;
    },

    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////MOUSE EVENTS/////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    _mouseOut: function(){
        this.highlighter.setNothingHighlighted();
    },

    _mouseUp: function(){
        this.mouseIsDown = false;
        this.highlighter.addRemoveVoxel(!this.appState.get("deleteMode"));
        if (dmaGlobals.lattice.get("numCells") == 0) dmaGlobals.appState.set("deleteMode", false);
    },

    _mouseDown: function(){
        this.mouseIsDown = true;
    },

    _mouseMoved: function(e){

        if (!dmaGlobals.appState.get("highlightMode") && !(dmaGlobals.appState.get("manualSelectOrigin"))) return;

        if (this.mouseIsDown && !this.controls.noRotate) {//in the middle of a camera move
            this.highlighter.setNothingHighlighted();
            return;
        }

        //make projection vector
        var vector = new THREE.Vector2(2*(e.pageX-this.$el.offset().left)/this.$el.width()-1, 1-2*(e.pageY-this.$el.offset().top)/this.$el.height());
        this.mouseProjection.setFromCamera(vector, this.model.camera);

        var objsToIntersect = this.model.cells.concat(this.model.basePlane);
        if (this.highlighter.isVisible()) {
          objsToIntersect = objsToIntersect.concat(this.highlighter.mesh);
        }
        var intersections = this.mouseProjection.intersectObjects(objsToIntersect, false);
        if (intersections.length == 0) {//no intersections
            // TODO: instead of not highlighting, can we look for the nearest intersection?
            this.highlighter.setNothingHighlighted();
            return;
        }

        if(intersections[0].object == this.highlighter.mesh) return;

        this.highlighter.highlight(intersections[0]);

        if (this.mouseIsDown) {
            if (this.appState.get("deleteMode")){
                this.highlighter.addRemoveVoxel(false);
            } else if (this.appState.get("shift")){
                this.highlighter.addRemoveVoxel(true);
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////INTERSECTIONS////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    _saveHighlighter: function(){
        this.highlighter = dmaGlobals.lattice.get("highlighter");
    }

});
