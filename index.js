import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(40, 20, 35)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

const gridHelper = new THREE.GridHelper(100, 20); // 100 jednostek, 50 podziałek
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(50); // Długość osi: 50 jednostek
scene.add(axesHelper);


const textureLoader = new THREE.TextureLoader();

const sunTexture = textureLoader.load('images/sun-texture.jpg');
const earthTexture = textureLoader.load('images/earth-texture.jpg');
const moonTexture = textureLoader.load('images/moon-texture.jpg');

const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });

const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const moonGeometry = new THREE.SphereGeometry(1.5, 32, 32);

const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);

sunMesh.position.set(0, 0, 0);
earthMesh.position.set(30, 0, 0);


const earthPivot = new THREE.Object3D();
scene.add(earthPivot);

earthPivot.add(earthMesh);


earthPivot.add(moonMesh);
moonMesh.position.set(20, 0, 0);

scene.add(sunMesh);

const ambientLight = new THREE.AmbientLight(0x404040, 10);
scene.add(ambientLight);


function animate() {
    requestAnimationFrame(animate);

     earthMesh.rotation.y += 0.01;

     earthPivot.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();


window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
