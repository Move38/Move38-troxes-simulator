/**
 * Created by aghassaei on 1/14/15.
 */


var partMaterial = new THREE.MeshLambertMaterial({ color:0xffffff, shading: THREE.FlatShading });
    partMaterial.color.setRGB( 0.9619657144369509, 0.6625466032079207, 0.20799727886007258 );

//var partMaterial = new THREE.MeshNormalMaterial();

//a part, element with a single material, handled by assembler

    function DMAPart(type, parent) {
        this.parentCell = parent;//use this reference to get position and scale
        this.type = type;
    }

    DMAPart.prototype._draw = function(){
        if (this.mesh) console.warn("part mesh already in scene");
        this.mesh = this._makeMeshForType(this.type);
        var rotation = this.parentCell.getEulerRotation();
        this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
        this.updateForScale(this.parentCell.getScale(), this.parentCell.getPosition());
        dmaGlobals.three.sceneAdd(this.mesh, "part");
    };

    DMAPart.prototype.updateForScale = function(scale, position){
        if (this.mesh) {
            this.mesh.scale.set(scale, scale, scale);
            this._setMeshPosition(position);
        }
    };

    DMAPart.prototype._setMeshPosition = function(position){
        var mesh = this.mesh;
        mesh.position.x = position.x;
        mesh.position.y = position.y;
        mesh.position.z = position.z;
    };

    DMAPart.prototype.moveTo = function(position, axis){//used for stock simulation
        this.mesh.position[axis] = position;
    };

    DMAPart.prototype.setVisibility = function(visibility){
        if (visibility) this._show();
        else this._hide();
    };

    DMAPart.prototype._show = function(){
        if (!this.mesh) this._draw();
        this.mesh.visible = true;
    };

    DMAPart.prototype._hide = function(){
        if (this.mesh) this.mesh.visible = false;
    };

    DMAPart.prototype.highlight = function(){
//        this.mesh.material.color.setRGB(1,0,0);
    };

    DMAPart.prototype.unhighlight = function(){
//        if (this.mesh) this.mesh.material.color.setRGB(0.9619657144369509, 0.6625466032079207, 0.20799727886007258);
    };

    DMAPart.prototype.removeFromCell = function(){//send message back to parent cell to destroy this
        if (this.parentCell) {
            this.parentCell.removePart(this.type);
            dmaGlobals.three.render();
        } else console.warn("part has no parent cell");
    };

    DMAPart.prototype.destroy = function(){
        if (this.mesh) {
            dmaGlobals.three.sceneRemove(this.mesh, "part");
            this.mesh.myPart = null;
//            this.mesh.dispose();
//            geometry.dispose();
//            material.dispose();
            this.mesh = null;
        }
        this.parentCell = null;
        this.type = null;
    };

    DMAPart.prototype.toJSON = function(){
        return {
        }
    };
