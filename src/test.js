// Generate maze V2

const nodes = [
  { startPos: { x: 0, y: 0, z: 0 } },
  { startPos: { x: -1, y: 2, z: 0 } },
  { startPos: { x: 1, y: 2, z: 0 } }];

const links = [
  { fromNode: nodes[0], toNode: nodes[1] },
  { fromNode: nodes[0], toNode: nodes[2] }];

// const CountToNodes = (a, e, i) => 2;
// const SproutDecision = (a, e, i) => true;
// const canGrow = (a, e, i) => CountToNodes(a, e, i) < 2 && SproutDecision(a, e, i);

const red = (arr) => arr.reduce((a, e, i) => {
  if (!i) {
    a.nodes.push({ startPos: { x: -2, y: 4, z: 0 } });
    a.links.push({ fromNode: nodes[1], toNode: nodes[3] });
  } else {
    a.nodes.push(i);
  }
  return a;
}, { nodes, links });

while (nodes.length < 7) red(nodes);
console.log(nodes);
console.log(links);
