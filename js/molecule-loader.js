// ATP Synthase Model Loader

import { loadModel, updateModelRotation, updateModelPosition, updateModelScale } from './three-loader.js';

// Model paths
const MODEL_PATHS = {
    ATP_SYNTHASE: 'models/atp-synthase.glb',
    ELECTRON_TRANSPORT: 'models/electron-transport.glb',
    CHLOROPLAST: 'models/chloroplast.glb',
    PHOTOSYSTEM_I: 'models/photosystem-i.glb',
    PHOTOSYSTEM_II: 'models/photosystem-ii.glb',
    NADPH: 'models/nadph.glb',
    ATP: 'models/atp.glb'
};

// Initial positions for models
const INITIAL_POSITIONS = {
    ATP_SYNTHASE: { x: 0, y: 0, z: 0 },
    ELECTRON_TRANSPORT: { x: -5, y: 0, z: 0 },
    CHLOROPLAST: { x: 0, y: -5, z: 0 },
    PHOTOSYSTEM_I: { x: 5, y: 0, z: 0 },
    PHOTOSYSTEM_II: { x: 7, y: 0, z: 0 },
    NADPH: { x: -2, y: 2, z: 0 },
    ATP: { x: 2, y: 2, z: 0 }
};

// Load all models
async function loadMoleculeModels() {
    try {
        // Load ATP Synthase with animation
        await loadModel(
            MODEL_PATHS.ATP_SYNTHASE,
            'atp_synthase',
            INITIAL_POSITIONS.ATP_SYNTHASE,
            1.0
        );

        // Load Electron Transport Chain
        await loadModel(
            MODEL_PATHS.ELECTRON_TRANSPORT,
            'electron_transport',
            INITIAL_POSITIONS.ELECTRON_TRANSPORT,
            1.0
        );

        // Load Chloroplast
        await loadModel(
            MODEL_PATHS.CHLOROPLAST,
            'chloroplast',
            INITIAL_POSITIONS.CHLOROPLAST,
            2.0
        );

        // Load Photosystems
        await loadModel(
            MODEL_PATHS.PHOTOSYSTEM_I,
            'photosystem_i',
            INITIAL_POSITIONS.PHOTOSYSTEM_I,
            1.0
        );

        await loadModel(
            MODEL_PATHS.PHOTOSYSTEM_II,
            'photosystem_ii',
            INITIAL_POSITIONS.PHOTOSYSTEM_II,
            1.0
        );

        // Load Molecules
        await loadModel(
            MODEL_PATHS.NADPH,
            'nadph',
            INITIAL_POSITIONS.NADPH,
            0.5
        );

        await loadModel(
            MODEL_PATHS.ATP,
            'atp',
            INITIAL_POSITIONS.ATP,
            0.5
        );

    } catch (error) {
        console.error('Error loading molecule models:', error);
    }
}

// Update ATP Synthase rotation for spinning animation
function updateATPSynthaseRotation(time) {
    updateModelRotation('atp_synthase', {
        x: 0,
        y: time * 0.5,
        z: 0
    });
}

// Move electron along transport chain
function animateElectronTransport(progress) {
    const path = [
        { x: -5, y: 0, z: 0 },
        { x: -3, y: 1, z: 0 },
        { x: -1, y: 0, z: 0 },
        { x: 1, y: 1, z: 0 },
        { x: 3, y: 0, z: 0 }
    ];
    
    const index = Math.floor(progress * (path.length - 1));
    const nextIndex = Math.min(index + 1, path.length - 1);
    const fraction = progress * (path.length - 1) - index;
    
    const currentPos = path[index];
    const nextPos = path[nextIndex];
    
    updateModelPosition('electron', {
        x: currentPos.x + (nextPos.x - currentPos.x) * fraction,
        y: currentPos.y + (nextPos.y - currentPos.y) * fraction,
        z: currentPos.z + (nextPos.z - currentPos.z) * fraction
    });
}

// Export functions
export {
    loadMoleculeModels,
    updateATPSynthaseRotation,
    animateElectronTransport
};