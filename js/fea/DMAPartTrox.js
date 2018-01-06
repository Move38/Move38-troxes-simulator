/**
 * Created by aghassaei on 4/9/15.
 */


(function () {

    function assignUVs(geometry) {

        geometry.faceVertexUvs[0] = [];

        geometry.faces.forEach(function(face) {

            var components = ['x', 'y', 'z'].sort(function(a, b) {
                return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
            });

            var v1 = geometry.vertices[face.a];
            var v2 = geometry.vertices[face.b];
            var v3 = geometry.vertices[face.c];

            geometry.faceVertexUvs[0].push([
                new THREE.Vector2(v1[components[0]], v1[components[1]]),
                new THREE.Vector2(v2[components[0]], v2[components[1]]),
                new THREE.Vector2(v3[components[0]], v3[components[1]])
            ]);

        });

        geometry.uvsNeedUpdate = true;
    }

    var tetraTrox;

    var getSkin = function(paperType) {
      var skin = THREE.ImageUtils.loadTexture('assets/textures/' + paperType + '.png'); // color is imported
  	  skin.wrapS = skin.wrapT = THREE.RepeatWrapping;
      skin.repeat.set(4,4);
      return skin;
    }

    var texture = THREE.ImageUtils.loadTexture( "assets/textures/paperSpecMap2.jpg" );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5,5);

    var getPaperMaterial = function(paperType) {
      var paperMaterial = new THREE.MeshPhongMaterial({
          map: getSkin(paperType),
          bumpMap:texture,
          color: new THREE.Color("#999999"),  // tint the color of the png loaded for material
          bumpScale:0.4,
          shininess:10,
          fog: false,
          shading:THREE.SmoothShading
      });
      return paperMaterial;
    }

    //import part geometry
    var loader = new THREE.STLLoader();
    loader.load("assets/stls/parts/troxTetra.stl", function(geometry){

        tetraTrox = new THREE.Geometry().fromBufferGeometry(geometry);
        tetraTrox.computeBoundingBox();
        var unitScale = 1/3.75;
        tetraTrox.applyMatrix(new THREE.Matrix4().makeScale(unitScale, unitScale, unitScale));
        tetraTrox.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI));
        assignUVs(tetraTrox);
        tetraTrox.computeFaceNormals();
    });

    function DMATetraTroxPart(type, parent, paperType){
        DMAPart.call(this, type, parent);
        this.paperType = paperType;
    }
    DMATetraTroxPart.prototype = Object.create(DMAPart.prototype);

    DMATetraTroxPart.prototype._makeMeshForType = function(){
        var mesh = new THREE.Mesh(tetraTrox, getPaperMaterial('bluePaper'));//TODO:set this in all the right places this.paperType));
        mesh.myPart = this;//need a ref back to this part
        return mesh;
    };

    self.DMATetraTroxPart = DMATetraTroxPart;

    var octaTrox;

    //import part geometry
    loader.load("assets/stls/parts/troxOcta.stl", function(geometry){

        octaTrox = geometry;
        octaTrox.computeBoundingBox();
        var unitScale = 1/3.25;
        octaTrox.applyMatrix(new THREE.Matrix4().makeScale(unitScale, unitScale, unitScale));
        octaTrox = new THREE.Geometry().fromBufferGeometry(octaTrox);
        assignUVs(octaTrox);
        octaTrox.computeFaceNormals();
    });

    function DMAOctaTroxPart(type, parent){
        DMAPart.call(this, type, parent);
    }
    DMAOctaTroxPart.prototype = Object.create(DMAPart.prototype);

    DMAOctaTroxPart.prototype._makeMeshForType = function(){
        var mesh = new THREE.Mesh(octaTrox, getPaperMaterial('bluePaper'));//TODO:set this in all the right places this.paperType));
        mesh.myPart = this;//need a ref back to this part
        return mesh;
    };

    self.DMAOctaTroxPart = DMAOctaTroxPart;

})();
