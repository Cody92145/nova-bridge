let scene, camera, renderer, torus, floor, skybox;
let controller1, controller2;
let torusColor = 0x00ffff;

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Torus (interactive object)
    const geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16);
    const material = new THREE.MeshStandardMaterial({ color: torusColor, metalness: 0.5, roughness: 0.5 });
    torus = new THREE.Mesh(geometry, material);
    torus.position.y = 1.5;
    scene.add(torus);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Lights
    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    light.position.set(0, 1, 0);
    scene.add(light);

    // Futuristic grid skybox
    const skyGeo = new THREE.SphereGeometry(50, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({
        map: createGridTexture(),
        side: THREE.BackSide
    });
    skybox = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skybox);

    // Controllers
    controller1 = renderer.xr.getController(0);
    controller2 = renderer.xr.getController(1);
    controller1.addEventListener('selectstart', onSelect);
    controller2.addEventListener('selectstart', onSelect);
    scene.add(controller1);
    scene.add(controller2);

    // Animate
    renderer.setAnimationLoop(() => {
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.01;
        renderer.render(scene, camera);
    });

    document.getElementById("voiceStatus").innerText = "Voice placeholder active (say 'Hey Nova')";
}

// Create a futuristic grid texture for skybox
function createGridTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    context.fillStyle = 'black';
    context.fillRect(0, 0, size, size);
    context.strokeStyle = '#00ffff';
    context.lineWidth = 2;

    for (let i = 0; i < size; i += 32) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, size);
        context.stroke();

        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(size, i);
        context.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    return texture;
}

// Color change on pinch/select
function onSelect() {
    torusColor = Math.random() * 0xffffff;
    torus.material.color.setHex(torusColor);
}

// Enter VR button
const vrButton = document.createElement('button');
vrButton.innerText = "Enter VR";
vrButton.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);padding:1em 2em;font-size:1.5em;z-index:999;";
document.body.appendChild(vrButton);

vrButton.addEventListener('click', async () => {
    if (navigator.xr) {
        const supported = await navigator.xr.isSessionSupported('immersive-vr');
        if (supported) {
            const session = await navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['hand-tracking'] });
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

// HUD menu button placeholders
document.addEventListener('click', (event) => {
    if (event.target.id === "marvelButton") alert("Marvel Tracker placeholder");
    if (event.target.id === "musicButton") alert("Music Hub placeholder");
    if (event.target.id === "xpButton") alert("XP Stats placeholder");
});

// Initialize
initScene();
