// Three.js sahne kurulumu
let scene, camera, renderer, controls;
let molekuller;
let clock;

function init() {
    // Scene oluştur
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);

    // Camera oluştur
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 20);

    // Renderer oluştur
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Renderer'ı sayfaya ekle
    const container = document.getElementById('3d-container');
    container.appendChild(renderer.domElement);

    // Kontroller ekle
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.8;

    // Işıklandırma ekle
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, -5, -5);
    scene.add(fillLight);

    // Spot ışıkları ekle
    const spotLight1 = new THREE.SpotLight(0xffffff, 0.8);
    spotLight1.position.set(10, 10, 10);
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xffffff, 0.8);
    spotLight2.position.set(-10, 10, -10);
    scene.add(spotLight2);

    // Modelleri yükle
    molekuller = new MolekulModelleri(scene);
    molekuller.yerlesirModeller();

    // Saat başlat
    clock = new THREE.Clock();

    // Pencere yeniden boyutlandırma olayını dinle
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    const time = clock.getElapsedTime();
    
    // ATP Sentaz rotasyonu
    molekuller.animateATPSentaz();
    
    // Diğer molekül animasyonları
    molekuller.animateMolekuller(time);
    
    controls.update();
    renderer.render(scene, camera);
}

// Sayfanın yüklenmesi tamamlandığında başlat
document.addEventListener('DOMContentLoaded', () => {
    init();
    animate();
});