let scene, camera, renderer;

function initXR() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    renderer.setAnimationLoop(() => {
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.01;
        renderer.render(scene, camera);
    });

    document.getElementById("voiceStatus").innerText = "Voice placeholder active (say 'Hey Nova')";
}

// Auto start VR session
if (navigator.xr) {
    navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        if (supported) {
            navigator.xr.requestSession('immersive-vr').then((session) => {
                renderer.xr.setSession(session);
            });
        }
    });
}

initXR();

// Placeholder voice input
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        if (transcript.includes("hey nova")) {
            document.getElementById("voiceStatus").innerText = "Nova Activated (placeholder)";
        }
    };
    recognition.start();
}

