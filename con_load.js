var box_array = [];
var copy_box_array = [];
var space_array = [];
var loaded_boxes = [];
//var itera = 0;

$(document).ready(function(){
	$("#add-cargo").click(function(){
		createBox();
		setScene();
	});
});

function setScene() {
	var container = document.getElementById( 'container3js' );
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( 600, 600 );
	container.appendChild( renderer.domElement );
}

function sendPoints(arg){
	window.location = 'skp:create_face@' + arg;
}

function init_box_set(){
	var isim = [];
	var en = [];
	var boy = [];
	var yukseklik = [];
	var adet = [];
	var dik = document.getElementById("dik");
	var box1;
	isim = ["a","b","c","d","e","f"];
	en = [26,31,22,26,21,31];
	boy = [51,43,32,51,41,43];
	yukseklik = [15,17,30,15,24,17];
	adet = [47,360,485,69,248,129];
	for(var j=0;j<6;j++){
		var yeni_kutu_satiri = [isim[j],en[j],boy[j],yukseklik[j],adet[j]];
		var table = document.getElementById("all_boxes");
		var row = table.insertRow(table.rows.length);
		for(var i=0;i<5;i++){
			var cell = row.insertCell(i);
			cell.innerHTML = yeni_kutu_satiri[i];
		}
		if(dik.checked === true){
			cell = row.insertCell(i);
			cell.innerHTML = "Evet";
			box1 = new box(isim[j],boy[j],en[j],yukseklik[j],adet[j],true,true,false,false,false,false);
			box_array.push(box1);
		} else {
			cell = row.insertCell(i);
			cell.innerHTML = "Hayır";
			box1 = new box(isim[j],boy[j],en[j],yukseklik[j],adet[j],true,true,true,true,true,true);
			box_array.push(box1);
		}
	}
}

function createBox(){
	var isim = document.getElementById("name").value;
	var en = parseFloat(document.getElementById("en").value);
	var boy = parseFloat(document.getElementById("boy").value);
	var yukseklik = parseFloat(document.getElementById("yukseklik").value);
	var adet = parseInt(document.getElementById("adet").value, 10);
	var dik = document.getElementById("dik");
	var box1;
	var yeni_kutu_satiri = [isim,en,boy,yukseklik,adet];
	var table = document.getElementById("all_boxes");
	var row = table.insertRow(table.rows.length);
	for(var i=0;i<5;i++){
		var cell = row.insertCell(i);
		cell.innerHTML = yeni_kutu_satiri[i];
	}
	if(dik.checked === true){
		cell = row.insertCell(i);
		cell.innerHTML = "Yes";
		box1 = new box(isim,boy,en,yukseklik,adet,true,true,false,false,false,false);
		box_array.push(box1);
	} else {
		cell = row.insertCell(i);
		cell.innerHTML = "No";
		box1 = new box(isim,boy,en,yukseklik,adet,true,true,true,true,true,true);
		box_array.push(box1);
	}
}

function check_space_usability(box_list, single_space){
	var is_space_usable = false;
	for (var i=0;i<box_list.length;i++){
		for (var key in box_list[i].orientation){
			if(box_list[i].orientation[key].pos===true && box_list[i].orientation[key].x<=single_space.dim.x && box_list[i].orientation[key].y<=single_space.dim.y && box_list[i].orientation[key].z<=single_space.dim.z){
				is_space_usable = true;
			}
		}
	}
	if(is_space_usable === true){
		return "usable";
	} else {
		return "unusable";
	}
}

function loadBoxes(){
	var usabili;
	for(var i=0; i<box_array.length; i++){
		copy_box_array[i] = box_array[i];
	}
	var space1 = new space(0,0,0,1360,240,300);
	var space_element = {
		empty_space: space1,
		usability: "usable"
	};
	space_array.push(space_element);
	var number_of_usable_spaces = 1;
	while(number_of_usable_spaces !== 0 && box_array.length !== 0){
		number_of_usable_spaces = 0;
		var a = eval1(box_array, space_array[0].empty_space);
		a = eval2(a, space_array[0].empty_space);
		a = eval3(a, space_array[0].empty_space);
		a = eval4(a, space_array[0].empty_space);
		var b = {};
		b.loaded_box = a[0];
		b.loading_point = {};
		b.loading_point.x = space_array[0].empty_space.origin.x;
		b.loading_point.y = space_array[0].empty_space.origin.y;
		b.loading_point.z = space_array[0].empty_space.origin.z;
		loaded_boxes.push(b);
		for(i=0;i<box_array.length;i++){
			var exit_for = 0;
			for (var key in box_array[i].orientation){
				if(exit_for === 0 && b.loaded_box.name==box_array[i].name && b.loaded_box.dim.x % box_array[i].orientation[key].x === 0 && b.loaded_box.dim.y % box_array[i].orientation[key].y === 0 && b.loaded_box.dim.z % box_array[i].orientation[key].z === 0){
					var box_number = (b.loaded_box.dim.x/box_array[i].orientation[key].x)*(b.loaded_box.dim.y/box_array[i].orientation[key].y)*(b.loaded_box.dim.z/box_array[i].orientation[key].z);
					if(box_array[i].quantity - box_number === 0){
						box_array.splice(i,1);
					} else {
						box_array[i].quantity = box_array[i].quantity-box_number;
					}
					exit_for = 1;
				}
			}
		}
		if(b.loaded_box.dim.x !== 0 && space_array[0].empty_space.dim.y-b.loaded_box.dim.y !== 0 && space_array[0].empty_space.dim.z !== 0){
			var space_side = new space(space_array[0].empty_space.origin.x,space_array[0].empty_space.origin.y+b.loaded_box.dim.y,space_array[0].empty_space.origin.z,b.loaded_box.dim.x,space_array[0].empty_space.dim.y-b.loaded_box.dim.y,space_array[0].empty_space.dim.z);
			usabili = check_space_usability(box_array,space_side);
			setSpaceElement(space_side,usabili);
		}
		if(space_array[0].empty_space.dim.x-b.loaded_box.dim.x !== 0 && space_array[0].empty_space.dim.y !== 0 && space_array[0].empty_space.dim.z !== 0){
			var space_front = new space(space_array[0].empty_space.origin.x+b.loaded_box.dim.x,space_array[0].empty_space.origin.y,space_array[0].empty_space.origin.z,space_array[0].empty_space.dim.x-b.loaded_box.dim.x,space_array[0].empty_space.dim.y,space_array[0].empty_space.dim.z);
			usabili = check_space_usability(box_array,space_front);
			setSpaceElement(space_front,usabili);
		}
		if(b.loaded_box.dim.x !== 0 && b.loaded_box.dim.y !== 0 && space_array[0].empty_space.dim.z-b.loaded_box.dim.z !== 0){
			var space_overhead = new space(space_array[0].empty_space.origin.x,space_array[0].empty_space.origin.y,space_array[0].empty_space.origin.z+b.loaded_box.dim.z,b.loaded_box.dim.x,b.loaded_box.dim.y,space_array[0].empty_space.dim.z-b.loaded_box.dim.z);
			usabili = check_space_usability(box_array,space_overhead);
			setSpaceElement(space_overhead,usabili);
		}
//		var dtw=document.getElementById("write");
//		dtw.innerHTML = dtw.innerHTML + "iter: " + itera + " Silinen:  " + " " + space_array[0].empty_space.origin.x + " " + space_array[0].empty_space.origin.y + " " + space_array[0].empty_space.origin.z + " " + space_array[0].empty_space.dim.x + " " + space_array[0].empty_space.dim.y + " " + space_array[0].empty_space.dim.z + "<br>";
		space_array.splice(0,1);
		for(var j=0;j<space_array.length;j++){
			space_array[j].usability=check_space_usability(box_array,space_array[j].empty_space);
		}
		space_array = merge_spaces(space_array);
		var min_distance_to_origin = 10000;
		for(i=0;i<space_array.length;i++){
			if(space_array[i].usability=="usable" && Math.sqrt(Math.pow(space_array[i].empty_space.origin.x,2)+Math.pow(space_array[i].empty_space.origin.y,2)+Math.pow(space_array[i].empty_space.origin.z,2))<min_distance_to_origin){
				min_distance_to_origin = Math.sqrt(Math.pow(space_array[i].empty_space.origin.x,2)+Math.pow(space_array[i].empty_space.origin.y,2)+Math.pow(space_array[i].empty_space.origin.z,2));
			}
			if(space_array[i].usability=="usable"){
				number_of_usable_spaces=number_of_usable_spaces+1;
			}
		}
		for(i=0;i<space_array.length;i++){
			if(space_array[i].usability=="usable" && Math.sqrt(Math.pow(space_array[i].empty_space.origin.x,2)+Math.pow(space_array[i].empty_space.origin.y,2)+Math.pow(space_array[i].empty_space.origin.z,2))==min_distance_to_origin){
				var temp = space_array[i]
				space_array[i] = space_array[0];
				space_array[0] = temp;
			}
		}
//		itera=itera+1;
	}
	var empty_volume=0;
	for(i=0;i<space_array.length;i++){
		empty_volume = empty_volume + (space_array[i].empty_space.dim.x*space_array[i].empty_space.dim.y*space_array[i].empty_space.dim.z);
	}
	alert(1-(empty_volume/(space1.dim.x*space1.dim.y*space1.dim.z)));
	for(i=0;i<box_array.length;i++){
		alert(box_array[i].quantity);
	}
	encode(loaded_boxes);
}
			
function encode(boxes){
	var encoded_box_set = [];
	for(var j=0;j<boxes.length;j++){
		for(var i=0;i<copy_box_array.length;i++){
			var exit_for = 0;
			if(boxes[j].loaded_box.name == copy_box_array[i].name){
				for (var key in copy_box_array[i].orientation){
					if(exit_for === 0 && boxes[j].loaded_box.dim.x % copy_box_array[i].orientation[key].x === 0 && boxes[j].loaded_box.dim.y % copy_box_array[i].orientation[key].y === 0 && boxes[j].loaded_box.dim.z % copy_box_array[i].orientation[key].z === 0){
						var how_many_through_x = boxes[j].loaded_box.dim.x/copy_box_array[i].orientation[key].x;
						var how_many_through_y = boxes[j].loaded_box.dim.y/copy_box_array[i].orientation[key].y;
						var how_many_through_z = boxes[j].loaded_box.dim.z/copy_box_array[i].orientation[key].z;
						var encoded_box_element;
						for(var l=0;l<how_many_through_x;l++){
							for(var w=0;w<how_many_through_y;w++){
								for(var h=0;h<how_many_through_z;h++){
									encoded_box_element = {};
									encoded_box_element.x = boxes[j].loading_point.x+l*copy_box_array[i].orientation[key].x;
									encoded_box_element.y = boxes[j].loading_point.y+w*copy_box_array[i].orientation[key].y;
									encoded_box_element.z = boxes[j].loading_point.z+h*copy_box_array[i].orientation[key].z;
									encoded_box_element.length = copy_box_array[i].orientation[key].x;
									encoded_box_element.width  = copy_box_array[i].orientation[key].y;
									encoded_box_element.heigth = copy_box_array[i].orientation[key].z;
									encoded_box_element.name   = copy_box_array[i].name;
									encoded_box_set.push(encoded_box_element);
								}
							}
						}
						exit_for = 1;
					}
				}
			}
		}
	}
	for(i=0; i<encoded_box_set.length; i++){
		var arg="";
		arg=encoded_box_set[i].x + "," + encoded_box_set[i].y + "," + encoded_box_set[i].z + "," + encoded_box_set[i].length + "," + encoded_box_set[i].width + "," + encoded_box_set[i].heigth + "," + encoded_box_set[i].name;
		sendPoints(arg);
	}
}

function merge_spaces(spaces){
//	var dtw=document.getElementById("write");
	var set_spaces;
	var checkusability;
	var new_spaces = [];
	for(var l=0;l<spaces.length;l++){
		for(var j=0;j<spaces.length;j++){
			if(l!=j){
				set_spaces = merge_spaces1(spaces[l].empty_space, spaces[j].empty_space);
				if(set_spaces.length>0){
//					dtw.innerHTML = dtw.innerHTML + "iter: " + itera + " Silinen:  " + " " + spaces[l].empty_space.origin.x + " " + spaces[l].empty_space.origin.y + " " + spaces[l].empty_space.origin.z + " " + spaces[l].empty_space.dim.x + " " + spaces[l].empty_space.dim.y + " " + spaces[l].empty_space.dim.z + "<br>";
//					dtw.innerHTML = dtw.innerHTML + "iter: " + itera + " Silinen:  " + " " + spaces[j].empty_space.origin.x + " " + spaces[j].empty_space.origin.y + " " + spaces[j].empty_space.origin.z + " " + spaces[j].empty_space.dim.x + " " + spaces[j].empty_space.dim.y + " " + spaces[j].empty_space.dim.z + "<br>";
					spaces.splice(l,1);
					if(l<j){
						spaces.splice(j-1,1);
					} else {
						spaces.splice(j,1);
					}
					for(var k=0;k<set_spaces.length;k++){
						checkusability = check_space_usability(box_array,set_spaces[k]);
//						dtw.innerHTML = dtw.innerHTML  + "iter: " + itera + " Eklenen:  " + " " + set_spaces[k].origin.x + " " + set_spaces[k].origin.y + " " + set_spaces[k].origin.z + " " + set_spaces[k].dim.x + " " + set_spaces[k].dim.y + " " + set_spaces[k].dim.z + "<br>";
						spaces[spaces.length] = new spaceelement(set_spaces[k],checkusability);
					}
					l=0;
					j=0;
				}
			}
		}
	}
	var set_spaces2;
	for(l=0;l<spaces.length;l++){
		for(j=0;j<spaces.length;j++){
			if(l!=j && spaces[l].usability=="unusable" && spaces[j].usability=="unusable"){
				set_spaces2 = merge_spaces2(spaces[l].empty_space, spaces[j].empty_space);
				for(var iter=0;iter<set_spaces2.length;iter++){
					if(set_spaces2[iter].dim.x === 0 || set_spaces2[iter].dim.y === 0 || set_spaces2[iter].dim.z === 0){
						set_spaces2.splice(iter,1);
					}
				}
				if(set_spaces2.length>0){
//					var dtw=document.getElementById("write");
//					dtw.innerHTML = dtw.innerHTML + "iter: " + itera  + " Silinen:  " + " " + spaces[l].empty_space.origin.x + " " + spaces[l].empty_space.origin.y + " " + spaces[l].empty_space.origin.z + " " + spaces[l].empty_space.dim.x + " " + spaces[l].empty_space.dim.y + " " + spaces[l].empty_space.dim.z + "<br>";
//					dtw.innerHTML = dtw.innerHTML + "iter: " + itera  + " Silinen:  " + " " + spaces[j].empty_space.origin.x + " " + spaces[j].empty_space.origin.y + " " + spaces[j].empty_space.origin.z + " " + spaces[j].empty_space.dim.x + " " + spaces[j].empty_space.dim.y + " " + spaces[j].empty_space.dim.z + "<br>";
					spaces.splice(l,1);
					if(l<j){
						spaces.splice(j-1,1);
					} else {
						spaces.splice(j,1);
					}
					for(k=0;k<set_spaces2.length;k++){
						checkusability = check_space_usability(box_array,set_spaces2[k]);
//						dtw.innerHTML = dtw.innerHTML + "iter: " + itera  + " Eklenen:  " + " " + set_spaces2[k].origin.x + " " + set_spaces2[k].origin.y + " " + set_spaces2[k].origin.z + " " + set_spaces2[k].dim.x + " " + set_spaces2[k].dim.y + " " + set_spaces2[k].dim.z + "<br>";
						new_spaces[new_spaces.length] = new spaceelement(set_spaces2[k],checkusability);
					}
					l=0;
					j=0;
				}
			}
		}
	}
	for(var i=0;i<new_spaces.length;i++){
		spaces.push(new_spaces[i]);
	}
	return spaces;
}

function merge_spaces1(space1,space2){
	var returned_spaces = [];
	var merged_space;
	if(space1.origin.z==space2.origin.z){
		if(space1.origin.x+space1.dim.x==space2.origin.x && space1.origin.y==space2.origin.y && space1.dim.y==space2.dim.y){
			merged_space = new space(space1.origin.x,space1.origin.y,space1.origin.z,space1.dim.x+space2.dim.x,space1.dim.y,space1.dim.z);
			returned_spaces.push(merged_space);
		} else if(space1.origin.x==space2.origin.x && space1.origin.y+space1.dim.y==space2.origin.y && space1.dim.x==space2.dim.x){
			merged_space = new space(space1.origin.x,space1.origin.y,space1.origin.z,space1.dim.x,space1.dim.y+space2.dim.y,space1.dim.z);
			returned_spaces.push(merged_space);
		}
	}
	return returned_spaces;
}

function merge_spaces2(space1, space2){
	var returned_spaces = [];
	var merged_space1;
	var merged_space2;
	var merged_space3;
	if(space1.origin.z == space2.origin.z){
		if(space1.origin.x+space1.dim.x == space2.origin.x){
			if(Math.max(space1.origin.y,space2.origin.y) == space1.origin.y && space2.dim.y + space2.origin.y > space1.origin.y){
				merged_space1 = new space(space2.origin.x,space2.origin.y,space2.origin.z,space2.dim.x,space1.origin.y-space2.origin.y,space2.dim.z);
				returned_spaces.push(merged_space1);
				if(Math.min(space1.origin.y+space1.dim.y,space2.origin.y+space2.dim.y) == space1.origin.y+space1.dim.y){
					merged_space2 = new space(space1.origin.x,space1.origin.y,space1.origin.z,space1.dim.x+space2.dim.x,space1.dim.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new space(space2.origin.x,space1.origin.y+space1.dim.y,space1.origin.z,space2.dim.x,(space2.dim.y+space2.origin.y)-(space1.origin.y+space1.dim.y),space1.dim.z);
					returned_spaces.push(merged_space3);
				} else {
					merged_space2 = new space(space1.origin.x,space1.origin.y,space1.origin.z,space1.dim.x+space2.dim.x,space2.origin.y+space2.dim.y-space1.origin.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new space(space1.origin.x,space2.origin.y+space2.dim.y,space1.origin.z,space1.dim.x,(space1.origin.y+space1.dim.y)-(space2.origin.y+space2.dim.y),space1.dim.z);
					returned_spaces.push(merged_space3);
				}
			} else if(Math.max(space1.origin.y,space2.origin.y) == space2.origin.y && space1.dim.y + space1.origin.y >= space2.origin.y){
				merged_space1 = new space(space1.origin.x,space1.origin.y,space1.origin.z,space1.dim.x,space2.origin.y-space1.origin.y,space1.dim.z);
				returned_spaces.push(merged_space1);
				if(Math.min(space1.origin.y+space1.dim.y,space2.origin.y+space2.dim.y) == space1.origin.y+space1.dim.y){
					merged_space2 = new space(space1.origin.x,space2.origin.y,space1.origin.z,space1.dim.x+space2.dim.x,space1.origin.y+space1.dim.y-space2.origin.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new space(space2.origin.x,space1.origin.y+space1.dim.y,space1.origin.z,space2.dim.x,space2.origin.y+space2.dim.y-(space1.origin.y+space1.dim.y),space1.dim.z);
					returned_spaces.push(merged_space3);
				} else {
					merged_space2 = new space(space1.origin.x,space2.origin.y,space1.origin.z,space1.dim.x+space2.dim.x,space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new space(space1.origin.x,space2.origin.y+space2.dim.y,space1.origin.z,space1.dim.x,(space1.origin.y+space1.dim.y)-(space2.origin.y+space2.dim.y),space1.dim.z);
					returned_spaces.push(merged_space3);
				}
			}
		} else if(space1.origin.y+space1.dim.y == space2.origin.y){
			if(Math.max(space1.origin.x,space2.origin.x) == space1.origin.x && space1.origin.x < space2.origin.x + space2.dim.x){
				merged_space1 = new space(space2.origin.x,space2.origin.y,space2.origin.z,space1.origin.x-space2.origin.x,space2.dim.y,space2.dim.z);
				returned_spaces.push(merged_space1);
				if(Math.min(space1.origin.x+space1.dim.x,space2.origin.x+space2.dim.x) == space1.origin.x+space1.dim.x){
					merged_space2 = new space(space1.origin.x,space1.origin.y,space1.origin.z,space1.dim.x,space1.dim.y+space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new space(space1.dim.x+space1.origin.x,space2.origin.y,space1.origin.z,space2.origin.x+space2.dim.x-(space1.dim.x+space1.origin.x),space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space3);
				} else {
					merged_space2 = new space(space1.origin.x,space1.origin.y,space1.origin.z,space2.origin.x+space2.dim.x-space1.origin.x,space1.dim.y+space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new space(space2.origin.x+space2.dim.x,space1.origin.y,space1.origin.z,space1.dim.x+space1.origin.x-(space2.dim.x+space2.origin.x),space1.dim.y,space1.dim.z);
					returned_spaces.push(merged_space3);
				}
			} else if(Math.max(space1.origin.x,space2.origin.x) == space2.origin.x && space2.origin.x < space1.origin.x + space1.dim.x){
				merged_space1 = new space(space1.origin.x,space1.origin.y,space1.origin.z,space2.origin.x-space1.origin.x,space1.dim.y,space1.dim.z);
				returned_spaces.push(merged_space1);
				if(Math.min(space1.origin.x+space1.dim.x,space2.origin.x+space2.dim.x) == space1.origin.x+space1.dim.x){
					merged_space2 = new space(space2.origin.x,space1.origin.y,space1.origin.z,space1.dim.x+space1.origin.x-space2.origin.x,space1.dim.y+space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new space(space1.origin.x+space1.dim.x,space2.origin.y,space1.origin.z,space2.dim.x+space2.origin.x-(space1.dim.x+space1.origin.x),space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space3);
				} else {
					merged_space2 = new space(space2.origin.x,space1.origin.y,space1.origin.z,space2.dim.x,space1.dim.y+space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new space(space2.dim.x+space2.origin.x,space1.origin.y,space1.origin.z,space2.dim.x,space1.dim.y+space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space3);
				}
			}
		}
	}
	return returned_spaces;
}

function box(name,l,w,h,q,xyz,yxz,xzy,zxy,zyx,yzx){
	this.name=name;
	this.dim = {};
	this.dim.x=l;
	this.dim.y=w;
	this.dim.z=h;
	this.quantity=q;
	this.orientation = {};
	this.orientation.first = {};
	this.orientation.first.name="first";
	this.orientation.first.pos=xyz;
	this.orientation.first.x=l;
	this.orientation.first.y=w;
	this.orientation.first.z=h;
	this.orientation.second = {};
	this.orientation.second.name="second";
	this.orientation.second.pos=yxz;
	this.orientation.second.x=w;
	this.orientation.second.y=l;
	this.orientation.second.z=h;
	this.orientation.third = {};
	this.orientation.third.name="third";
	this.orientation.third.pos=xzy;
	this.orientation.third.x=l;
	this.orientation.third.y=h;
	this.orientation.third.z=w;
	this.orientation.fourth = {};
	this.orientation.fourth.name="fourth";
	this.orientation.fourth.pos=zxy;
	this.orientation.fourth.x=h;
	this.orientation.fourth.y=l;
	this.orientation.fourth.z=w;
	this.orientation.fifth = {};
	this.orientation.fifth.name="fifth";
	this.orientation.fifth.pos=zyx;
	this.orientation.fifth.x=h;
	this.orientation.fifth.y=w;
	this.orientation.fifth.z=l;
	this.orientation.sixth ={};
	this.orientation.sixth.name="sixth";
	this.orientation.sixth.pos=yzx;
	this.orientation.sixth.x=w;
	this.orientation.sixth.y=h;
	this.orientation.sixth.z=l;
}

function space(x,y,z,l,w,h){
	this.origin = {};
	this.origin.x=x;
	this.origin.y=y;
	this.origin.z=z;
	this.dim = {};
	this.dim.x=l;
	this.dim.y=w;
	this.dim.z=h;
}

function spaceelement(spac, usab){
	this.empty_space = spac;
	this.usability = usab;
}

function setSpaceElement(spa, usa){
    space_array[space_array.length] = new spaceelement(spa, usa);
//	var dtw=document.getElementById("write");
//	dtw.innerHTML = dtw.innerHTML  + "iter: " + itera + " Eklenen:  " + " " + spa.origin.x + " " + spa.origin.y + " " + spa.origin.z + " " + spa.dim.x + " " + spa.dim.y + " " + spa.dim.z + "<br>";
}

function best_ory(box,orientation,direction,rest_value,x,y,z,q){
	this.name=box;
	this.orientation=orientation;
	this.direction=direction;
	this.value=rest_value;
	this.new_x=x;
	this.new_y=y;
	this.new_z=z;
	this.quantity=q;
}

function eval1(boxes, space){
	var returned_boxes_set = [];
	var min_len_of_boxes = [];
	var possible_box;
	var x_value;
	var y_value;
	var z_value;
	var qua_of_boxes;
	var min;
	for (var i=0; i<boxes.length; i++){
		for (var key in boxes[i].orientation){
			var ory = boxes[i].orientation[key];
			if (ory.pos === true && space.dim.x >= ory.x && space.dim.y >= ory.y && space.dim.z >= ory.z){
				var emp_len_x = space.dim.x - Math.min(boxes[i].quantity, Math.floor(space.dim.x/ory.x))*ory.x;
				var emp_len_y = space.dim.y - Math.min(boxes[i].quantity, Math.floor(space.dim.y/ory.y))*ory.y;
				var emp_len_z = space.dim.z - Math.min(boxes[i].quantity, Math.floor(space.dim.z/ory.z))*ory.z;
				min = Math.min(emp_len_x, emp_len_y, emp_len_z);
				if (min == emp_len_x){
					possible_box = new best_ory(boxes[i].name, ory.name, "x", min, ory.x, ory.y, ory.z, boxes[i].quantity);
					min_len_of_boxes.push(possible_box);
				}
				if (min == emp_len_y){
					possible_box = new best_ory(boxes[i].name, ory.name, "y", min, ory.x, ory.y, ory.z, boxes[i].quantity);
					min_len_of_boxes.push(possible_box);
				}
				if (min == emp_len_z){
					possible_box = new best_ory(boxes[i].name, ory.name, "z", min, ory.x, ory.y, ory.z, boxes[i].quantity);
					min_len_of_boxes.push(possible_box);
				}
			}
		}
	}
	min = 1000000;
	for (i=0; i<min_len_of_boxes.length; i++){
		if (min_len_of_boxes[i].value < min){
			min = min_len_of_boxes[i].value;
		}
	}
	for (i=0; i<min_len_of_boxes.length; i++){
		var can_box = min_len_of_boxes[i];
		if (can_box.value == min){
			if (can_box.direction == "x"){
				x_value = space.dim.x - can_box.value;
				y_value = can_box.new_y;
				z_value = can_box.new_z;
				qua_of_boxes = x_value / can_box.new_x;
			} else if (can_box.direction == "y"){
				x_value = can_box.new_x;
				y_value = space.dim.y - can_box.value;
				z_value = can_box.new_z;
				qua_of_boxes = y_value / can_box.new_y;
			} else {
				x_value = can_box.new_x;
				y_value = can_box.new_y;
				z_value = space.dim.z - can_box.value;
				qua_of_boxes = z_value / can_box.new_z;
			}
			var min_box = new box(can_box.name, x_value, y_value, z_value, Math.max(Math.floor(can_box.quantity/qua_of_boxes),1), true, false, false, false, false, false);
			returned_boxes_set.push(min_box);
		}
	}
	return returned_boxes_set;
}

function eval2(boxes,space) {
	var returned_boxes_set = [];
	var possible_boxes_set = [];
	for (var j=0;j<boxes.length;j++){
		var boxs=boxes[j];
		for (var key in boxes[j].orientation){
			var ory=boxes[j].orientation[key];
			if (ory.pos === true){
				var max_box_along_w = Math.floor(space.dim.y/ory.y);
				var max_box_along_h = Math.floor(space.dim.z/ory.z);
				var box_amount = boxs.quantity;
				var exit = 0;
				while (box_amount >= 1 && exit === 0){
					var i = 1;
					while (i <= max_box_along_w && exit === 0){
						if (box_amount/i<=max_box_along_h && box_amount/i == Math.floor(box_amount/i)){
							var new_box = new box(boxs.name,ory.x,i*ory.y,(box_amount/i)*ory.z,Math.max(Math.floor(boxs.quantity/box_amount),1),true,false,false,false,false,false);
							possible_boxes_set.push(new_box);
							exit = 1;
						}
						i = i+1;
					}
					box_amount = box_amount-1;
				}
			}
		}
	}
	var max_area = 0;
	for (j=0;j<possible_boxes_set.length;j++){
		boxs=possible_boxes_set[j];
		if (boxs.dim.y*boxs.dim.z>max_area){
			max_area = boxs.dim.y*boxs.dim.z;
		}
	}
	for (j=0;j<possible_boxes_set.length;j++){
		boxs=possible_boxes_set[j];
		if (boxs.dim.y*boxs.dim.z==max_area){
			returned_boxes_set.push(boxs);
		}
	}
	return returned_boxes_set;
}

function eval3(boxes,space) {
	var returned_boxes_set = [];
	var possible_boxes_set = [];
	for (var j=0;j<boxes.length;j++){
		var boxs=boxes[j];
		for (var key in boxes[j].orientation){
			var ory=boxes[j].orientation[key];
			if (ory.pos === true){
				var max_box_along_l = Math.floor(space.dim.x/ory.x);
				var max_box_along_h = Math.floor(space.dim.z/ory.z);
				var box_amount = boxs.quantity;
				var exit = 0;
				while (box_amount >= 1 && exit === 0){
					var i = 1;
					while (i<=max_box_along_l && exit === 0){
						if (box_amount/i<=max_box_along_h && box_amount/i == Math.floor(box_amount/i)){
							var new_box = new box(boxs.name,i*ory.x,ory.y,(box_amount/i)*ory.z,Math.max(Math.floor(boxs.quantity/box_amount),1),true,false,false,false,false,false);
							possible_boxes_set.push(new_box);
							exit = 1;
						}
						i = i+1;
					}
					box_amount = box_amount-1;
				}
			}
		}
	}
	var max_area = 0;
	for (j=0;j<possible_boxes_set.length;j++){
		boxs=possible_boxes_set[j];
		if (boxs.dim.x*boxs.dim.z>max_area){
			max_area = boxs.dim.x*boxs.dim.z;
		}
	}
	for (j=0;j<possible_boxes_set.length;j++){
		boxs=possible_boxes_set[j];
		if (boxs.dim.x*boxs.dim.z==max_area){
			returned_boxes_set.push(boxs);
		}
	}
	return returned_boxes_set;
}

function eval4(boxes,space) {
	var returned_boxes_set = [];
	var possible_boxes_set = [];
	for (var j=0;j<boxes.length;j++){
		var boxs=boxes[j];
		for (var key in boxes[j].orientation){
			var ory=boxes[j].orientation[key];
			if (ory.pos === true){
				var max_box_along_l = Math.floor(space.dim.x/ory.x);
				var max_box_along_w = Math.floor(space.dim.y/ory.y);
				var box_amount = boxs.quantity;
				var exit = 0;
				while (box_amount >= 1 && exit === 0){
					var i = 1;
					while (i<=max_box_along_l && exit === 0){
						if (box_amount/i<=max_box_along_w && box_amount/i == Math.floor(box_amount/i)){
							var new_box = new box(boxs.name,i*ory.x,(box_amount/i)*ory.y,ory.z,Math.max(Math.floor(boxs.quantity/box_amount),1),true,false,false,false,false,false);
							possible_boxes_set.push(new_box);
							exit = 1;
						}
						i = i+1;
					}
					box_amount = box_amount-1;
				}
			}
		}
	}
	var max_area = 0;
	for (j=0;j<possible_boxes_set.length;j++){
		boxs=possible_boxes_set[j];
		if (boxs.dim.x*boxs.dim.y>max_area){
			max_area = boxs.dim.x*boxs.dim.y;
		}
	}
	for (j=0;j<possible_boxes_set.length;j++){
		boxs=possible_boxes_set[j];
		if (boxs.dim.x*boxs.dim.y==max_area){
			returned_boxes_set.push(boxs);
		}
	}
	return returned_boxes_set;
}