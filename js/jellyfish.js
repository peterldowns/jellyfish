

setupScene();

function setupScene() { 

    //************SETUP SCENE****************

    var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

    // Create the scene and set the scene size. 
    scene = new THREE.Scene();

    // Create a renderer and add it to the DOM = Direct Object Model.
    renderer = new THREE.WebGLRenderer({ alpha: true , antialias:true});
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);
    // Set the background color of the scene.
    renderer.setClearColor( 0xffffff, 0);

    // Create a camera make it look at the scene.
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    //camera.position.set(0,6,0);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 200;
    // camera.lookAt(new THREE.Vector3(10, 0, 0));
    camera.lookAt(scene.position);
    scene.add(camera); 

    // Create an event listener that resizes the renderer with the browser window.
    window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });

    //spotlight
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-100, 100, -100);
    spotLight.castShadow = true;
    scene.add(spotLight);
    //ambient light 
    scene.add(new THREE.AmbientLight(0x666666));

    //build axes 
    var l = 10;
    axes = buildAxes(l);
    scene.add(axes);

    //mouse controls 
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //GUI
    //addDatGui();

}

draw_cut_lines();

function draw_cut_lines(){

    a = 15;
    b = 6;
    gamma = 60*Math.PI/180;//must be greater than 45!
    t = (a-b)/(2*Math.cos(gamma)); //hypotenuse 
    h = 2*t*Math.sin(gamma) + a + b; //height/width of unit cell 
    n = 1; //nxn array of points (of 4x4 small cells)

    inc = [a,t*Math.sin(gamma),b,t*Math.cos(gamma)];

        // col 1
    base_coords=[
        0,0,
        0,inc[0],
        inc[3],inc[0]+inc[1],
        inc[3],inc[0]+inc[1]+inc[2],
        //col 2
 //   base_coords_2 = [
        inc[2]+inc[3],inc[0]+inc[1]+inc[2],
        inc[2]+inc[3],inc[0]+inc[1],
        inc[0],inc[0],
        inc[0],0,
        
        //col 3
//    base_coords_3 = [
        inc[0]+inc[1],inc[3],
        inc[0]+inc[1],inc[2]+inc[3],
        inc[0]+inc[1]-inc[3],inc[1]+inc[2]+inc[3],
        inc[0]+inc[1]-inc[3],inc[0]+inc[1]+inc[2]+inc[3],
        // col 4
  //  base_coords_4 = [
        inc[0]+inc[1]-inc[3]+inc[0],inc[0]+inc[1]+inc[2]+inc[3],
        inc[0]+inc[1]-inc[3]+inc[0],inc[1]+inc[2]+inc[3],
        inc[0]+inc[1]+inc[2],inc[2]+inc[3],
        inc[0]+inc[1]+inc[2],inc[3]];
    //need to connect all horizontals and all vertical lines together 
    // --> this is an indexing problem 

    len = base_coords.length;
    var foldmap = new THREE.Geometry();    
    for(var i = 0; i < n; i++) {  
        for(k=0; k<n; k++){
            for(var j=0; j < base_coords.length; j+=2){
                foldmap.vertices.push(new THREE.Vector3(h*k + base_coords[j], h*i + base_coords[j+1],0));
            }     
        }   
    }

    var foldmap_odd = new THREE.Geometry(); 
    j = 1
        for(k = 1; k < foldmap.vertices.length - 1; k++){
             if (k == 16*n*j) {              
                foldmap_odd.vertices.push(foldmap.vertices[k-1])                
                foldmap_odd.vertices.push(foldmap.vertices[k])  
                j += 1;
                k-=1;              
             }
             else {
                foldmap_odd.vertices.push(foldmap.vertices[k])
                }                             
        }


//for line pieces, add two vertices at a time for desired lines 
    var foldmap_horiz = new THREE.Geometry();
    for(k = 0; k < foldmap.vertices.length - 7; k+=8){
        foldmap_horiz.vertices.push(foldmap.vertices[k])
        foldmap_horiz.vertices.push(foldmap.vertices[k+7])
        //
        foldmap_horiz.vertices.push(foldmap.vertices[k+1])
        foldmap_horiz.vertices.push(foldmap.vertices[k+6])
        //
        foldmap_horiz.vertices.push(foldmap.vertices[k+2])
        foldmap_horiz.vertices.push(foldmap.vertices[k+5])
        //
        foldmap_horiz.vertices.push(foldmap.vertices[k+3])
        foldmap_horiz.vertices.push(foldmap.vertices[k+4])
    }
    
    var foldmap_trap = new THREE.Geometry();
    for(k = 4; k < foldmap.vertices.length - 11; k+=8){
        if(foldmap.vertices[k].x > foldmap.vertices[k+4].x){ //up to next row 
            foldmap_trap.vertices.push(foldmap.vertices[k])                
            foldmap_trap.vertices.push(foldmap.vertices[k])                
        }
        else{
        foldmap_trap.vertices.push(foldmap.vertices[k])
        foldmap_trap.vertices.push(foldmap.vertices[k+7])
        //            
        foldmap_trap.vertices.push(foldmap.vertices[k+1])
        foldmap_trap.vertices.push(foldmap.vertices[k+6])
        //            
        foldmap_trap.vertices.push(foldmap.vertices[k+2])
        foldmap_trap.vertices.push(foldmap.vertices[k+5])
        //            
        foldmap_trap.vertices.push(foldmap.vertices[k+3])
        foldmap_trap.vertices.push(foldmap.vertices[k+4])
        
        }
    }

    var foldmap_trap_vert = new THREE.Geometry();
    for(k = 1;k<foldmap.vertices.length - 5; k+=8){
        foldmap_trap_vert.vertices.push(foldmap.vertices[k])
        foldmap_trap_vert.vertices.push(foldmap.vertices[k+1])
        //
        if (k < 16*n*(n-1)){
        foldmap_trap_vert.vertices.push(foldmap.vertices[k+2])
        foldmap_trap_vert.vertices.push(foldmap.vertices[k+16*n - 1])
        //
        foldmap_trap_vert.vertices.push(foldmap.vertices[k+3])
        foldmap_trap_vert.vertices.push(foldmap.vertices[k+16*n + 7 - 1])
    }
        //
        foldmap_trap_vert.vertices.push(foldmap.vertices[k+4])
        foldmap_trap_vert.vertices.push(foldmap.vertices[k+5])
    }

    material = new THREE.LineBasicMaterial({
                //size: .5,
                color: 0x997799
            });

    points = new THREE.Line(foldmap, material,THREE.LinePieces);
    points_horiz = new THREE.Line(foldmap_horiz, material, THREE.LinePieces);
    points_trap = new THREE.Line(foldmap_trap, material, THREE.LinePieces);
    points_trap_vert = new THREE.Line(foldmap_trap_vert, material, THREE.LinePieces);
    scene.add(points); // square sides (list of vector pairs (x1,y1,z1),(x2,y2,z2))
    scene.add(points_horiz); // square top/bottom 
    scene.add(points_trap);
    scene.add(points_trap_vert);

    //put all points in a long 1D list for output

coords = [];
    length = points.geometry.vertices.length //all the points 
    for (var i=0; i<length;i++){
        coords.push(points.geometry.vertices[i].x);
        coords.push(points.geometry.vertices[i].y);
    }
    for (var i=0; i<points_horiz.geometry.vertices.length;i++){
        coords.push(points_horiz.geometry.vertices[i].x);
        coords.push(points_horiz.geometry.vertices[i].y);
    }  
    for (var i=0; i<points_trap.geometry.vertices.length;i++){
        coords.push(points_trap.geometry.vertices[i].x);
        coords.push(points_trap.geometry.vertices[i].y);
    }
    for (var i=0; i<points_trap_vert.geometry.vertices.length;i++){
        coords.push(points_trap_vert.geometry.vertices[i].x);
        coords.push(points_trap_vert.geometry.vertices[i].y);
    }
    

    var blobparts = ccl2dxf(coords,0,20,0,20);
    var blob = new Blob(blobparts, {type: "text/plain"});
    saveAs(blob, "kiri.dxf");

}

animateScene();

function animateScene() {
    points.geometry.verticesNeedUpdate = true; // ask for an update
    controls.update();
    renderScene();
    requestAnimationFrame(animateScene);
}

function renderScene() {
    renderer.render( scene, camera );
}
