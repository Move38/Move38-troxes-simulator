/**
 * Created by aghassaei on 1/17/15.
 */


function ThreeModel(){

    var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 10000);
    var scene = new THREE.Scene();
    var sceneDepth = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({antialias:true});//antialiasing is not supported in ff and on mac+chrome

    //store all meshes to highlight
    var cells = [];
    var parts = [];
    var depthParts = [];//used for rendering ambient occlusion
    var basePlane = [];

    var animationLoopRunning = false;
    var stopAnimationFlag = false;

    //ambient occlusion
    var depthMaterial, effectComposer, depthRenderTarget;
    var ssaoPass;

    initialize();

    function initialize(){

        camera.position.x = 0;
        camera.position.y = 230;
        camera.position.z = 75;
        camera.up.set(0,0,1);//set z axis as "up"

        scene.fog = new THREE.FogExp2(0xffffff, 0.0004);

//        lights
        var color = 0x000000;
        var light = new THREE.DirectionalLight(color);
        light.position.set(0, 300, 0);
        scene.add(light);
        var light = new THREE.DirectionalLight(color);
        light.position.set(260, -150, 0);
        scene.add(light);
        var light = new THREE.DirectionalLight(color);
        light.position.set(-260, -150, 0);
        scene.add(light);
        var light = new THREE.DirectionalLight(color);
        light.position.set(0, 0, 300);
        scene.add(light);
        var light = new THREE.DirectionalLight(color);
        light.position.set(0, 0, -300);
        scene.add(light);
        light = new THREE.DirectionalLight(0xaaaaaa);
        light.position.set(-1, -1, -1);
        scene.add(light);
        var light = new THREE.AmbientLight(0xffffff);
        scene.add(light);

        // renderer
        renderer.setClearColor(scene.fog.color, 1);
        renderer.setSize(window.innerWidth, window.innerHeight);

        var renderPass = new THREE.RenderPass( scene, camera );

        // Setup depth pass
        depthMaterial = new THREE.MeshDepthMaterial();
        depthMaterial.depthPacking = THREE.RGBADepthPacking;
        depthMaterial.blending = THREE.NoBlending;

        var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
        depthRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );

        // Setup SSAO pass
        ssaoPass = new THREE.ShaderPass( THREE.SSAOShader );
        ssaoPass.renderToScreen = true;
        //ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
        ssaoPass.uniforms[ "tDepth" ].value = depthRenderTarget.texture;
        ssaoPass.uniforms[ 'size' ].value.set( window.innerWidth, window.innerHeight );
        ssaoPass.uniforms[ 'cameraNear' ].value = camera.near;
        ssaoPass.uniforms[ 'cameraFar' ].value = camera.far;
        ssaoPass.uniforms[ 'aoClamp' ].value = 0.3;
        ssaoPass.uniforms[ 'lumInfluence' ].value = 0.5;
        // Add pass to effect composer
        effectComposer = new THREE.EffectComposer( renderer );
        effectComposer.addPass( renderPass );
        effectComposer.addPass( ssaoPass );

        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize(){
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

    function sceneAdd(object, type){
        scene.add(object);

        if (type == "cell"){
            cells.push(object.children[0]);
        } else if (type == "part"){
            parts.push(object);
            var copy = object.clone();
            depthParts.push(copy);
            sceneDepth.add(copy);
        } else if (type == "basePlane"){
            basePlane.push(object);
        }
    }

    function sceneRemove(object, type){

        var objectToRemove = getParentObject(object);

        if (type == "cell"){
            cells.splice(cells.indexOf(objectToRemove.children[0]), 1);
        } else if (type == "part"){
            var index = parts.indexOf(objectToRemove);
            parts.splice(index, 1);
            var copy = depthParts[index];
            sceneDepth.remove(copy);
            depthParts.splice(index, 1);
        } else if (type == "basePlane"){
            basePlane.splice(0, basePlane.length);//delete array without removing reference
        }
        scene.remove(objectToRemove);
    }

    function removeAllCells(){
        _.each(cells, function(cell){
            var objectToRemove = getParentObject(cell);
            scene.remove(objectToRemove);
        });
        _.each(parts, function(part){
            scene.remove(part);
        });
        _.each(depthParts, function(part){
            sceneDepth.remove(part);
        });
        cells.splice(0, cells.length);
        parts.splice(0, parts.length);
    }

    function getParentObject(object){
        var objectToRemove = object;
        if (object.parent && object.parent.type != "Scene") {
            objectToRemove = object.parent;
        }
        return objectToRemove;
    }

    function startAnimationLoop(){
        if (animationLoopRunning) return;
        stopAnimationFlag = false;
        animationLoopRunning = true;
        console.log("animation started");
        _loop();
    }

    function stopAnimationLoop(){
        if (!animationLoopRunning) return;
        stopAnimationFlag = true;
    }

    function _loop(){
        _render();
        if (stopAnimationFlag) {
            animationLoopRunning = false;
            console.log("animation stopped");
            return;
        }
        requestAnimationFrame(_loop);
    }

    function render(){
        if (animationLoopRunning) return;
        _render();
    }

    function _render(){
        // Render depth into depthRenderTarget
        sceneDepth.overrideMaterial = depthMaterial;
        renderer.render(sceneDepth, camera, depthRenderTarget, true);
        // Render renderPass and SSAO shaderPass
        // sceneDepth.overrideMaterial = null;
        effectComposer.render();

        //do this instead for no ambient occlusion
        // renderer.render(scene, camera);
    }

    return {//return public properties/methods
        render: render,
        startAnimationLoop: startAnimationLoop,
        stopAnimationLoop: stopAnimationLoop,
        sceneRemove: sceneRemove,
        sceneAdd: sceneAdd,
        domElement: renderer.domElement,
        camera: camera,
        cells: cells,
        parts: parts,
        basePlane: basePlane,
        removeAllCells: removeAllCells
    }
}
