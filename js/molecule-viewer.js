// Babylon.js ile 3D Molekül Görüntüleyici
class MoleculeViewer {
    constructor() {
        // Canvas elementi bul veya oluştur
        this.canvas = document.getElementById('renderCanvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'renderCanvas';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.touchAction = 'none';
            
            const container = document.getElementById('3d-container');
            if (container) {
                container.appendChild(this.canvas);
            } else {
                document.body.appendChild(this.canvas);
            }
        }

        // Wait for BABYLON to be available (CDN or local fallback)
        this.waitForBabylon(3000).then(() => {
            this.initScene();
        }).catch((err) => {
            console.error('BABYLON beklenirken hata:', err);
            this.showErrorMessage('3D kütüphaneleri yüklenemedi. Lütfen internet bağlantınızı kontrol edin veya sayfayı bir HTTP sunucusunda çalıştırın.');
        });
    }

    // Wait up to timeoutMs for BABYLON to be defined
    waitForBabylon(timeoutMs = 3000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                if (typeof BABYLON !== 'undefined') return resolve();
                if (Date.now() - start > timeoutMs) return reject(new Error('BABYLON not available'));
                setTimeout(check, 100);
            };
            check();
        });
    }

    async initScene() {
        try {
            // Engine oluştur
            this.engine = new BABYLON.Engine(this.canvas, true);

            // Yeni sahne oluştur
            this.scene = new BABYLON.Scene(this.engine);
            this.scene.clearColor = new BABYLON.Color4(0.95, 0.95, 0.95, 1);

            // Kamera oluştur
            // Use Vector3.Zero if available, otherwise fallback to {x:0,y:0,z:0}
            const zeroVec = (BABYLON.Vector3 && typeof BABYLON.Vector3.Zero === 'function') ? BABYLON.Vector3.Zero() : (BABYLON.Vector3 ? BABYLON.Vector3(0,0,0) : {x:0,y:0,z:0});
            this.camera = new BABYLON.ArcRotateCamera(
                "camera",
                0, Math.PI / 3,
                10,
                zeroVec,
                this.scene
            );
            this.camera.attachControl(this.canvas, true);
            this.camera.wheelPrecision = 50;
            this.camera.pinchPrecision = 50;
            this.camera.lowerRadiusLimit = 5;
            this.camera.upperRadiusLimit = 20;

            // Işıklandırma ekle
            this.setupLights();

            // Test modeli ekle
            this.addTestMolecule();

            // Render döngüsünü başlat
            this.engine.runRenderLoop(() => {
                try { this.scene.render(); } catch(e) { /* swallow render errors in fallback */ }
            });

            // Pencere yeniden boyutlandırma
            window.addEventListener('resize', () => {
                this.engine.resize();
            });

        } catch (error) {
            console.error('Sahne başlatma hatası:', error);
            this.showErrorMessage(error.message);
        }
    }

    setupLights() {
        // Hemisferik ışık
        const hemiLight = new BABYLON.HemisphericLight(
            "hemiLight",
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        hemiLight.intensity = 0.7;

        // Nokta ışık
        const pointLight = new BABYLON.PointLight(
            "pointLight",
            new BABYLON.Vector3(5, 5, -5),
            this.scene
        );
        pointLight.intensity = 0.5;
    }

    addTestMolecule() {
        // ATP molekülü temel yapısı
        
        // Merkez küre (Fosfat grubu)
        const phosphate = BABYLON.MeshBuilder.CreateSphere("phosphate", {
            diameter: 1,
            segments: 16
        }, this.scene);
        phosphate.material = new BABYLON.StandardMaterial("phosphateMat", this.scene);
        phosphate.material.diffuseColor = new BABYLON.Color3(1, 0.2, 0.2);
        phosphate.material.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        phosphate.material.emissiveColor = new BABYLON.Color3(0.1, 0, 0);

        // Bağlantı silindiri
        const bond = BABYLON.MeshBuilder.CreateCylinder("bond", {
            height: 2,
            diameter: 0.2
        }, this.scene);
        bond.position.y = 1;
        bond.material = new BABYLON.StandardMaterial("bondMat", this.scene);
        bond.material.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);

        // Üst molekül grubu (Adenin)
        const adenine = BABYLON.MeshBuilder.CreateBox("adenine", {
            height: 1,
            width: 1.5,
            depth: 0.5
        }, this.scene);
        adenine.position.y = 2;
        adenine.material = new BABYLON.StandardMaterial("adenineMat", this.scene);
        adenine.material.diffuseColor = new BABYLON.Color3(0.2, 0.5, 1);

        // Animasyon ekle
        this.scene.registerBeforeRender(() => {
            phosphate.rotation.y += 0.01;
            bond.rotation.y += 0.01;
            adenine.rotation.y += 0.01;
        });
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            text-align: center;
            font-family: Arial, sans-serif;
            z-index: 1000;
        `;
        errorDiv.innerHTML = `
            <h2 style="color: #ff4444; margin-bottom: 10px;">3D Görüntüleyici Yüklenemedi</h2>
            <p style="color: #666; margin-bottom: 20px;">${message}</p>
            <button onclick="location.reload()" style="
                padding: 10px 20px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">Sayfayı Yenile</button>
        `;
        document.body.appendChild(errorDiv);
    }
}

// Sayfa yüklendiğinde başlat
window.addEventListener('DOMContentLoaded', () => {
    try {
        window.moleculeViewer = new MoleculeViewer();
    } catch (error) {
        console.error('Molecule Viewer başlatma hatası:', error);
    }
});