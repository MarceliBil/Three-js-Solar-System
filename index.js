import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';

const scene = new THREE.Scene();

// Create a texture loader
const loader = new THREE.TextureLoader();

// Load the texture and set it as the scene background
loader.load('images/scene-bg-1.webp', (texture) => {
     scene.background = texture;
});


const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, .0001, 10000);
camera.position.set(0, 0, 40)

const renderer = new THREE.WebGLRenderer({ 
     antialias: true,
     alpha: true,
});


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
          shininess: 30,
     })

     return new THREE.Mesh(sphereGeo, sphereMat);
}


const createPointLight = (i = 1, color = 0xffffff) => {
     return new THREE.PointLight(color, i);
}


const nucleus = createSphere(3);
const l1 = createPointLight(.9);
const l2 = createPointLight(.5);

l1.position.set(60, 20, 60);
l2.position.set(-30, 0, 20);


nucleus.add(l1);
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

const e1 = createElectron();
const e2 = createElectron();
const e3 = createElectron();
const e4 = createElectron();

e1.sphere.position.set(10, 0, 0);
e2.sphere.position.set(5, 0, 0);
e3.sphere.position.set(-5, 0, 0);
e4.sphere.position.set(-10, 0, 0);

nucleus.add(e1.pivot, e2.pivot, e3.pivot, e4.pivot);

e1.pivot.rotation.y += 90;
e2.pivot.rotation.y += 60;
e3.pivot.rotation.y += -60;
e4.pivot.rotation.y += -90;


const loop = () => {
     // nucleus.rotation.z +=0.01;

     e1.pivot.rotation.z += .04;
     e2.pivot.rotation.z += .03;
     e3.pivot.rotation.z += .03;
     e4.pivot.rotation.z += .04;

     nucleus.rotation.z += .001;
     nucleus.rotation.x += .002;
     nucleus.rotation.y += .003;

     renderer.render(scene, camera);
     requestAnimationFrame(loop);
}

loop();

window.addEventListener('resize', handleResize);