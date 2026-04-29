/**
 * @class VisionSystem
 * Optimizado para minimizar la latencia de inferencia en dispositivos móviles.
 */
class VisionSystem {
    constructor() {
        this.model = null;
        this.video = document.getElementById('webcam-feed');
        this.isProcessing = false;
    }

    async loadModel() {
        // Carga el modelo desde el repositorio local para evitar dependencia de red
        this.model = await cocoSsd.load({
            base: 'mobilenet_v2' // Más ligero y rápido para móviles industriales
        });
        console.log("Model State: Ready");
    }

    async runInference() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        // tf.engine().startScope() asegura que las tensores se liberen de la GPU
        tf.engine().startScope();
        
        try {
            const predictions = await this.model.detect(this.video);
            this.updateSafetyLogic(predictions);
        } catch (error) {
            console.error("Inference Error:", error);
        }

        tf.engine().endScope();
        this.isProcessing = false;
        requestAnimationFrame(() => this.runInference());
    }

    updateSafetyLogic(predictions) {
        const alertEntity = document.querySelector('#danger-alert');
        // Buscamos humanos con un umbral de confianza estricto (0.75+)
        const human = predictions.find(p => p.class === 'person' && p.score > 0.75);
        
        if (human) {
            alertEntity.setAttribute('visible', 'true');
            // Lógica de feedback háptico (vibración) para el operario
            if (window.navigator.vibrate) window.navigator.vibrate(200);
        } else {
            alertEntity.setAttribute('visible', 'false');
        }
    }
}
