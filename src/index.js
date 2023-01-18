import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';

import {
  Scene,
  Color,
  Fog,
  PerspectiveCamera,
  WebGLRenderer,
  MeshBasicMaterial,
  QuadraticBezierCurve3,
  TubeGeometry,
  Vector3,
  Clock,
  Mesh,
  Group,
} from 'three';

const scene = new Scene();
scene.background = new Color(0xffffff);
scene.fog = new Fog(0x002000, 1, 10);
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.x = 0;
camera.position.y = 2;
camera.position.z = 7;

const newDiv = document.createElement('div');
const newContent = document.createTextNode('');
newDiv.appendChild(newContent);
const id = document.createAttribute('id');
id.value = 'testdiv';
newDiv.setAttributeNode(id);
document.body.appendChild(newDiv);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new FlyControls(camera, renderer.domElement);
const clock = new Clock();

controls.movementSpeed = 1;
controls.domElement = renderer.domElement;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = false;

const mg = new MeshBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0.5,
});

const curve90 = new QuadraticBezierCurve3(
  new Vector3(0, 0, 0),
  new Vector3(1, 0, 0),
  new Vector3(1, 2, 0),
);

const g1 = new TubeGeometry(curve90, 64, 0.1, 8, false);
const mxp = new Mesh(g1, mg);
mxp.rotateY(Math.PI);
const gra = new Group();

const maze = [];

for (let level = 0; level < 3; level += 1) {
  for (let xpos = -level; xpos <= level; xpos += 1) {
    if (Math.abs(xpos) <= level) {
      for (let direction = -1; direction <= 1; direction += 2) {
        const row = [level, xpos, direction];
        if (level === 0 || Math.floor(Math.random() * 2)) {
          row.push(1);
          const m = mxp.clone();
          if (direction === 1) {
            m.rotateY(Math.PI);
          }
          m.position.set(xpos, level * 2, 0);
          gra.add(m);
        } else {
          row.push(0);
        }
        maze.push(row);
      }
    }
  }
}

maze.forEach((it) => { console.log(it); });
scene.add(gra);

function animate() {
  requestAnimationFrame(animate);
  newContent.nodeValue = [
    'camera.position.x', camera.position.x,
    'camera.position.y', camera.position.y,
    'camera.position.z', camera.position.z,
    'camera.rotation.x', camera.rotation.x,
    'camera.rotation.y', camera.rotation.y,
    'camera.rotation.z', camera.rotation.z,
  ];

  // gra.rotation.y += 0.01;
  controls.update(clock.getDelta());
  renderer.render(scene, camera);
}

animate();
