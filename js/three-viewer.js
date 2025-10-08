// Three.js non-module viewer (uses global THREE, OrbitControls, GLTFLoader)
(function(){
    function showOverlay(title, message, extraHtml) {
        const existing = document.getElementById('three-overlay');
        if (existing) existing.remove();
        const overlay = document.createElement('div');
        overlay.id = 'three-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.25);z-index:9999;font-family:Arial,Helvetica,sans-serif;';
        overlay.innerHTML = `
            <div style="background:#fff;padding:22px;border-radius:12px;max-width:820px;width:90%;text-align:left;box-shadow:0 12px 40px rgba(0,0,0,0.15);">
                <h2 style="margin:0 0 8px;color:#d32f2f;">${title}</h2>
                <p style="margin:0 0 12px;color:#333;">${message}</p>
                ${extraHtml || ''}
                <div style="margin-top:14px;text-align:left;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
                    <button id="overlay-copy" style="padding:8px 12px;border-radius:8px;border:none;background:#1976d2;color:#fff;cursor:pointer;">Kopyala</button>
                    <button id="overlay-open-readme" style="padding:8px 12px;border-radius:8px;border:none;background:#455a64;color:#fff;cursor:pointer;">README'i Aç</button>
                    <div style="flex:1"></div>
                    <button id="overlay-reload" style="padding:8px 14px;margin-right:8px;border-radius:8px;border:none;background:#4caf50;color:#fff;cursor:pointer;">Yeniden Yükle</button>
                    <button id="overlay-close" style="padding:8px 14px;border-radius:8px;border:none;background:#e0e0e0;color:#333;cursor:pointer;">Kapat</button>
                </div>
            </div>`;
        document.documentElement.appendChild(overlay);
        document.getElementById('overlay-reload').addEventListener('click', () => location.reload());
        document.getElementById('overlay-close').addEventListener('click', () => overlay.remove());
        const copyBtn = document.getElementById('overlay-copy');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                // find pre inside overlay and copy its text
                const pre = overlay.querySelector('pre');
                const text = pre ? pre.innerText : '';
                if (!text) return;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => {
                        copyBtn.textContent = 'Kopyalandı ✓';
                        setTimeout(() => copyBtn.textContent = 'Kopyala', 2000);
                    }).catch(() => alert('Kopyalama başarısız. Lütfen elle seçip kopyalayın.'));
                } else {
                    alert('Tarayıcı kopyalama API desteği yok; lütfen elle seçip kopyalayın.');
                }
            });
        }
        const readmeBtn = document.getElementById('overlay-open-readme');
        if (readmeBtn) readmeBtn.addEventListener('click', () => { window.open('README_RUN.md','_blank'); });
    }

    function isFileProtocol() { return location.protocol === 'file:'; }

    function init() {
        if (typeof THREE === 'undefined') {
            showOverlay('Kütüphane Yüklenemedi', 'Three.js kütüphanesi yüklenemedi. Lütfen internet bağlantınızı kontrol edin veya sayfayı bir HTTP sunucusunda çalıştırın.', `<pre style="background:#f5f5f5;padding:10px;border-radius:6px;">cd C:\\Users\\saltu\\YasliGuvenlikSistemi_TubitekProje\\FotosentezWebSitesi
python -m http.server 8000
# sonra http://localhost:8000 açın</pre>`);
            console.error('THREE not available');
            return;
        }

        if (isFileProtocol()) {
            showOverlay('Yerel Dosya Protokolü', 'Sayfayı doğrudan açtınız (file://). GLTF/GLB dosyaları bazı tarayıcılarda yüklenemez. Lütfen aşağıdaki komutu PowerShell veya terminalde çalıştırın ve http://localhost:8000 üzerinden açın.', `<pre style="background:#f5f5f5;padding:10px;border-radius:6px;">cd C:\\Users\\saltu\\YasliGuvenlikSistemi_TubitekProje\\FotosentezWebSitesi
python -m http.server 8000</pre>`);
            // continue to attempt initialization anyway; user can close overlay
        }

        // Setup scene
        const container = document.getElementById('3d-container');
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8f9fa);

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
        camera.position.set(0,5,12);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Lights
        const ambient = new THREE.AmbientLight(0x404040, 1.0); scene.add(ambient);
        const dir = new THREE.DirectionalLight(0xffffff, 1.0); dir.position.set(5,10,7); scene.add(dir);

        // Test geometry while loading
        const geo = new THREE.BoxGeometry(1.2,1.2,1.2);
        const mat = new THREE.MeshPhongMaterial({ color:0x4caf50 });
        const testCube = new THREE.Mesh(geo, mat); testCube.position.set(0,1,0); scene.add(testCube);

        // Load models
        const loader = new THREE.GLTFLoader();
        const modelsToLoad = [
            {path:'models/atp-synthase.glb', name:'ATP'},
            {path:'models/photosystem-ii.glb', name:'PSII'}
        ];

        let loaded = 0;
        function tryAddModel(path, name, pos){
            loader.load(path, function(gltf){
                const model = gltf.scene || gltf.scenes && gltf.scenes[0];
                if (!model) { console.warn('GLTF yüklenmiş fakat sahne boş:', path); return; }
                model.position.copy(pos || new THREE.Vector3());
                model.scale.set(1,1,1);
                scene.add(model);
                loaded++;
                console.log(name + ' yüklendi:', path);
                if (loaded === modelsToLoad.length) {
                    // remove test cube
                    scene.remove(testCube);
                    const overlay = document.getElementById('three-overlay'); if (overlay) overlay.remove();
                }
            }, function(xhr){
                // progress
                if (xhr && xhr.total) {
                    console.log(path + ' yükleniyor: ' + Math.round((xhr.loaded/xhr.total)*100) + '%');
                }
            }, function(err){
                console.error('Model yükleme hatası', path, err);
                // Show overlay with suggestion
                showOverlay('Model Yükleme Hatası', `Model yüklenemedi: ${path}. Eğer sayfayı file:// ile açtıysanız, lütfen bir yerel sunucu kullanın. Konsol hatasını kontrol edin.`, `<pre style="background:#f5f5f5;padding:10px;border-radius:6px;">cd C:\\Users\\saltu\\YasliGuvenlikSistemi_TubitekProje\\FotosentezWebSitesi
python -m http.server 8000</pre>`);
            });
        }

        // Try to load each model; if any model fails, fall back to procedural models
        let anyLoaded = false;
        const total = modelsToLoad.length;
        modelsToLoad.forEach((m, i) => {
            tryAddModel(m.path, m.name, new THREE.Vector3((i*6)-3, 0, 0));
        });

        // If loader fails to load within a short timeout, provide procedural fallback
        setTimeout(() => {
            if (loaded === 0) {
                console.warn('Hiç model yüklenemedi — prosedürsel fallback kullanılıyor.');
                // remove any overlay suggesting server issues (user can still open it)
                const overlay = document.getElementById('three-overlay'); if (overlay) overlay.remove();
                // create procedural models so user sees something
                createProceduralATP(scene, new THREE.Vector3(-3,0,0));
                createProceduralPSII(scene, new THREE.Vector3(3,0,0));
                scene.remove(testCube);
            }
        }, 1500);

        // Resize handling
        window.addEventListener('resize', function(){
            camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Animate
        const clock = new THREE.Clock();
        function animate(){
            requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            testCube.rotation.x += 0.01; testCube.rotation.y += 0.013;
            controls.update();
            try{ renderer.render(scene, camera); }catch(e){}
        }
        animate();
    }

    // Small delay to allow CDN scripts to evaluate if loading
    setTimeout(init, 200);
})();
// Procedural fallback model creators
function createProceduralATP(scene, pos) {
    const bodyGeom = new THREE.CylinderGeometry(1.2,1.2,3,32);
    const bodyMat = new THREE.MeshPhongMaterial({color:0x2196F3});
    const body = new THREE.Mesh(bodyGeom, bodyMat); body.position.copy(pos); body.position.y = 0.5; scene.add(body);
    const crown = new THREE.SphereGeometry(1.4,24,16);
    const crownMat = new THREE.MeshPhongMaterial({color:0x4CAF50});
    const cap = new THREE.Mesh(crown, crownMat); cap.position.copy(pos); cap.position.y = 2.0; scene.add(cap);
}

function createProceduralPSII(scene, pos) {
    const coreGeom = new THREE.BoxGeometry(2.2,1.6,1.2);
    const coreMat = new THREE.MeshPhongMaterial({color:0x8BC34A});
    const core = new THREE.Mesh(coreGeom, coreMat); core.position.copy(pos); core.position.y = 0.6; scene.add(core);
    for(let i=0;i<4;i++){ const el = new THREE.Mesh(new THREE.SphereGeometry(0.18,12,12), new THREE.MeshPhongMaterial({color:0x03A9F4})); el.position.set(pos.x-0.9+(i*0.6), pos.y-0.4, pos.z+0.6); scene.add(el);} 
}
