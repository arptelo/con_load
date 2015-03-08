var scene;
var camera;
var renderer;
var controls;

var setScene = function() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, 600/300, 0.1, 5000 );
	var container = document.getElementById("container3js");
	renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
	renderer.setSize( 600, 300 );
	controls = new THREE.OrbitControls( camera, container );
	controls.damping = 0.2;
	controls.addEventListener( 'change', render );
	container.appendChild( renderer.domElement );
	
	camera.position.x = 680;
	camera.position.y = 120;
	camera.position.z = 400;
	var skyboxGeometry = new THREE.BoxGeometry(15000, 15000, 15000);
	var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
	var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
	scene.add(skybox);
	var pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(700, -600, -700);
	scene.add(pointLight);
	pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(-700, 600, 700);
	scene.add(pointLight);
	renderer.render(scene, camera);
};

var drawCube = function(w ,d, h, x, z, y, color, opacity, texture){
	texture = texture || "noTexture";
	var geometry = new THREE.BoxGeometry(w, h, d);
	for ( var i = 0; i < geometry.faces.length; i ++ ) {
		geometry.faces[ i ].color.set(color);
	}

	var material = new THREE.MeshLambertMaterial( { transparent: true, opacity: opacity, vertexColors: THREE.FaceColors } );
	
	var cube = new THREE.Mesh( geometry, material );
	cube.position.x = x+(w/2);
	cube.position.y = y+(h/2);
	cube.position.z = z+(d/2);
	cube.matrixAutoUpdate = false;
	cube.updateMatrix();
	return cube;
};

var render = function() {
	renderer.render( scene, camera );
};

var drawGrid = function(x1, z1, x2, z2){
	var minx, maxx, minz, maxz;
	var step = 20;
	maxx = Math.max(x1, x2);
	minx = Math.min(x1, x2);
	maxz = Math.max(z1, z2);
	minz = Math.min(z1, z2);
	var geometry = new THREE.Geometry();
	for (var i = minx; i <= maxx; i += step) {
		geometry.vertices.push( new THREE.Vector3( i, 0, z1 ) );
		geometry.vertices.push( new THREE.Vector3( i, 0, z2 ) );
	}
	for (var i = minz; i <= maxz; i += step) {
		geometry.vertices.push( new THREE.Vector3( x1, 0, i ) );
		geometry.vertices.push( new THREE.Vector3( x2, 0, i ) );
	}
	var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );
	var line = new THREE.Line( geometry, material );
	line.type = THREE.LinePieces;
	return line;
};