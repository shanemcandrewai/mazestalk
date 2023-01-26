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
  // Clock,
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

// const clock = new Clock();

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

for (let y = 0; y < 15; y += curve90.v2.y) {
  for (let x = -y; x <= y; x += 1) {
    for (let upperXDir = -1; upperXDir <= 1; upperXDir += 2) {
      const tubeRow = {};
      tubeRow.x = x;
      tubeRow.y = y;
      tubeRow.upperX = x + upperXDir;
      if (y === 0 || ((maze.some((mazeRow) => (tubeRow.y === mazeRow.y + curve90.v2.y
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
            newTube.position.set(x, y, 0);
            group.add(newTube);
            maze.push(tubeRow);
          }
        }
      }
    }
  }
}
// maze.forEach((elem) => { console.log(elem); });

scene.add(group);

const tubePoints = [];
const numSteps = 100;
for (let tubeStep = 0; tubeStep <= 1; tubeStep += 1 / numSteps) {
  tubePoints.push(curve90.getPoint(tubeStep));
}
let currentStep = 0;
const sphereStartPos = new Vector3();
let branches = maze.filter((tubeRow) => tubeRow.x === 0 && tubeRow.y === 0);
let chosenBranch = Math.floor(Math.random() * 2) + 1;
let { upperX } = branches[chosenBranch - 1];

function animate() {
  requestAnimationFrame(animate);
  // branches.forEach((elem) => { console.log(elem); });
  if (chosenBranch) {
    if (currentStep < numSteps) {
      const nextPoint = tubePoints[currentStep].clone();
      if (branches[chosenBranch - 1].x > branches[chosenBranch - 1].upperX) {
        nextPoint.x = -nextPoint.x;
      }
      sphere.position.copy(sphereStartPos).add(nextPoint);
      if (!currentStep) {
        console.log('xxx =============');
        console.log('xxx currentStep', currentStep);
        console.log('xxx chosenBranch', chosenBranch);
        console.log('xxx sphereStartPos', sphereStartPos);
        console.log('xxx upperX', upperX);
        console.log('xxx sphere.position', sphere.position);
      }
      currentStep += 1;
    } else { // currentStep === numSteps
      branches = maze.filter((tubeRow) => tubeRow.x === branches[chosenBranch - 1].upperX
     && tubeRow.y === sphereStartPos.y + curve90.v2.y);
      chosenBranch = branches.length ? Math.floor(Math.random() * branches.length + 1) : 0;

      if (chosenBranch) {
        upperX = branches[chosenBranch - 1].upperX;
        sphereStartPos.x = branches[chosenBranch - 1].x;
        sphereStartPos.y += curve90.v2.y;
        sphere.position.copy(sphereStartPos);
        currentStep = 0;
      }
    }
  } else if (currentStep > 0) { //! chosenBranch
    console.log('xxx currentStep', currentStep);
    console.log('xxx chosenBranch', chosenBranch);
    console.log('xxx sphereStartPos', sphereStartPos);
    console.log('xxx upperX', upperX);
    console.log('xxx sphere.position', sphere.position); currentStep -= 1;
    const nextPoint = tubePoints[currentStep].clone();

    if (upperX < sphere.position.x) {
      nextPoint.x = -nextPoint.x;
    }
    sphere.position.copy(sphereStartPos).add(nextPoint);
  }

  // group.rotation.y += 0.01;
  // controls.update(clock.getDelta());

  renderer.render(scene, camera);
}

animate();

// newContent.nodeValue = [
// 'getElapsedTime', clock.getElapsedTime(),
// 'camera.position.x', camera.position.x,
// 'camera.position.y', camera.position.y,
// 'camera.position.z', camera.position.z,
// 'camera.rotation.x', camera.rotation.x,
// 'camera.rotation.y', camera.rotation.y,
// 'camera.rotation.z', camera.rotation.z,
// ];
