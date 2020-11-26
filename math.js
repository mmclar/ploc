// Given points A and B and length l, return point B' that is the endpoint of the line segment that
// runs from A, through (or towards) B, with length l.
// A and B are arrays of equal length.
// All coordinates and l are in the same units.
function extendLine(A, B, l) {
    const indices = [...Array(A.length).keys()];
	const deltas = indices.map((i) => B[i] - A[i]);
	const deltasSquared = deltas.map((d) => Math.pow(d, 2));
	const distance = Math.sqrt(deltasSquared.reduce((d1, d2) => d1 + d2));
	const normalizationFactor = l / distance;
	const newDeltas = deltas.map((d) => d * normalizationFactor);
	return indices.map((i) => A[i] + newDeltas[i]);
}

// Given a line segment defined by its endpoints, find its midpoint.
function midpoint(P1, P2) {
	var p = {};
	$(['x', 'y', 'z']).each(function(k, v) {
		p[v] = (P1[v] + P2[v]) / 2;
	});
	return p;
}

// Find the dot product of two vectors.
function dot(V, U) {
	const indices = [...Array(V.length).keys()];
	let sum = 0;
	indices.forEach((i) => {
		if (!isNaN(V[i]) && !isNaN(U[i])) sum += V[i] * U[i];
	});
	return sum;
}

// Given two points, find the difference between them.
function vector(A, B) {
	const indices = [...Array(A.length).keys()];
	return indices.map((i) => A[i] - B[i]);
}

// Given two lines, A1-A2 and B1-B2, find the shortest line segment that connects them.
// http://texgen.sourceforge.net/api/mymath_8h_source.html
var eps = 0.0000000000001;
function closestConnection(A1, A2, B1, B2) {
	var p13 = vector(A1, B1);
	var p43 = vector(B2, B1);
	var p21 = vector(A2, A1);
	if (Math.abs(p43[0]) < eps && Math.abs(p43[1]) < eps && Math.abs(p43[2]) < eps) return false;
	if (Math.abs(p21[0]) < eps && Math.abs(p21[1]) < eps && Math.abs(p21[2]) < eps) return false;

	var d1343 = dot(p13, p43);
	var d4321 = dot(p43, p21);
	var d1321 = dot(p13, p21);
	var d4343 = dot(p43, p43);
	var d2121 = dot(p21, p21);

	var denom = d2121 * d4343 - d4321 * d4321;
	if (Math.abs(denom) < eps) return false;
	var numer = d1343 * d4321 - d1321 * d4343;
	var mua = numer / denom;
	const mub = (d1343 + d4321 * mua) / d4343;
	return [
		[
			A1[0] + mua * p21[0],
			A1[1] + mua * p21[1],
			A1[2] + mua * p21[2],
		],
		[
			B1[0] + mub * p43[0],
			B1[1] + mub * p43[1],
			B1[2] + mub * p43[2],
		]
	];
}

// Given two line segments L1 and L2, return the intersection of their
// lines or false if they don't intersect.
function intersection(L1, L2) {
	var p21 = vector(L1.P2, L1.P1);
	var p43 = vector(L2.P2, L2.P1);
	var d = p21.x * p43.y - p43.x * p21.y;
	if (Math.abs(d) < eps) return false;
	var p31 = vector(L2.P1, L1.P1);
	var t = ((p31.x * p43.y) - (p43.x * p31.y)) / d;

	return { x:L1.P1.x+(t*p21.x), y:L1.P1.y+(t*p21.y) };
}
