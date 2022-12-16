class Ploc {
    viewer = null;
    points = {
        af: null,
        an: null,
        bf: null,
        bn: null,
    }
    ploc = null;

    constructor(viewer) {
        this.viewer = viewer;

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (movement) {
            if (viewer.scene.mode !== Cesium.SceneMode.MORPHING) {
                const pickedObject = viewer.scene.pick(movement.position);
                if (
                    viewer.scene.pickPositionSupported &&
                    Cesium.defined(pickedObject)
                ) {
                    const cartesian = viewer.scene.pickPosition(movement.position);

                    if (Cesium.defined(cartesian)) {
                        const point = Cesium.Cartographic.fromCartesian(cartesian);
                        const [lon, lat] = [point.longitude, point.latitude].map((n) => Cesium.Math.toDegrees(n));
                        const name = $('#controls tr [name="points"]:checked').val();
                        ploc.setPoints([[name, [lon, lat, point.height]]]);
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    getPoints() {
        return [this.points.af, this.points.an, this.points.bf, this.points.bn].filter((p) => p !== null);
    }

    refreshTable() {
        const points = this.getPoints();
        const trs = $('#controls tr');
        trs.each((i, tr) => {
            const point = points[i - 1];
            if (point) {
                const tds = $(tr).find('td');
                tds.each((i, td) => {
                    if (i > 0) {
                        td.innerHTML = point[i - 1].toFixed(5);
                    }
                });
            }
        });
    }

    makePointEntityCartesian(position, name) {
        const color = {
            'f': Cesium.Color.GREEN,    // af/bf
            'n': Cesium.Color.RED,      // an/bn
            'a': Cesium.Color.ORANGE,   // camera
        }[name[1]];
        return new Cesium.Entity({
            position,
            point: {
                pixelSize: 10,
                color,
            }
        });
    }

    makePointEntity(coords, name) {
        const cartesian = Cesium.Cartesian3.fromDegrees(...coords);
        return this.makePointEntityCartesian(cartesian, name);
    }

    makeLineEntityCartesian(fromCoords, toCoords, color) {
        return new Cesium.Entity({
            polyline: {
                positions: [fromCoords, toCoords],
                pixelSize: 10,
            },
            color,
        })
    }

    makeLineEntityDegreeArray(fromCoords, toCoords, color) {
        const endpoint = extendLine(fromCoords, toCoords, 1000);
        return this.makeLineEntityCartesian(
            Cesium.Cartesian3.fromDegrees(...fromCoords),
            Cesium.Cartesian3.fromDegrees(...endpoint),
            color,
        );
    }

    drawPoints() {
        // Remove existing points
        this.viewer.entities.removeAll();

        const entities = Object.keys(this.points).map((name) => this.makePointEntity(this.points[name], name));

        // If we have all 4 points, add in the lines, and the closest connecting line
        if (entities.length === 4) {
            entities.push(this.makeLineEntityDegreeArray(this.points.af, this.points.an, Cesium.Color.GREEN));
            entities.push(this.makeLineEntityDegreeArray(this.points.bf, this.points.bn, Cesium.Color.GREEN));
            const cartesianPoints = [this.points.af, this.points.an, this.points.bf, this.points.bn].map((p) => Cesium.Cartesian3.fromDegrees(...p));
            const triples = cartesianPoints.map((p) => [p.x, p.y, p.z]);
            const closestConnectingCartesianTriples = closestConnection(...triples);
            const closestConnectingCartesian = closestConnectingCartesianTriples.map((triple) => new Cesium.Cartesian3(...triple));
            entities.push(this.makeLineEntityCartesian(closestConnectingCartesian[0], closestConnectingCartesian[1], Cesium.Color.ORANGE));
            this.ploc = Cesium.Cartesian3.midpoint(...closestConnectingCartesian, new Cesium.Cartesian3());
            entities.push(this.makePointEntityCartesian(this.ploc, 'camera'));
        }

        // Draw the entities
        entities.forEach((entity) => {
            this.viewer.entities.add(entity);
        });
    }

    zoomToPoints() {
        // Update the viewport to see all the points
        const boundsPoints = Object.values(this.points).map((p) => Cesium.Cartesian3.fromDegrees(...p));
        const boundingSphere = new Cesium.BoundingSphere.fromPoints(boundsPoints);
        this.viewer.camera.flyTo({
            destination: boundingSphere.center,
            complete: () => { this.viewer.camera.moveBackward(1000); },
        });
    }

    setPoints(nameCoordPairs) {
        nameCoordPairs.forEach(([name, coords]) => {
            this.points[name] = coords;
        });
        this.refreshTable();
        this.drawPoints();
    }

    flyToPloc() {
        ploc.viewer.camera.flyTo({
            destination: ploc.ploc,
            complete: () => {
                const boundingSphere = new Cesium.BoundingSphere.fromPoints(
                    ['af', 'bf'].map((name) => Cesium.Cartesian3.fromDegrees(...ploc.points[name]))
                );
                // ploc.viewer.camera.viewBoundingSphere(boundingSphere);
            }
        })
    }
}

let ploc;
$(()=> {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMTE5OWFkOC1lMTViLTQ3ZTctYTkyMC1iMmE1MDU5ZGYxZGIiLCJpZCI6MzQ4MjcsImlhdCI6MTYwMDg3MTQ5NH0.9x5LFarOqpBXM5BMPgs3V6Qz9go1mx2BqjLUvbUerKI';
    const viewer = new Cesium.Viewer('map3d', {
        terrainProvider: Cesium.createWorldTerrain(),
        infoBox: false,
    });
    viewer.scene.primitives.add(new Cesium.Cesium3DTileset({url: Cesium.IonResource.fromAssetId(69380)}));
    ploc = new Ploc(viewer);
    $('#fly-to').on('click', ploc.flyToPloc);
});