export default class Node {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.y = z;
  }

  isEqual = (node) => node.x === this.x
                      && node.y === this.y
                      && node.z === this.z;
}
