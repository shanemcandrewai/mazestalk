/* eslint no-underscore-dangle: ["error", { "allow": ["__dirname"] }] */
import { FlyControls } from './FlyControls.js';

const {
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
} = await import('three');

const getRandomInt = (min, max) => {
  // The maximum is exclusive and the minimum is inclusive
  const ceilmin = Math.ceil(min);
  return Math.floor(Math.random() * (Math.floor(max) - ceilmin) + ceilmin);
};

const scene = new Scene();
scene.background = new Color(0xffffff);
scene.fog = new Fog(0x002000, 1, 7);
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.x = 0;
camera.position.y = 1;
camera.position.z = 4;

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
  new Vector3(1, 1, 0),
);

const g1 = new TubeGeometry(curve90, 64, 0.1, 16, false);
const mxp = new Mesh(g1, mg);
const gra = new Group();

for (let level = 0; level < 2; level += 1) {
  // const par = ge tRandomInt(nodes);
  for (let xpos = -level; xpos <= level; xpos += 1) {
    for (let zpos = -level; zpos <= level; zpos += 1) {
      if (Math.abs(xpos) + Math.abs(zpos) <= level) {
        for (let direction = 0; direction < 4; direction += 1) {
          const m = mxp.clone();
          m.rotateY(Math.PI * 0.5 * direction);
          m.position.set(xpos, level, zpos);
          gra.add(m);
        }
      }
    }
  }
}

scene.add(gra);

gra.rotateY(Math.PI * 0.1);
function animate() {
  requestAnimationFrame(animate);
  // newContent.nodeValue = gra.rotation.y;
  newContent.nodeValue = ['camera.position.x', camera.position.x,
    'camera.position.y', camera.position.y,
    'camera.position.z', camera.position.z,
    'camera.rotation.x', camera.rotation.x,
    'camera.rotation.y', camera.rotation.y,
    'camera.rotation.z', camera.rotation.z,
  ];

  gra.rotation.y += 0.001;
  controls.update(clock.getDelta());
  renderer.render(scene, camera);
}

animate();
