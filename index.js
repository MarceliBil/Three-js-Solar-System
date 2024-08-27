import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


let isPaused = false;
let isBackground = true;
let isHelpers = true;

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.0001, 10000);
camera.position.set(window.innerWidth < 576 ? -70 : 10, 20, 70);
console.log(camera.position);

// renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// helpers
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

const gridHelper = new THREE.GridHelper(200, 20);
const axesHelper = new THREE.AxesHelper(100);

scene.add(gridHelper, axesHelper);


// texture loader
const textureLoader = new THREE.TextureLoader();

const sunTexture = textureLoader.load('images/sun-texture.jpg');
const earthTexture = textureLoader.load('images/earth-texture.jpg');
const moonTexture = textureLoader.load('images/moon-texture.jpg');

const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });

const sunGeometry = new THREE.SphereGeometry(12, 32, 32);
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const moonGeometry = new THREE.SphereGeometry(1.5, 32, 32);

const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);

sunMesh.position.set(0, 0, 0);
earthMesh.position.set(35, 0, 0);
earthMesh.rotation.z = THREE.MathUtils.degToRad(23.5);


const moonOrbitPivot = new THREE.Object3D();
moonOrbitPivot.add(moonMesh);
moonOrbitPivot.position.copy(earthMesh.position);

const earthPivot = new THREE.Object3D();
earthPivot.add(moonOrbitPivot)
scene.add(earthPivot);
earthPivot.add(earthMesh);

moonOrbitPivot.rotation.x = THREE.MathUtils.degToRad(6);

moonMesh.position.set(10, 0, 0);

scene.add(sunMesh);

// Renderer configuration
renderer.shadowMap.enabled = true;

// Lighting configuration
const sunLight = new THREE.PointLight(0xffffff, 1200, 200);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

// Mesh shadow configuration;
earthMesh.castShadow = true;
earthMesh.receiveShadow = true;
moonMesh.castShadow = true;
moonMesh.receiveShadow = true;

// scene background
const sceneBackgroundTexture = textureLoader.load('images/space-bg.png');
sceneBackgroundTexture.encoding = THREE.sRGBEncoding;
scene.background = sceneBackgroundTexture;

// animation loop
function animate() {
    
    requestAnimationFrame(animate);

    if (!isPaused) {
        earthMesh.rotation.y += 0.03;
        earthPivot.rotation.y += 0.005;
        moonOrbitPivot.rotation.y += 0.007;
    }

    renderer.render(scene, camera);
    
}
animate();


// handle resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});


// buttons / controls
const pauseToggle = document.querySelector('#pause');
const helpersToggle = document.querySelector('#helpers');
const backgroundToggle = document.querySelector('#background');
const resetBtn = document.querySelector('#reset');

pauseToggle.addEventListener('click', () => isPaused = !isPaused);

helpersToggle.addEventListener('click', () => {
    isHelpers = !isHelpers;
    gridHelper.visible = isHelpers;
    axesHelper.visible = isHelpers;
});

backgroundToggle.addEventListener('click', () => {
    isBackground = !isBackground;
    scene.background = isBackground ? sceneBackgroundTexture : null;
});

resetBtn.addEventListener('click', () => location.reload());

