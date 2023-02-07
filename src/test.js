// Generate maze V2

class maze {
  static nodes = [
    { x: 0, y: 0, z: 0 },
    { x: -1, y: 2, z: 0 },
    { x: 1, y: 2, z: 0 }];

  static edges = [
    { fromNode: maze.nodes[0], toNode: maze.nodes[1] },
    { fromNode: maze.nodes[0], toNode: maze.nodes[2] }];

  static getNextNodes(startPos) {
    return maze.edges.reduce((acc, edge) => {
      if (edge.fromNode.x === startPos.x
       && edge.fromNode.y === startPos.y
       && edge.fromNode.z === startPos.z) { acc.push(edge.toNode); }
      return acc;
    }, []);
  }
}

console.log(maze.getNextNodes({ x: 0, y: 0, z: 0 }));
console.log(maze.nodes[0].x);
console.log(maze.edges[0].fromNode.x);
