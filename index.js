import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();



// const loader = new THREE.TextureLoader();

// loader.load('images/space-bg.jpg', (texture) => {
//      scene.background = texture;
// });


const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, .0001, 1000);
camera.position.set(15, 5, 35);


const cameraHelper = new THREE.CameraHelper(camera);
scene.add(cameraHelper);



const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);


const renderer = new THREE.WebGLRenderer({ 
     antialias: true,
     alpha: true,
});


const controls = new OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const handleResize = () => {
     const { innerWidth, innerHeight } = window;
     renderer.setSize(innerWidth, innerHeight);
     camera.aspect = innerWidth / innerHeight;
     camera.updateProjectionMatrix();
}


const createSphere = (r = 1, color = 0xffffff) => {

     const sphereGeo = new THREE.SphereGeometry(r, 20, 20);
     const sphereMat = new THREE.MeshPhongMaterial({
          color,
          shininess: 50,
     })

     return new THREE.Mesh(sphereGeo, sphereMat);
}


const createPointLight = (i = 800, d = 100, color = 0xffffff) => {
     return new THREE.PointLight(color, i, d);
}


const nucleus = createSphere(5, 0xebb400);
const l1 = createPointLight();

const pointLightHelper = new THREE.PointLightHelper(l1, 1); // 1 is the size of the helper sphere
scene.add(pointLightHelper);

l1.position.set(0, 0, 20);
scene.add(l1);


scene.add(nucleus);


const createElectron = (r= .4, color = 0xffffff) => {
     const sphere = createSphere(r, color);
     const pivot = new THREE.Object3D();

     pivot.add(sphere);

     return {
          sphere,
          pivot
     }
}

const e1 = createElectron(1, 0x0051c9);

e1.sphere.position.set(-10, 0, 0);

nucleus.add(e1.pivot);


const loop = () => {

     e1.pivot.rotation.y += .02;

     renderer.render(scene, camera);
     requestAnimationFrame(loop);


     controls.update();
}

loop();

window.addEventListener('resize', handleResize);