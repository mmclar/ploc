class Ploc {
    viewer = null;
    logArea$ = null;
    points = {
        af: null,
        an: null,
        bf: null,
        bn: null,
    }

    constructor(viewer, logArea) {
        this.viewer = viewer;
        this.logArea$ = logArea;
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
                        td.innerHTML = point[i - 1];
                    }
                });
            }
        });
    }

    makePointEntity(coords, name) {
        const color = name[1] === 'f' ? Cesium.Color.GREEN : Cesium.Color.RED;
        const position = Cesium.Cartesian3.fromDegrees(...coords);
        return new Cesium.Entity({
            description: 'abc',
            position,
            point: {
                pixelSize: 10,
                color,
            }
        });
    }

    drawPoints() {
        // Remove existing points
        this.viewer.entities.removeAll();

        const entities = Object.keys(this.points).map((name) => this.makePointEntity(this.points[name], name));

        // Draw the points
        entities.forEach((point) => {
            this.viewer.entities.add(point);
        });

        // Update the viewport to see all the points
        const boundsPoints = Object.values(this.points).map((p) => Cesium.Cartesian3.fromDegrees(...p));
        const boundingSphere = new Cesium.BoundingSphere.fromPoints(boundsPoints);
        this.log(boundingSphere);
        this.viewer.camera.flyTo({
            destination: boundingSphere.center,
            complete: () => { this.viewer.camera.moveBackward(1000); },
        });

    }

    setPoint(name, coords) {
        this.setPoints([[name, coords]]);
    }

    setPoints(nameCoordPairs) {
        nameCoordPairs.forEach(([name, coords]) => {
            this.points[name] = coords;
        });
        this.refreshTable();
        this.drawPoints();
    }

    log(text) {
        this.logArea$.val(`${this.logArea$.val()}${text}\n`);
    }
}

let ploc;
$(()=> {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMTE5OWFkOC1lMTViLTQ3ZTctYTkyMC1iMmE1MDU5ZGYxZGIiLCJpZCI6MzQ4MjcsImlhdCI6MTYwMDg3MTQ5NH0.9x5LFarOqpBXM5BMPgs3V6Qz9go1mx2BqjLUvbUerKI';
    const viewer = new Cesium.Viewer('map3d', { terrainProvider: Cesium.createWorldTerrain() });
    viewer.scene.primitives.add(Cesium.createOsmBuildings());
    ploc = new Ploc(viewer, $('textarea.log-area'));
});

/*

var points = {}

function init() {
	google.earth.createInstance('map3d', initCallback);
	$('button.locate').bind('click', locate);
}

function initCallback(pluginInstance) {
	ge = pluginInstance;
	ge.getWindow().setVisibility(true);
	
	ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);
	
	google.earth.addEventListener(ge.getWindow(), 'dblclick', viewClick);
	ge.getNavigationControl().setVisibility(ge.VISIBILITY_SHOW);

	var camera = ge.createCamera('');
	camera.setLatitude(39.95);
	camera.setLongitude(-75.17);
	camera.setTilt(0.0);
	camera.setAltitude(3000);
	ge.getView().setAbstractView(camera);
	
	// Set the initial points values from the markup if they're there.
	$('table.points tr').each(function(k, v) {
		var name = $(v).attr('class');
		if ($(v).find('td.lat').text() != "") {
			lon = +$(v).find('td.lon').text();
			lat = +$(v).find('td.lat').text();
			alt = +$(v).find('td.alt').text();
			points[name] = {
				lon: lon,
				lat: lat,
				alt: alt,
				placeMark: makePlacemark(lat, lon, alt, ge.ALTITUDE_ABSOLUTE, name[1])
			};
			ge.getFeatures().appendChild(points[name].placeMark);
		}
	});
}

function viewClick(evt){
	evt.preventDefault();
	if (evt.getButton() != 0)
	return;
	
	// hit test and create new placemarks
	var x = evt.getClientX(),
		  y = evt.getClientY();
	var hitTestResult = ge.getView().hitTest(x, ge.UNITS_PIXELS, y, ge.UNITS_PIXELS, ge.HIT_TEST_BUILDINGS);
	var point = hitTestResult;
	if (point) {
		var lat = point.getLatitude(), 
			lon = point.getLongitude(),
			alt = point.getAltitude();

		var pname = $("input[name=points]:checked").val();
		if (!points.hasOwnProperty(pname)) {
			points[pname] = { lon: lon, lat: lat, alt: alt }
		}

		// If that point has a placemark, just use the 
		// geometry; otherwise, add the new one and remember
		// it for this point.
		if (points[pname].hasOwnProperty('placeMark')) {
			var pt = ge.createPoint('');
			pt.set(lat, lon, alt, ge.ALTITUDE_ABSOLUTE, false, false);
			points[pname].placeMark.setGeometry(pt);
		}
		else {
			points[pname].placeMark = makePlacemark(lat, lon, alt, ge.ALTITUDE_ABSOLUTE, pname[1]);
			ge.getFeatures().appendChild(points[pname].placeMark);
		}

		var section = $('table.points .' + pname);
		section.find('.lon').text(lon);
		section.find('.lat').text(lat);
		section.find('.alt').text(alt);
		model.setLocation(loc);
	}
}

function makePlacemark(lat, lng, alt, altMode, iconStr) {
	var icon = ge.createIcon('');
	icon.setHref('http://maps.google.com/mapfiles/kml/paddle/' + iconStr + '.png');

	var style = ge.createStyle('');
	style.getIconStyle().setIcon(icon);
	style.getIconStyle().getHotSpot().set(0.5, ge.UNITS_FRACTION, 0, ge.UNITS_FRACTION);

	var pt = ge.createPoint('');
	pt.set(lat, lng, alt, altMode, false, false);

	var pm = ge.createPlacemark('');
	pm.setGeometry(pt);
	pm.setStyleSelector(style);

	return pm;
}

function mark(point, iconStr) {
	var pm = makePlacemark(point.y, point.x, point.z, ge.ALTITUDE_ABSOLUTE, iconStr);
	ge.getFeatures().appendChild(pm);
	return pm;
}

function g(p) {
	return { x:p.lon, y:p.lat, z:p.alt };
}

function locate() {
	// Cheat: find the intersection of the projection of the lines and use
	// the average altitude.
	var i2d = intersection(
		{P1:g(points.P1), P2:g(points.P2)},
		{P1:g(points.P3), P2:g(points.P4)});
	i2d.z = (points.P1.alt + points.P2.alt + points.P3.alt + points.P4.alt) / 4;
	mark(i2d, 'I');

	// Find the line that connects p1,p2 and p3,p4 where they are closest to intersection.
	var connection = closestConnection(
		{P1:g(points.P1), P2:g(points.P2)},
		{P1:g(points.P3), P2:g(points.P4)});
	var m = midpoint(connection.P1, connection.P2);

	// Mark the start, end, and mid-points of that line.
	mark(connection.P1, 'A'); 
	mark(connection.P2, 'B'); 
	mark(m, 'M');


	// Fly to the midpoint, and look towards the points that were selected.
}
*/