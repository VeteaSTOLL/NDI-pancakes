import * as THREE from 'three';
import { OBJLoader } from 'three/addons/OBJLoader.js';

const canvas = document.getElementById("render");
let camera, scene, renderer;
let distance = 300;
let trex;

// --- AUDIO ---
let listener, sound, analyser, sphere;

export function displayMusic(path) {
    listener = new THREE.AudioListener();
    camera.add(listener);

    sound = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(path, function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
    });

    analyser = new THREE.AudioAnalyser(sound, 64);

    // Sphere pour visualisation
    const geo = new THREE.IcosahedronGeometry(100, 100);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff5500, wireframe: true });
    sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(0, 0, -200);
    scene.add(sphere);
}

// --- DINO T-REX ---
let talking = false;

export function dialogue(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.pitch = 0.5;
    utterance.rate = 1;
    utterance.volume = 1;
    utterance.onstart = () => { talking = true; };
    utterance.onend = () => { talking = false; };
    window.speechSynthesis.speak(utterance);
}

// --- MOUSE ---
let mx, my;
document.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mx = (event.clientX - centerX) / window.innerWidth;
    my = (event.clientY - centerY) / window.innerHeight;
});

// --- INIT / ANIMATE ---
init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 2000);
    camera.position.set(0, 20, distance);

    scene = new THREE.Scene();

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10,10,10);
    scene.add(light);

    const amb = new THREE.AmbientLight(0x555555);
    scene.add(amb);

    new OBJLoader().load('res/T-rex.obj',
        function(obj) {
            obj.traverse(function(child) {
                if(child.isMesh) {
                    child.geometry.rotateX(-Math.PI/2);
                    trex = new THREE.Mesh(child.geometry, new THREE.MeshStandardMaterial({
                        color: 0x55ff55, roughness:0, metalness:0.5
                    }));
                    trex.scale.set(2,2,2);
                    scene.add(trex);
                }
            });
        }
    );

    renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setPixelRatio(window.devicePixelRatio);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    const timer = Date.now()*0.0003;

    if(trex) {
        trex.rotation.y = mx;
        trex.rotation.x = my;
        if(talking) trex.rotation.x = my + Math.cos(timer*100)*0.25;
    }

    // Animation audio
    if(analyser && sphere) {
        const freq = analyser.getAverageFrequency();
        const scale = 1 + freq/128; // Ajuste amplitude
        sphere.scale.set(scale, scale, scale);
    }

    renderer.render(scene, camera);
}
