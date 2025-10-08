// Main Three.js Scene Setup and Animation

import { initThreeJS, animate } from './three-loader.js';
import { loadMoleculeModels, updateATPSynthaseRotation, animateElectronTransport } from './molecule-loader.js';

// Initialize scene
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Three.js scene
    initThreeJS('3d-container');
    
    // Start animation loop
    animate();
    
    try {
        // Load molecular models
        await loadMoleculeModels();
        
        // Start animations
        let time = 0;
        function animationLoop() {
            time += 0.016; // Approximately 60fps
            
            // Update ATP Synthase rotation
            updateATPSynthaseRotation(time);
            
            // Animate electron transport
            const progress = (Math.sin(time) + 1) * 0.5; // Oscillates between 0 and 1
            animateElectronTransport(progress);
            
            requestAnimationFrame(animationLoop);
        }
        
        animationLoop();
        
    } catch (error) {
        console.error('Error in main scene setup:', error);
    }
});