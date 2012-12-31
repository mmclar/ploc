var ge;
var debug = true;
var $ = jQuery;
var roofHeight;

google.load("earth", "1");

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
	camera.setTilt(80.0);
	camera.setAltitude(100);
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
			points[pname] = { x: lon, y: lat, z: alt }
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

function locate() {
	// Find the line that connects p1,p2 and p3,p4 where they are closest to intersection.
	var connection = closestConnection({P1:P1, P2:P2}, {P1:P3, P2:P4});
	var midpoint = midpoint(connection);

	// Mark the start, end, and mid-points of that line.
	// Fly to the midpoint, and look towards the points that were selected.
}
