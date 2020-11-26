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
function dot(V1, V2) {
	var sum = 0;
	$(['x', 'y', 'z']).each(function(k, v) {
		if (V1.hasOwnProperty(v) && !isNaN(V1[v]) && !isNaN(V2[v])) sum += V1[v] * V2[v];
	});
	return sum;
}

// Given two points, find the difference between them.
function vector(P1, P2) {
	return { x:P1.x - P2.x, y:P1.y - P2.y, z:P1.z - P2.z };
}

// Given two line segments L1 and L2 (where a line segment is defined
// by its endpoints { P1{x, y, z}, P2{x, y, z} }, find the shortest line
// segment that connects them.
var eps = 0.0000000000001;
function closestConnection(L1, L2) {
	var p13 = vector(L1.P1, L2.P1);
	var p43 = vector(L2.P2, L2.P1);
	if (Math.abs(p43.x) < eps && Math.abs(p43.y) < eps && Math.abs(p43.z) < eps) return false;
	var p21 = vector(L1.P2, L1.P1);
	if (Math.abs(p21.x) < eps && Math.abs(p21.y) < eps && Math.abs(p21.z) < eps) return false;

	var d1343 = dot(p13, p43);
	var d4321 = dot(p43, p21);
	var d1321 = dot(p13, p21);
	var d4343 = dot(p43, p43);
	var d2121 = dot(p21, p21);

	var denom = d2121 * d4343 - d4321 * d4321;
	if (Math.abs(denom) < eps) return false;
	var numer = d1343 * d4321 - d1321 * d4343;
	var mua = numer / denom;
	return {
		P1: {
			x:L1.P1.x + mua * p21.x,
			y:L1.P1.y + mua * p21.y,
			z:L1.P1.z + mua * p21.z
		},
		P2: {
			x:L2.P1.x + mua * p43.x,
			y:L2.P1.y + mua * p43.y,
			z:L2.P1.z + mua * p43.z
		}
	};
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
