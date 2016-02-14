// //flipping via matrix transformation

// var mS = (new THREE.Matrix4()).identity();
// //set -1 to the corresponding axis
// mS.elements[0] = -1;
// //mS.elements[5] = -1;
// mS.elements[10] = -1;

// geometry.applyMatrix(mS);
// //mesh.applyMatrix(mS);
// //object.applyMatrix(mS);

// // to draw an arc 2D
// var curve = new THREE.EllipseCurve(
//     0, 0,             // ax, aY
//     7, 15,            // xRadius, yRadius
//     0, 3/2 * Math.PI, // aStartAngle, aEndAngle
//     false             // aClockwise
// );

// var points = curve.getSpacedPoints( 20 );

// var path = new THREE.Path();
// var geometry = path.createGeometry( points );

// var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

// var line = new THREE.Line( geometry, material );

// scene.add( line );

// function storeCoordinate(x, y, array) {
//     array.push(x);
//     array.push(y);
// }

// var coords = [];
// storeCoordinate(3, 5, coords);
// storeCoordinate(19, 1000, coords);
// storeCoordinate(-300, 4578, coords);

// coords[0] == 3   // x value (even indexes)
// coords[1] == 5   // y value (odd indexes)

// // to loop through coordinate values
// for (var i = 0; i < coords.length; i+=2) {
//     var x = coords[i];
//     var y = coords[i+1];
// } 


function arrayToGeo(array, lengthx, lengthy) { 
	var geometry = new THREE.Geometry();
	for(var i =0; i < array.length; i++){
		geometry.vertices.push(new THREE.Vector3(lengthx*array[i][0], lengthy*array[i][1], array[i][2]));
	}
	return geometry;
}
 

function grid(arrayA, arrayB) {
    var length = Math.min(arrayA.length, arrayB.length);
    var result = [];
    for (var i = 0; i < length; i++) {
        for(var j = 0; j < length; j++){
            result.push([arrayA[i], arrayB[j], 0]); // x coordinate set, y coord
        }
    }
    return result;
}

function buildAxes(length) {
        var axes = new THREE.Object3D();

        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

        return axes;

}

function buildLocalAxis(object,length) { 

        var axes = new THREE.Object3D();

        axes.add( buildAxis( new THREE.Vector3( object.position.x, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
        axes.add( buildAxis( new THREE.Vector3( object.position.x, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
        axes.add( buildAxis( new THREE.Vector3( object.position.x, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

        return axes;

}

function buildAxis( src, dst, colorHex, dashed ) {
        var geom = new THREE.Geometry(),
            mat; 

        if(dashed) {
                mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
                mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push( src.clone() );
        geom.vertices.push( dst.clone() );
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line( geom, mat, THREE.LineSegments );

        return axis;

}

// Functions to convert a list of Cartesian coordinates into various
// output file types. Each function takes an argument string containing
// lines of the form:
//
// <xval>\t<yval>\n
//
// where <xval> and <yval> are numbers without exponents. The functions
// return a string with the coordinates appropriately encoded.


function ccl2html(l) {
	// Returns contents of a minimal html file containing the coordinate
	// list as a single two column table.
	
	var pattern = /-?[0-9.]+/g;
	var s = "";
	var x;
	var y;
	
	s = s + "<html><head><title>Calculator Results</title></head><body>" + "\n";
	s = s + "<table border='0' width='100%'><tbody>" + "\n";
			
	while ((x = pattern.exec(l)) != null) {
		y = pattern.exec(l);
		s = s + "<tr><td>" + x[0] + "</td><td>" + y[0] + "</td></tr>" + "\n";
	}

	s = s + "</tbody></table></body></html>" + "\n";
	return s;
} // function 


// function ccl2dxf(l, xmin, ymin, xmax, ymax) {
// 	// Returns contents of a minimal dxf r10 file containing the coordinate
// 	// list as an open polyline on layer 0.
// 	// DXF file format from Autodesk. Help from Paul Bourke.
	
// 	var s = "";
	
// 	// DXF header
// 	s = s + "999" + "\n";
// 	s = s + "Polyline generated by a calculator on http://www.liutaiomottola.com" + "\n";
	
// 	s = s + "0" + "\n";
// 	s = s + "SECTION" + "\n";
// 	s = s + "2" + "\n";
// 	s = s + "HEADER" + "\n";
// 	s = s + "9" + "\n";
// 	s = s + "$ACADVER" + "\n";
// 	s = s + "1" + "\n";
// 	s = s + "AC1006" + "\n";
// 	s = s + "9" + "\n";
// 	s = s + "$INSBASE" + "\n";
// 	s = s + "10" + "\n";
// 	s = s + "0.0" + "\n";
// 	s = s + "20" + "\n";
// 	s = s + "0.0" + "\n";
// 	s = s + "30" + "\n";
// 	s = s + "0.0" + "\n";
// 	s = s + "9" + "\n";
// 	s = s + "$EXTMIN" + "\n";
// 	s = s + "10" + "\n";
// 	s = s + xmin + "\n";
// 	s = s + "20" + "\n";
// 	s = s + ymin + "\n";
// 	s = s + "9" + "\n";
// 	s = s + "$EXTMAX" + "\n";
// 	s = s + "10" + "\n";
// 	s = s + xmax + "\n";
// 	s = s + "20" + "\n";
// 	s = s + ymax + "\n";
// 	s = s + "0" + "\n";
// 	s = s + "ENDSEC" + "\n";
	
// 	s = s + "0" + "\n";
// 	s = s + "SECTION" + "\n";
// 	s = s + "2" + "\n";
// 	s = s + "ENTITIES" + "\n";
		
// 	// Polyline header
// 	s = s + "0" + "\n";
// 	s = s + "POLYLINE" + "\n";
// 	s = s + "8" + "\n";
// 	s = s + "0" + "\n";
// 	s = s + "66" + "\n";
// 	s = s + "1" + "\n";
		
// 	// Vertices
// 	var x;
// 	var y;
// 	var pattern = /-?[0-9.]+/g;

// 	while ((x = pattern.exec(l)) != null) {
// 		y = pattern.exec(l);
// 		s = s + "0" + "\n";
// 		s = s + "VERTEX" + "\n";
// 		s = s + "8" + "\n";
// 		s = s + "0" + "\n";
// 		s = s + "10" + "\n";
// 		s = s + x[0] + "\n";
// 		s = s + "20" + "\n";
// 		s = s + y[0] + "\n";
// 	}
		
// 	//Polyline end
// 	s = s + "0" + "\n";
// 	s = s + "SEQEND" + "\n";
		
// 	//DXF end
// 	s = s + "0" + "\n";
// 	s = s + "ENDSEC" + "\n";
// 	s = s + "0" + "\n";
// 	s = s + "EOF" + "\n";

// 	return s;
// } // function 


function ccl2svg(l, xmin, ymin, xmax, ymax) {
	// Returns contents of a minimal svg file containing the coordinate
	// list as a polyline.
	
	var s = "";
	
	s = s + '<?xml version="1.0" encoding="iso-8859-1"?>' + '\n';
	s = s + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20001102//EN"' + '\n';
	s = s + '"http://www.w3.org/TR/2000/CR-SVG-20001102/DTD/svg-20001102.dtd">' + '\n';
	s = s + '\n';
	s = s + '<!-- Polyline generated by a calculator on http://www.liutaiomottola.com -->' + '\n';
	s = s + '\n';
	s = s + '<!-- Size to fit data: width = xMax - xMin, height = yMax - yMin -->' + '\n';
	s = s + '<svg width="' + (xmax - xmin) + '" height="' + (ymax - ymin) + '"' + '  xmlns="http://www.w3.org/2000/svg" version="1.1">' + '\n';
	s = s + '\t<!-- Offset to fit data -->' + '\n';
	s = s + '\t<g transform="translate(' + (-1 * xmin) + ',0)">' + '\n';
	s = s + '\t\t<!-- Origin at lower left corner -->' + '\n';
	s = s + '\t\t<g transform="scale(1,-1)">' + '\n';
	s = s + '\t\t\t<g transform="translate(0,' + (-1 * (ymax - ymin)) + ')">' + '\n';
	s = s + '\t\t\t\t<polyline fill="none" stroke="blue" stroke-width="2%"' + '\n';
    s = s + '\t\t\t\tpoints="';
	
	// Vertices. SVG origin is in top left corner so y values have to be inverted.
	var x;
	var y;
	var pattern = /-?[0-9.]+/g;

	while ((x = pattern.exec(l)) != null) {
		y = pattern.exec(l);
		s = s + x[0] + ",";
		s = s + y[0] + " ";
	}
	s = s + '\n';

	s = s + '\t\t\t\t" />' + '\n';
	s = s + '\t\t\t</g>' + '\n';
	s = s + '\t\t</g>' + '\n';
	s = s + '\t</g>' + '\n';
	s = s + '</svg>' + '\n';
	
	return s;
} // function 



