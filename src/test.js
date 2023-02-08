// Generate maze V2

import Node from './Node.js';
import Edge from './Edge.js';

class Maze {
  #nodes;

  #edges;

  constructor() {
    this.#nodes = [
      new Node(0, 0),
      new Node(-1, 2),
      new Node(1, 2),
    ];

    this.#edges = [
      new Edge(this.#nodes[0], this.#nodes[1]),
      new Edge(this.#nodes[0], this.#nodes[2]),
    ];
  }

  getaddNode(startNode, endNode) {
    const startInd = this.#nodes.findIndex((node) => node
    return this.#edges.reduce((acc, edge) => {
      if (edge.fromNode.x === startNode.x
       && edge.fromNode.y === startNode.y
       && edge.fromNode.z === startNode.z) { acc.push(edge.toNode); }
      return acc;
    }, []);
  }


  getNextNodes(startNode) {
    return this.#edges.reduce((acc, edge) => {
      if (edge.fromNode.x === startNode.x
       && edge.fromNode.y === startNode.y
       && edge.fromNode.z === startNode.z) { acc.push(edge.toNode); }
      return acc;
    }, []);
  }

  getPreviousNodes(endNode) {
    return this.#edges.reduce((acc, edge) => {
      if (edge.toNode.x === endNode.x
       && edge.toNode.y === endNode.y
       && edge.toNode.z === endNode.z) { acc.push(edge.fromNode); }
      return acc;
    }, []);
  }
}

const maze = new Maze();

console.log(maze.getNextNodes(new Node()));
console.log(maze.getPreviousNodes(new Node(-1, 2)));
