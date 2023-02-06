// Generate maze V2

const nodes = [
  { startPos: { x: 0, y: 0, z: 0 } },
  { startPos: { x: -1, y: 2, z: 0 } },
  { startPos: { x: -1, y: 2, z: 0 } },
  { startPos: { x: 1, y: 2, z: 0 } }];

const edges = [
  { fromNode: nodes[0], toNode: nodes[1] },
  { fromNode: nodes[0], toNode: nodes[2] }];

const getPointsAbove = ((startPos) => []);

const getPreviousEdges = ((startPos) => []);

const getNextEdges = ((startPos) => []);

const getGrowthChance = ((startPos) => {
  if (NextEdges(startPos) > 1) return 0;
  const PreviousEdges = getPreviousEdges(startPos);
}
);

const addNextPoint = ((NextPos) => true);
const addNextEdge = ((StartPos, NextPos) => true);

while (nodes.length < 10) {
  nodes.reduce((a, e, i) => {
    if (Math.random() > getGrowthChance(e)) {
      addNextPoint(e);
    }
    return a;
  }, { nodes, edges });
}
