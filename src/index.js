import {
  Scene,
  Color,
  PerspectiveCamera,
  WebGLRenderer,
  MeshBasicMaterial,
  QuadraticBezierCurve3,
  TubeGeometry,
  Vector3,
  Mesh,
  Group,
  SphereGeometry,
} from 'three';

const scene = new Scene();
scene.background = new Color(0xffffff);
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.x = 0;
camera.position.y = 15;
camera.position.z = 20;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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
let NextX = branches[chosenBranch - 1].upperX;
let NextY = curve90.v2.y;

function animate() {
  requestAnimationFrame(animate);
  // branches.forEach((elem) => { console.log(elem); });
  if (chosenBranch) {
    if (currentStep < numSteps && currentStep >= 0) {
      const nextPoint = tubePoints[currentStep].clone();
      if (branches[chosenBranch - 1].x > NextX) {
        nextPoint.x = -nextPoint.x;
      }
      if (NextY < sphereStartPos.y) {
        nextPoint.y = -nextPoint.y;
      }
      sphere.position.copy(sphereStartPos).add(nextPoint);
      if (NextY > sphereStartPos.y) {
        currentStep += 1;
      } else {
        currentStep -= 1;
      }
    } else { // chosenBranch && currentStep === numSteps
      sphereStartPos.x = NextX;
      sphereStartPos.y = NextY;
      sphere.position.copy(sphereStartPos);
      chosenBranch = 0;
      currentStep = 0;
    }
  } else { //! chosenBranch
    branches = maze.filter((tubeRow) => tubeRow.x === NextX && tubeRow.y === NextY);
    chosenBranch = branches.length ? Math.floor(Math.random() * branches.length) + 1 : 0;
    if (chosenBranch) {
      NextX = branches[chosenBranch - 1].upperX;
      NextY += curve90.v2.y;
    } else {
      maze.forEach((elem) => { console.log(elem); });

      console.log('xxx =============');
      console.log('xxx sphereStartPos', sphereStartPos);
      console.log('xxx sphere.position', sphere.position);
      console.log('xxx chosenBranch', chosenBranch);
      console.log('xxx branches.length', branches.length);
      console.log('xxx currentStep', currentStep);
      console.log('xxx NextX', NextX);
      console.log('xxx NextY', NextY);
      branches = maze.filter((tubeRow) => tubeRow.UpperX === NextX
                                       && tubeRow.y === NextY - curve90.v2.y);
      chosenBranch = branches.length ? Math.floor(Math.random() * branches.length) + 1 : 0;
      if (chosenBranch) {
        NextX = branches[chosenBranch - 1].x;
        NextY -= curve90.v2.y;
      }
    }
  }
  // group.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
