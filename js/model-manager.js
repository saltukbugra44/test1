// Three.js modellerinin yüklenmesi ve yönetimi
class ModelManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container bulunamadı:', containerId);
            return;
        }

        // Three.js bileşenleri
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.loader = null;
        this.mixer = null;
        this.clock = new THREE.Clock();

        // Modeller
        this.models = new Map();
        
        this.init();
    }

    init() {
        // Sahne ayarları
        this.scene.background = new THREE.Color(0xf8f9fa);
        
        // Kamera ayarları
        this.camera.position.set(0, 0, 20);

        // Renderer ayarları
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);

        // Kontroller
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Işıklandırma
        this.setupLights();

        // Model yükleyici
        this.loader = new GLTFLoader();

        // Event listener'lar
        window.addEventListener('resize', () => this.onWindowResize(), false);

        // Basit test geometrisi
        this.addTestGeometry();
    }

    setupLights() {
        // Ortam ışığı
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Ana ışık
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 5, 5);
        this.scene.add(mainLight);

        // Dolgu ışığı
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, -5, -5);
        this.scene.add(fillLight);
    }

    addTestGeometry() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
        this.models.set('test-cube', cube);
    }

    loadModel(modelPath, modelName, position = { x: 0, y: 0, z: 0 }) {
        return new Promise((resolve, reject) => {
            try {
                this.loader.load(
                    modelPath,
                    (gltf) => {
                        const model = gltf.scene;
                        model.position.set(position.x, position.y, position.z);
                        this.scene.add(model);
                        this.models.set(modelName, model);

                        if (gltf.animations.length > 0) {
                            this.mixer = new THREE.AnimationMixer(model);
                            const action = this.mixer.clipAction(gltf.animations[0]);
                            action.play();
                        }

                        resolve(model);
                    },
                    (xhr) => {
                        console.log(`${modelName} yükleniyor: ${(xhr.loaded / xhr.total) * 100}%`);
                    },
                    (error) => {
                        console.error(`${modelName} yüklenirken hata:`, error);
                        reject(error);
                    }
                );
            } catch (error) {
                console.error(`${modelName} yükleme girişiminde hata:`, error);
                reject(error);
            }
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Kontrolleri güncelle
        if (this.controls) {
            this.controls.update();
        }

        // Animasyonları güncelle
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta());
        }

        // Modelleri güncelle
        this.models.forEach((model, name) => {
            if (name === 'atp-synthase') {
                model.rotation.y += 0.01;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }

    async loadAllModels() {
        try {
            await this.loadModel('models/atp-synthase.gltf', 'atp-synthase', { x: -3, y: 0, z: 0 });
            await this.loadModel('models/photosystem-ii.gltf', 'photosystem-ii', { x: 3, y: 0, z: 0 });
            
            // Test küpünü kaldır
            const testCube = this.models.get('test-cube');
            if (testCube) {
                this.scene.remove(testCube);
                this.models.delete('test-cube');
            }
        } catch (error) {
            console.error('Modeller yüklenirken hata:', error);
        }
    }
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const modelManager = new ModelManager('3d-container');
        modelManager.animate();
        await modelManager.loadAllModels();
    } catch (error) {
        console.error('Uygulama başlatılırken hata:', error);
    }
});