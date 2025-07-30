let scene, camera, renderer, torus, floor, skybox, novaOrb;
let torusColor = 0x00ffff;
let orbPulse = 1;

// Marvel movie list with local save
const marvelMovies = [
    "Iron Man", "Incredible Hulk", "Iron Man 2", "Thor", "Captain America: The First Avenger",
    "Avengers", "Iron Man 3", "Thor: The Dark World", "Captain America: Winter Soldier",
    "Guardians of the Galaxy", "Avengers: Age of Ultron", "Ant-Man", "Captain America: Civil War",
    "Doctor Strange", "Guardians Vol. 2", "Spider-Man: Homecoming", "Thor: Ragnarok",
    "Black Panther", "Avengers: Infinity War", "Ant-Man and the Wasp", "Captain Marvel",
    "Avengers: Endgame"
];

function initHUD() {
    const list = document.getElementById("marvelList");
    const saved = JSON.parse(localStorage.getItem("marvelProgress") || "[]");

    marvelMovies.forEach(movie => {
        const li = document.createElement("li");
        li.textContent = movie;
        if (saved.includes(movie)) li.style.textDecoration = "line-through";

        li.addEventListener("click", () => {
            li.style.textDecoration = li.style.textDecoration === "line-through" ? "none" : "line-through";
            const newProgress = Array.from(list.children)
                .filter(x => x.style.textDecoration === "line-through")
                .map(x => x.textContent);
            localStorage.setItem("marvelProgress", JSON.stringify(newProgress));
        });

        list.appendChild(li);
    });
}

initScene();
initHUD();
animate();

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.set(0, 1.5, 3);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
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

    // Grid skybox
    const skyGeo = new THREE.SphereGeometry(50, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({ map: createGridTexture(), side: THREE.BackSide });
    skybox = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skybox);

    // Nova orb
    const orbGeo = new THREE.SphereGeometry(0.2, 32, 32);
    const orbMat = new THREE.MeshStandardMaterial({ emissive: 0x00ffff, emissiveIntensity: 1, color: 0x000000 });
    novaOrb = new THREE.Mesh(orbGeo, orbMat);
    novaOrb.position.set(1, 1.5, -1);
    scene.add(novaOrb);

    window.addEventListener('resize', onWindowResize, false);
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

function animate() {
    requestAnimationFrame(animate);
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
    orbPulse += 0.05;
    const scale = 1 + 0.05 * Math.sin(orbPulse);
    novaOrb.scale.set(scale, scale, scale);
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Voice input
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        if (transcript.includes("hey nova")) {
            document.getElementById("voiceStatus").innerText = "Nova Activated!";
            novaOrb.material.emissiveIntensity = 3;
            setTimeout(() => novaOrb.material.emissiveIntensity = 1, 1000);
        }
    };
    recognition.start();
}
