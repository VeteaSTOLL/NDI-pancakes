import * as THREE from 'three';
import { OBJLoader } from 'three/addons/OBJLoader.js';

const canvas = document.getElementById("render");
let camera, scene, renderer;
let distance = 300;
let trex;
let cactus;

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

    utterance.lang = 'fr-FR'; // Langue française
    utterance.pitch = 0.5;      // Hauteur de la voix (0 à 2)
    utterance.rate = 1;       // Vitesse de lecture (0.1 à 10)
    utterance.volume = 1;     // Volume (0 à 1)

    utterance.onstart = () => {
        talking = true;
    };
    utterance.onend = () => {
        talking = false;
    };

    window.speechSynthesis.speak(utterance);
}

let mx;
let my;

document.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();

    // Centre de l'élément
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Position relative au centre
    const x = event.clientX - centerX;
    const y = event.clientY - centerY;

    // Normalisation par la taille de l'écran
    mx = x / window.innerWidth;
    my = y / window.innerHeight;
});


init();
animate();

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
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .1, 2000 );
    camera.position.y = 20;
    camera.position.z = distance;

    scene = new THREE.Scene();
    
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);

    const amb_light = new THREE.AmbientLight( 0x555555 );
    scene.add( amb_light );
    
    new OBJLoader().load(
        'res/T-rex.obj',
        function ( obj ) {					
            obj.traverse(function (child) {
                if (child.isMesh) {
                    let geometry = child.geometry;
                    geometry.rotateX(-Math.PI / 2);
                    trex = new THREE.Mesh( child.geometry, new THREE.MeshStandardMaterial({
                        color: 0x55ff55,
                        roughness: 0,
                        metalness: 0.5,
                    }));
                    place_trex()
                    scene.add( trex ); 
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

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {		
    const timer = (Date.now() * 0.0003);
    // camera.position.x = Math.cos( timer ) * distance;
    // camera.position.z = Math.sin( timer ) * distance;
    // camera.lookAt( scene.position );
    // shader.uniforms.cameraPos.value = camera.position;

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

export function game(){
    canvas.classList.toggle("fullscreen")
    trex.position.set(-150, 0, 0)
    trex.scale.set(0.5,0.5,0.5);

                trex.rotation.z = 0;
                trex.rotation.x = 0;
                trex.rotation.y = Math.PI / 2;
    inGame = true
}