let scene, camera, renderer, torus, floor, skybox, novaOrb;
let controller1, controller2;
let torusColor = 0x00ffff;
let orbPulse = 1;

const debugPanel = document.createElement('div');
debugPanel.style.cssText = "position:absolute;bottom:10px;left:10px;color:lime;font-size:1em;background:rgba(0,0,0,0.5);padding:5px;border-radius:5px;z-index:999;";
debugPanel.innerText = "VR: Waiting";
document.body.appendChild(debugPanel);

initScene(); // <-- Build scene BEFORE VR session

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Torus
    const geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16);
    const material = new THREE.MeshStandardMaterial({ color: torusColor, metalness: 0.5, roughness: 0.5 });
    torus = new THREE.Mesh(geometry, material);
    torus.position.y = 1.5;
    torus.position.x = -1;
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

    // Skybox
    const skyGeo = new THREE.SphereGeometry(50, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({ map: createGridTexture(), side: THREE.BackSide });
    skybox = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skybox);

    // Nova Orb
    const orbGeo = new THREE.SphereGeometry(0.2, 32, 32);
    const orbMat = new THREE.MeshStandardMaterial({ emissive: 0x00ffff, emissiveIntensity: 1, color: 0x000000 });
    novaOrb = new THREE.Mesh(orbGeo, orbMat);
    novaOrb.position.set(1, 1.5, -1);
    scene.add(novaOrb);

    // Controllers
    controller1 = renderer.xr.getController(0);
    controller2 = renderer.xr.getController(1);
    controller1.addEventListener('selectstart', onSelect);
    controller2.addEventListener('selectstart', onSelect);
    scene.add(controller1);
    scene.add(controller2);

    // Render Loop
    renderer.setAnimationLoop(() => {
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.01;
        orbPulse += 0.05;
        const scale = 1 + 0.05 * Math.sin(orbPulse);
        novaOrb.scale.set(scale, scale, scale);
        renderer.render(scene, camera);
    });

    document.getElementById("voiceStatus").innerText = "Voice placeholder active (say 'Hey Nova')";
}

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
        context.beginPath(); context.moveTo(i, 0); context.lineTo(i, size); context.stroke();
        context.beginPath(); context.moveTo(0, i); context.lineTo(size, i); context.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    return texture;
}

function onSelect() {
    torusColor = Math.random() * 0xffffff;
    torus.material.color.setHex(torusColor);
}

// VR Button
const vrButton = document.createElement('button');
vrButton.innerText = "Enter VR";
vrButton.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);padding:1em 2em;font-size:1.5em;z-index:999;";
document.body.appendChild(vrButton);

vrButton.addEventListener('click', async () => {
    if (navigator.xr) {
        const supported = await navigator.xr.isSessionSupported('immersive-vr');
        if (supported) {
            debugPanel.innerText = "VR: Starting session...";
            const session = await navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['hand-tracking'] });
            renderer.xr.setSession(session);
            debugPanel.innerText = "VR: Session started!";
            vrButton.remove();
        } else {
            alert("VR not supported");
            debugPanel.innerText = "VR: Not supported";
        }
    }
});

// Voice placeholder
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        if (transcript.includes("hey nova")) {
            document.getElementById("voiceStatus").innerText = "Nova Activated (placeholder)";
            if (novaOrb) {
                novaOrb.material.emissiveIntensity = 3;
                setTimeout(() => novaOrb.material.emissiveIntensity = 1, 1000);
            }
        }
    };
    recognition.start();
}

// HUD Menu placeholders
document.addEventListener('click', (event) => {
    if (event.target.id === "marvelButton") alert("Marvel Tracker placeholder");
    if (event.target.id === "musicButton") alert("Music Hub placeholder");
    if (event.target.id === "xpButton") alert("XP Stats placeholder");
});
