// Generate maze V2

const nodesArr = [
  { startPos: { x: 0, y: 0, z: 0 } },
  { startPos: { x: -1, y: 2, z: 0 } },
  { startPos: { x: -1, y: 2, z: 0 } },
  { startPos: { x: 1, y: 2, z: 0 } }];

const linksArr = [
  { fromNode: nodesArr[0], toNode: nodesArr[1] },
  { fromNode: nodesArr[0], toNode: nodesArr[2] }];

const nodes = new Map(nodesArr.map((e) => [JSON.stringify(e), e]));
const links = new Map(linksArr.map((e) => [JSON.stringify(e), e]));

Array.from(nodes).filter((e) => e[1].startPos.x === 0)
