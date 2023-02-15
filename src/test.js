// Generate maze V2

// to do
// make rand a parameter of attemptGrow* methods
// fix call to this.getNextUnoccupied(fromNode, toPoint)
// test attemptGrow* methods

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

  getNextPoints = (fromNode) => [
    new Node(fromNode.x - this.#tube.v2.x, fromNode.y + this.#tube.v2.y),
    new Node(fromNode.x + this.#tube.v2.x, fromNode.y + this.#tube.v2.y)];

  getNextUnoccupied = (fromNode) => {
    const nextPoints = this.getNextPoints(fromNode);
    const nextNodes = this.getNextNodes(fromNode);
    if (nextNodes.length === nextPoints.length) return [];
    if (!nextNodes.length) return nextPoints;
    return nextPoints.filter((point) => !nextNodes.some((node) => node.isSameLocation(point)));
  };

  addNodeEdge = (fromNode, toNode) => {
    const fromInd = this.#nodes.findIndex((node) => fromNode.isSameLocation(node));
    if (fromInd < 0) return -1;
    if (this.#edges.some((edge) => fromNode.isSameLocation(edge.fromNode)
                                && toNode.isSameLocation(edge.toNode))) return -2;
    let toInd = this.#nodes.findIndex((node) => toNode.isSameLocation(node));
    if (toInd === -1) toInd = this.#nodes.push(toNode) - 1;
    this.#edges.push(new Edge(this.#nodes[fromInd], this.#nodes[toInd]));
    return toInd;
  };

  getNextNodes = (fromNode) => this.#edges.reduce((acc, edge) => {
    if (edge.fromNode.isSameLocation(fromNode)) acc.push(edge.toNode);
    return acc;
  }, []);

  getPreviousNodes = (toNode) => this.#edges.reduce((acc, edge) => {
    if (edge.toNode.isSameLocation(toNode)) acc.push(edge.fromNode);
    return acc;
  }, []);

  getGrowProb = (fromNode, toPoint) => {
    if (!this.#nodes.some((node) => fromNode.isSameLocation(node))) return 0;
    if (this.#nodes.some((node) => toPoint.isSameLocation(node))) return 0;
    if (this.#edges.some((edge) => fromNode.isSameLocation(edge.fromNode)
                                && toPoint.isSameLocation(edge.toNode))) return 0;
    if (!this.getNextUnoccupied(fromNode, toPoint).some(
      (node) => toPoint.isSameLocation(node),
    )) return 0;
    return 1 / (Math.abs(toPoint.x) + 1);
  };

  attemptGrow = (fromNode) => {
    if (!this.#nodes.some((node) => fromNode.isSameLocation(node))) return -1;
    return this.getNextUnoccupied(fromNode).reduce((acc, toNode) => {
      if (Math.random() < this.getGrowProb(fromNode, toNode)) {
        if (this.addNodeEdge(fromNode, toNode) > 0) acc.push(toNode);
      }
      return acc;
    }, []);
  };

  attemptGrowAll = (startNode) => this.getNextNodes(
    startNode,
  ).reduce((acc, toNode) => this.attemptGrow(toNode).reduce((acc2, newNode) => {
    acc2.push(this.attemptGrowAll(newNode));
    return acc2;
  }, []), []);
}

const maze = new Maze();

log.info(
  maze.getNextNodes(new Node()).length === 2,
  'maze.getNextNodes(new Node()).length === 2;',
);
log.info(
  maze.getNextNodes(new Node())[0].isSameLocation(new Node(-1, 2)),
  'maze.getNextNodes(new Node())[0].isSameLocation(new Node(-1, 2))',
);
log.info(
  maze.getPreviousNodes(new Node(-1, 2))[0].isSameLocation(new Node()),
  'maze.getPreviousNodes(new Node(-1, 2))[0].isSameLocation(new Node())',
);
log.info(
  maze.getPreviousNodes(new Node(1, 2))[0].isSameLocation(new Node()),
  'maze.getPreviousNodes(new Node(1, 2))[0].isSameLocation(new Node())',
);
log.info(
  maze.addNodeEdge(new Node(-1, 2), new Node(-2, 4)) === 3,
  'maze.addNodeEdge(new Node(-1, 2), new Node(-2, 4)) === 3',
);
log.info(
  maze.getNextNodes(new Node(-1, 2))[0].isSameLocation(new Node(-2, 4)),
  'maze.getNextNodes(new Node(-1, 2))[0].isSameLocation(new Node(-2, 4))',
);
log.info(
  maze.getNextNodes(new Node(1, 2)).length === 0,
  'maze.getNextNodes(new Node(1, 2)).length === 0',
);
log.info(
  maze.getNextUnoccupied(new Node(1, 2)).length === 2,
  'maze.getNextUnoccupied(new Node(1, 2)).length === 2',
);
log.info(
  maze.getNextPoints(new Node(-1, 2)).length === 2,
  'maze.getNextPoints(new Node(-1, 2)).length === 2',
);
log.info(
  maze.getNextUnoccupied(new Node(-1, 2)).length === 1,
  'maze.getNextUnoccupied(new Node(-1, 2)).length === 1',
);
log.info(
  maze.getNextUnoccupied(new Node(-1, 2))[0].isSameLocation(new Node(0, 4)),
  'maze.getNextUnoccupied(new Node(-1, 2))[0].isSameLocation(new Node(0, 4))',
);
log.info(
  maze.getGrowProb(new Node(), new Node(-1, 2)) === 0,
  'maze.getGrowProb(new Node(), new Node(-1, 2)) === 0',
);
log.info(
  maze.getGrowProb(new Node(), new Node(-1, 3)) === 0,
  'maze.getGrowProb(new Node(), new Node(-1, 3)) === 0',
);
log.info(
  maze.getGrowProb(new Node(1, 2), new Node(2, 4)) === 1 / 3,
  'maze.getGrowProb(new Node(1, 2), new Node(2, 4)) === 1 / 3',
);
