function testEqual(expected, actual) {
    if ('' + expected !== '' + actual) {
        console.log(`Failed: Expected ${expected} but got ${actual}`);
    }
}

testEqual([2, 0, 0], extendLine([0, 0, 0], [1, 0, 0], 2));
testEqual(12, dot([1, 2, 3], [4, -5, 6]));
testEqual(12, dot([4, -5, 6], [1, 2, 3]));
testEqual([[0, 0, 0], [0, 0, 1]], closestConnection([0, 0, 0], [1, 0, 0], [0, 0, 1], [0, 1, 1]));
testEqual([[.5, .5, 0], [.5, .5, 1]], closestConnection([0, 0, 0], [1, 1, 0], [0, 1, 1], [1, 0, 1]));
testEqual([[.5, .5, 0], [.5, .5, 1]], closestConnection([0, 0, 0], [1, 1, 0], [0, 1, 1], [1, 0, 1]));
testEqual(true, vectorIsZero([0, 0, 0]));
testEqual(false, vectorIsZero([0, 0, 0.000001]));

