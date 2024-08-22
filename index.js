import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 10, 35)

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// helpers
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

const gridHelper = new THREE.GridHelper(100, 20);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

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
earthMesh.position.set(30, 0, 0);
earthMesh.rotation.z = THREE.MathUtils.degToRad(23.5);


const moonOrbitPivot = new THREE.Object3D();
moonOrbitPivot.add(moonMesh);
moonOrbitPivot.position.x = 30;

const earthPivot = new THREE.Object3D();
earthPivot.add(moonOrbitPivot)
scene.add(earthPivot);
earthPivot.add(earthMesh);

moonOrbitPivot.rotation.x = THREE.MathUtils.degToRad(6);

moonMesh.position.set(10, 0, 0);

scene.add(sunMesh);

const ambientLight = new THREE.AmbientLight(0x404040, 10);
scene.add(ambientLight);

// loop
function animate() {
    requestAnimationFrame(animate);

    earthMesh.rotation.y += 0.03;
    earthPivot.rotation.y += 0.005;
    moonOrbitPivot.rotation.y += 0.007;

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
