// Generate maze V2

const nodes = [
  { startPos: { x: 0, y: 0, z: 0 } },
  { startPos: { x: -1, y: 2, z: 0 } },
  { startPos: { x: -1, y: 2, z: 0 } },
  { startPos: { x: 1, y: 2, z: 0 } }];

const edges = [
  { fromNode: nodesArr[0], toNode: nodesArr[1] },
  { fromNode: nodesArr[0], toNode: nodesArr[2] }];
  
const getPointsAbove((startPos) =>{
  return [];
}

const getPreviousEdges((startPos) =>{
  return [];
}

const getNextEdges((startPos) =>{
  return [];
}

const getGrowthChance((startPos) =>{
  const PointsAbove = 
  return 1;
}

while(nodes.length < 10){
  nodes.reduce((a, e, i) => {
    const pointsAbove = getPointsAbove(e);
  }, {nodes, edges);
}