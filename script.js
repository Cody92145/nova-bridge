let scene, camera, renderer, torus, floor;

function initScene() {
    // Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Torus (floating object)
    const geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff, wireframe: false, metalness: 0.5, roughness: 0.5 });
    torus = new THREE.Mesh(geometry, material);
    torus.position.y = 1.5;
    scene.add(torus);

    // Floor (environment)
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Light
    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    light.position.set(0, 1, 0);
    scene.add(light);

    // Animation
    renderer.setAnimationLoop(() => {
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.01;
        renderer.render(scene, camera);
    });

    document.getElementById("voiceStatus").innerText = "Voice placeholder active (say 'Hey Nova')";
}

// Add Enter VR button (Quest-safe)
const vrButton = document.createElement('button');
vrButton.innerText = "Enter VR";
vrButton.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);padding:1em 2em;font-size:1.5em;z-index:999;";
document.body.appendChild(vrButton);

vrButton.addEventListener('click', async () => {
    if (navigator.xr) {
        const supported = await navigator.xr.isSessionSupported('immersive-vr');
        if (supported) {
            const session = await navigator.xr.requestSession('immersive-vr');
            renderer.xr.setSession(session);
            vrButton.remove();
        } else {
            alert("VR not supported");
        }
    }
});

// Voice input placeholder
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

// Initialize scene before VR session starts
initScene();
