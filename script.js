let scene, camera, renderer;
let xrSession;

// Basic WebXR Scene
function initXR() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Animate
    renderer.setAnimationLoop(() => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    });

    document.getElementById("loading").style.display = "none";
}

// Voice Input Placeholder
document.getElementById("voiceButton").addEventListener("click", () => {
    document.getElementById("voiceStatus").innerText = "Listening (placeholder)...";
    // Future: Integrate Web Speech API or Nova voice engine
});

// Start WebXR
if (navigator.xr) {
    navigator.xr.requestSession("immersive-vr").then(session => {
        xrSession = session;
        renderer.xr.setSession(session);
    });
}

initXR();
