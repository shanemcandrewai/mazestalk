const arr = [{ colour: 'blue', weight: 1 }, { colour: 'red', weight: 2 }, { colour: 'green', weight: 3 }];
const tot = arr.reduce((acc, elem) => acc + elem.weight, 0);
const arrn = arr.map((elem) => ({ ...elem, norm: (elem.weight += elem.weight) / tot }));
