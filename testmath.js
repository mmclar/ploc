function testEqual(expected, actual) {
    if ('' + expected.toPrecision(8) !== '' + actual.toPrecision(8)) {
        console.log(`Failed: Expected ${expected} but got ${actual}`);
    }
}

testEqual([2, 0, 0], extendLine([0, 0, 0], [1, 0, 0], 2));
