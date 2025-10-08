import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let scene, camera, renderer, controls;
let atpSynthase, photosystemII;
let mixer;
const clock = new THREE.Clock();

function init() {
    // Scene oluştur
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);

    // Camera oluştur
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);

    // Renderer oluştur
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Container'a ekle
    const container = document.getElementById('3d-container');
    container.appendChild(renderer.domElement);

    // Kontrolleri ekle
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Işıkları ekle
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Modelleri yükle
    loadModels();

    // Pencere yeniden boyutlandırma
    window.addEventListener('resize', onWindowResize, false);
}

function loadModels() {
    const loader = new GLTFLoader();

    // ATP Synthase modelini yükle
    loader.load(
        'models/atp-synthase.gltf',
        function (gltf) {
            atpSynthase = gltf.scene;
            scene.add(atpSynthase);
            
            // Animasyonu ayarla
            mixer = new THREE.AnimationMixer(atpSynthase);
            const clips = gltf.animations;
            if (clips && clips.length) {
                const clip = clips[0];
                const action = mixer.clipAction(clip);
                action.play();
            }

            // Pozisyonu ayarla
            atpSynthase.position.set(-3, 0, 0);
        },
        undefined,
        function (error) {
            console.error('ATP Synthase yüklenirken hata:', error);
        }
    );

    // Photosystem II modelini yükle
    loader.load(
        'models/photosystem-ii.gltf',
        function (gltf) {
            photosystemII = gltf.scene;
            scene.add(photosystemII);
            
            // Pozisyonu ayarla
            photosystemII.position.set(3, 0, 0);
        },
        undefined,
        function (error) {
            console.error('Photosystem II yüklenirken hata:', error);
        }
    );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Kontrolleri güncelle
    controls.update();

    // Animasyonları güncelle
    if (mixer) {
        mixer.update(clock.getDelta());
    }

    // ATP Synthase rotasyonu
    if (atpSynthase) {
        atpSynthase.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

// Başlat
document.addEventListener('DOMContentLoaded', () => {
    init();
    animate();
});