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

const matGreen = new MeshBasicMaterial({
  color: 0x00ff00,
  transparent: true,
  opacity: 0.5,
});

const curve90 = new QuadraticBezierCurve3(
  new Vector3(0, 0, 0),
  new Vector3(1, 0, 0),
  new Vector3(1, 2, 0),
);

const tubeGeo = new TubeGeometry(curve90, 64, 0.1, 8, false);
const tubeXPos = new Mesh(tubeGeo, matGreen);
const tubeXNeg = tubeXPos.clone();
tubeXNeg.rotateY(Math.PI);
const group = new Group();

const SphereGeom = new SphereGeometry(0.2, 32, 16);
const sphere = new Mesh(SphereGeom, matGreen);
group.add(sphere);

const maze = [];

for (let y = 0; y < 15; y += 1) {
  for (let x = -y; x <= y; x += 1) {
    for (let upperXDir = -1; upperXDir <= 1; upperXDir += 2) {
      const tubeRow = {};
      tubeRow.y = y;
      tubeRow.x = x;
      tubeRow.upperXDir = upperXDir;
      tubeRow.upperX = x + upperXDir;
      if (y === 0 || ((maze.some((mazeRow) => (tubeRow.y === mazeRow.y + 1
        && tubeRow.x === mazeRow.upperX))))) {
        if (!maze.some((mazeRow) => ((tubeRow.y === mazeRow.y
            && tubeRow.upperX === mazeRow.upperX)))) {
          if (y === 0 || Math.floor(5 * (Math.random() / (Math.abs(x) + 1)))) {
            let newTube;
            if (upperXDir === 1) {
              newTube = tubeXPos.clone();
            } else {
              newTube = tubeXNeg.clone();
            }
            tubeRow.id = newTube.id;
            newTube.position.set(x, y * 2, 0);
            group.add(newTube);
            maze.push(tubeRow);
          }
        }
      }
    }
  }
}

const tubePoints = [];
const numSteps = 100;
for (let tubeStep = 0; tubeStep <= 1; tubeStep += 1 / numSteps) {
  tubePoints.push(curve90.getPoint(tubeStep));
}

// tubePoints.forEach((v) => { console.log(v); });
// console.log('xxx', tubePoints[100].x);
scene.add(group);

let currentStep = 0;
const spherePos = new Vector3();
let branches = maze.filter((tubeRow) => tubeRow.y === sphere.position.y
                                     && tubeRow.x === sphere.position.x);
let chosenBranch = branches.length ? Math.floor(Math.random() * branches.length) : -1;

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

  // const numBranches = maze.reduce(
  // (accumulator, tubeRow) => {
  // if (tubeRow.y === sphere.position.y && tubeRow.x === sphere.position.x) {
  // return accumulator + 1;
  // }
  // return accumulator;
  // },
  // 0,
  // );

  if (!(chosenBranch < 0)) {
    sphere.position.copy(spherePos);
    if (currentStep < (numSteps - 1)) {
      currentStep += 1;
      sphere.position.copy(spherePos).add(tubePoints[currentStep].x * maze[chosenBranch].upperXDir);
    } else {
      branches = maze.filter((tubeRow) => tubeRow.y === sphere.position.y
                                     && tubeRow.x === sphere.position.x);
      chosenBranch = branches.length ? Math.floor(Math.random() * branches.length) : -1;
      spherePos.copy(sphere.position).add(tubePoints[currentStep]);
      currentStep = 0;
    }
  }
  // group.rotation.y += 0.01;
  // controls.update(clock.getDelta());

  renderer.render(scene, camera);
}

animate();
