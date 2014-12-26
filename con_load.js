var box_array = [],
	callbackResults = [],
	checkpoints = [],
    copy_box_array = [],
    loaded_boxes = [],
    space_array = [],
    map,
    mapOptions = {
		center: {lat: 39.13, lng: 35.4},
		zoom: 5
	},
	mapPin = {
		path: "M24,47c0,0-18-9.417-18-28C6,9.059,14.059,1,24,1s18,8.059,18,18 C42,37.583,24,47,24,47z " +
			"M24,3C15.178,3,8,10.178,8,19c0,14.758,12.462,23.501,16.003,25.687C27.547,42.51,40,33.805,40,19  " + 
			"C40,10.178,32.822,3,24,3z M24,28c-4.971,0-9-4.029-9-9s4.029-9,9-9s9,4.029,9,9S28.971,28,24,28z " + 
			"M24,12c-3.866,0-7,3.134-7,7  s3.134,7,7,7s7-3.134,7-7S27.866,12,24,12z",
		fillOpacity: 0.8,
		scale: 0.5,
		strokeWeight: 2,
		anchor: {x:24, y:48}
	},
	noOfReturnedCallbacks = 0,
	directionsDisplay,
	directionsService = new google.maps.DirectionsService();

$(document).ready(function(){
	setScene();
	map = new google.maps.Map($('#map-canvas')[0], mapOptions);
	directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
	directionsDisplay.setMap(map);
	$("#add-cargo").click(function(e){
		e.preventDefault();
		var marker = new google.maps.Marker({map: map});
		checkpoints.push(new Checkpoint(marker));
		var noCheckpoints = checkpoints.length;
		var $chCon = $('.container.panels');
		$chCon.append($('.checkpointTemplate').html());
		var $chPanel = $chCon.find('.panel').last();
		$chPanel.addClass("active");
		$chPanel.attr("id", noCheckpoints);
		$chPanel.find('.panel-heading').attr("id", "heading" + noCheckpoints);
		$chPanel.find('.expand').attr({
			"href": "#collapse" + noCheckpoints,
			"aria-controls": "collapse" + noCheckpoints 
		});
		$chPanel.find('.panel-collapse').attr({
			"id": "collapse" + noCheckpoints,
			"aria-labelledby": "heading" + noCheckpoints
		});
		if(noCheckpoints == 1){
			$chPanel.find(".add-box").addClass("hidden");
			$chPanel.find(".expand").addClass("hidden");
			$chPanel.find(".delCheck").addClass("hidden");
			$chPanel.find(".checkName").attr("placeholder", "Departure location...");
			$chPanel.find(".panel-heading").append("<label class='return'><input type='checkbox' checked class='return-check' /> Return here</label>");
		}
		$chPanel.find('.checkName').attr("id","checkName" + noCheckpoints);
		var input = $('#checkName' + noCheckpoints)[0];
		var searchBox = new google.maps.places.SearchBox(input);
		google.maps.event.addListener(searchBox, 'places_changed', (function(noCheckpoints) {
			return function(){
				var places = searchBox.getPlaces();
				if (places.length === 0) {
					return;
				}
				mapPin.strokeColor = $chPanel.find('.color.pin').val();
				checkpoints[noCheckpoints-1].marker.setTitle(places[0].name);
				checkpoints[noCheckpoints-1].marker.setPosition(places[0].geometry.location);
				checkpoints[noCheckpoints-1].marker.setIcon(mapPin);
			};
		})(noCheckpoints));
		$(".loadButtonDiv").removeClass("hidden");
		$("#map-canvas").removeClass("hidden");
		google.maps.event.trigger(map, 'resize');
		map.setCenter({lat: 39.13, lng: 35.4});
		map.setZoom(5);
	});
	$("#load-cargo").click(function(e){
		e.preventDefault();
		$(".panel.active").each(function(){
			var panel_id = parseInt($(this).attr("id"), 10);
			$(this).find(".row").each(function(){
				var name = $(this).find(".name").val();
				var length = parseFloat($(this).find(".length").val());
				var width = parseFloat($(this).find(".width").val());
				var height = parseFloat($(this).find(".height").val());
				var quantity = parseInt($(this).find(".quantity").val(), 10);
				var up = $(this).find(".up").is(":checked");
				var color =  $(this).find(".color").val();
				var box1 = new Box(name, length, width, height, quantity, true, true, !up, !up, !up, !up, color);
				checkpoints[panel_id-1].push_box_array(box1);
				box_array.push(box1);
			});
		});
		loadBoxes();
		$(".canvasAndMap").removeClass("hidden");
	});
	$(".container").on("click", ".delCheck", function(e){
		e.preventDefault();
		var noCheckpoints = checkpoints.length;
		var panelId = parseInt($(this).closest(".panel").attr("id"), 10);
		if(noCheckpoints == 1){
			$(".loadButtonDiv").addClass("hidden");
			$("#map-canvas").addClass("hidden");
		}
		for(var i=panelId+1, j=i-1; i<=noCheckpoints; i++){
			var $panel = $(this).closest(".panels").find("#" + i);
			$panel.attr("id", j);
			$panel.find(".panel-heading").attr("id", "heading" + j);
			$panel.find('.expand').attr({
				"href": "#collapse" + j,
				"aria-controls": "collapse" + j
			});
			$panel.find('.panel-collapse').attr({
				"id": "collapse" + j,
				"aria-labelledby": "heading" + j
			});
			$panel.find('.checkName').attr("id", "checkName" + j);
		}
		checkpoints.splice(panelId-1,1);
		$(this).closest(".panel").remove();
	});
	$(".container").on("click", ".delBox", function(e){
		e.preventDefault();
		$(this).closest(".row").remove();
	});
	$(".panels").on("click", ".add-box", function(e){
		e.preventDefault();
		var $chCon = $(this).closest(".panel").find(".container");
		$chCon.append($('.addCargoTemplate').html());
		var noOfRows = $(this).closest(".panel").find(".row").length;
		var i = 1;
		$(this).closest(".panel").find(".row").each(function(){
			var newColorValue = ColorLuminance($(this).closest(".panel").find(".panel-heading").find(".color.pin").val(), -i/(noOfRows+2));
			$(this).find(".color").val(newColorValue);
			i++;
		});
	});
	$(".panels").on("click", ".expand", function(e){
		e.preventDefault();		
	});
	$(".panels").on("change", ".color.pin", function(){
		mapPin.strokeColor = $(this).val();
		checkpoints[$(this).closest(".panel").index()].marker.setIcon(mapPin);	
	});
	$(".panels").on("keyup", ".quantity", function(){
		$(this).closest(".panel").find(".summaryQuantity").html($(this).val() + " boxes");
	});
	$("#opt-route").click(function(e){
		e.preventDefault();
		var x = checkpoints.length,
			waypts = [];
		if(x > 1){
			for(var i=1; i<x; i++){
				waypts.push({
					location: checkpoints[i].marker.getPosition(),
          			stopover: true
          		});
			}
			if($(".return-check").is(":checked") === true){
				calcRoute(checkpoints[0].marker.getPosition(), waypts, -1);
			} else {
				var wayptsOriginal = waypts.slice();
				for(i=1; i<x; i++){
					waypts = wayptsOriginal.slice();
					waypts.splice(i-1,1);
					calcRoute(checkpoints[i].marker.getPosition(), waypts, i-1);
				}
			}
		}
	});
});

var calcRoute = function(end, waypoints, order){
	var start = checkpoints[0].marker.getPosition(),
	request = {
		origin: start,
		waypoints: waypoints,
		destination: end,
		optimizeWaypoints: true,
		travelMode: google.maps.TravelMode.DRIVING
	};
	directionsService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			if(order === -1){
				directionsDisplay.setDirections(result);
			} else {
				callbackResults[order] = {"response": result, "distance": 0};
			}
		} else {
			if(order !== -1){
				callbackResults[order] = {"response": "Error", "distance": 1000000};
			}
		}
		noOfReturnedCallbacks++;
		if(noOfReturnedCallbacks == checkpoints.length-1){
			noOfReturnedCallbacks = 0;
			findShortestRoute(order);
		}
	});
};

var findShortestRoute = function(){
	var x = checkpoints.length-1, i, j;
	for(i=0; i<x; i++){
		if(callbackResults[i].response !== "Error"){
			var noOfLegs = callbackResults[i].response.routes[0].legs.length;
			for(j=0; j<noOfLegs; j++){
				callbackResults[i].distance += callbackResults[i].response.routes[0].legs[j].distance.value/1000;
			}
		}
	}
	var minDistance = 99999;
	for(i=0; i<x; i++){
		minDistance = Math.min(minDistance, callbackResults[i].distance);
	}
	for(i=0; i<x; i++){
		if(minDistance == callbackResults[i].distance){
			var response = callbackResults[i].response;
			var orderWp = response.routes[0].waypoint_order;
			directionsDisplay.setDirections(response);
			for(j=0; j<orderWp.length; j++){
				if(orderWp[j] >= i){
					orderWp[j]++;
				}
			}
			orderWp.push(i);
			sortPanels(orderWp);
			break;
		}
	}
};

var sortPanels = function(queue){
	var checkpointsCopy = checkpoints.slice();
	for(var i=0, x=queue.length; i<x; i++){
		$("#" + (queue[i]+2)).appendTo($(".panels"));
		checkpoints[i+1] = checkpointsCopy[queue[i]+1];
	}
};

var init_box_set = function(){
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
	for(var j=0; j<6; j++){
		var yeni_kutu_satiri = [isim[j],en[j],boy[j],yukseklik[j],adet[j]];
		var table = document.getElementById("all_boxes");
		var row = table.insertRow(table.rows.length);
		var cell;
		for(var i=0;i<5;i++){
			cell = row.insertCell(i);
			cell.innerHTML = yeni_kutu_satiri[i];
		}
		if(dik.checked === true){
			cell = row.insertCell(i);
			cell.innerHTML = "Yes";
			box1 = new Box(isim[j],boy[j],en[j],yukseklik[j],adet[j],true,true,false,false,false,false);
		} else {
			cell = row.insertCell(i);
			cell.innerHTML = "No";
			box1 = new Box(isim[j],boy[j],en[j],yukseklik[j],adet[j],true,true,true,true,true,true);
		}
		cell = row.insertCell(i+1);
		var color = "#FF0000";
		cell.innerHTML = "<input type='color' value='" + color + "'/>";
		box1.color = color;
		box_array.push(box1);
	}
};

var ColorLuminance = function(hex, lum) {
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}
	return rgb;
};

var loadBoxes = function(){
	copy_box_array = box_array.slice();
	var space_initial = new Space(0, 0, 0, 1360, 240, 300);
	space_array.push(space_initial);
	scene.add(drawGrid(0, 0, 1360, 240));
	var number_of_usable_spaces = 1;
	while(number_of_usable_spaces !== 0 && box_array.length !== 0){
		number_of_usable_spaces = 0;
		var a = eval1(box_array, space_array[0]);
		a = eval2(a, space_array[0]);
		a = eval3(a, space_array[0]);
		a = eval4(a, space_array[0]);
		var b = {};
		b.loaded_box = a[0];
		b.loading_point = {};
		b.loading_point.x = space_array[0].origin.x;
		b.loading_point.y = space_array[0].origin.y;
		b.loading_point.z = space_array[0].origin.z;
		loaded_boxes.push(b);
		for(i=0; i<box_array.length; i++){
			for (var key in box_array[i].orientation){
				if(b.loaded_box.name == box_array[i].name && b.loaded_box.dim.x % box_array[i].orientation[key].x === 0 && b.loaded_box.dim.y % box_array[i].orientation[key].y === 0 && b.loaded_box.dim.z % box_array[i].orientation[key].z === 0){
					var box_number = (b.loaded_box.dim.x/box_array[i].orientation[key].x)*(b.loaded_box.dim.y/box_array[i].orientation[key].y)*(b.loaded_box.dim.z/box_array[i].orientation[key].z);
					if(box_array[i].quantity - box_number === 0){
						box_array.splice(i,1);
					} else {
						box_array[i].quantity = box_array[i].quantity - box_number;
					}
					break;
				}
			}
		}
		if(b.loaded_box.dim.x !== 0 && space_array[0].dim.y-b.loaded_box.dim.y !== 0 && space_array[0].dim.z !== 0) {
			var space_side = new Space(space_array[0].origin.x,space_array[0].origin.y+b.loaded_box.dim.y,space_array[0].origin.z,b.loaded_box.dim.x,space_array[0].dim.y-b.loaded_box.dim.y,space_array[0].dim.z);
			space_array.push(space_side);
		}
		if(space_array[0].dim.x-b.loaded_box.dim.x !== 0 && space_array[0].dim.y !== 0 && space_array[0].dim.z !== 0) {
			var space_front = new Space(space_array[0].origin.x+b.loaded_box.dim.x,space_array[0].origin.y,space_array[0].origin.z,space_array[0].dim.x-b.loaded_box.dim.x,space_array[0].dim.y,space_array[0].dim.z);
			space_array.push(space_front);
		}
		if(b.loaded_box.dim.x !== 0 && b.loaded_box.dim.y !== 0 && space_array[0].dim.z-b.loaded_box.dim.z !== 0) {
			var space_overhead = new Space(space_array[0].origin.x,space_array[0].origin.y,space_array[0].origin.z+b.loaded_box.dim.z,b.loaded_box.dim.x,b.loaded_box.dim.y,space_array[0].dim.z-b.loaded_box.dim.z);
			space_array.push(space_overhead);
		}
		space_array.splice(0, 1);
		space_array = merge_spaces(space_array);
		var min_distance_to_origin = 10000;
		for(i=0; i<space_array.length; i++) {
			if(space_array[i].check_space_usability(box_array) && Math.sqrt(Math.pow(space_array[i].origin.x,2)+Math.pow(space_array[i].origin.y,2)+Math.pow(space_array[i].origin.z,2))<min_distance_to_origin){
				min_distance_to_origin = Math.sqrt(Math.pow(space_array[i].origin.x,2)+Math.pow(space_array[i].origin.y,2)+Math.pow(space_array[i].origin.z,2));
			}
			if(space_array[i].check_space_usability(box_array)) {
				number_of_usable_spaces = number_of_usable_spaces+1;
			}
		}
		for(i=0; i<space_array.length; i++){
			if(space_array[i].check_space_usability(box_array) && Math.sqrt(Math.pow(space_array[i].origin.x,2)+Math.pow(space_array[i].origin.y,2)+Math.pow(space_array[i].origin.z,2))==min_distance_to_origin){
				var temp = space_array[i];
				space_array[i] = space_array[0];
				space_array[0] = temp;
			}
		}
	}
	var empty_volume=0;
	for(i=0;i<space_array.length;i++){
		empty_volume = empty_volume + (space_array[i].dim.x*space_array[i].dim.y*space_array[i].dim.z);
	}
	for(i=0;i<box_array.length;i++){
		
	}
	encode(loaded_boxes);
};

function encode(boxes) {
	var encoded_box_set = [];
	var i;
	for(var j=0; j<boxes.length; j++) {
		for(i=0; i<copy_box_array.length; i++) {
			if(boxes[j].loaded_box.name == copy_box_array[i].name) {
				for (var key in copy_box_array[i].orientation){
					if(boxes[j].loaded_box.dim.x % copy_box_array[i].orientation[key].x === 0 && boxes[j].loaded_box.dim.y % copy_box_array[i].orientation[key].y === 0 && boxes[j].loaded_box.dim.z % copy_box_array[i].orientation[key].z === 0){
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
									encoded_box_element.color   = copy_box_array[i].color;
									encoded_box_set.push(encoded_box_element);
								}
							}
						}
						break;
					}
				}
			}
		}
	}
	for(i=0; i<encoded_box_set.length; i++) {
		//$("#write").html($("#write").html() + "<br>l:" + encoded_box_set[i].length + " w:" + encoded_box_set[i].width + " h:" +  encoded_box_set[i].heigth + " x:" +  encoded_box_set[i].x + " y:" + encoded_box_set[i].y + " z:" + encoded_box_set[i].z);
		scene.add(drawCube(encoded_box_set[i].length, encoded_box_set[i].width, encoded_box_set[i].heigth, encoded_box_set[i].x, encoded_box_set[i].y, encoded_box_set[i].z, encoded_box_set[i].color, 1));
	}
	camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
	renderer.render(scene, camera);
}

function merge_spaces(spaces){
	var set_spaces;
	var new_spaces = [];
	var i, j, k, l;
	for(l=0; l<spaces.length; l++){
		for(j=0; j<spaces.length; j++){
			if(l != j){
				set_spaces = merge_spaces1(spaces[l], spaces[j]);
				if(set_spaces.length>0){
					spaces.splice(l,1);
					if(l<j){
						spaces.splice(j-1,1);
					} else {
						spaces.splice(j,1);
					}
					for(k=0;k<set_spaces.length;k++){
						spaces[spaces.length] = set_spaces[k];
					}
					l=0;
					j=0;
				}
			}
		}
	}
	var set_spaces2;
	for(l=0; l<spaces.length; l++){
		for(j=0; j<spaces.length; j++){
			if(l!=j && !spaces[l].check_space_usability(box_array) && !spaces[j].check_space_usability(box_array)){
				set_spaces2 = merge_spaces2(spaces[l], spaces[j]);
				for(var iter=0; iter<set_spaces2.length; iter++){
					if(set_spaces2[iter].dim.x === 0 || set_spaces2[iter].dim.y === 0 || set_spaces2[iter].dim.z === 0){
						set_spaces2.splice(iter,1);
					}
				}
				if(set_spaces2.length>0){
					spaces.splice(l,1);
					if(l<j){
						spaces.splice(j-1,1);
					} else {
						spaces.splice(j,1);
					}
					for(k=0;k<set_spaces2.length;k++){
						new_spaces[new_spaces.length] = set_spaces2[k];
					}
					l=0;
					j=0;
				}
			}
		}
	}
	for(i=0;i<new_spaces.length;i++){
		spaces.push(new_spaces[i]);
	}
	return spaces;
}

function merge_spaces1(space1, space2) {
	var returned_spaces = [];
	var merged_space;
	if(space1.origin.z == space2.origin.z){
		if(space1.origin.x+space1.dim.x==space2.origin.x && space1.origin.y==space2.origin.y && space1.dim.y==space2.dim.y){
			merged_space = new Space(space1.origin.x,space1.origin.y,space1.origin.z,space1.dim.x+space2.dim.x,space1.dim.y,space1.dim.z);
			returned_spaces.push(merged_space);
		} else if(space1.origin.x==space2.origin.x && space1.origin.y+space1.dim.y==space2.origin.y && space1.dim.x==space2.dim.x){
			merged_space = new Space(space1.origin.x,space1.origin.y,space1.origin.z,space1.dim.x,space1.dim.y+space2.dim.y,space1.dim.z);
			returned_spaces.push(merged_space);
		}
	}
	return returned_spaces;
}

function merge_spaces2(space1, space2) {
	var returned_spaces = [];
	var merged_space1;
	var merged_space2;
	var merged_space3;
	if(space1.origin.z == space2.origin.z) {
		if(space1.origin.x+space1.dim.x == space2.origin.x) {
			if(Math.max(space1.origin.y,space2.origin.y) == space1.origin.y && space2.dim.y + space2.origin.y > space1.origin.y) {
				merged_space1 = new Space(space2.origin.x,space2.origin.y,space2.origin.z,space2.dim.x,space1.origin.y-space2.origin.y,space2.dim.z);
				returned_spaces.push(merged_space1);
				if(Math.min(space1.origin.y+space1.dim.y,space2.origin.y+space2.dim.y) == space1.origin.y+space1.dim.y) {
					merged_space2 = new Space(space1.origin.x,space1.origin.y,space1.origin.z,space1.dim.x+space2.dim.x,space1.dim.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new Space(space2.origin.x,space1.origin.y+space1.dim.y,space1.origin.z,space2.dim.x,(space2.dim.y+space2.origin.y)-(space1.origin.y+space1.dim.y),space1.dim.z);
					returned_spaces.push(merged_space3);
				} else {
					merged_space2 = new Space(space1.origin.x,space1.origin.y,space1.origin.z,space1.dim.x+space2.dim.x,space2.origin.y+space2.dim.y-space1.origin.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new Space(space1.origin.x,space2.origin.y+space2.dim.y,space1.origin.z,space1.dim.x,(space1.origin.y+space1.dim.y)-(space2.origin.y+space2.dim.y),space1.dim.z);
					returned_spaces.push(merged_space3);
				}
			} else if(Math.max(space1.origin.y,space2.origin.y) == space2.origin.y && space1.dim.y + space1.origin.y >= space2.origin.y) {
				merged_space1 = new Space(space1.origin.x,space1.origin.y,space1.origin.z,space1.dim.x,space2.origin.y-space1.origin.y,space1.dim.z);
				returned_spaces.push(merged_space1);
				if(Math.min(space1.origin.y+space1.dim.y,space2.origin.y+space2.dim.y) == space1.origin.y+space1.dim.y) {
					merged_space2 = new Space(space1.origin.x,space2.origin.y,space1.origin.z,space1.dim.x+space2.dim.x,space1.origin.y+space1.dim.y-space2.origin.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new Space(space2.origin.x,space1.origin.y+space1.dim.y,space1.origin.z,space2.dim.x,space2.origin.y+space2.dim.y-(space1.origin.y+space1.dim.y),space1.dim.z);
					returned_spaces.push(merged_space3);
				} else {
					merged_space2 = new Space(space1.origin.x,space2.origin.y,space1.origin.z,space1.dim.x+space2.dim.x,space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new Space(space1.origin.x,space2.origin.y+space2.dim.y,space1.origin.z,space1.dim.x,(space1.origin.y+space1.dim.y)-(space2.origin.y+space2.dim.y),space1.dim.z);
					returned_spaces.push(merged_space3);
				}
			}
		} else if(space1.origin.y+space1.dim.y == space2.origin.y) {
			if(Math.max(space1.origin.x,space2.origin.x) == space1.origin.x && space1.origin.x < space2.origin.x + space2.dim.x) {
				merged_space1 = new Space(space2.origin.x,space2.origin.y,space2.origin.z,space1.origin.x-space2.origin.x,space2.dim.y,space2.dim.z);
				returned_spaces.push(merged_space1);
				if(Math.min(space1.origin.x+space1.dim.x,space2.origin.x+space2.dim.x) == space1.origin.x+space1.dim.x) {
					merged_space2 = new Space(space1.origin.x,space1.origin.y,space1.origin.z,space1.dim.x,space1.dim.y+space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new Space(space1.dim.x+space1.origin.x,space2.origin.y,space1.origin.z,space2.origin.x+space2.dim.x-(space1.dim.x+space1.origin.x),space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space3);
				} else {
					merged_space2 = new Space(space1.origin.x,space1.origin.y,space1.origin.z,space2.origin.x+space2.dim.x-space1.origin.x,space1.dim.y+space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new Space(space2.origin.x+space2.dim.x,space1.origin.y,space1.origin.z,space1.dim.x+space1.origin.x-(space2.dim.x+space2.origin.x),space1.dim.y,space1.dim.z);
					returned_spaces.push(merged_space3);
				}
			} else if(Math.max(space1.origin.x,space2.origin.x) == space2.origin.x && space2.origin.x < space1.origin.x + space1.dim.x) {
				merged_space1 = new Space(space1.origin.x,space1.origin.y,space1.origin.z,space2.origin.x-space1.origin.x,space1.dim.y,space1.dim.z);
				returned_spaces.push(merged_space1);
				if(Math.min(space1.origin.x+space1.dim.x,space2.origin.x+space2.dim.x) == space1.origin.x+space1.dim.x) {
					merged_space2 = new Space(space2.origin.x,space1.origin.y,space1.origin.z,space1.dim.x+space1.origin.x-space2.origin.x,space1.dim.y+space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new Space(space1.origin.x+space1.dim.x,space2.origin.y,space1.origin.z,space2.dim.x+space2.origin.x-(space1.dim.x+space1.origin.x),space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space3);
				} else {
					merged_space2 = new Space(space2.origin.x,space1.origin.y,space1.origin.z,space2.dim.x,space1.dim.y+space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space2);
					merged_space3 = new Space(space2.dim.x+space2.origin.x,space1.origin.y,space1.origin.z,space2.dim.x,space1.dim.y+space2.dim.y,space1.dim.z);
					returned_spaces.push(merged_space3);
				}
			}
		}
	}
	return returned_spaces;
}

var eval1 = function(boxes, space) {
	var returned_boxes_set = [];
	var min_len_of_boxes = [];
	var possible_box;
	var x_value, y_value, z_value;
	var qua_of_boxes;
	var min;
	for (var i=0; i<boxes.length; i++) {
		for (var key in boxes[i].orientation) {
			var ory = boxes[i].orientation[key];
			if (ory.pos === true && space.dim.x >= ory.x && space.dim.y >= ory.y && space.dim.z >= ory.z) {
				var emp_len_x = space.dim.x - Math.min(boxes[i].quantity, Math.floor(space.dim.x/ory.x))*ory.x;
				var emp_len_y = space.dim.y - Math.min(boxes[i].quantity, Math.floor(space.dim.y/ory.y))*ory.y;
				var emp_len_z = space.dim.z - Math.min(boxes[i].quantity, Math.floor(space.dim.z/ory.z))*ory.z;
				min = Math.min(emp_len_x, emp_len_y, emp_len_z);
				if (min == emp_len_x) {
					possible_box = new Best_ory(boxes[i].name, ory.name, "x", min, ory.x, ory.y, ory.z, boxes[i].quantity);
					min_len_of_boxes.push(possible_box);
				}
				if (min == emp_len_y) {
					possible_box = new Best_ory(boxes[i].name, ory.name, "y", min, ory.x, ory.y, ory.z, boxes[i].quantity);
					min_len_of_boxes.push(possible_box);
				}
				if (min == emp_len_z) {
					possible_box = new Best_ory(boxes[i].name, ory.name, "z", min, ory.x, ory.y, ory.z, boxes[i].quantity);
					min_len_of_boxes.push(possible_box);
				}
			}
		}
	}
	min = 1000000;
	for (i=0; i<min_len_of_boxes.length; i++) {
		if (min_len_of_boxes[i].value < min) {
			min = min_len_of_boxes[i].value;
		}
	}
	for (i=0; i<min_len_of_boxes.length; i++) {
		var can_box = min_len_of_boxes[i];
		if (can_box.value == min) {
			if (can_box.direction == "x") {
				x_value = space.dim.x - can_box.value;
				y_value = can_box.new_y;
				z_value = can_box.new_z;
				qua_of_boxes = x_value / can_box.new_x;
			} else if (can_box.direction == "y") {
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
			var min_box = new Box(can_box.name, x_value, y_value, z_value, Math.max(Math.floor(can_box.quantity/qua_of_boxes),1), true, false, false, false, false, false);
			returned_boxes_set.push(min_box);
		}
	}
	return returned_boxes_set;
};

var eval2 = function(boxes, space) {
	var returned_boxes_set = [];
	var possible_boxes_set = [];
	var boxs;
	for (var j=0;j<boxes.length;j++){
		boxs = boxes[j];
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
							var new_box = new Box(boxs.name,ory.x,i*ory.y,(box_amount/i)*ory.z,Math.max(Math.floor(boxs.quantity/box_amount),1),true,false,false,false,false,false);
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
};

var eval3 = function(boxes, space) {
	var returned_boxes_set = [];
	var possible_boxes_set = [];
	var boxs;
	for (var j=0;j<boxes.length;j++){
		boxs = boxes[j];
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
							var new_box = new Box(boxs.name,i*ory.x,ory.y,(box_amount/i)*ory.z,Math.max(Math.floor(boxs.quantity/box_amount),1),true,false,false,false,false,false);
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
};

var eval4 = function(boxes, space) {
	var returned_boxes_set = [];
	var possible_boxes_set = [];
	var boxs;
	for (var j=0;j<boxes.length;j++){
		boxs = boxes[j];
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
							var new_box = new Box(boxs.name,i*ory.x,(box_amount/i)*ory.y,ory.z,Math.max(Math.floor(boxs.quantity/box_amount),1),true,false,false,false,false,false);
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
};