import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// flags
let isPaused = false;
let isBackground = true;
let isHelpers = true;

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.0001, 10000);
camera.position.set(window.innerWidth < 576 ? -70 : 10, 20, 70);;

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

// creating functions
const loadTexture = (path) => new THREE.TextureLoader().load(path);

const createMaterial = (texturePath, materialType = 'Phong') => {
    const texture = loadTexture(texturePath);
    const materials = {
        Basic: THREE.MeshBasicMaterial,
        Phong: THREE.MeshPhongMaterial,
    };
    
    return new materials[materialType]({ map: texture });
};

const createMesh = (geometry, material) => new THREE.Mesh(geometry, material);

// creating spheres
const sunMaterial = createMaterial('images/sun-texture.jpg', 'Basic');
const earthMaterial = createMaterial('images/earth-texture.jpg', 'Phong');
const moonMaterial = createMaterial('images/moon-texture.jpg', 'Phong');

const sunGeometry = new THREE.SphereGeometry(12, 32, 32);
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const moonGeometry = new THREE.SphereGeometry(1.5, 32, 32);

const sunMesh = createMesh(sunGeometry, sunMaterial);
const earthMesh = createMesh(earthGeometry, earthMaterial);
const moonMesh = createMesh(moonGeometry, moonMaterial);

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

// renderer configuration
renderer.shadowMap.enabled = true;

// lighting configuration
const sunLight = new THREE.PointLight(0xffffff, 1200, 200);
sunLight.castShadow = true;
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
scene.add(ambientLight);

// mesh shadow configuration;
earthMesh.castShadow = true;
earthMesh.receiveShadow = true;
moonMesh.castShadow = true;
moonMesh.receiveShadow = true;

// scene background
const textureLoader = new THREE.TextureLoader();
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