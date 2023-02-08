// Generate maze V2

import Node from './Node.js';
import Edge from './Edge.js';

class Maze {
  constructor() {
    this.nodes = [
      new Node(0, 0),
      new Node(-1, 2),
      new Node(1, 2),
    ];

    this.edges = [
      new Edge(this.nodes[0], this.nodes[1]),
      new Edge(this.nodes[0], this.nodes[2]),
    ];
  }

  getNextNodes(startPos) {
    return this.edges.reduce((acc, edge) => {
      if (edge.fromNode.x === startPos.x
       && edge.fromNode.y === startPos.y
       && edge.fromNode.z === startPos.z) { acc.push(edge.toNode); }
      return acc;
    }, []);
  }
}

const maze = new Maze();

console.log(maze.getNextNodes(new Node()));
console.log(maze.nodes[0].x);
console.log(maze.edges[0].fromNode.x);
