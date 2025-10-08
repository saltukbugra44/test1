// Clean Scene Manager using Three.js
class SceneManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) throw new Error('Container not found: ' + containerId);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf8f9fa);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 12);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        // lights
        const ambient = new THREE.AmbientLight(0x404040, 1.0); this.scene.add(ambient);
        const dir = new THREE.DirectionalLight(0xffffff, 1.0); dir.position.set(5,10,7); this.scene.add(dir);

        // test cube
        const geo = new THREE.BoxGeometry(1.2,1.2,1.2);
        const mat = new THREE.MeshPhongMaterial({ color:0x4caf50 });
        this.testCube = new THREE.Mesh(geo, mat); this.testCube.position.set(0,1,0); this.scene.add(this.testCube);

        window.addEventListener('resize', () => this.onResize());
        this.clock = new THREE.Clock();
        this.animate();
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const t = this.clock.getElapsedTime();
        if (this.testCube) { this.testCube.rotation.x += 0.01; this.testCube.rotation.y += 0.013; }
        if (this.controls) this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.sceneManager = new SceneManager('3d-container');
        console.log('SceneManager başlatıldı');
    } catch (e) {
        console.error('SceneManager hata:', e);
        const errDiv = document.createElement('div');
        errDiv.style = 'position:fixed;top:20px;left:20px;background:#fff;padding:12px;border-radius:8px;color:#b00020;box-shadow:0 6px 18px rgba(0,0,0,0.12);z-index:9999';
        errDiv.textContent = 'Sahne başlatılamadı: ' + e.message;
        document.body.appendChild(errDiv);
    }
});