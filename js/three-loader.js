// Three.js Model Loader and Scene Setup

let scene, camera, renderer, controls;
let mixer, clock;
const animations = new Map();
const models = new Map();

// Initialize Three.js scene
function initThreeJS(containerId) {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Add renderer to container
    const container = document.getElementById(containerId);
    container.appendChild(renderer.domElement);

    // Add controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Initialize animation clock
    clock = new THREE.Clock();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

// Load GLTF model
async function loadModel(modelPath, modelName, position = { x: 0, y: 0, z: 0 }, scale = 1) {
    try {
        const loader = new THREE.GLTFLoader();
        const result = await loader.loadAsync(modelPath);
        
        const model = result.scene;
        model.position.set(position.x, position.y, position.z);
        model.scale.set(scale, scale, scale);
        
        // Store model reference
        models.set(modelName, model);
        
        // Handle animations if present
        if (result.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            result.animations.forEach(clip => {
                const action = mixer.clipAction(clip);
                animations.set(clip.name, action);
            });
        }
        
        scene.add(model);
        return model;
    } catch (error) {
        console.error(`Error loading model ${modelName}:`, error);
        throw error;
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    
    controls.update();
    renderer.render(scene, camera);
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Play animation by name
function playAnimation(name, loop = THREE.LoopRepeat) {
    const action = animations.get(name);
    if (action) {
        action.setLoop(loop);
        action.play();
    }
}

// Stop animation by name
function stopAnimation(name) {
    const action = animations.get(name);
    if (action) {
        action.stop();
    }
}

// Get model by name
function getModel(name) {
    return models.get(name);
}

// Update model position
function updateModelPosition(name, position) {
    const model = models.get(name);
    if (model) {
        model.position.set(position.x, position.y, position.z);
    }
}

// Update model rotation
function updateModelRotation(name, rotation) {
    const model = models.get(name);
    if (model) {
        model.rotation.set(rotation.x, rotation.y, rotation.z);
    }
}

// Update model scale
function updateModelScale(name, scale) {
    const model = models.get(name);
    if (model) {
        if (typeof scale === 'number') {
            model.scale.set(scale, scale, scale);
        } else {
            model.scale.set(scale.x, scale.y, scale.z);
        }
    }
}

// Export functions
export {
    initThreeJS,
    loadModel,
    animate,
    playAnimation,
    stopAnimation,
    getModel,
    updateModelPosition,
    updateModelRotation,
    updateModelScale
};