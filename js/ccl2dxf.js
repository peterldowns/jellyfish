function ccl2dxf(l, xmin, ymin, xmax, ymax, layer) {
	
	// Returns contents of a minimal dxf r10 file containing the coordinate
	// list as an open polyline on layer 0.
	
	var s = []; //overcompensate for \n and extra values
	
	// DXF header
	s.push("999","\n");
	
	s.push("written by hand by srw", "\n");
	
	s.push(
			"0" , "\n",
			"SECTION" , "\n",
			"2" , "\n",
			"HEADER" , "\n",
			"9" , "\n",
			"$ACADVER" , "\n",
			"1" , "\n",
			"AC1006" , "\n",
			"9" , "\n",
			"$INSBASE" , "\n",
			"10" , "\n",
			"0.0" , "\n",
			"20" , "\n",
			"0.0" , "\n",
			"30" , "\n",
			"0.0" , "\n",
			"9" , "\n",
			"$EXTMIN" , "\n",
			"10" , "\n",
			xmin , "\n",
			"20" , "\n",
			ymin , "\n",
			"9" , "\n",
			"$EXTMAX" , "\n",
			"10" , "\n",
			xmax , "\n",
			"20" , "\n",
			ymax , "\n",
			"0" , "\n",
			"ENDSEC" , "\n",
				
			"0" , "\n",
			"SECTION" , "\n",
			"2" , "\n",
			"ENTITIES" , "\n")
					

		

	for(i=0;i<l.length;i+=4){
		if(l[i] != ',' & typeof l[i] == "number" )
		{
			// this scheme emulates the line segment pieces in THREE... 
			// bigger files? probably... 

			s.push(
				// Polyline header
				"0" , "\n",
				"POLYLINE" , "\n",
				"8" , "\n", // layer call 
				layer , "\n",
				"66" , "\n",// color index 
				"3" , "\n",
				// Vertex 1
				'0', '\n',
				'VERTEX', '\n', 
				'8', '\n',
				'0', '\n', 
				'10', '\n', 
				l[i], '\n', 
				'20', '\n', 
				l[i+1], '\n',

				// Vertex 2
				'0', '\n',
				'VERTEX', '\n', 
				'8', '\n',
				'0', '\n', 
				'10', '\n', 
				l[i+2], '\n', 
				'20', '\n', 
				l[i+3], '\n',

				// Polyline end
				"0", "\n",
				"SEQEND","\n");
		}

	}
		

		
	// DXF end
	s.push("0","\n");
	s.push("ENDSEC","\n");
	s.push("0","\n");
	s.push("EOF","\n");

	return s;

} // function 