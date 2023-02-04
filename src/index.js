import {
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  QuadraticBezierCurve3,
  Scene,
  SphereGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';

// let xx = [1, 2, 3, 4];
// xx = xx.reduce((a, e, i) => { if (e > 2) a.push(i); return a; }, []);
// console.log(xx);

const scene = new Scene();
scene.background = new Color(0xffffff);
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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

// Generate maze
let maze = [];
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
            maze.push(tubeRow);
          }
        }
      }
    }
  }
}

// Draw maze and update with tube ID, visits
maze = maze.map((tubeRow) => {
  let newTube;
  if (tubeRow.x < tubeRow.upperX) {
    newTube = tubeXPos.clone();
  } else {
    newTube = tubeXNeg.clone();
  }
  newTube.position.set(tubeRow.x, tubeRow.y, 0);
  group.add(newTube);
  return { ...tubeRow, id: newTube.id, visits: 0 };
});

scene.add(group);

// Calculate points along tube
const tubePoints = [];
const numSteps = 100;
for (let tubeStep = 0; tubeStep <= 1; tubeStep += 1 / numSteps) {
  tubePoints.push(curve90.getPoint(tubeStep));
}

// Prepare state for animation
let currentStep = 0;
const sphereStartPos = new Vector3();
let chosenIndex = Math.floor(Math.random() * 2);
let nextPoint;

function animate() {
  requestAnimationFrame(animate);

  if (chosenIndex > -1) { // target branch chosen
    if (currentStep < numSteps && currentStep >= 0) {
      nextPoint = tubePoints[currentStep].clone();

      if (maze[chosenIndex].x < sphereStartPos.x
          || maze[chosenIndex].upperX < sphereStartPos.x) { // moving left
        if (maze[chosenIndex].y + curve90.v2.y > sphereStartPos.y) { // moving left up
          nextPoint.x = -nextPoint.x;
        }
      }
      if (maze[chosenIndex].y < sphereStartPos.y) { // moving down
        nextPoint.y = -nextPoint.y;
        if (maze[chosenIndex].x < sphereStartPos.x) { // moving down left
          nextPoint.x = -nextPoint.x;
        }
      }
      sphere.position.copy(sphereStartPos).add(nextPoint);
      currentStep += 1;
    } else { // chosenIndex set && currentStep === numSteps
      maze[chosenIndex].visits += 1;
      nextPoint.x = Math.round(nextPoint.x);
      nextPoint.y = Math.round(nextPoint.y);
      sphere.position.copy(sphereStartPos).add(nextPoint);
      sphereStartPos.copy(sphere.position);
      chosenIndex = -1;
      currentStep = 0;
    }
  } else { // target maze index not chosen, choose new branch
    let branches = maze.reduce((acc, tubeRow, ind) => {
      // select upper weighted branches, if any
      if (tubeRow.x === sphereStartPos.x && tubeRow.y === sphereStartPos.y) {
        acc.push({ index: ind, weight: 2 / (tubeRow.visits + 1) });
      }
      // add lower weighted branches
      if (tubeRow.upperX === sphereStartPos.x && tubeRow.y === sphereStartPos.y - curve90.v2.y) {
        acc.push({ index: ind, weight: 1 / (tubeRow.visits + 1) });
      }
      return acc;
    }, []);

    const totalWeight = branches.reduce((acc, tubeRow) => acc + tubeRow.weight, 0);

    // add randMax - running total of weights
    branches = branches.reduce(
      (acc, tubeRow, ind) => {
        acc.push({
          ...tubeRow,
          randMax: (ind && (acc[ind - 1].randMax + tubeRow.weight)) || tubeRow.weight,
        });
        return acc;
      },
      [],
    );

    // choose weighted branch
    const rand = Math.random() * totalWeight;
    chosenIndex = { ...branches.filter((elem) => elem.randMax > rand)[0] }.index;
  }
  // group.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
