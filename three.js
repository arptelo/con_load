var scene;
var camera;
var renderer;

function setScene() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, 600 / 600, 0.1, 1000 );
	var container = document.getElementById("container3js");
	renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setSize( 600, 600 );
	container.appendChild( renderer.domElement );
	
	camera.position.x = 680;
	camera.position.y = 120;
	camera.position.z = 400;
	var skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
	var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
	var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
	scene.add(skybox);
	var pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(700, 300, 200);
	
	scene.add(pointLight);
	renderer.render(scene, camera);
	
	container.addEventListener( 'mousewheel', mousewheel, false );
    container.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox
}

function drawCube(w ,h, d, x, y, z, color, texture){
	texture = texture || "noTexture";
	var geometry = new THREE.BoxGeometry( w, h, d );
	for ( var i = 0; i < geometry.faces.length; i ++ ) {
		geometry.faces[ i ].color.setHex( color );
	}

	var material = new THREE.MeshLambertMaterial( { vertexColors: THREE.FaceColors } );
	
	var cube = new THREE.Mesh( geometry, material );
	cube.position.x = x;
	cube.position.y = y;
	cube.position.z = z;
	cube.matrixAutoUpdate = false;
	cube.updateMatrix();
	return cube;
}

var mousewheel  = function (e) {
    e.preventDefault();
    var d = ((typeof e.wheelDelta != "undefined")?(-e.wheelDelta):e.detail);
    d = 100 * ((d>0)?1:-1);
    var cPos = camera.position;
    if (isNaN(cPos.x) || isNaN(cPos.y) || isNaN(cPos.y)) return;

    // Your zomm limitation
    // For X axe you can add anothers limits for Y / Z axes
    if ((cPos.x > 1500 && d>0) || (cPos.x < 200 && d<0)){
        return ;
    }

    var mb = d>0 ? 1.1 : 0.9;
    camera.position.x = cPos.x * mb;
    camera.position.y = cPos.y * mb;
    camera.position.z = cPos.z * mb;
    renderer.render( scene, camera );
};