// Minimal Babylon.js shim to allow the viewer to initialize when CDN fails.
// This shim implements only the tiny subset of BABYLON used by the project:
// - BABYLON.Engine, BABYLON.Scene, BABYLON.Color4, BABYLON.Vector3, BABYLON.ArcRotateCamera,
// - BABYLON.HemisphericLight, BABYLON.PointLight, BABYLON.MeshBuilder, BABYLON.StandardMaterial
// The shim provides simple placeholders so the viewer can show a 2D fallback if full Babylon isn't available.

(function(window){
    if (window.BABYLON) return; // don't overwrite a real library

    const BABYLON = {};

    // Simple vector placeholder
    BABYLON.Vector3 = function(x, y, z){ return { x: x||0, y: y||0, z: z||0 }; };
    BABYLON.Color3 = function(r,g,b){ return { r:r||0,g:g||0,b:b||0 }; };
    BABYLON.Color4 = function(r,g,b,a){ return { r:r||0,g:g||0,b:b||0,a:a||1 }; };

    // Engine placeholder: create a simple 2D canvas fallback renderer
    BABYLON.Engine = function(canvas, antialias){
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isFallback = true;
        this._onResize = [];
    };
    BABYLON.Engine.prototype.runRenderLoop = function(cb){
        var self = this;
        function loop(){
            try{ cb(); } catch(e){}
            requestAnimationFrame(loop);
        }
        loop();
    };
    BABYLON.Engine.prototype.resize = function(){
        // noop
    };

    // Scene placeholder
    BABYLON.Scene = function(engine){
        this.engine = engine;
        this.clearColor = new BABYLON.Color4(1,1,1,1);
        this._beforeRender = [];
    };
    BABYLON.Scene.prototype.registerBeforeRender = function(fn){ this._beforeRender.push(fn); };
    BABYLON.Scene.prototype.render = function(){
        // Clear canvas
        const ctx = this.engine.ctx;
        const canvas = this.engine.canvas;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#f5f7f7';
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // Simple placeholder drawing
        ctx.fillStyle = '#b71c1c';
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, Math.min(canvas.width, canvas.height)/8, 0, Math.PI*2);
        ctx.fill();

        // call beforeRender hooks
        for(var i=0;i<this._beforeRender.length;i++){
            try{ this._beforeRender[i](); }catch(e){}
        }
    };

    // Camera placeholder
    BABYLON.ArcRotateCamera = function(name, alpha, beta, radius, target, scene){
        this.name = name; this.alpha=alpha; this.beta=beta; this.radius=radius; this.target=target; this.scene=scene;
    };
    BABYLON.ArcRotateCamera.prototype.attachControl = function(canvas, allow){ /* noop */ };

    // Light placeholders
    BABYLON.HemisphericLight = function(name, dir, scene){ this.name=name; this.direction=dir; this.scene=scene; this.intensity=1; };
    BABYLON.PointLight = function(name, pos, scene){ this.name=name; this.position=pos; this.scene=scene; this.intensity=1; };

    // MeshBuilder placeholder
    BABYLON.MeshBuilder = {
        CreateSphere: function(name, opts, scene){
            // return a simple object with position/rotation
            return { name:name, position:{x:0,y:0,z:0}, rotation:{x:0,y:0,z:0}, _type:'sphere' };
        },
        CreateCylinder: function(name, opts, scene){ return { name:name, position:{x:0,y:0,z:0}, rotation:{x:0,y:0,z:0}, _type:'cylinder' }; },
        CreateBox: function(name, opts, scene){ return { name:name, position:{x:0,y:0,z:0}, rotation:{x:0,y:0,z:0}, _type:'box' }; }
    };

    BABYLON.StandardMaterial = function(name, scene){
        this.name=name; this.scene=scene; this.diffuseColor={r:1,g:1,b:1}; this.specularColor={r:1,g:1,b:1};
    };

    // Expose
    window.BABYLON = BABYLON;
})(window);

//# sourceMappingURL=babylon-shim.js
