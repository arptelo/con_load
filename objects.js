var Box = function(name, l, w, h, q, xyz, yxz, xzy, zxy, zyx, yzx, color) {
	this.name = name;
	this.dim = {
		x: l,
		y: w,
		z: h
	};
	this.quantity = q;
	this.orientation = {
		first:  { name: "first",  pos: xyz, x: l, y: w, z: h },
		second: { name: "second", pos: yxz, x: w, y: l, z: h },
		third:  { name: "third",  pos: xzy, x: l, y: h, z: w },
		fourth: { name: "fourth", pos: zxy, x: h, y: l, z: w },
		fifth:  { name: "fifth",  pos: zyx, x: h, y: w, z: l },
		sixth:  { name: "sixth",  pos: yzx, x: w, y: h, z: l }
	};
	this.color = color;
};

var space = function(x, y, z, l, w, h) {
	this.origin = { x: x, y: y, z: z};
	this.dim = { x: l, y: w, z: h};
	this.check_space_usability = function(box_list){
	    var is_space_usable = false;
	    for (var i=0; i<box_list.length; i++){
    		for (var key in box_list[i].orientation){
    			if(box_list[i].orientation[key].pos === true && box_list[i].orientation[key].x <= this.dim.x && box_list[i].orientation[key].y <= this.dim.y && box_list[i].orientation[key].z <= this.dim.z){
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
};

var spaceelement = function(space, usability) {
	this.empty_space = space;
	this.usability = usability;
};

var best_ory = function(box, orientation, direction, rest_value, x, y, z, q) {
	this.name = box;
	this.orientation = orientation;
	this.direction = direction;
	this.value = rest_value;
	this.new_x = x;
	this.new_y = y;
	this.new_z = z;
	this.quantity = q;
};