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

  // getNextUnoccupied = (fromNode) => {
  // const nextPoints = [];
  // nextPoints.push(new Node(fromNode.x - 1, fromNode.y + 2));
  // nextPoints.push(new Node(fromNode.x + 1, fromNode.y + 2));
  // nextPoint.filter((point) =>
  // };

  addNodeEdge = (fromNode, toNode) => {
    if (!this.#nodes.some((node) => fromNode.isSameLocation(node))) return -1;
    if (this.#edges.some((edge) => fromNode.isSameLocation(edge.fromNode)
                                && toNode.isSameLocation(edge.toNode))) return -2;
    let endInd = this.#nodes.findIndex((node) => toNode.isSameLocation(node));
    if (endInd === -1) endInd = this.#nodes.push(toNode) - 1;
    this.#edges.push(new Edge(fromNode, toNode));
    return endInd;
  };

  getNextNodes = (fromNode) => this.#edges.reduce((acc, edge) => {
    if (edge.fromNode.isSameLocation(fromNode)) acc.push(edge.toNode);
    return acc;
  }, []);

  getPreviousNodes = (toNode) => this.#edges.reduce((acc, edge) => {
    if (edge.toNode.isSameLocation(toNode)) acc.push(edge.fromNode);
    return acc;
  }, []);
}

const maze = new Maze();

log.info('maze.getNextNodes(new Node())', maze.getNextNodes(new Node()));
log.info('maze.getPreviousNodes(new Node(-1, 2))', maze.getPreviousNodes(new Node(-1, 2)));
log.info('toNode', maze.addNodeEdge(new Node(-1, 2), new Node(-2, 4)));
log.info('maze.getNextNodes(new Node(-1, 2))', maze.getNextNodes(new Node(-1, 2)));
log.info('maze.getNextNodes(new Node(1, 2))', maze.getNextNodes(new Node(1, 2)));
