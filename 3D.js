import * as THREE from 'three';
import { OBJLoader } from 'three/addons/OBJLoader.js';

const canvas = document.getElementById("render");
let camera, scene, renderer, mat, timer, previous, dt;
let distance = 400;
let trex;
let cactus;

const haloShader = {
  uniforms: {
    fq: { value: 50.0 },
    amp: { value: 10.0},
    off: { value: 0.0},
    uColor: { value: new THREE.Color(0x00ffff) }, // couleur du halo
    uCameraPos: { value: new THREE.Vector3() }    // position de la caméra
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPos;

    uniform float fq;
    uniform float amp;
    uniform float off;

    void main() {
        vNormal = normalize(normalMatrix * normal);

        vec3 pos = normalize(position);
        float u = (atan(pos.z, pos.x) + 3.14159265) / (2.0 * 3.14159265);
        float v = acos(pos.y) / 3.14159265;

        vec3 displacedPosition = position + normal * amp * cos(u*fq + off) * sin(v*fq + off);

        vec4 worldPosition = modelMatrix * vec4(displacedPosition, 1.0);
        vWorldPos = worldPosition.xyz;

        gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: `
    uniform float off;
    uniform vec3 uColor;
    uniform vec3 uCameraPos;

    varying vec3 vNormal;
    varying vec3 vWorldPos;

    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
      vec3 viewDir = normalize(uCameraPos - vWorldPos);
      float dotNV = 1.-dot(vNormal, viewDir);
      gl_FragColor = vec4(hsv2rgb(vec3(off*0.05,1,1)), pow(dotNV, 2.));
    }
  `
};

// --- AUDIO ---
let listener, sound, analyser, sphere;
let currentSound = null;
export function displayMusic(path) {
    scene.remove(sphere);

    
    if (currentSound) {
        currentSound.stop(); 
    }

    listener = new THREE.AudioListener();
    camera.add(listener);

    currentSound = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(path, function(buffer) {
        currentSound.setBuffer(buffer);
        currentSound.setLoop(true);
        currentSound.setVolume(0.5);
        currentSound.play();
    });

    analyser = new THREE.AudioAnalyser(currentSound, 64);

    const geo = new THREE.IcosahedronGeometry(100, 100);
    mat = new THREE.ShaderMaterial({
        uniforms: haloShader.uniforms,
        vertexShader: haloShader.vertexShader,
        fragmentShader: haloShader.fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide
    });
    mat.uniforms.uCameraPos.value.copy(camera.position);
    sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(0, 0, -200);
    scene.add(sphere);
}


// --- DINO T-REX ---
let talking = false;

// VARIABLES DE JEU

let inGame = false
let gameOver = false
let velocityY = 0;
const gravity = -0.6;
const jumpForce = 12;
let isOnGround = true;

document.addEventListener("keydown", (e) => {
    if (inGame && e.code === "Space" && isOnGround) {
        velocityY = jumpForce;
        isOnGround = false;
        dialogue("Linux")
    }
});

// LES cacTYS

let limitX = -225
let velocityX = -5




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
onWindowResize();

function place_trex()
{
                    trex.position.set(0, 0, 0)
                    trex.scale.set(2,2,2);
}

function place_cactus()
{
                    cactus.position.set(-limitX, -15, 0)
                    cactus.scale.set(0.2,0.2,0.2);
}

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
                    place_trex()
                }
            });
        }
    );

    renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    new OBJLoader().load(
        'res/cactus.obj',
        function ( obj ) {					
            obj.traverse(function (child) {
                if (child.isMesh) {
                    let geometry = child.geometry;
                    geometry.rotateX(-Math.PI / 2);
                    cactus = new THREE.Mesh( child.geometry, new THREE.MeshStandardMaterial({
                        color: 0x55ff55,
                        roughness: 0,
                        metalness: 0.5,
                    }));
                    place_cactus()
                    scene.add( cactus ); 
                }
            });
            
        },
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
            console.log( 'An error happened' );
        }
    );

    renderer = new THREE.WebGLRenderer( { canvas, alpha:true, antialias: true } );
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setPixelRatio(window.devicePixelRatio);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
}

// --- HSV to RGB conversion JS ---
function hsv2rgb(h, s, v) {
    let r, g, b;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return new THREE.Color(r, g, b);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    timer = Date.now()*0.0003;
    dt = timer - previous;
    previous = timer;

    if (trex) {
        if(!inGame)
            {
                trex.rotation.y = mx
                trex.rotation.x = my

                if (talking) {
                    let fq = 100;
                    let amp = 0.25;
                    // trex.scale.set(2, 2+Math.cos(timer*fq)*amp,2);

                    trex.rotation.x = my + Math.cos(timer*fq)*amp;
                }
                trex.rotation.y = mx;
                trex.rotation.x = my;
                if(talking) trex.rotation.x = my + Math.cos(timer*100)*0.25;

                if(analyser && sphere) {
                    const freq = analyser.getAverageFrequency();
                    const scale = 1 + freq/128;
                    sphere.scale.set(scale, scale, scale);
                    mat.uniforms.amp.value = scale * scale * 3;
                    mat.uniforms.off.value += dt * scale * 10;

                    // --- Synchroniser couleur du T-Rex ---
                    const h = mat.uniforms.off.value * 0.05 % 1;
                    const color = hsv2rgb(h, 1, 1);
                    trex.material.color.copy(color);
                }
        }
        else {
            
                velocityY += gravity;
                trex.position.y += velocityY;

                if (trex.position.y <= 0) {
                    trex.position.y = 0;
                    velocityY = 0;
                    isOnGround = true;
                }

                if( !isOnGround) {
                    trex.rotation.x += 0.19;
                } else {
                    trex.rotation.x = 0;
                }

                cactus.position.x += velocityX

                if(cactus.position.x < limitX)
                {
                    cactus.position.x = -limitX
                    velocityX += 0.1
                }
                
                // COLLISION
                const trexBox = new THREE.Box3().setFromObject(trex);
                    const cactusBox = new THREE.Box3().setFromObject(cactus);

                    if (trexBox.intersectsBox(cactusBox)) {
                        if (!gameOver) {
                            dialogue("TA PERDU GROS LOSER");
                            canvas.classList.toggle("fullscreen")
                            inGame = false
                            velocityX = -5
                            place_cactus()
                            place_trex()
                        }
                    }


            }


    }

    renderer.render( scene, camera );
}

export function changeDinoColor(hex) {
    if (trex) trex.material.color.set(hex);
}

export function game(){
    scene.remove(sphere);
    canvas.classList.toggle("fullscreen")
    trex.position.set(-150, 0, 0)
    trex.scale.set(0.5,0.5,0.5);

                trex.rotation.z = 0;
                trex.rotation.x = 0;
                trex.rotation.y = Math.PI / 2;
    inGame = true
}
