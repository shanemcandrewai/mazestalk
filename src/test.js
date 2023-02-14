// Generate maze V2

import log from 'loglevel';
import {
  // Color,
  // Group,
  // Mesh,
  // MeshBasicMaterial,
  // PerspectiveCamera,
  QuadraticBezierCurve3,
  // Scene,
  // SphereGeometry,
  // TubeGeometry,
  Vector3,
  // WebGLRenderer,
} from 'three';
import Node from './Node.js';
import Edge from './Edge.js';

log.setLevel('info', true);

class Maze {
  #nodes;

  #edges;

  #tube;

  constructor(nodes, edges, tube) {
    this.#nodes = nodes || [
      new Node(0, 0),
      new Node(-1, 2),
      new Node(1, 2),
    ];

    this.#edges = edges || [
      new Edge(this.#nodes[0], this.#nodes[1]),
      new Edge(this.#nodes[0], this.#nodes[2]),
    ];

    this.#tube = tube || new QuadraticBezierCurve3(
      new Vector3(0, 0, 0),
      new Vector3(1, 0, 0),
      new Vector3(1, 2, 0),

    );
  }

  getNextUnoccupied = (fromNode) => {
    const nextPoints = [
      new Node(fromNode.x - this.#tube.v2.x, fromNode.y + this.#tube.v2.y),
      new Node(fromNode.x + this.#tube.v2.x, fromNode.y + this.#tube.v2.y)];
    const nextNodes = this.getNextNodes(fromNode);
    if (nextNodes.length === nextPoints.length) return [];
    if (!nextNodes.length) return nextPoints;
    return nextPoints.filter((point) => !nextNodes.some((node) => node.isSameLocation(point)));
  };

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

log.info(
  'maze.getNextNodes(new Node()).length === 2;',
  maze.getNextNodes(new Node()).length === 2,
);
log.info(
  'maze.getNextNodes(new Node())[0].isSameLocation(new Node(-1, 2))',
  maze.getNextNodes(new Node())[0].isSameLocation(new Node(-1, 2)),
);
log.info(
  'maze.getPreviousNodes(new Node(-1, 2))[0].isSameLocation(new Node())',
  maze.getPreviousNodes(new Node(-1, 2))[0].isSameLocation(new Node()),
);
log.info(
  'maze.getPreviousNodes(new Node(1, 2))[0].isSameLocation(new Node())',
  maze.getPreviousNodes(new Node(1, 2))[0].isSameLocation(new Node()),
);
log.info(
  'maze.addNodeEdge(new Node(-1, 2), new Node(-2, 4)) === 3',
  maze.addNodeEdge(new Node(-1, 2), new Node(-2, 4)) === 3,
);
log.info(
  'maze.getNextNodes(new Node(-1, 2))[0].isSameLocation(new Node(-2, 4))',
  maze.getNextNodes(new Node(-1, 2))[0].isSameLocation(new Node(-2, 4)),
);
log.info(
  'maze.getNextNodes(new Node(1, 2)).length === 0',
  maze.getNextNodes(new Node(1, 2)).length === 0,
);
log.info(
  'maze.getNextUnoccupied(new Node(1, 2)).length === 2',
  maze.getNextUnoccupied(new Node(1, 2)).length === 2,
);
