// Generate maze V2

const nodes = [
  { startPos: { x: 0, y: 0, z: 0 } },
  { startPos: { x: -1, y: 2, z: 0 } },
  { startPos: { x: 1, y: 2, z: 0 } }];

const links = [
  { fromNode: nodes[0], nodes[1] },
  { fromNode: nodes[0], nodes[2] }];

const CountToNodes = (a, e, i) => 2;
const SproutDecision = (a, e, i) => true;
const canGrow = (a, e, i) => CountToNodes(a, e, i) < 2 && SproutDecision(a, e, i);

const red = (arr) => arr.reduce((a, e, i) => { a.push(i, e); return a; }, []);
let res = [1, 2, 3];
while (res.length < 7) res = red(res);
console.log(res);
