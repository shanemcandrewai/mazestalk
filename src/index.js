import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';

import {
  Scene,
  Color,
  // Fog,
  PerspectiveCamera,
  WebGLRenderer,
  MeshBasicMaterial,
  QuadraticBezierCurve3,
  TubeGeometry,
  Vector3,
  Clock,
  Mesh,
  Group,
  SphereGeometry,
} from 'three';

const scene = new Scene();
scene.background = new Color(0xffffff);
// scene.fog = new Fog(0x002000, 1, 10);
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.x = 0;
camera.position.y = 15;
camera.position.z = 20;

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

const clock = new Clock();

const controls = new FlyControls(camera, renderer.domElement);
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

const tubegeom = new TubeGeometry(curve90, 64, 0.1, 8, false);
const mxp = new Mesh(tubegeom, mg);
const mxn = mxp.clone();
mxn.rotateY(Math.PI);
const group = new Group();

const SphereGeom = new SphereGeometry(0.2, 32, 16);
const sphere = new Mesh(SphereGeom, mg);
group.add(sphere);

const maze = [];

for (let level = 0; level < 15; level += 1) {
  for (let xpos = -level; xpos <= level; xpos += 1) {
    for (let ydir = -1; ydir <= 1; ydir += 2) {
      const row = {};
      row.level = level;
      row.xpos = xpos;
      row.ydir = ydir;
      row.xpos_up = xpos + ydir;
      if (level === 0 || ((maze.some((mazeRow) => (row.level === mazeRow.level + 1
        && row.xpos === mazeRow.xpos_up))))) {
        if (!maze.some((mazeRow) => ((row.level === mazeRow.level
            && row.xpos_up === mazeRow.xpos_up)))) {
          if (Math.floor(5 * (Math.random() / (Math.abs(xpos) + 1)))) {
            let m;
            if (ydir === 1) {
              m = mxp.clone();
            } else {
              m = mxn.clone();
            }
            row.id = m.id;
            m.position.set(xpos, level * 2, 0);
            group.add(m);
            maze.push(row);
          }
        }
      }
    }
  }
}

// maze.forEach((it) => { console.log(it); });
scene.add(group);
let ElapsedTime = 0;
let showsphere;
// let randomrow;
let idremoved;

function animate() {
  requestAnimationFrame(animate);
  newContent.nodeValue = [
    'getElapsedTime', clock.getElapsedTime(),
    'camera.position.x', camera.position.x,
    'camera.position.y', camera.position.y,
    'camera.position.z', camera.position.z,
    'camera.rotation.x', camera.rotation.x,
    'camera.rotation.y', camera.rotation.y,
    'camera.rotation.z', camera.rotation.z,
  ];

  // group.rotation.y += 0.01;
  // controls.update(clock.getDelta());

  if ((clock.getElapsedTime() - ElapsedTime) > 1) {
    ElapsedTime = clock.getElapsedTime();
    // const randomrow = Math.floor(Math.random() * maze.length);
    if (showsphere) {
      showsphere = false;
      const randomrow = Math.floor(Math.random() * maze.length);
      idremoved = group.getObjectById(maze[randomrow].id);
      group.remove(idremoved);
      console.log('xxx', showsphere);
    } else {
      showsphere = true;

      group.add(idremoved);
      console.log('xxx', showsphere);
    }
  }
  renderer.render(scene, camera);
}

animate();
