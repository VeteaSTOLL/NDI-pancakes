import * as THREE from 'three';
import { OBJLoader } from 'three/addons/OBJLoader.js';

const canvas = document.getElementById("render");
let camera, scene, renderer;
let distance = 300;
let trex;
let talking = false;


document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        talking = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        talking = false;
        if (trex) {
            trex.rotation.x = 0;
        }
    }
});

init();
animate();

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
                    trex.position.set(0, 0, 0)
                    trex.scale.set(2,2,2);
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


    renderer = new THREE.WebGLRenderer( { canvas, antialias: true } );
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

    if (trex && talking) {
        let fq = 100;
        let amp = 0.25;
        // trex.scale.set(2, 2+Math.cos(timer*fq)*amp,2);

        trex.rotation.x = Math.cos(timer*fq)*amp;
    }

    renderer.render( scene, camera );
}