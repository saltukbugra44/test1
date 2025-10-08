/* =============================================================================
   ADVANCED INTERACTIONS & ANIMATIONS
   ============================================================================= */

// =============================================================================
// MOLECULE INTERACTION SYSTEM
// =============================================================================

class MoleculeInteraction {
    constructor() {
        this.molecules = [];
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.createMolecularSystem();
        this.bindEvents();
        this.startAmbientAnimations();
    }

    createMolecularSystem() {
        // Create interactive molecules
        const moleculeContainer = document.querySelector('.equation-container');
        if (!moleculeContainer) return;

        // Add click effects to all molecules
        const molecules = moleculeContainer.querySelectorAll('.molecule-group');
        molecules.forEach((molecule, index) => {
            this.setupMoleculeInteraction(molecule, index);
        });
    }

    setupMoleculeInteraction(molecule, index) {
        molecule.addEventListener('click', (e) => {
            this.triggerMoleculeReaction(molecule, index);
        });

        molecule.addEventListener('mouseenter', (e) => {
            this.showMoleculeInfo(molecule);
        });

        molecule.addEventListener('mouseleave', (e) => {
            this.hideMoleculeInfo(molecule);
        });

        // Add ripple effect container
        const rippleContainer = document.createElement('div');
        rippleContainer.className = 'ripple-container';
        rippleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: inherit;
            overflow: hidden;
            pointer-events: none;
        `;
        molecule.style.position = 'relative';
        molecule.appendChild(rippleContainer);
    }

    triggerMoleculeReaction(molecule, index) {
        // Create ripple effect
        this.createRippleEffect(molecule);
        
        // Trigger specific molecule animation
        molecule.style.animation = 'energyPulse 0.8s ease-out';
        
        // Show molecule details
        this.showMoleculeDetails(molecule, index);
        
        // Trigger chain reaction if appropriate
        setTimeout(() => {
            this.triggerChainReaction(index);
        }, 500);
    }

    createRippleEffect(element) {
        const rippleContainer = element.querySelector('.ripple-container');
        const ripple = document.createElement('div');
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(139, 195, 74, 0.6);
            pointer-events: none;
            animation: clickRipple 0.6s ease-out forwards;
            width: 20px;
            height: 20px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        `;
        
        rippleContainer.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    showMoleculeDetails(molecule, index) {
        const details = this.getMoleculeDetails(index);
        
        const modal = document.createElement('div');
        modal.className = 'molecule-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${details.name}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="molecule-3d">${details.formula}</div>
                    <p><strong>Rol:</strong> ${details.role}</p>
                    <p><strong>Özellik:</strong> ${details.property}</p>
                    <div class="molecule-animation-demo">
                        <div class="demo-molecule">${details.formula}</div>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeInScale 0.3s ease-out forwards;
        `;
        
        // Style modal content
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: var(--light-surface);
            border-radius: var(--radius-lg);
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            position: relative;
            animation: slideInFromBottom 0.3s ease-out forwards;
        `;
        
        document.body.appendChild(modal);
        
        // Close modal events
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeModal(modal));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });
        
        // Apply dark theme if needed
        if (document.body.classList.contains('dark-theme')) {
            modalContent.style.background = 'var(--dark-surface)';
            modalContent.style.color = 'var(--text-white)';
        }
    }

    closeModal(modal) {
        modal.style.animation = 'fadeOutScale 0.3s ease-out forwards';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    getMoleculeDetails(index) {
        const details = [
            {
                name: 'Karbondioksit',
                formula: 'CO₂',
                role: 'Fotosentezin hammaddesi',
                property: 'Atmosferden alınan ana karbon kaynağı'
            },
            {
                name: 'Su',
                formula: 'H₂O',
                role: 'Elektron ve proton kaynağı',
                property: 'Işığa bağlı reaksiyonlarda parçalanır'
            },
            {
                name: 'Glukoz',
                formula: 'C₆H₁₂O₆',
                role: 'Fotosende ürünü',
                property: 'Bitkilerin temel enerji kaynağı'
            },
            {
                name: 'Oksijen',
                formula: 'O₂',
                role: 'Fotosende yan ürünü',
                property: 'Tüm canlılar için yaşamsal'
            },
            {
                name: 'ATP',
                formula: 'C₁₀H₁₆N₅O₁₃P₃',
                role: 'Enerji taşıyıcısı',
                property: 'Hücrenin enerji para birimi'
            }
        ];
        
        return details[index] || details[0];
    }

    triggerChainReaction(startIndex) {
        const molecules = document.querySelectorAll('.molecule-group');
        let currentIndex = startIndex;
        
        const chainInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % molecules.length;
            const nextMolecule = molecules[currentIndex];
            
            if (nextMolecule) {
                nextMolecule.style.animation = 'chainReaction 1s ease-out';
                this.createRippleEffect(nextMolecule);
            }
            
            // Stop after full cycle
            if (currentIndex === startIndex) {
                clearInterval(chainInterval);
            }
        }, 300);
    }

    startAmbientAnimations() {
        // Continuous subtle animations for molecules
        setInterval(() => {
            const molecules = document.querySelectorAll('.molecule-group');
            const randomMolecule = molecules[Math.floor(Math.random() * molecules.length)];
            
            if (randomMolecule && !this.isAnimating) {
                randomMolecule.style.animation = 'dustParticle 3s ease-in-out';
            }
        }, 5000);
    }
}

// =============================================================================
// CHLOROPLAST 3D INTERACTION
// =============================================================================

class ChloroplastInteraction {
    constructor() {
        this.chloroplast = document.querySelector('.chloroplast-3d');
        this.isRotating = false;
        this.init();
    }

    init() {
        if (!this.chloroplast) return;
        
        this.addInteractiveElements();
        this.bindEvents();
        this.createPhotonStream();
    }

    addInteractiveElements() {
        // Add interactive hotspots to chloroplast parts
        const thylakoids = this.chloroplast.querySelectorAll('.thylakoid');
        thylakoids.forEach((thylakoid, index) => {
            this.addHotspot(thylakoid, `thylakoid-${index}`, {
                title: 'Tilakoid',
                description: 'Işığa bağlı reaksiyonların gerçekleştiği yer',
                process: 'ATP ve NADPH üretimi'
            });
        });

        // Add stroma hotspot
        const stroma = this.chloroplast.querySelector('.stroma');
        if (stroma) {
            this.addHotspot(stroma, 'stroma', {
                title: 'Stroma',
                description: 'Calvin döngüsünün gerçekleştiği bölge',
                process: 'CO₂ fiksasyonu ve glukoz sentezi'
            });
        }
    }

    addHotspot(element, id, data) {
        const hotspot = document.createElement('div');
        hotspot.className = 'chloroplast-hotspot';
        hotspot.dataset.id = id;
        
        hotspot.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(255, 235, 59, 0.8);
            border: 2px solid rgba(255, 235, 59, 1);
            border-radius: 50%;
            cursor: pointer;
            animation: energyPulse 2s ease-in-out infinite;
            z-index: 10;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        `;
        
        element.style.position = 'relative';
        element.appendChild(hotspot);
        
        hotspot.addEventListener('click', () => {
            this.showHotspotInfo(data);
        });
    }

    showHotspotInfo(data) {
        const info = document.createElement('div');
        info.className = 'hotspot-info';
        info.innerHTML = `
            <div class="info-content">
                <h4>${data.title}</h4>
                <p>${data.description}</p>
                <p><strong>Süreç:</strong> ${data.process}</p>
                <button class="info-close">Kapat</button>
            </div>
        `;
        
        info.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--light-surface);
            padding: 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            z-index: 10001;
            max-width: 300px;
            animation: fadeInScale 0.3s ease-out forwards;
        `;
        
        if (document.body.classList.contains('dark-theme')) {
            info.style.background = 'var(--dark-surface)';
            info.style.color = 'var(--text-white)';
        }
        
        document.body.appendChild(info);
        
        const closeBtn = info.querySelector('.info-close');
        closeBtn.addEventListener('click', () => {
            info.style.animation = 'fadeOutScale 0.3s ease-out forwards';
            setTimeout(() => {
                if (info.parentNode) {
                    info.parentNode.removeChild(info);
                }
            }, 300);
        });
    }

    bindEvents() {
        this.chloroplast.addEventListener('click', () => {
            this.toggleRotation();
        });

        this.chloroplast.addEventListener('mouseenter', () => {
            this.startEnergyEffect();
        });

        this.chloroplast.addEventListener('mouseleave', () => {
            this.stopEnergyEffect();
        });
    }

    toggleRotation() {
        this.isRotating = !this.isRotating;
        const body = this.chloroplast.querySelector('.chloroplast-body');
        
        if (this.isRotating) {
            body.style.animationPlayState = 'paused';
        } else {
            body.style.animationPlayState = 'running';
        }
    }

    startEnergyEffect() {
        const lightRays = this.chloroplast.querySelectorAll('.light-ray');
        lightRays.forEach(ray => {
            ray.style.animationDuration = '0.5s';
            ray.style.opacity = '1';
        });
    }

    stopEnergyEffect() {
        const lightRays = this.chloroplast.querySelectorAll('.light-ray');
        lightRays.forEach(ray => {
            ray.style.animationDuration = '2s';
            ray.style.opacity = '0.7';
        });
    }

    createPhotonStream() {
        setInterval(() => {
            this.createPhoton();
        }, 1000);
    }

    createPhoton() {
        const photon = document.createElement('div');
        photon.className = 'photon';
        
        photon.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, #ffeb3b 0%, #ffc107 100%);
            border-radius: 50%;
            top: -50px;
            left: ${Math.random() * 100}%;
            animation: photonTravel 3s linear forwards;
            box-shadow: 0 0 10px #ffeb3b;
        `;
        
        this.chloroplast.appendChild(photon);
        
        setTimeout(() => {
            if (photon.parentNode) {
                photon.parentNode.removeChild(photon);
            }
        }, 3000);
    }
}

// =============================================================================
// DRAG & DROP MOLECULE GAME
// =============================================================================

class MoleculeDragGame {
    constructor() {
        this.gameContainer = null;
        this.score = 0;
        this.gameActive = false;
        this.init();
    }

    init() {
        this.createGameContainer();
        this.bindEvents();
    }

    createGameContainer() {
        // Add game trigger button to FAB menu
        const fabMenu = document.querySelector('.fab-menu');
        if (!fabMenu) return;

        const gameButton = document.createElement('button');
        gameButton.className = 'fab';
        gameButton.innerHTML = '<i class="fas fa-gamepad"></i>';
        gameButton.title = 'Molekül Oyunu';
        gameButton.addEventListener('click', () => this.startGame());
        
        fabMenu.appendChild(gameButton);
    }

    startGame() {
        this.gameContainer = document.createElement('div');
        this.gameContainer.className = 'molecule-game';
        this.gameContainer.innerHTML = `
            <div class="game-header">
                <h3>Fotosentez Molekül Oyunu</h3>
                <div class="game-score">Skor: <span id="game-score">0</span></div>
                <button class="game-close">&times;</button>
            </div>
            <div class="game-instructions">
                Molekülleri doğru yerlere sürükleyerek fotosentez denklemini tamamlayın!
            </div>
            <div class="game-area">
                <div class="reactants-zone" data-zone="reactants">
                    <h4>Reaktanlar</h4>
                    <div class="drop-zone"></div>
                </div>
                <div class="products-zone" data-zone="products">
                    <h4>Ürünler</h4>
                    <div class="drop-zone"></div>
                </div>
            </div>
            <div class="molecules-palette">
                <div class="molecule-item" draggable="true" data-type="reactant" data-molecule="CO₂">CO₂</div>
                <div class="molecule-item" draggable="true" data-type="reactant" data-molecule="H₂O">H₂O</div>
                <div class="molecule-item" draggable="true" data-type="product" data-molecule="C₆H₁₂O₆">C₆H₁₂O₆</div>
                <div class="molecule-item" draggable="true" data-type="product" data-molecule="O₂">O₂</div>
                <div class="molecule-item" draggable="true" data-type="product" data-molecule="ATP">ATP</div>
            </div>
        `;

        this.styleGameContainer();
        document.body.appendChild(this.gameContainer);
        
        this.bindGameEvents();
        this.gameActive = true;
        this.score = 0;
        this.updateScore();
    }

    styleGameContainer() {
        this.gameContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 800px;
            height: 80%;
            background: var(--light-surface);
            border-radius: var(--radius-lg);
            padding: 2rem;
            z-index: 10000;
            box-shadow: var(--shadow-2xl);
            overflow-y: auto;
            animation: fadeInScale 0.3s ease-out forwards;
        `;

        if (document.body.classList.contains('dark-theme')) {
            this.gameContainer.style.background = 'var(--dark-surface)';
            this.gameContainer.style.color = 'var(--text-white)';
        }
    }

    bindGameEvents() {
        const closeBtn = this.gameContainer.querySelector('.game-close');
        closeBtn.addEventListener('click', () => this.closeGame());

        // Drag and drop events
        const molecules = this.gameContainer.querySelectorAll('.molecule-item');
        const dropZones = this.gameContainer.querySelectorAll('.drop-zone');

        molecules.forEach(molecule => {
            molecule.addEventListener('dragstart', this.handleDragStart.bind(this));
            molecule.addEventListener('dragend', this.handleDragEnd.bind(this));
        });

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', this.handleDragOver.bind(this));
            zone.addEventListener('drop', this.handleDrop.bind(this));
        });
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            molecule: e.target.dataset.molecule,
            type: e.target.dataset.type
        }));
        e.target.style.opacity = '0.5';
    }

    handleDragEnd(e) {
        e.target.style.opacity = '1';
    }

    handleDragOver(e) {
        e.preventDefault();
        e.target.style.background = 'rgba(139, 195, 74, 0.2)';
    }

    handleDrop(e) {
        e.preventDefault();
        e.target.style.background = '';
        
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const zone = e.target.closest('[data-zone]').dataset.zone;
        
        // Check if correct zone
        const isCorrect = (zone === 'reactants' && data.type === 'reactant') ||
                         (zone === 'products' && data.type === 'product');
        
        if (isCorrect) {
            this.addMoleculeToZone(e.target, data.molecule, true);
            this.score += 10;
            this.createSuccessEffect(e.target);
        } else {
            this.addMoleculeToZone(e.target, data.molecule, false);
            this.score = Math.max(0, this.score - 5);
            this.createErrorEffect(e.target);
        }
        
        this.updateScore();
        this.checkGameCompletion();
    }

    addMoleculeToZone(zone, molecule, correct) {
        const moleculeEl = document.createElement('div');
        moleculeEl.className = `dropped-molecule ${correct ? 'correct' : 'incorrect'}`;
        moleculeEl.textContent = molecule;
        moleculeEl.style.cssText = `
            display: inline-block;
            margin: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: var(--radius-md);
            background: ${correct ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)'};
            color: white;
            animation: fadeInScale 0.3s ease-out forwards;
        `;
        
        zone.appendChild(moleculeEl);
    }

    createSuccessEffect(element) {
        const effect = document.createElement('div');
        effect.innerHTML = '✓';
        effect.style.cssText = `
            position: absolute;
            color: #4caf50;
            font-size: 2rem;
            font-weight: bold;
            animation: successPop 1s ease-out forwards;
            pointer-events: none;
        `;
        
        element.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }

    createErrorEffect(element) {
        const effect = document.createElement('div');
        effect.innerHTML = '✗';
        effect.style.cssText = `
            position: absolute;
            color: #f44336;
            font-size: 2rem;
            font-weight: bold;
            animation: errorShake 0.5s ease-out forwards;
            pointer-events: none;
        `;
        
        element.appendChild(effect);
        setTimeout(() => effect.remove(), 500);
    }

    updateScore() {
        const scoreEl = this.gameContainer.querySelector('#game-score');
        if (scoreEl) scoreEl.textContent = this.score;
    }

    checkGameCompletion() {
        const correctMolecules = this.gameContainer.querySelectorAll('.dropped-molecule.correct');
        if (correctMolecules.length >= 5) {
            this.gameCompleted();
        }
    }

    gameCompleted() {
        const congratsModal = document.createElement('div');
        congratsModal.innerHTML = `
            <div class="congrats-content">
                <h3>🎉 Tebrikler!</h3>
                <p>Fotosentez denklemini başarıyla tamamladınız!</p>
                <p>Skorunuz: ${this.score}</p>
                <button class="btn btn-primary" onclick="this.parentNode.parentNode.remove()">Tamam</button>
            </div>
        `;
        
        congratsModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(congratsModal);
    }

    closeGame() {
        this.gameActive = false;
        this.gameContainer.style.animation = 'fadeOutScale 0.3s ease-out forwards';
        setTimeout(() => {
            if (this.gameContainer.parentNode) {
                this.gameContainer.parentNode.removeChild(this.gameContainer);
            }
        }, 300);
    }
}

// =============================================================================
// ADVANCED TIMELINE INTERACTIONS
// =============================================================================

class AdvancedTimelineInteraction {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 4;
        this.autoPlayInterval = null;
        this.init();
    }

    init() {
        this.enhanceTimelineSteps();
        this.addProgressBar();
        this.addStepDetails();
    }

    enhanceTimelineSteps() {
        const steps = document.querySelectorAll('.timeline-step');
        steps.forEach((step, index) => {
            this.addStepEnhancements(step, index + 1);
        });
    }

    addStepEnhancements(step, stepNumber) {
        // Add progress indicator
        const progressRing = document.createElement('div');
        progressRing.className = 'step-progress-ring';
        progressRing.innerHTML = `
            <svg width="70" height="70">
                <circle cx="35" cy="35" r="30" stroke="#e0e0e0" stroke-width="4" fill="none"/>
                <circle cx="35" cy="35" r="30" stroke="#4caf50" stroke-width="4" fill="none" 
                        stroke-dasharray="188" stroke-dashoffset="188" class="progress-circle"/>
            </svg>
        `;
        
        step.appendChild(progressRing);
        
        // Add detailed info panel
        const infoPanel = document.createElement('div');
        infoPanel.className = 'step-info-panel';
        infoPanel.innerHTML = this.getStepDetails(stepNumber);
        step.appendChild(infoPanel);
        
        // Add click handler for detailed view
        step.addEventListener('click', () => {
            this.showStepDetails(stepNumber);
        });
    }

    getStepDetails(stepNumber) {
        const details = {
            1: {
                title: 'Işık Absorpsiyonu',
                description: 'Klorofil a ve b molekülleri güneş ışığından fototonları absorbe eder',
                processes: ['Fotosistem II aktivasyonu', 'Elektron uyarılması', 'Enerji yakalama'],
                molecules: ['Klorofil a', 'Klorofil b', 'Karotenoidler']
            },
            2: {
                title: 'Elektron Taşıma',
                description: 'Uyarılmış elektronlar elektron taşıma zinciri boyunca hareket eder',
                processes: ['Plastoquinon redüksiyonu', 'Cytochrome kompleksi', 'Plastocyanin transferi'],
                molecules: ['PQ', 'Cyt b6f', 'PC', 'Ferredoxin']
            },
            3: {
                title: 'ATP Sentezi',
                description: 'Proton gradyenti kullanılarak ATP sentez edilir',
                processes: ['Proton pompası', 'Chemiosmotic gradient', 'ATP synthase aktivitesi'],
                molecules: ['ADP', 'Pi', 'ATP', 'H⁺']
            },
            4: {
                title: 'Calvin Döngüsü',
                description: 'CO₂ fiksasyonu ve glukoz sentezi gerçekleşir',
                processes: ['CO₂ fiksasyonu', 'Redüksiyon', 'RuBP rejenerasyonu'],
                molecules: ['RuBP', '3-PGA', 'G3P', 'Glukoz']
            }
        };
        
        return details[stepNumber] || details[1];
    }

    showStepDetails(stepNumber) {
        const details = this.getStepDetails(stepNumber);
        
        const modal = document.createElement('div');
        modal.className = 'step-detail-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${details.title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${details.description}</p>
                    <h4>Ana Süreçler:</h4>
                    <ul>
                        ${details.processes.map(process => `<li>${process}</li>`).join('')}
                    </ul>
                    <h4>İlgili Moleküller:</h4>
                    <div class="molecules-list">
                        ${details.molecules.map(mol => `<span class="molecule-tag">${mol}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        this.styleModal(modal);
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeModal(modal));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });
    }

    styleModal(modal) {
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeInScale 0.3s ease-out forwards;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: var(--light-surface);
            border-radius: var(--radius-lg);
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideInFromBottom 0.3s ease-out forwards;
        `;
        
        if (document.body.classList.contains('dark-theme')) {
            modalContent.style.background = 'var(--dark-surface)';
            modalContent.style.color = 'var(--text-white)';
        }
    }

    closeModal(modal) {
        modal.style.animation = 'fadeOutScale 0.3s ease-out forwards';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interaction systems
    new MoleculeInteraction();
    new ChloroplastInteraction();
    new MoleculeDragGame();
    new AdvancedTimelineInteraction();
    
    // Add custom CSS animations
    addCustomAnimations();
    
    console.log('🎮 Advanced interactions loaded successfully!');
});

function addCustomAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes successPop {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
            100% { transform: scale(1) rotate(360deg); opacity: 0; }
        }
        
        @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes fadeOutScale {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.8); }
        }
        
        .ripple-container {
            overflow: hidden;
        }
        
        .step-progress-ring {
            position: absolute;
            top: -5px;
            left: -5px;
            pointer-events: none;
        }
        
        .progress-circle {
            transition: stroke-dashoffset 0.5s ease;
        }
        
        .molecule-tag {
            display: inline-block;
            background: var(--primary-green);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: var(--radius-sm);
            margin: 0.25rem;
            font-size: 0.875rem;
        }
        
        .molecules-list {
            display: flex;
            flex-wrap: wrap;
            margin-top: 1rem;
        }
    `;
    
    document.head.appendChild(style);
}

// =============================================================================
// UTILITY FUNCTIONS FOR INTERACTIONS
// =============================================================================

function createParticleExplosion(x, y, color = '#4caf50', count = 10) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / count) * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let frame = 0;
        const animate = () => {
            frame++;
            const progress = frame / 60;
            
            if (progress >= 1) {
                particle.remove();
                return;
            }
            
            const currentX = x + vx * progress;
            const currentY = y + vy * progress + (progress * progress * 200);
            
            particle.style.left = currentX + 'px';
            particle.style.top = currentY + 'px';
            particle.style.opacity = 1 - progress;
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
}

// Export for global use
window.createParticleExplosion = createParticleExplosion;