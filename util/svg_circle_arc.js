"use strict";
// © 2019 Xah Lee
// version 2019-06-26
const cos = Math.cos;
const sin = Math.sin;
const π = Math.PI;
// const f_matrix_times = (( [[a,b], [c,d]], [x,y]) => [ a * x + b * y, c * x + d * y]);
const f_matrix_times = (([[a, b], [c, d]], [x, y]) => [a * x + b * y, c * x + d * y]);
const f_rotate_matrix = ((x) => {
  const cosx = cos(x);
  const sinx = sin(x);
  return [[cosx, -sinx], [sinx, cosx]];
});
// const f_vec_add = (([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2]);
const f_vec_add = (([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2]);
const f_svg_ellipse_arc = (([cx, cy], [rx, ry], [t1, Δ], φ) => {
  /* [
  returns a a array that represent a ellipse for SVG path element d attribute.
  cx,cy → center of ellipse.
  rx,ry → major minor radius.
  t1 → start angle, in radian.
  Δ → angle to sweep, in radian. positive.
  φ → rotation on the whole, in radian.
  url: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
  Version 2019-06-19
   ] */
  Δ = Δ % (2 * π);
  const rotMatrix = f_rotate_matrix(φ);
  const [sX, sY] = (f_vec_add(f_matrix_times(rotMatrix, [rx * cos(t1), ry * sin(t1)]), [cx, cy]));
  const [eX, eY] = (f_vec_add(f_matrix_times(rotMatrix, [rx * cos(t1 + Δ), ry * sin(t1 + Δ)]), [cx, cy]));
  const fA = ((Δ > π) ? 1 : 0);
  const fS = ((Δ > 0) ? 1 : 0);
  return "M" + sX + "," + sY + " A" + rx + "," + ry + " " + (φ / π * 180) + " " + fA + " " + fS + " " + eX + "," + eY;
});

module.exports = f_svg_ellipse_arc;
