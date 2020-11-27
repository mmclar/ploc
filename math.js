// Given points A and B and length l, return point B' that is the endpoint of the line segment that
// runs from A, through (or towards) B, with length l.
// A and B are arrays of equal length.
function extendLine(A, B, l) {
    const indices = [...Array(A.length).keys()];
	const deltas = indices.map((i) => B[i] - A[i]);
	const deltasSquared = deltas.map((d) => Math.pow(d, 2));
	const distance = Math.sqrt(deltasSquared.reduce((d1, d2) => d1 + d2));
	const normalizationFactor = l / distance;
	const newDeltas = deltas.map((d) => d * normalizationFactor);
	return indices.map((i) => A[i] + newDeltas[i]);
}

// Find the dot product of two vectors.
function dot(V, U) {
	const indices = [...Array(V.length).keys()];
	let sum = 0;
	indices.forEach((i) => {
		sum += V[i] * U[i];
	});
	return sum;
}

// Given two points, find the difference between them (A - B)
function subtract(A, B) {
	const indices = [...Array(A.length).keys()];
	return indices.map((i) => A[i] - B[i]);
}

function add(V, U) {
	const indices = [...Array(V.length).keys()];
	return indices.map((i) => V[i] + U[i]);
}

function scale(V, m) {
	const indices = [...Array(V.length).keys()];
	return indices.map((i) => V[i] * m);
}

// Given two lines, A1-A2 and B1-B2, find the shortest line segment that connects them.
// http://texgen.sourceforge.net/api/mymath_8h_source.html
var eps = 0.0000000000001;
function closestConnection(p1, p2, p3, p4) {
	let mua, mub;

	let p13,p43,p21;

	let d1343,d4321,d1321,d4343,d2121;
	let numer,denom;
	p13 = subtract(p1, p3);
	p43 = subtract(p4, p3);

	// if (ABS(p43.x) < FLT_EPSILON && ABS(p43.y) < FLT_EPSILON && ABS(p43.z) < FLT_EPSILON)
	// 	return false;

	p21 = subtract(p2, p1);

	// if (ABS(p21.x) < FLT_EPSILON && ABS(p21.y) < FLT_EPSILON && ABS(p21.z) < FLT_EPSILON)
	// 	return false;

	d1343 = dot(p13, p43);
	d4321 = dot(p43, p21);
	d1321 = dot(p13, p21);
	d4343 = dot(p43, p43);
	d2121 = dot(p21, p21);

	denom = d2121 * d4343 - d4321 * d4321;
	// if (ABS(denom) < FLT_EPSILON)
	// 	return false;
	numer = d1343 * d4321 - d1321 * d4343;

	mua = numer / denom;
	mub = (d1343 + d4321 * mua) / d4343;

	pa = add(p1, scale(p21, mua));
	pb = add(p3, scale(p43, mub));

	return [pa, pb];
}

