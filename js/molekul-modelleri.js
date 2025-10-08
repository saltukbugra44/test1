// Gerçekçi Molekül Modelleri ve Animasyonları

class MolekulModelleri {
    constructor(scene) {
        this.scene = scene;
        this.modeller = new Map();
        this.animasyonlar = new Map();
    }

    // ATP Sentaz modelini oluştur
    olusturATPSentaz() {
        // Ana gövde - silindir şeklinde
        const govdeGeometry = new THREE.CylinderGeometry(2, 2, 6, 32);
        const govdeMaterial = new THREE.MeshPhongMaterial({
            color: 0x2196F3,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        const govde = new THREE.Mesh(govdeGeometry, govdeMaterial);

        // F1 parçası - üst küre
        const f1Geometry = new THREE.SphereGeometry(2.5, 32, 32);
        const f1Material = new THREE.MeshPhongMaterial({
            color: 0x4CAF50,
            shininess: 100
        });
        const f1 = new THREE.Mesh(f1Geometry, f1Material);
        f1.position.y = 4;

        // Alt parça - F0
        const f0Geometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
        const f0Material = new THREE.MeshPhongMaterial({
            color: 0xFF9800,
            shininess: 100
        });
        const f0 = new THREE.Mesh(f0Geometry, f0Material);
        f0.position.y = -3;
        f0.rotation.x = Math.PI / 2;

        // Detay parçaları - protein alt birimleri
        const altBirimSayisi = 8;
        const altBirimler = new THREE.Group();
        
        for(let i = 0; i < altBirimSayisi; i++) {
            const birimGeometry = new THREE.BoxGeometry(0.5, 1.5, 0.5);
            const birimMaterial = new THREE.MeshPhongMaterial({
                color: 0xE91E63,
                shininess: 100
            });
            const birim = new THREE.Mesh(birimGeometry, birimMaterial);
            
            const angle = (i / altBirimSayisi) * Math.PI * 2;
            birim.position.x = Math.cos(angle) * 2;
            birim.position.z = Math.sin(angle) * 2;
            birim.rotation.y = angle;
            
            altBirimler.add(birim);
        }
        altBirimler.position.y = 4;

        // Tüm parçaları birleştir
        const atpSentaz = new THREE.Group();
        atpSentaz.add(govde);
        atpSentaz.add(f1);
        atpSentaz.add(f0);
        atpSentaz.add(altBirimler);

        // Modeli sakla
        this.modeller.set('atpSentaz', atpSentaz);
        this.modeller.set('atpAltBirimler', altBirimler);

        return atpSentaz;
    }

    // Fotosistem II modelini oluştur
    olusturFotosistemII() {
        const group = new THREE.Group();

        // Merkez protein kompleksi
        const merkezGeometry = new THREE.BoxGeometry(4, 3, 2);
        const merkezMaterial = new THREE.MeshPhongMaterial({
            color: 0x8BC34A,
            shininess: 80
        });
        const merkez = new THREE.Mesh(merkezGeometry, merkezMaterial);
        group.add(merkez);

        // Reaksiyon merkezi
        const reaksiyonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const reaksiyonMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFEB3B,
            shininess: 100,
            emissive: 0xFFEB3B,
            emissiveIntensity: 0.5
        });
        const reaksiyon = new THREE.Mesh(reaksiyonGeometry, reaksiyonMaterial);
        reaksiyon.position.set(0, 0.5, 1);
        group.add(reaksiyon);

        // Elektron taşıyıcıları
        const elektronSayisi = 6;
        for(let i = 0; i < elektronSayisi; i++) {
            const elektronGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const elektronMaterial = new THREE.MeshPhongMaterial({
                color: 0x03A9F4,
                shininess: 100
            });
            const elektron = new THREE.Mesh(elektronGeometry, elektronMaterial);
            
            const x = (i - elektronSayisi/2) * 0.8;
            elektron.position.set(x, -0.5, 0.5);
            group.add(elektron);
        }

        this.modeller.set('fotosistemII', group);
        return group;
    }

    // Klorofil molekülünü oluştur
    olusturKlorofil() {
        const group = new THREE.Group();

        // Porfirin halkası
        const halkaGeometry = new THREE.TorusGeometry(1, 0.2, 16, 100);
        const halkaMaterial = new THREE.MeshPhongMaterial({
            color: 0x4CAF50,
            shininess: 100
        });
        const halka = new THREE.Mesh(halkaGeometry, halkaMaterial);
        group.add(halka);

        // Magnezyum iyonu
        const mgGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const mgMaterial = new THREE.MeshPhongMaterial({
            color: 0xE91E63,
            shininess: 100
        });
        const mg = new THREE.Mesh(mgGeometry, mgMaterial);
        group.add(mg);

        // Fitol kuyruğu
        const kuyrukGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
        const kuyrukMaterial = new THREE.MeshPhongMaterial({
            color: 0x8BC34A,
            shininess: 80
        });
        const kuyruk = new THREE.Mesh(kuyrukGeometry, kuyrukMaterial);
        kuyruk.position.y = -1.2;
        kuyruk.rotation.x = Math.PI / 6;
        group.add(kuyruk);

        this.modeller.set('klorofil', group);
        return group;
    }

    // NADPH molekülünü oluştur
    olusturNADPH() {
        const group = new THREE.Group();

        // Nikotinamid halkası
        const halkaGeometry = new THREE.TorusGeometry(0.8, 0.15, 16, 100);
        const halkaMaterial = new THREE.MeshPhongMaterial({
            color: 0xFF9800,
            shininess: 90
        });
        const halka = new THREE.Mesh(halkaGeometry, halkaMaterial);
        group.add(halka);

        // Fosfat grupları
        for(let i = 0; i < 2; i++) {
            const fosfatGeometry = new THREE.TetrahedronGeometry(0.3);
            const fosfatMaterial = new THREE.MeshPhongMaterial({
                color: 0xF44336,
                shininess: 100
            });
            const fosfat = new THREE.Mesh(fosfatGeometry, fosfatMaterial);
            fosfat.position.set(i * 0.8 - 0.4, -1, 0);
            group.add(fosfat);
        }

        this.modeller.set('nadph', group);
        return group;
    }

    // ATP molekülünü oluştur
    olusturATP() {
        const group = new THREE.Group();

        // Adenin bazı
        const adeninGeometry = new THREE.BoxGeometry(0.8, 1, 0.3);
        const adeninMaterial = new THREE.MeshPhongMaterial({
            color: 0x3F51B5,
            shininess: 90
        });
        const adenin = new THREE.Mesh(adeninGeometry, adeninMaterial);
        group.add(adenin);

        // Riboz şekeri
        const ribozGeometry = new THREE.DodecahedronGeometry(0.4);
        const ribozMaterial = new THREE.MeshPhongMaterial({
            color: 0x009688,
            shininess: 90
        });
        const riboz = new THREE.Mesh(ribozGeometry, ribozMaterial);
        riboz.position.y = -0.8;
        group.add(riboz);

        // Fosfat grupları
        for(let i = 0; i < 3; i++) {
            const fosfatGeometry = new THREE.TetrahedronGeometry(0.3);
            const fosfatMaterial = new THREE.MeshPhongMaterial({
                color: 0xF44336,
                shininess: 100
            });
            const fosfat = new THREE.Mesh(fosfatGeometry, fosfatMaterial);
            fosfat.position.y = -1.5 - (i * 0.6);
            group.add(fosfat);
        }

        this.modeller.set('atp', group);
        return group;
    }

    // Tüm modelleri yerleştir
    yerlesirModeller() {
        // ATP Sentaz
        const atpSentaz = this.olusturATPSentaz();
        atpSentaz.position.set(0, 0, 0);
        this.scene.add(atpSentaz);

        // Fotosistem II
        const fotosistemII = this.olusturFotosistemII();
        fotosistemII.position.set(-8, 0, 0);
        this.scene.add(fotosistemII);

        // Klorofil molekülleri
        for(let i = 0; i < 3; i++) {
            const klorofil = this.olusturKlorofil();
            klorofil.position.set(-8 + (i * 2), 3, 0);
            klorofil.scale.set(0.5, 0.5, 0.5);
            this.scene.add(klorofil);
        }

        // NADPH
        const nadph = this.olusturNADPH();
        nadph.position.set(6, 2, 0);
        this.scene.add(nadph);

        // ATP
        const atp = this.olusturATP();
        atp.position.set(-6, -3, 0);
        this.scene.add(atp);
    }

    // ATP Sentaz rotasyonu
    animateATPSentaz() {
        const altBirimler = this.modeller.get('atpAltBirimler');
        if (altBirimler) {
            altBirimler.rotation.y += 0.01;
        }
    }

    // NADPH ve ATP hareketi
    animateMolekuller(time) {
        const nadph = this.modeller.get('nadph');
        const atp = this.modeller.get('atp');

        if (nadph) {
            nadph.position.y = 2 + Math.sin(time * 2) * 0.2;
        }

        if (atp) {
            atp.position.y = -3 + Math.cos(time * 2) * 0.2;
        }
    }
}

export { MolekulModelleri };