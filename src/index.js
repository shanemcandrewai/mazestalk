import {
  Clock,
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

const clock = new Clock();
clock.start();

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

// Draw maze and update with tube ID
let updatdedMaze = [];
maze.forEach((tubeRow) => {
  let newTube;
  if (tubeRow.x < tubeRow.upperX) {
    newTube = tubeXPos.clone();
  } else {
    newTube = tubeXNeg.clone();
  }
  newTube.position.set(tubeRow.x, tubeRow.y, 0);
  group.add(newTube);
  const updatedTubeRow = { ...tubeRow };
  updatedTubeRow.id = newTube.id;

  updatdedMaze.push(updatedTubeRow);
});

maze = Array.from(updatdedMaze);
updatdedMaze = [];
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
let branches = maze.filter((tubeRow) => tubeRow.x === 0 && tubeRow.y === 0);
const chosenIndex = Math.floor(Math.random() * 2);
let chosenBranch = [...branches[Math.floor(Math.random() * 2)]];
let TargetX = chosenBranch.upperX;
let TargetY = curve90.v2.y;

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getElapsedTime();
  if (delta > 15) {
    clock.start();
    console.log('xxx =============  function animate', delta);
    maze.forEach((elem) => { console.log(elem); });
    console.log('xxx sphereStartPos', sphereStartPos);
    console.log('xxx sphere.position', sphere.position);
    console.log('xxx chosenBranch', chosenBranch);
    console.log('xxx branches.length', branches.length);
    console.log('xxx currentStep', currentStep);
    console.log('xxx TargetX', TargetX);
    console.log('xxx TargetY', TargetY);
  }

  if (chosenBranch.length) {
    if (currentStep < numSteps && currentStep >= 0) {
      const nextPoint = tubePoints[currentStep].clone();
      if (TargetY > sphereStartPos.y) { // moving up
        if (chosenBranch.x > TargetX) {
          nextPoint.x = -nextPoint.x;
        }
      } else { // moving down
        if (TargetX < sphereStartPos.x) {
          nextPoint.x = -nextPoint.x;
        }
        nextPoint.y = -nextPoint.y;
      }
      currentStep += 1;
      sphere.position.copy(sphereStartPos).add(nextPoint);
    } else { // chosenBranch set && currentStep === numSteps
      const currentNode = maze.findIndex((tubeRow) => tubeRow.x === sphereStartPos.x
                                                   && tubeRow.y === sphereStartPos.y
                                                   && tubeRow.upperX === TargetX);
      if (currentNode > -1) {
        if ('visits' in maze[currentNode]) {
          maze[currentNode].visits += 1;
        } else {
          maze[currentNode].visits = 1;
        }
      }
      sphereStartPos.x = TargetX;
      sphereStartPos.y = TargetY;
      sphere.position.copy(sphereStartPos);
      chosenBranch = [];
      currentStep = 0;
    }
  } else { // chosenBranch not set, choose new branch
  // select upper weighted branches, if any
    branches = maze.filter((tubeRow) => tubeRow.x === TargetX && tubeRow.y === TargetY);
    branches = branches.map((tubeRow) => ({ ...tubeRow, weight: 2 }));
    // add lower weighted branches
    let branchesLower = maze.filter((tubeRow) => tubeRow.upperX === TargetX
                                              && tubeRow.y === TargetY - curve90.v2.y);
    branchesLower = branchesLower.map((tubeRow) => ({ ...tubeRow, weight: 1 }));
    branches.push(...branchesLower);
    // normalise weights
    const totalWeight = branches.reduce(
      (accumulator, tubeRow) => accumulator + tubeRow.weight,
      0,
    );
    // choose weighted branch
    let randMax = 0;
    branches = branches.map((elem) => {
      randMax += elem.weight / totalWeight;
      return { ...elem, randMax };
    });
    const rand = Math.random();
    chosenBranch = Array.from(branches.filter((elem) => elem.randMax > rand)[0]);

    // chosenBranch = branches.length ? Math.floor(Math.random() * branches.length) + 1 : 0;

    // Calculate target position.
    if (chosenBranch.x === sphereStartPos.x) {
      TargetX = chosenBranch.upperX;
      TargetY += curve90.v2.y;
    } else {
      TargetX = chosenBranch.x;
      TargetY = chosenBranch.y;
    }

    // if (chosenBranch) {
    // TargetX = chosenBranch.upperX;
    // TargetY += curve90.v2.y;
    // } else { // no upper branches found, choose lower branch
    // branches = maze.filter((tubeRow) => tubeRow.upperX === TargetX
    // && tubeRow.y === TargetY - curve90.v2.y);
    // chosenBranch = branches.length ? Math.floor(Math.random() * branches.length) + 1 : 0;

    // TargetX = chosenBranch.x;
    // TargetY = chosenBranch.y;
    // }
  }
  // group.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
