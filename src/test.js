// Generate maze V2

import log from 'loglevel';
import Node from './Node.js';
import Edge from './Edge.js';

log.setLevel('info', true);

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

  // getaddNode(startNode, endNode) {
  // const startInd = this.#nodes.findIndex((node) => node
  // return this.#edges.reduce((acc, edge) => {
  // if (edge.fromNode.x === startNode.x
  // && edge.fromNode.y === startNode.y
  // && edge.fromNode.z === startNode.z) { acc.push(edge.toNode); }
  // return acc;
  // }, []);
  // }

  getNextNodes(startNode) {
    return this.#edges.reduce((acc, edge) => {
      if (edge.fromNode.isSameLocation(startNode)) acc.push(edge.toNode);
      return acc;
    }, []);
  }

  getPreviousNodes(endNode) {
    return this.#edges.reduce((acc, edge) => {
      if (edge.toNode.isSameLocation(endNode)) acc.push(edge.fromNode);
      return acc;
    }, []);
  }
}

const maze = new Maze();

log.info('maze.getNextNodes(new Node())', maze.getNextNodes(new Node()));
log.info('maze.getPreviousNodes(new Node(-1, 2))', maze.getPreviousNodes(new Node(-1, 2)));
