export function numberSplitFormatter(value) {
  let vs = (''+Math.round(value)).split('').reverse();
  for (var i = 0; i < vs.length - 1; i++) {
    if (i % 3 === 2) {
      vs[i] = ',' + vs[i];
    }
  }
  return vs.reverse().join('');
}
