var aktif_gizli_div_satiri,
	aracdizi = [],
	aradurakdizi = [],
	atanancolumn = [],
	atananrow = [],
	bos_km = [],
	bos_mus_km = [],
	bosaltma_noktalar = [],
	chart,
	date,
	delivery_dizi = [],
	directionsDisplay,
	directionsService = new google.maps.DirectionsService(),
	elevator,
	gumrukdizi = [],
	hesaplaText,
	km = [],
	map,
	musteridizi = [],
	overview_path_array = [],
	panorama,
	panoramaOptions,
	renk,
	resim_arac = 'img/truck.png',
	resim_custom = 'img/custom.png',
	resim_delivery = new google.maps.MarkerImage('img/delivery.png',
		new google.maps.Size(21, 34),
		new google.maps.Point(0,0),
		new google.maps.Point(21, 34)
	),
	resim_gum = 'img/omsan.png',
	resim_must = 'img/customer.png',
	sv = new google.maps.StreetViewService(),
	taseron_sayisi = 0,
	varis_olasilik_tablo = [],
	varis_saati_array = [],
	x;

google.load("visualization", "1", {
	packages: ["columnchart"]
});

function AddControl(controlDiv, map) {
	controlDiv.style.padding = '5px';
		
	var addUI = document.createElement('DIV'); 
	addUI.style.width = '150px';
	addUI.style.backgroundColor = '#EAF2D3';
	addUI.style.border = '1px solid #98bf21';
	addUI.style.cursor = 'pointer';
	addUI.style.textAlign = 'center';
	addUI.title = 'Araçları otomatik eklemek için tıklayınız';
	controlDiv.appendChild(addUI);

	var addText = document.createElement('DIV');
	addText.style.fontFamily = 'Arial,sans-serif';
	addText.style.fontSize = '12px';
	addText.style.color = 'black';
	addText.style.paddingLeft = '4px';
	addText.style.paddingRight = '4px';
	addText.innerHTML = '<b>Otomatik Araç Ekle</b>';
	addUI.appendChild(addText);

	google.maps.event.addDomListener(addUI, 'click', function() {
		addUI.style.backgroundColor = '#ff6600';
		addUI.style.border = '1px solid #ff1100';
		addText.style.color = 'white';
		oto_addrow();
	});
}

function HomeControl(controlDiv, map, x_value) {
	x = x_value;
	controlDiv.style.padding = '5px';
	
	var goHomeUI = document.createElement('DIV'); 
	goHomeUI.style.width = '150px';
	goHomeUI.style.backgroundColor = '#ff6600';
	goHomeUI.style.border = '1px solid #ff1100';
	goHomeUI.style.cursor = 'pointer';
	goHomeUI.style.textAlign = 'center';
	goHomeUI.title = 'Araç eklemek için tıklayınız';
	controlDiv.appendChild(goHomeUI);
		 
	var goHomeText = document.createElement('DIV');
	goHomeText.style.fontFamily = 'Arial,sans-serif';
	goHomeText.style.fontSize = '12px';
	goHomeText.style.color = 'white';
	goHomeText.style.paddingLeft = '4px';
	goHomeText.style.paddingRight = '4px';
	goHomeText.innerHTML = '<b>Araç Ekle</b>';
	goHomeUI.appendChild(goHomeText);
	  
	var setHomeUI = document.createElement('DIV');
	setHomeUI.style.width = '150px';
	setHomeUI.style.backgroundColor = '#EAF2D3';
	setHomeUI.style.border = '1px solid #98bf21';
	setHomeUI.style.cursor = 'pointer';
	setHomeUI.style.textAlign = 'center';
	setHomeUI.title = 'Müşteri eklemek için tıklayınız';
	controlDiv.appendChild(setHomeUI);

	var setHomeText = document.createElement('DIV');
	setHomeText.style.fontFamily = 'Arial,sans-serif';
	setHomeText.style.fontSize = '12px';
	setHomeText.style.paddingLeft = '4px';
	setHomeText.style.paddingRight = '4px';
	setHomeText.innerHTML = '<b>Müşteri Ekle</b>';
	setHomeUI.appendChild(setHomeText);

	var hesaplaUI = document.createElement('DIV'); 
	hesaplaUI.style.width = '150px';
	hesaplaUI.style.backgroundColor = '#EAF2D3';
	hesaplaUI.style.border = '1px solid #98bf21';
	hesaplaUI.style.cursor = 'pointer';
	hesaplaUI.style.textAlign = 'center';
	hesaplaUI.title = 'Planlama için tıklayınız';
	controlDiv.appendChild(hesaplaUI);
	 
	hesaplaText = document.createElement('DIV');
	hesaplaText.style.fontFamily = 'Arial,sans-serif';
	hesaplaText.style.fontSize = '12px';
	hesaplaText.style.paddingLeft = '4px';
	hesaplaText.style.paddingRight = '4px';
	hesaplaText.innerHTML = '<b>HESAPLA</b>';
	hesaplaUI.appendChild(hesaplaText);

	google.maps.event.addDomListener(goHomeUI, 'click', function() {
		hesaplaUI.style.backgroundColor = '#EAF2D3';
		hesaplaUI.style.border = '1px solid #98bf21';
		hesaplaText.style.color = 'black';
		setHomeUI.style.backgroundColor = '#EAF2D3';
		setHomeUI.style.border = '1px solid #98bf21';
		setHomeText.style.color = 'black';
		goHomeUI.style.backgroundColor = '#ff6600';
		goHomeUI.style.border = '1px solid #ff1100';
		goHomeText.style.color = 'white';
		x = 1;
	});
		
	google.maps.event.addDomListener(setHomeUI, 'click', function() {
		hesaplaUI.style.backgroundColor = '#EAF2D3';
		hesaplaUI.style.border = '1px solid #98bf21';
		hesaplaText.style.color = 'black';
		setHomeUI.style.backgroundColor = '#ff6600';
		setHomeUI.style.border = '1px solid #ff1100';
		setHomeText.style.color = 'white';
		goHomeUI.style.backgroundColor = '#EAF2D3';
		goHomeUI.style.border = '1px solid #98bf21';
		goHomeText.style.color = 'black';
		x = 0;
	});

	google.maps.event.addDomListener(hesaplaUI, 'click', function() {
		if(aracdizi.length!=0 && musteridizi.length!=0){
			hesaplaUI.style.backgroundColor = '#ff6600';
			hesaplaUI.style.border = '1px solid #ff1100';
			hesaplaText.style.color = 'white';
			setHomeUI.style.backgroundColor = '#EAF2D3';
			setHomeUI.style.border = '1px solid #98bf21';
			setHomeText.style.color = 'black';
			goHomeUI.style.backgroundColor = '#EAF2D3';
			goHomeUI.style.border = '1px solid #98bf21';
			goHomeText.style.color = 'black';
			hesaplaText.innerHTML = 'Rota oluşturuluyor(%0)';
			calcRoute(0,0);
		} else {
			alert("Lütfen araç ve(ya) müşteri ekleyiniz.");
		}
	});
}

var initialize = function() {
	directionsDisplay = new google.maps.DirectionsRenderer();
	var center = new google.maps.LatLng(48.85605278, 2.297894444);
	var myOptions = {                                                                       
		zoom      				: 6,
		mapTypeId 				: google.maps.MapTypeId.TERRAIN,
		center  				: center,
		streetViewControl		: false
//		mapTypeControlOptions	: {mapTypeIds:[google.maps.MapTypeId.TERRAIN,'usroadatlas']}
	}
	var roadAtlasStyles = [{
		featureType: "road",       
		elementType: "all",   
		stylers: [{visibility:"off"}]
	},{
		featureType: "poi",       
		elementType: "all",   
		stylers: [{visibility:"off"}]
	},{
		featureType: "landscape",       
		elementType: "all",   
		stylers: [{visibility:"off"}]
	},{
		featureType: "administrative.locality",       
		elementType: "all",   
		stylers: [{hue:"#ff0000"},{saturation:100}]
	},{
		featureType: "administrative.country",       
		elementType: "all",   
		stylers: [{hue:"#ccccff"},{saturation:30}]
	}];
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
//	var styledMapOptions = {      
//		name: "Ayrıntı"   
//	}    
//	var usRoadMapType = new google.maps.StyledMapType(roadAtlasStyles, styledMapOptions);       
//	map.mapTypes.set('usroadatlas', usRoadMapType);   
//	map.setMapTypeId('usroadatlas');
	google.maps.event.addListener(map, 'click', function(event) {isaretekle(event.latLng);});
	directionsDisplay.setMap(map);
	panoramaOptions = {
       	position: center,
		pov		: {
   			heading : -45,
   			pitch   : 18,
   			zoom    : 1
		}
	};
	panorama = new  google.maps.StreetViewPanorama(document.getElementById("pano"),panoramaOptions);
    map.setStreetView(panorama);
	elevator = new google.maps.ElevationService();
	var homeControlDiv = document.createElement('DIV');   
	var homeControl = new HomeControl(homeControlDiv, map, 1);    
	homeControlDiv.index = 1;   
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(homeControlDiv); 
	var addControlDiv = document.createElement('DIV');   
	var addControl = new AddControl(addControlDiv, map);   
	addControlDiv.index = 2;   
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(addControlDiv);
	var bosalt_nok = document.getElementById("bos_nokt_ekle");
	for (i=0;i<json.customers.length;i++) {
		bosalt_nok.options[i+1] = new Option(json.customers[i].İsim, i);
	}
};

function renderDirections(result){
	renk = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
	var polopt = { strokeColor:renk , strokeOpacity:1.0, strokeWeight:5 };
	var rendererOptions = {
		map             : map,
		polylineOptions : polopt
	};
    var directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
    directionsRenderer.setDirections(result);
}

function check_routable(mark){
	var dest_test_for_added = new google.maps.LatLng(46.20279,5.21924599999999)
	var request = {
		origin      :mark,      
		destination :dest_test_for_added,
		travelMode  :google.maps.DirectionsTravelMode.DRIVING   
	};
	directionsService.route(request, function(result, status) {
		if (status != google.maps.DirectionsStatus.OK) {
			alert("Eklediğiniz bölge için rota oluşturulamaz. Lütfen bu işareti silip tekrar deneyiniz!");
		}
	});
}
  
function isaretekle(location) {
	marker = new google.maps.Marker({
		position : location,
		map		 : map,
		draggable: true
	});
	check_routable(marker.position);
	google.maps.event.addListener(marker, 'click', function(event) {
		drawPath(event.latLng);
		sv.getPanoramaByLocation(event.latLng, 1000, processSVData);
		check_routable(event.latLng);
	});
	google.maps.event.addListener(marker, 'dragend', function(event) {
		check_routable(event.latLng);
	});
	if(x == 1){
		var marker_delivery = new google.maps.Marker({
			position : location,
			icon     : resim_delivery,
			draggable: true
		});
//		marker.icon = image;
		aracdizi.push(marker);
		delivery_dizi.push(marker_delivery);
		addRow();
	} else {
		var marker_custom = new google.maps.Marker({
			position : location,
			icon     : resim_custom,
			draggable: true,
			map      : map
		});
		marker.icon = resim_must;
		musteridizi.push(marker);
		gumrukdizi.push(marker_custom);
		custaddrow();
	}
}

function delivery_marker_goster(i){
	var bosaltma_musteri = "ihrcustomer" + i;
	bosaltma_musteri = document.getElementById(bosaltma_musteri);
	var del_true = "dolu" + i;
	del_true = document.getElementById(del_true);
	if(del_true.checked == true){
		delivery_dizi[i-1].setMap(map);
		delivery_dizi[i-1].title = document.getElementById("truck" + i).options[document.getElementById("truck" + i).selectedIndex].text + "/" + document.getElementById("trailer" + i).options[document.getElementById("trailer" + i).selectedIndex].text + " boşaltma noktası";
		bosaltma_musteri.selectedIndex = 1;
		bosaltma_musteri.disabled = false;
	} else {
		delivery_dizi[i-1].setMap();
		bosaltma_musteri.selectedIndex = 0;
		bosaltma_musteri.disabled = true;
	}
}

function oto_addrow(){
	for(p=0;p<vehicle_position.trucks.length;p++){
		var loc_loc = new google.maps.LatLng(vehicle_position.trucks[p].Last_Lat, vehicle_position.trucks[p].Last_Lng);
		marker = new google.maps.Marker({
			position	: loc_loc,
			map			: map,
			draggable	: true
		});
		google.maps.event.addListener(marker, 'click', function(event) {
			drawPath(event.latLng);
			sv.getPanoramaByLocation(event.latLng, 1000, processSVData);
		});
		aracdizi.push(marker);
		loc_loc = new google.maps.LatLng(vehicle_position.trucks[p].Lat, vehicle_position.trucks[p].Lng);
		marker_delivery = new google.maps.Marker({
			position	: loc_loc,
			icon		: resim_delivery,
			map			: map,
			draggable	: true
		});
		delivery_dizi.push(marker_delivery);
		addRow();
		var sl_truck = "truck" + eval(p+1);
		sl_truck = document.getElementById(sl_truck);
		sl_truck.selectedIndex = vehicle_position.trucks[p].Truck;
		tabloguncelle(sl_truck,aracdizi.length);
		marker_delivery.setTitle(sl_truck.options[sl_truck.selectedIndex].text);
		sl_truck = "trailer" + eval(p+1);
		sl_truck = document.getElementById(sl_truck);
		sl_truck.selectedIndex = vehicle_position.trucks[p].Trailer;
		yrtabloguncelle(sl_truck,aracdizi.length);
		marker_delivery.setTitle(json.trucks[vehicle_position.trucks[p].Truck].Plaka + "/" + sl_truck.options[sl_truck.selectedIndex].text + " boşaltma noktası");
		sl_truck = "driver" + eval(p+1);
		sl_truck = document.getElementById(sl_truck);
		sl_truck.selectedIndex = vehicle_position.trucks[p].Driver;
		surucuguncelle(sl_truck,aracdizi.length);
		sl_truck = "transit" + eval(p+1);
		sl_truck = document.getElementById(sl_truck);
		if(vehicle_position.trucks[p].Transit == true){
			sl_truck.checked = true;
		}
		sl_truck = "dolu" + eval(p+1);
		sl_truck = document.getElementById(sl_truck);
		sl_truck.checked = true;
		sl_truck = "ihrcustomer" + eval(p+1);
		sl_truck = document.getElementById(sl_truck);
		sl_truck.disabled = false;
		sl_truck.selectedIndex = vehicle_position.trucks[p].Ihracat_Musteri;
		sl_truck = "bdate" + eval(p+1);
		sl_truck = document.getElementById(sl_truck);
		if(vehicle_position.trucks[p].Last_Lat==vehicle_position.trucks[p].Lat && vehicle_position.trucks[p].Last_Lng==vehicle_position.trucks[p].Last_Lng){
			sl_truck.value = "Tarih girilmeli";
		}
		if(vehicle_position.trucks[p].Bosaltma_Tarihi == "GRUPAJ!"){
			sl_truck.value = vehicle_position.trucks[p].Bosaltma_Tarihi;
		}else if(vehicle_position.trucks[p].Bosaltma_Tarihi != ""){
			sl_truck.value = vehicle_position.trucks[p].Bosaltma_Tarihi;
			document.getElementById("dolu" + eval(p+1)).checked = false;
			delivery_dizi[p].setMap();
			document.getElementById("ihrcustomer" + eval(p+1)).selectedIndex = 0;
			document.getElementById("ihrcustomer" + eval(p+1)).disabled = true;
		} else if(vehicle_position.trucks[p].Termin != "0"){
			var termin_tarihi = new Date(vehicle_position.trucks[p].Termin);
			sl_truck.value = eval(termin_tarihi.getMonth()+1) + "-" + termin_tarihi.getDate() + "-" + termin_tarihi.getFullYear() + " " + termin_tarihi.getHours() + ":" + termin_tarihi.getMinutes();
		}
	}
}

function processSVData(data, status){   
	if (status == google.maps.StreetViewStatus.OK) {   
		panorama.setPosition(data.location.latLng);              
		panorama.setVisible(true);   
	} else {
		panorama.setVisible(false);
	}
}

function bos_nokta_sil(ind){
	bosaltma_noktalar[aktif_gizli_div_satiri].splice(ind,1);
	bosaltma_noktalari(aktif_gizli_div_satiri+1);
	bosaltma_noktalari(aktif_gizli_div_satiri+1);
}

function bos_nokta_ekle(){
	var gizli_div_table = document.getElementById("giz_table");
	var row_number = gizli_div_table.rows.length;
	if(row_number-2<=5){
		var row_inserted = gizli_div_table.insertRow(row_number);
		var cell_inserted = row_inserted.insertCell(0);
		var yeni_bos_nokt = document.getElementById("bos_nokt_ekle");
		cell_inserted.innerHTML = row_number-2 + ". boşaltma noktası: " + yeni_bos_nokt.options[yeni_bos_nokt.selectedIndex].text;
		cell_inserted = row_inserted.insertCell(1);
		cell_inserted.innerHTML = "<a href='javascript:bos_nokta_sil(" + eval(row_number-3) + ")'>Sil</a>";
		var yeni_bos_konum = new google.maps.LatLng(json.customers[yeni_bos_nokt.options[yeni_bos_nokt.selectedIndex].value].lat,json.customers[yeni_bos_nokt.options[yeni_bos_nokt.selectedIndex].value].lng);
		bosaltma_noktalar[aktif_gizli_div_satiri][bosaltma_noktalar[aktif_gizli_div_satiri].length]=new bosa_konu(yeni_bos_nokt.options[yeni_bos_nokt.selectedIndex].text,yeni_bos_konum);
	} else {
		alert("En fazla 5 ara boşaltma noktası ekleyebilirsiniz!");
	}
}

function bosa_konu(isim,konum){
	this.isim  = isim;
	this.konum = konum;
}

function bosaltma_noktalari(i){
	aktif_gizli_div_satiri = i-1;
	var delivery_konum = "ihrcustomer" + i;
	delivery_konum = document.getElementById(delivery_konum);
	var gizli_div_table = document.getElementById("giz_table");
	while(gizli_div_table.rows.length > 2){
		gizli_div_table.deleteRow(gizli_div_table.rows.length-1);
	}
	var row_number = gizli_div_table.rows.length;
	var row_inserted = gizli_div_table.insertRow(row_number);
	var cell_inserted = row_inserted.insertCell(0);
	var duugme = document.getElementById("yeni_bos_ekle_dugm");
	if(delivery_konum.selectedIndex==0){
		duugme.disabled=true;
	} else {
		duugme.disabled=false;
	}
	cell_inserted.innerHTML = "Son boşaltma noktası: " + delivery_konum.options[delivery_konum.selectedIndex].text;
	cell_inserted.colSpan = 2;
	for(j=0;j<bosaltma_noktalar[i-1].length;j++){
		row_inserted = gizli_div_table.insertRow(row_number+j+1);
		cell_inserted = row_inserted.insertCell(0);
		cell_inserted.innerHTML = row_number+j-1 + ". boşaltma noktası: " + bosaltma_noktalar[i-1][j].isim;
		cell_inserted = row_inserted.insertCell(1);
		cell_inserted.innerHTML = "<a href='javascript:bos_nokta_sil(" + eval(row_number+j-2) + ")'>Sil</a>";
	}
	var gizli_div = document.getElementById('bos_nokt_kutusu');
	if(gizli_div.style.display == 'none'){
		gizli_div.style.display = 'block';
		gizli_div.style.top = eval(763+(i-1)*26) + "px";
	} else {
		gizli_div.style.display = 'none';
	}
}

function calcRoute(i,j) {
	hesaplaText.innerHTML = 'Rota oluşturuluyor(%' + Math.round(eval(((i*aracdizi.length+j)/(aracdizi.length*musteridizi.length))*100)) + ')';
	if(i==0 && j==0){
		date = new Date();
	}
	var dist_after_empty = 0;
	var start = aracdizi[j].position;
	var end = musteridizi[i].position;
	var gum = gumrukdizi[i].position;
	var waypts = [];
	var selid = "dolu" + eval(j+1);
	selid = document.getElementById(selid);
	for(p=0;p<bosaltma_noktalar[j].length;p++){
		waypts.push({location:bosaltma_noktalar[j][p].konum, stopover:false});
	}
	if(selid.checked == true) {
		var ihr = delivery_dizi[j].position;
		waypts.push({location:ihr, stopover:true});
	} else {
		waypts.push({location:start, stopover:true});
	}
	waypts.push({location:end, stopover:true});
	waypts.push({location:gum, stopover:false});
	var kapi = "transit" + eval(j+1);
	var karse = document.getElementById(kapi);
	var cells = document.getElementById('aractablo').rows[j+2].getElementsByTagName('td');
	var bitis = new google.maps.LatLng(47.76830278, 12.94341111);
	if(cells[2].innerHTML == "Kara" || cells[2].innerHTML == "Oms.Romanya") {
		bitis = new google.maps.LatLng(48.40568611, 13.42816111);
	} else if(karse.checked == true){
		bitis = new google.maps.LatLng(45.13928889, 6.690794444);
	}
	var request = {                                                              
		origin      :start,      
		destination :bitis,
		waypoints   :waypts,
		travelMode  :google.maps.DirectionsTravelMode.DRIVING   
	};
	directionsService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			for(k=1;k<result.routes[0].legs.length;k++){
				dist_after_empty = dist_after_empty + (result.routes[0].legs[k].distance.value/1000);
			}
			km.push(dist_after_empty);
			bos_km.push(result.routes[0].legs[1].distance.value/1000);
			bos_mus_km.push(result.routes[0].legs[0].distance.value/1000);
			if(km.length < musteridizi.length*aracdizi.length){
				if(j < (aracdizi.length-1)){
					calcRoute(i,j+1);
				} else {
					calcRoute(i+1,0);
				}
			} else {
				hesaplaText.innerHTML = 'Rota oluşturuluyor(%100)';
				maliyet_hesapla();
			}
		}                                                                    
	});
}

function dom_event(e){
	var secilen, i;
	var dom_element = e.target;
	for(i=0;i<aracdizi.length;i++){
		aracdizi[i].setAnimation(null);
		delivery_dizi[i].setAnimation(null);
		if(dom_element.id == "truck" + (i+1)){
			secilen = i;
		}
	}
	aracdizi[secilen].setAnimation(google.maps.Animation.BOUNCE);
	delivery_dizi[secilen].setAnimation(google.maps.Animation.BOUNCE);
	var t=setTimeout("stop_animation(" + secilen + ")",5000);
}

function stop_animation(hh){
	aracdizi[hh].setAnimation(null);
	delivery_dizi[hh].setAnimation(null);
}

function delete_row(){
	var table = document.getElementById("aractablo");
	var rowCount = table.rows.length;
	if(rowCount > 2){
		table.deleteRow(rowCount-1);
		aracdizi[aracdizi.length-1].setMap(null);
		delivery_dizi[delivery_dizi.length-1].setMap(null);
		aracdizi.splice(aracdizi.length-1,1);
		delivery_dizi.splice(delivery_dizi.length-1,1);
		bosaltma_noktalar.splice(bosaltma_noktalar.length-1,1);
	}
}

function addRow() {
	var table = document.getElementById("aractablo");
	var rowCount = table.rows.length;
	var row = table.insertRow(rowCount);
	if(rowCount>2 && rowCount%2 == 1){
		row.className = "alt";
	}
	
	var cell1 = row.insertCell(0);
	cell1.innerHTML = aracdizi.length;
	cell1.align = "center";
	
	var cell2 = row.insertCell(1);
	cell2.innerHTML = "<select id='truck"+aracdizi.length+"' onchange='tabloguncelle(truck" + aracdizi.length + "," + aracdizi.length + ");'></select>"; 
	cell2.align = "center";
	var selid = "truck" + aracdizi.length;
	var arse = document.getElementById(selid);
	for (i=0;i<json.trucks.length;i++) {
		arse.options[i] = new Option (json.trucks[i].Plaka, i);
	}
	var dom_dom = "truck" + aracdizi.length;
	dom_dom = document.getElementById(dom_dom);
	google.maps.event.addDomListener(dom_dom, 'mouseover', dom_event);
	
	var hucre3 = "";
	hucre3 = json.trucks[0].Hat;
	var cell3 = row.insertCell(2);            
	cell3.innerHTML = "<select id='transmod"+aracdizi.length+"'><option value='Diğer'>Lütfen Seçiniz</option><option value='Kara'>Kara</option><option value='Oms.Romanya'>Oms.Romanya</option><option value='RoRo'>RoRo</option><option value='Toulon'>Toulon</option><option value='Petko'>Petko</option></select>";
	cell3.align = "center";
	var transmod_select = document.getElementById("transmod"+aracdizi.length);
	switch(hucre3){
		case "Kara":
			transmod_select.selectedIndex = 1;
			break;
		case "Oms.Romanya":
			transmod_select.selectedIndex = 2;
			break;
		case "RoRo":
			transmod_select.selectedIndex = 3;
			break;
		default:
			transmod_select.selectedIndex = 0;
	}
	
	var cell4 = row.insertCell(3);
	cell4.innerHTML = "<select id='trailer"+aracdizi.length+"' onchange='yrtabloguncelle(trailer" + aracdizi.length + "," + aracdizi.length + ");'></select>"; 
	cell4.align = "center";
	var yrselid = "trailer" + aracdizi.length;
	var yrarse = document.getElementById(yrselid);
	for (i=0;i<json.trailers.length;i++) {
		yrarse.options[i] = new Option (json.trailers[i].Plaka, i);
	}
	aracdizi[rowCount-2].title = arse.options[arse.selectedIndex].text + "/" + yrarse.options[yrarse.selectedIndex].text;

	var hucre4 = "";
	var hucre5 = "";
	var hucre6 = "";
	hucre4 = json.trailers[0].Yandan_Perdeli;
	hucre5 = json.trailers[0].Çatısı_Açılan;
	hucre6 = json.trailers[0].Çatısı_Yükselen;
	var cell5 = row.insertCell(4);
	var cell6 = row.insertCell(5);
	var cell7 = row.insertCell(6);             
	cell5.innerHTML = "<input type='checkbox' id='yandan" + aracdizi.length + "'>";
	cell6.innerHTML = "<input type='checkbox' id='ustten" + aracdizi.length + "'>";
	cell7.innerHTML = "<input type='checkbox' id='catiyukselen" + aracdizi.length + "'>";
	var check_arac_ozellik = "yandan" + aracdizi.length;
	check_arac_ozellik = document.getElementById(check_arac_ozellik);
	if(hucre4=="true"){
		check_arac_ozellik.checked = true;
	}
	check_arac_ozellik = "ustten" + aracdizi.length;
	check_arac_ozellik = document.getElementById(check_arac_ozellik);
	if(hucre5=="true"){
		check_arac_ozellik.checked = true;
	}
	check_arac_ozellik = "catiyukselen" + aracdizi.length;
	check_arac_ozellik = document.getElementById(check_arac_ozellik);
	if(hucre6=="true"){
		check_arac_ozellik.checked = true;
	}
		
	var cell8 = row.insertCell(7)
	cell8.innerHTML = "<select id='driver"+aracdizi.length+"' onchange='surucuguncelle(driver" + aracdizi.length + "," + aracdizi.length + ");'></select>"; 
	cell8.align = "center";
	var custselid = "driver" + aracdizi.length;
	var carse = document.getElementById(custselid);
	for (i=0;i<json.drivers.length;i++) {
		carse.options[i] = new Option (json.drivers[i].İsim, i);
	}
		
	var hucre9 = "";
	hucre9 = json.drivers[carse.options[carse.selectedIndex].value].ADR;
	var cell9 = row.insertCell(8);             
	cell9.innerHTML = "<input type='checkbox' id='adr" + aracdizi.length + "'>";
	var adr = "adr" + aracdizi.length;
	adr = document.getElementById(adr);
	if(hucre9 == "true"){	
		adr.checked = true;
	}
	cell9.align = "center";
	
	var cell10 = row.insertCell(9);
	cell10.innerHTML = "<input type='checkbox' id='transit" + aracdizi.length + "'>";
	cell10.align = "center";
		
	var cell11 = row.insertCell(10);
	cell11.innerHTML = "<input type='checkbox' id='dolu"+aracdizi.length+"' onclick='delivery_marker_goster(" + aracdizi.length + ");'>";
	cell11.align = "center";
		
	var cell12 = row.insertCell(11);
	cell12.innerHTML = "<select id='ihrcustomer"+aracdizi.length+"' onchange='delivery_marker_guncelle(" + aracdizi.length + ");'><option value='-1'>Boş</option></select><a href='javascript:bosaltma_noktalari(" + aracdizi.length + ")'>+</a>"; 
	cell12.align = "center";
	var ihrselid = "ihrcustomer" + aracdizi.length;
	var ihrarse = document.getElementById(ihrselid);
	for (i=0;i<json.customers.length;i++) {
		var ihrkonum = new google.maps.LatLng(json.customers[i].lat,json.customers[i].lng);
		ihrarse.options[i+1] = new Option(json.customers[i].İsim, i);
	}

	var cell13 = row.insertCell(12);
	cell13.innerHTML = "<input type='text' id='bdate"+aracdizi.length+"' style='font-size:10px; text-align:center;' />";
	cell13.align = "center";
	cell13 = "ihrcustomer" + aracdizi.length;
	cell13 = document.getElementById(cell13);
	cell13.disabled = true;
	bosaltma_noktalar[rowCount-2] = new Array();
}

function tabloguncelle(selectedselect,satir) {
	var cells = document.getElementById('aractablo').rows[satir+1].getElementsByTagName('td');
	var hucre3 = "";
	var hucre33 = "";
	var hucre333 = "";
	hucre3 = json.trucks[selectedselect.options[selectedselect.selectedIndex].value].Hat;
	hucre33 = json.trucks[selectedselect.options[selectedselect.selectedIndex].value].Plaka;
	var adr = "adr" + satir;
	adr = document.getElementById(adr);
	if(selectedselect.options[selectedselect.selectedIndex].text == "PIMK"){
		var transit_select = "transit" + satir;
		transit_select = document.getElementById(transit_select);
		var driver_select = "driver" + satir;
		var driver_select_kutu = document.getElementById(driver_select);
		transit_select.checked = true;
		driver_select_kutu.selectedIndex = 1;
		adr.checked = false;
	}
	selectedselect = selectedselect.options[selectedselect.selectedIndex].text;
	if(selectedselect.substring(0,2) == "AG"){
		var driver_select = "driver" + satir;
		driver_select = document.getElementById(driver_select);
		driver_select.selectedIndex = 2;
		driver_select = "truck" + satir;
		driver_select = document.getElementById(driver_select);
		var transit_select = "trailer" + satir;
		transit_select = document.getElementById(transit_select);
		transit_select.selectedIndex = eval(driver_select.selectedIndex + 59);
		adr.checked = false;
	}
	var transmod_select = document.getElementById("transmod"+satir);
	switch(hucre3){
		case "Kara":
			transmod_select.selectedIndex = 1;
			break;
		case "Oms.Romanya":
			transmod_select.selectedIndex = 2;
			break;
		case "RoRo":
			transmod_select.selectedIndex = 3;
			break;
		default:
			transmod_select.selectedIndex = 0;
	}
	hucre333 = "trailer" + satir;
	hucre333 = document.getElementById(hucre333);
	hucre333 = json.trailers[hucre333.options[hucre333.selectedIndex].value].Plaka;
	aracdizi[satir-1].setTitle(hucre33 + "/" + hucre333);
	delivery_dizi[satir-1].setTitle(hucre33 + "/" + hucre333 + " boşaltma noktası");
}

function yrtabloguncelle(selectedselect,satir) {
	var hucre4 = json.trailers[selectedselect.options[selectedselect.selectedIndex].value].Yandan_Perdeli;
	var hucre5 = json.trailers[selectedselect.options[selectedselect.selectedIndex].value].Çatısı_Açılan;
	var hucre6 = json.trailers[selectedselect.options[selectedselect.selectedIndex].value].Çatısı_Yükselen;
	var arac_ozellik = "yandan" + satir;
	arac_ozellik = document.getElementById(arac_ozellik);
	if(hucre4 == "true"){
		arac_ozellik.checked = true;
	} else {
		arac_ozellik.checked = false;
	}
	arac_ozellik = "ustten" + satir;
	arac_ozellik = document.getElementById(arac_ozellik);
	if(hucre5 == "true"){
		arac_ozellik.checked = true;
	} else {
		arac_ozellik.checked = false;
	}
	arac_ozellik = "catiyukselen" + satir;
	arac_ozellik = document.getElementById(arac_ozellik);
	if(hucre6 == "true"){
		arac_ozellik.checked = true;
	} else {
		arac_ozellik.checked = false;
	}
	hucre4 = json.trailers[selectedselect.options[selectedselect.selectedIndex].value].Plaka;
	hucre5 = "truck" + satir;
	hucre5 = document.getElementById(hucre5);
	hucre5 = json.trucks[hucre5.options[hucre5.selectedIndex].value].Plaka;
	aracdizi[satir-1].setTitle(hucre5 + "/" + hucre4);
	delivery_dizi[satir-1].setTitle(hucre5 + "/" + hucre4 + " boşaltma noktası");
}
	
function surucuguncelle(selectedselect,satir) {
	var adr = "adr" + satir;
	adr = document.getElementById(adr);
	var hucre9 = json.drivers[selectedselect.options[selectedselect.selectedIndex].value].ADR;
	if(hucre9 == "true"){
		adr.checked = true;
	} else {
		adr.checked = false;
	}
}
	
function delivery_marker_guncelle(i) {
	var delivery_konum = "ihrcustomer" + i;
	delivery_konum = document.getElementById(delivery_konum);
	delivery_konum = delivery_konum.options[delivery_konum.selectedIndex].value;
	delivery_konum = new google.maps.LatLng(json.customers[delivery_konum].lat, json.customers[delivery_konum].lng);
	delivery_dizi[i-1].setPosition(delivery_konum);
}

function custdelete_row(){
	var table = document.getElementById("musteritablo");
	var rowCount = table.rows.length;
	if(rowCount > 2){
		table.deleteRow(rowCount-1);
		musteridizi[musteridizi.length-1].setMap(null);
		gumrukdizi[gumrukdizi.length-1].setMap(null);
		musteridizi.splice(musteridizi.length-1,1);
		gumrukdizi.splice(gumrukdizi.length-1,1);
	}
}

function custaddrow() {
	date = new Date();
	if(date.getDay() == 5){
		date.setDate(date.getDate() + 3);
	} else {
		date.setDate(date.getDate() + 1);
	}
	var table = document.getElementById("musteritablo");
	var rowCount = table.rows.length;
	var row = table.insertRow(rowCount);
	if(rowCount>2 && rowCount%2 == 1){
		row.className = "alt";
	}
	var cell1 = row.insertCell(0);
	cell1.innerHTML = musteridizi.length;
	cell1.align = "center";
		
	var cell2 = row.insertCell(1);
	cell2.innerHTML = "<select id='customer"+musteridizi.length+"' onchange='custtabloguncelle(customer" + musteridizi.length + "," + musteridizi.length + ");'></select>"; 
	cell2.align = "center";
	var selid = "customer" + musteridizi.length;
	var arse = document.getElementById(selid);
	for (i=0;i<json.customers.length;i++) {
		arse.options[i] = new Option(json.customers[i].İsim, i);
	}
	musteridizi[rowCount-2].title = arse.options[0].text;
		
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	var cell6 = row.insertCell(5);
	var cell7 = row.insertCell(6);
	cell3.innerHTML ="<input type='checkbox' id='yandan_talep" + musteridizi.length + "'>";
	cell4.innerHTML ="<input type='checkbox' id='ustten_talep" + musteridizi.length + "'>";
	cell5.innerHTML ="<input type='checkbox' id='cati_yukselen_talep" + musteridizi.length + "'>";
	cell6.innerHTML ="<input type='checkbox' id='kara_talep" + musteridizi.length + "'>";
	cell7.innerHTML = "<input type='checkbox' id='adr_talep" + musteridizi.length + "'>";
		
	var cell8 = row.insertCell(7);
	cell8.align = "center";
	date.setHours(json.customers[0].Yükleme_Saati.Saat);
	date.setMinutes(json.customers[0].Yükleme_Saati.Dakika);
	cell8.innerHTML = "<input type='text' id='ydate"+musteridizi.length+"' style='font-size:10px; text-align:center; width:145px' value='" + eval(date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + "' />";
		
	var cell8 = row.insertCell(8);
	cell8.align = "center";
	cell8.innerHTML = "<input type='checkbox' id='tasols"+musteridizi.length+"' onclick='custtablotaseronguncelle(tasols" + musteridizi.length + "," + musteridizi.length + ");'>";
		
	var cell9 = row.insertCell(9);
	cell9.align = "center";
	cell9.innerHTML = "<input type='text' disabled='true' id='tasid"+musteridizi.length+"' size=10 style='text-align:center' />";

	var cell10 = row.insertCell(10);
	cell10.align = "center";
	cell10.innerHTML = "<input type='text' disabled='true' id='navlun"+musteridizi.length+"' size=5 style='text-align:right' />euro";
}

function custtabloguncelle(selectedselect,satir) {
	var talep_edilen = "yandan_talep" + satir;
	talep_edilen = document.getElementById(talep_edilen);
	if(json.customers[selectedselect.options[selectedselect.selectedIndex].value].Yandan_Perdeli_Talep == "true"){
		talep_edilen.checked = true;
	} else {
		talep_edilen.checked = false;
	}
	talep_edilen = "ustten_talep" + satir;
	talep_edilen = document.getElementById(talep_edilen);
	if(json.customers[selectedselect.options[selectedselect.selectedIndex].value].Çatısı_Açılan_Talep == "true"){
		talep_edilen.checked = true;
	} else {
		talep_edilen.checked = false;
	}
	talep_edilen = "cati_yukselen_talep" + satir;
	talep_edilen = document.getElementById(talep_edilen);
	if(json.customers[selectedselect.options[selectedselect.selectedIndex].value].Çatısı_Yükselen_Talep == "true"){
		talep_edilen.checked = true;
	} else {
		talep_edilen.checked = false;
	}
	talep_edilen = "kara_talep" + satir;
	talep_edilen = document.getElementById(talep_edilen);
	if(json.customers[selectedselect.options[selectedselect.selectedIndex].value].Hat_Talep == "land"){
		talep_edilen.checked = true;
	} else {
		talep_edilen.checked = false;
	}
	talep_edilen = "adr_talep" + eval(satir);
	talep_edilen = document.getElementById(talep_edilen);
	if(json.customers[selectedselect.options[selectedselect.selectedIndex].value].ADR_Talep=="true"){
		talep_edilen.checked = true;
	} else {
		talep_edilen.checked = false;
	}
	var hucre33 = json.customers[selectedselect.options[selectedselect.selectedIndex].value].İsim;
	var konum = new google.maps.LatLng(json.customers[selectedselect.options[selectedselect.selectedIndex].value].lat,json.customers[selectedselect.options[selectedselect.selectedIndex].value].lng);
	var gumkonum = new google.maps.LatLng(json.customers[selectedselect.options[selectedselect.selectedIndex].value].custlat,json.customers[selectedselect.options[selectedselect.selectedIndex].value].custlng);
	musteridizi[satir-1].setTitle(hucre33);
	gumrukdizi[satir-1].setPosition(gumkonum);
	musteridizi[satir-1].setPosition(konum);
	date.setHours(json.customers[selectedselect.options[selectedselect.selectedIndex].value].Yükleme_Saati.Saat);
	date.setMinutes(json.customers[selectedselect.options[selectedselect.selectedIndex].value].Yükleme_Saati.Dakika);
	hucre33 = "ydate" + satir;
	hucre33 = document.getElementById(hucre33);
	hucre33.value = eval(date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
}

function custtablotaseronguncelle(selectedselect,satir) {
	var id_kutusu = "tasid" + satir;
	var navlun_kutusu = "navlun" + satir;
	var cells = document.getElementById(id_kutusu);
	var cells2 = document.getElementById(navlun_kutusu);
	if(selectedselect.checked == true){
		cells.disabled = false;
		cells2.disabled = false;
	} else {
		cells.disabled = true;
		cells2.disabled = true;
	}
}
	
function maliyet_hesapla() {
	hesaplaText.innerHTML = 'Maliyetler hesaplanıyor';
	var bos_gunu;
	var bos_mus_mal;
	var bosaltma_musteri_ismi;
	var c = 0;
	var dolu_mu;
	var earliest_loading_hour;
	var en_erken_yukleme_saati;
	var en_gec_yukleme_saati;
	var gec_varis_maliyeti;
	var iyimser_varis_saati = new Date();
	var kac_saatte;
	var kotu_olasilik;
	var kotumser_var_saa = new Date();
	var latest_loading_hour;
	var mal_tabl_boyutu;
	var musteri_ismi;
	var navlun;
	var p_iyi_olasilik;
	var service_time;
	var taseron_id;
	var taseron_id2;
	var taseron_varmı;
	var taseronlar = [];
	var tasidtekrar;
	var yuk_gunu;
	var zero_found;
	for(i=0;i<musteridizi.length;i++){
		tasidtekrar = 0;
		taseron_varmı = "tasols"+eval(i+1);
		taseron_id = "tasid"+eval(i+1);
		taseron_varmı = document.getElementById(taseron_varmı);
		taseron_id = document.getElementById(taseron_id);
		if(taseron_varmı.checked == true){
			for(j=0;j<i;j++){	
				taseron_id2 = "tasid"+eval(j+1);
				taseron_id2 = document.getElementById(taseron_id2);
				if(taseron_id.value == taseron_id2.value && taseron_id.value != ""){
					tasidtekrar = 1;
				}
			}
			if(tasidtekrar == 0 && taseron_id.value != ""){
				taseron_sayisi = taseron_sayisi + 1;
				taseronlar[taseron_sayisi-1] = (taseron_id.value);
			}
		}
	}
	mal_tabl_boyutu = Math.max((aracdizi.length + taseron_sayisi),musteridizi.length);
	c = 0;
	var maliyet_tablo = new Array(mal_tabl_boyutu);
	var taboo = new Array(mal_tabl_boyutu);
	for(i=0;i<musteridizi.length;i++){
		maliyet_tablo[i] = new Array(mal_tabl_boyutu);
		musteri_ismi = "customer" + eval(i+1);
		navlun = "navlun"+eval(i+1);
		taseron_id = "tasid"+eval(i+1);
		var adr_talep = "adr_talep"+eval(i+1);
		adr_talep = document.getElementById(adr_talep);
		musteri_ismi = document.getElementById(musteri_ismi);
		navlun = document.getElementById(navlun);
		taseron_id = document.getElementById(taseron_id);
		bos_mus_mal = json.customers[musteri_ismi.options[musteri_ismi.selectedIndex].value].Araç_Verememe_Maliyeti;
		earliest_loading_hour = json.customers[musteri_ismi.options[musteri_ismi.selectedIndex].value].En_Erken_Yükleme_Saati;
		latest_loading_hour = json.customers[musteri_ismi.options[musteri_ismi.selectedIndex].value].En_Gec_Yükleme_Saati;
		for(j=0;j<aracdizi.length;j++){
			bosaltma_musteri_ismi = "ihrcustomer" + eval(j+1);
			var arac_ozellik = document.getElementById("transmod" + eval(j+1)).selectedIndex;
			var romork_yandan = "yandan" + eval(j+1);
			var romork_yandan_talep = "yandan_talep" + eval(i+1);
			var romork_ustten = "ustten" + eval(j+1);
			var romork_ustten_talep = "ustten_talep" + eval(i+1);
			var romork_catiyukselen = "catiyukselen" + eval(j+1);
			var romork_cati_yukselen_talep = "cati_yukselen_talep" + eval(i+1);
			var kara_talep = "kara_talep" + eval(i+1);
			var ortalama_hiz = json.drivers[document.getElementById("driver" + eval(j+1)).options[document.getElementById("driver" + eval(j+1)).selectedIndex].value].Ortalama_Hız;
			romork_yandan = document.getElementById(romork_yandan);
			romork_yandan_talep = document.getElementById(romork_yandan_talep);
			romork_ustten = document.getElementById(romork_ustten);
			romork_ustten_talep = document.getElementById(romork_ustten_talep);
			romork_catiyukselen = document.getElementById(romork_catiyukselen);
			romork_cati_yukselen_talep = document.getElementById(romork_cati_yukselen_talep);
			kara_talep = document.getElementById(kara_talep);
			kac_saatte = 0;
			var adr = "adr"+eval(j+1);
			bos_gunu = "bdate"+eval(j+1);
			dolu_mu = "dolu"+eval(j+1);
			yuk_gunu = "ydate"+eval(i+1);
			adr = document.getElementById(adr);
			bos_gunu = document.getElementById(bos_gunu);
			dolu_mu = document.getElementById(dolu_mu);
			yuk_gunu = document.getElementById(yuk_gunu);
			if((romork_yandan_talep.checked == true && romork_yandan.checked == false) || (romork_ustten_talep.checked == true && romork_ustten.checked == false) || (romork_cati_yukselen_talep.checked == true && romork_catiyukselen.checked == false) || (adr_talep.checked == true && adr.checked == false) || (kara_talep.checked == true && !(arac_ozellik == 1 || arac_ozellik == 2))){
				maliyet_tablo[i][j] = 100000;
				varis_olasilik_tablo.push(0);
				varis_saati_array.push("Araç Özellikleri Uymuyor");
			} else {
				if(yuk_gunu.value != ""){
					var yukleme_saati = new Date(yuk_gunu.value);
					var bosaltmaya_varis_saati = new Date();
					if(dolu_mu.checked == true){
						bosaltma_musteri_ismi = document.getElementById(bosaltma_musteri_ismi);
						service_time = json.customers[bosaltma_musteri_ismi.options[bosaltma_musteri_ismi.selectedIndex].value].Servis_Süresi;
						kac_saatte = Math.floor(bos_mus_km[i*aracdizi.length + j]/(ortalama_hiz/60));
						kac_saatte = Math.floor(kac_saatte/(9*60))*20*60 + (kac_saatte - Math.floor(kac_saatte/(9*60))*9*60);
						bosaltmaya_varis_saati.setMinutes(bosaltmaya_varis_saati.getMinutes() + kac_saatte);
						if(bosaltmaya_varis_saati.getHours() < earliest_loading_hour){
							bosaltmaya_varis_saati.setHours(earliest_loading_hour);
							bosaltmaya_varis_saati.setMinutes(0);
							bosaltmaya_varis_saati.setSeconds(0);
						} else if(bosaltmaya_varis_saati.getHours() >= latest_loading_hour){
							bosaltmaya_varis_saati.setHours(earliest_loading_hour);
							bosaltmaya_varis_saati.setDate(bosaltmaya_varis_saati.getDate() + 1);
							bosaltmaya_varis_saati.setMinutes(0);
							bosaltmaya_varis_saati.setSeconds(0);
						}
						if(bos_gunu.value != ""){
							var termin = new Date(bos_gunu.value);
							bosaltmaya_varis_saati = new Date(Math.max(termin.getTime(),bosaltmaya_varis_saati.getTime()));
						}
					}
					kac_saatte = Math.floor(bos_km[i*aracdizi.length + j]/(ortalama_hiz/60));
// Sürüş süresini dikkate alarak kaç saatte'yi güncelle---------------------------------------------------------------------------------------------------
					if(kac_saatte > (18*60)){
						kac_saatte = 10000;
						kotu_olasilik = 10000;
					} else {
						if(kac_saatte > (9*60)){
							kac_saatte = 20*60 + (kac_saatte - 9*60);
							p_iyi_olasilik = (9*60-(kac_saatte - 20*60))/(9*60);
							kotu_olasilik = 31*60 + (kac_saatte - 9*60);
						} else {
							p_iyi_olasilik = (9*60 - kac_saatte)/(9*60);
							kotu_olasilik = 11*60 + kac_saatte;
						}
					}
// -------------------------------------------------------------------------------------------------------------------------------------------------------
					iyimser_varis_saati = new Date(bosaltmaya_varis_saati);
					kotumser_var_saa = new Date(bosaltmaya_varis_saati);
					iyimser_varis_saati.setMinutes(iyimser_varis_saati.getMinutes() + kac_saatte);
					if(dolu_mu.checked == true){
						iyimser_varis_saati.setHours(iyimser_varis_saati.getHours() + service_time);
					}
					kotumser_var_saa.setMinutes(kotumser_var_saa.getMinutes() + kotu_olasilik);
					if(iyimser_varis_saati.getTime() > yukleme_saati.getTime()){
						varis_olasilik_tablo.push(0);
					} else if(kotumser_var_saa.getTime() > yukleme_saati.getTime()){
						varis_olasilik_tablo.push(p_iyi_olasilik);
					} else {
						varis_olasilik_tablo.push(1);
					}
					en_erken_yukleme_saati = new Date(yukleme_saati);
					en_gec_yukleme_saati = new Date(yukleme_saati);
					en_erken_yukleme_saati.setHours(earliest_loading_hour);
					en_gec_yukleme_saati.setHours(latest_loading_hour);
					if(iyimser_varis_saati.getHours() > en_gec_yukleme_saati.getHours()){
						iyimser_varis_saati.setHours(en_erken_yukleme_saati.getHours());
						iyimser_varis_saati.setDate(iyimser_varis_saati.getDate() + 1);
					}
					if(kac_saatte==10000){
						var cok_gec_varis_icin_bilgi = new Date(bosaltmaya_varis_saati);
						cok_gec_varis_icin_bilgi.setHours(cok_gec_varis_icin_bilgi.getHours() + 40);
						varis_saati_array.push(cok_gec_varis_icin_bilgi.toLocaleString() + " sonrasında");
					} else {
						varis_saati_array.push(iyimser_varis_saati);
					}
					kac_saatte = Math.max(0,(iyimser_varis_saati.getTime() - yukleme_saati.getTime())/(1000*60*60));
				} else {
					varis_olasilik_tablo.push(1);
					varis_saati_array.push("Önemsiz");
				}
				gec_varis_maliyeti = json.customers[musteri_ismi.options[musteri_ismi.selectedIndex].value].Geç_Kalma_Maliyeti;
				if(arac_ozellik ==1) {
					maliyet_tablo[i][j] = 2733.8896 + km[c]*0.44214 + kac_saatte * gec_varis_maliyeti;
				} else if(arac_ozellik == 2) {
					maliyet_tablo[i][j] = 2750 + kac_saatte * gec_varis_maliyeti + bos_km[c]*0.85;
				} else if(arac_ozellik == 4) {
					maliyet_tablo[i][j] = 2750 + km[c]*0.0828 + Math.max((km[c]-1003)*0.37629,0) - Math.max((1003-km[c])*0.26442,0) + kac_saatte * gec_varis_maliyeti;
				} else if(arac_ozellik == 5) {
					maliyet_tablo[i][j] = 1550 + json.customers[musteri_ismi.options[musteri_ismi.selectedIndex].value].Petko + kac_saatte * gec_varis_maliyeti + bos_km[c]*0.85 + Math.max(Math.floor(kac_saatte/24)-1,0)*100;
				} else {
					var transit_mi = "transit" + eval(j+1);
					transit_mi = document.getElementById(transit_mi);
					if(transit_mi.checked == true){
						maliyet_tablo[i][j] = 2812.64400 + km[c]*0.45905 + kac_saatte * gec_varis_maliyeti;
					} else {
						maliyet_tablo[i][j] = 2519.54404 + km[c]*0.44214 + kac_saatte * gec_varis_maliyeti;
					}
				}
			}
			c = c + 1;
		}
		for(j=aracdizi.length;j<(aracdizi.length + taseron_sayisi);j++){
			if(taseron_id.value == "" && navlun.value != ""){
				alert("Lütfen taşeronu niteleyecek (plaka...vs.) bir değer giriniz!");
				hesaplaText.innerHTML = 'HESAPLA';
				return;
			} else if(taseronlar[j-aracdizi.length] == taseron_id.value){
				maliyet_tablo[i][j] = navlun.value;
			} else {
				maliyet_tablo[i][j] = 100000;
			}
		}
		for(j=(aracdizi.length + taseron_sayisi);j<mal_tabl_boyutu;j++){
			maliyet_tablo[i][j] = bos_mus_mal;
		}
	}
	for(i=musteridizi.length;i<mal_tabl_boyutu;i++){
		maliyet_tablo[i] = new Array(mal_tabl_boyutu);
		for(j=0;j<aracdizi.length;j++){
			dolu_mu = "dolu"+eval(j+1);
			dolu_mu = document.getElementById(dolu_mu);
			if(dolu_mu.checked == true){
				maliyet_tablo[i][j] = 0;
			} else {
				bos_gunu = "bdate"+eval(j+1);
				bos_gunu = document.getElementById(bos_gunu);
				if(bos_gunu.value == ""){
					maliyet_tablo[i][j] = 100;
				} else {
					bosaltmaya_varis_saati = new Date(bos_gunu.value);
					yukleme_saati = new Date();
					if(yukleme_saati.getTime()-bosaltmaya_varis_saati.getTime()>0){
						yukleme_saati = ((yukleme_saati.getTime()-bosaltmaya_varis_saati.getTime())/(1000*60*60))*5;
						maliyet_tablo[i][j] = 100 + yukleme_saati;
					} else {
						maliyet_tablo[i][j] = 0;
					}
				}
			}
		}
		for(j=aracdizi.length;j<mal_tabl_boyutu;j++){
			maliyet_tablo[i][j] = 0;
		}
	}
	var table = document.getElementById("mal_tablo_ilk");
	for(i=0;i<mal_tabl_boyutu;i++){
		var rowCount = table.rows.length;
		var row = table.insertRow(rowCount);
		for(j=0;j<mal_tabl_boyutu;j++){
			var cell = row.insertCell(j);
			cell.innerHTML = maliyet_tablo[i][j];
			cell.align = "center";
		}
	}
	var dongu = 1;
	hesaplaText.innerHTML = 'Planlama Yapılıyor';
	while(dongu == 1) {
		for(i=0;i<mal_tabl_boyutu;i++){
			var minimum = maliyet_tablo[i][0];
			for(j=1;j<mal_tabl_boyutu;j++) {
				if(maliyet_tablo[i][j] < minimum){
					minimum = maliyet_tablo[i][j];
				}
			}
			for(j=0;j<mal_tabl_boyutu;j++) {
				maliyet_tablo[i][j] = maliyet_tablo[i][j]-minimum;
			}
		}
		for(i=0;i<mal_tabl_boyutu;i++) {
			var minimum = maliyet_tablo[0][i];
			for(j=1;j<mal_tabl_boyutu;j++) {
				if(maliyet_tablo[j][i] < minimum){
					minimum = maliyet_tablo[j][i];
				}
			}
			for(j=0;j<mal_tabl_boyutu;j++) {
				maliyet_tablo[j][i] = maliyet_tablo[j][i]-minimum;
			}
		}
		var sifir_sayisi;
		var atama;
		atananrow = [];
		atanancolumn = [];
		for(i=0;i<mal_tabl_boyutu;i++){
			taboo[i] = new Array(mal_tabl_boyutu);
		}
		for(i=0;i<mal_tabl_boyutu;i++){
			for(j=0;j<mal_tabl_boyutu;j++){
				taboo[i][j]=0;
			}
		}
		var atandı = 1;
		while(atandı == 1){
			atandı = 0;
			for(i=0;i<mal_tabl_boyutu;i++){
				atama = 0;
				sifir_sayisi = 0;
				for(j=0;j<mal_tabl_boyutu;j++){
					if(maliyet_tablo[i][j] == 0){
						sifir_sayisi = sifir_sayisi + 1;
					}
				}
				for(k=0;k<atananrow.length;k++){
					if(i == atananrow[k]){
						atama = 1;
					}
				}
				if(atama == 0){
					for(j=0;j<mal_tabl_boyutu;j++){
						if(maliyet_tablo[i][j] == 0){
							for(k=0;k<atanancolumn.length;k++){
								if(j == atanancolumn[k]){
									atama = atama + 1;
								}
							}
						}
					}
					if(sifir_sayisi - atama == 1){
						for(j=0;j<mal_tabl_boyutu;j++){
							if(maliyet_tablo[i][j] == 0){
								atama = 0;
								for(k=0;k<atanancolumn.length;k++){
									if(j == atanancolumn[k]){
										atama = 1;
									}
								}
								if(atama == 0) {
									atananrow.push(i);
									atanancolumn.push(j);
									taboo[i][j]=1;
									atandı = 1;
								}
							}
						}
					}
				}
			}
			for(i=0;i<mal_tabl_boyutu;i++){
				atama = 0;
				sifir_sayisi = 0;
				for(j=0;j<mal_tabl_boyutu;j++){
					if(maliyet_tablo[j][i]==0){
						sifir_sayisi = sifir_sayisi+1;
					}
				}
				for(k=0;k<atanancolumn.length;k++){
					if(i == atanancolumn[k]){
						atama = 1;
					}
				}
				if(atama == 0){
					for(j=0;j<mal_tabl_boyutu;j++){
						if(maliyet_tablo[j][i] == 0){
							for(k=0;k<atananrow.length;k++){
								if(j == atananrow[k]){
									atama = atama + 1;
								}
							}
						}
					}
					if(sifir_sayisi - atama == 1){
						for(j=0;j<mal_tabl_boyutu;j++){
							if(maliyet_tablo[j][i] == 0){
								atama = 0;
								for(k=0;k<atananrow.length;k++){
									if(j==atananrow[k]){
										atama = 1;
									}
								}
								if(atama == 0){
									atananrow.push(j);
									atanancolumn.push(i);
									taboo[j][1]=1;
									atandı = 1;
								}
							}
						}
					}
				}
			}
			if(atandı == 0){
				for(i=0;i<mal_tabl_boyutu;i++){
					j=0;
					while(j<mal_tabl_boyutu && atandı == 0){
						atama = 0;
						if(maliyet_tablo[i][j] == 0){
							for(k=0;k<atananrow.length;k++){
								if(i == atananrow[k]){
									atama = 1;
								}
							}
							for(k=0;k<atanancolumn.length;k++){
								if(j == atanancolumn[k]){
									atama = 1;
								}
							}
							if(atama == 0){
								atananrow.push(i);
								atanancolumn.push(j);
								taboo[i][j]=1;
								atandı = 1;
							}
						}
						j = j+1;
					}
				}
			}
		}
		var aveb = 0;
		while(aveb==0){
			aveb=1;
			var a = [];
			var b = [];
			for(i=0;i<mal_tabl_boyutu;i++){
				a.push(1);
			}
			for(i=0;i<mal_tabl_boyutu;i++){
				b.push(1);
			}
			for(i=0;i<atananrow.length;i++){
				for(j=0;j<mal_tabl_boyutu;j++){
					if(j == atananrow[i]){
						a[j] = 0;
					}
				}
			}
			var degisim = 1;
			while(degisim == 1){
				degisim = 0;
				for(i=0;i<mal_tabl_boyutu;i++){
					if(a[i] == 1){
						for(j=0;j<mal_tabl_boyutu;j++){
							if(maliyet_tablo[i][j] == 0){
								if (b[j] != 0){
									b[j] = 0;
									degisim = 1;
								}
							}
						}
					}
				}
				i=0;
				var cikis = 0;
				while(i<mal_tabl_boyutu && cikis == 0){
					if (b[i] == 0){
						var atanan_column_var = 0;
						for(j=0;j<atanancolumn.length;j++){
							if(atanancolumn[j] == i){
								atanan_column_var = 1;
								if(a[atananrow[j]] != 1){
									a[atananrow[j]] = 1;
									degisim = 1;
								}
							}
						}
						if(atanan_column_var == 0){
							degisim = 0;
							var silinen_column = i;
							var hoppala = 0;
							var gecici = mal_tabl_boyutu;
							while(hoppala == 0){
								hoppala = 1;
								cikis = 1;
								var min_min = 10000000;
								for(f=0;f<mal_tabl_boyutu;f++){
									if(maliyet_tablo[f][silinen_column]==0){
										min_min = Math.min(min_min,taboo[f][silinen_column]);
									}
								}
								for(f=0;f<mal_tabl_boyutu;f++){
									if(taboo[f][silinen_column]==min_min && maliyet_tablo[f][silinen_column]==0){
										j=f;
									}
								}
								var atanan_row_var = 0;
								for(k=0;k<atanancolumn.length;k++){
									if(atananrow[k]==j){
										atanan_row_var = 1;
										var kk = k;
									}
								}
								if(atanan_row_var==1){
									gecici = silinen_column;
									silinen_column = atanancolumn[kk];
									taboo[atananrow[kk]][atanancolumn[kk]]=taboo[atananrow[kk]][atanancolumn[kk]]+1;
									atanancolumn[kk] = gecici;
									gecici = atananrow[kk];
									hoppala = 0;
								} else {
									atananrow.push(j);
									atanancolumn.push(silinen_column);
									aveb=0;
								}
							}
						}
					}
					i=i+1;
				}
			}
		}
		var taranan;
		taranan = 0;
		for(i=0;i<mal_tabl_boyutu;i++){
			taranan = taranan + 1 - a[i] + 1 - b[i];
		}
		var minimum;
		minimum = 10000000;
		if(taranan != mal_tabl_boyutu){
			zero_found = 0;
			while(zero_found==0){
				for(i=0;i<mal_tabl_boyutu;i++){
					for(j=0;j<mal_tabl_boyutu;j++){
						if(a[i] != 0 && b[j] != 0){
							minimum = Math.min(minimum, maliyet_tablo[i][j]);
						}
					}
				}
				if(minimum == 0){
					b[j] = 0;
					minimum = 10000000;
				} else {
					zero_found = 1;
				}
			}
			for(i=0;i<mal_tabl_boyutu;i++){
				for(j=0;j<mal_tabl_boyutu;j++){
					if(a[i] != 0 && b[j] != 0){
						maliyet_tablo[i][j] = maliyet_tablo[i][j] - minimum;
					} else if(a[i] == 0 && b[j] == 0) {
						maliyet_tablo[i][j] = maliyet_tablo[i][j] + minimum;
					}
				}
			}
		} else {
			dongu = 0;
			calcFinalRoute(0);
		}
	}
	c=0;
	table = document.getElementById("mal_tablo_km");
	for(i=0;i<musteridizi.length;i++){
		var rowCount = table.rows.length;
		var row = table.insertRow(rowCount);
		for(j=0;j<aracdizi.length;j++){
			var cell = row.insertCell(j);
			cell.innerHTML = km[c];
			cell.align = "center";
			c=c+1;
		}
	}
}

function calcFinalRoute(i) {
	if(atananrow[i] < musteridizi.length && atanancolumn[i] < aracdizi.length) {
		var start = aracdizi[atanancolumn[i]].position;
		var end = musteridizi[atananrow[i]].position;
		var waypts = [];
		var selid = "dolu" + eval(atanancolumn[i]+1);
		var arse = document.getElementById(selid);
		for(p=0;p<bosaltma_noktalar[atanancolumn[i]].length;p++){
			waypts.push({location:bosaltma_noktalar[atanancolumn[i]][p].konum, stopover:true});
		}
		if(arse.checked == true) {
			var ihr = delivery_dizi[atanancolumn[i]].position;
			waypts.push({location:ihr, stopover:true});
		}
		var request = {                                                              
			origin      :start,      
			destination :end,
			waypoints   :waypts,
			travelMode  :google.maps.DirectionsTravelMode.DRIVING   
		};   
		directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				renderDirections(result);
				overview_path_array[i] = result.routes[0].overview_path;
				if(i<(atananrow.length-1)){
					calcFinalRoute(i+1);
				} else {
					ozet_tablo_yazdir();
				}
			}                                                                  
		});
	} else {
		if(i<(atananrow.length-1)){
			var a = [];
			overview_path_array[i] = a;
			calcFinalRoute(i+1);
		} else {
			ozet_tablo_yazdir();
		}
	}
}

function ozet_tablo_yazdir() {
	var mu_ta_ce;
	var ar_ta_ce;
	var sondate = new Date();
	var cozum_dakika = Math.floor((sondate.getTime()-date.getTime())/(1000*60));
	var cozum_saniye = Math.floor(((sondate.getTime()-date.getTime())-(cozum_dakika*60*1000))/1000);
	var arac_table;
	table = document.getElementById("mal_tablo");
	row = table.insertRow(0);
	cell = row.insertCell(0);
	cell.innerHTML = "Çözüm Süresi: " + cozum_dakika + " dakika " + cozum_saniye + " saniye";
	cell.colSpan = 8;
	cell.style.backgroundColor = "#336699";
	cell.style.color = "#FFFFFF";
	cell.align = "center";
	row = table.insertRow(1);
	cell = row.insertCell(0);
	cell.innerHTML = "No";
	cell.align = "center";
	cell = row.insertCell(1);
	cell.innerHTML = "Müşteri";
	cell.align = "center";
	cell = row.insertCell(2);
	cell.innerHTML = "Araç";
	cell.align = "center";
	cell = row.insertCell(3);
	cell.innerHTML = "İthalat Aktivitesi (km)";
	cell.align = "center";
	cell = row.insertCell(4);
	cell.innerHTML = "Boş Mesafe (km)";
	cell.align = "center";
	cell = row.insertCell(5);
	cell.innerHTML = "Zamanında Varış Olasılığı";
	cell.align = "center";
	cell = row.insertCell(6);
	cell.innerHTML = "Yükleme İçin Hazır Olunabilecek Saat";
	cell.align = "center";
	cell = row.insertCell(7);
	cell.innerHTML = "Boşaltma Müşterisine Mesafe (km)";
	cell.align = "center";
	for(l=0;l<atananrow.length;l++){
		mu_ta_ce = "customer" + eval(atananrow[l]+1);
		ar_ta_ce = "truck" + eval(atanancolumn[l]+1);
		if(atananrow[l] < musteridizi.length){
			mu_ta_ce = document.getElementById(mu_ta_ce);
		}
		if(atanancolumn[l] < aracdizi.length){
			ar_ta_ce = document.getElementById(ar_ta_ce);
			arac_table = document.getElementById("aractablo").rows[atanancolumn[l]+2].getElementsByTagName('td');
		}
		rowCount = table.rows.length;
		row = table.insertRow(rowCount);
		cell = row.insertCell(0);
		cell.innerHTML = rowCount-1;
		cell.align = "center";
		cell = row.insertCell(1);
		if(atananrow[l] < musteridizi.length){
			cell.innerHTML = eval(atananrow[l]+1) + ". " + mu_ta_ce.options[mu_ta_ce.selectedIndex].text;
		} else {
			cell.innerHTML = "Planlanmayan araç";
		}
		cell.align = "center";
		cell = row.insertCell(2);
		if(atanancolumn[l] < aracdizi.length){
			cell.innerHTML = eval(atanancolumn[l]+1) + ". " + ar_ta_ce.options[ar_ta_ce.selectedIndex].text;
		} else if(atanancolumn[l] < (aracdizi.length+taseron_sayisi)){
			cell.innerHTML = "Taşeron araç";
		} else {
			cell.innerHTML = "Karşılanamayan talep";
		}
		cell.align = "center";
		cell = row.insertCell(3);
		cell2 = row.insertCell(4);
		cell3 = row.insertCell(5);
		cell4 = row.insertCell(6);
		cell5 = row.insertCell(7);
		if(atanancolumn[l] < aracdizi.length && atananrow[l] < musteridizi.length){
			if(arac_table[2].innerHTML == "Kara" || arac_table[2].innerHTML=="Oms.Romanya"){
				cell.innerHTML = Math.round(km[atananrow[l] * aracdizi.length + atanancolumn[l]]+2119);
			} else {
				cell.innerHTML = Math.round(km[atananrow[l] * aracdizi.length + atanancolumn[l]]+380);
			}
			cell2.innerHTML = Math.round(bos_km[atananrow[l] * aracdizi.length + atanancolumn[l]]);
			cell3.innerHTML = "%" + Math.round(varis_olasilik_tablo[atananrow[l] * aracdizi.length + atanancolumn[l]]*100);
			cell4.innerHTML = varis_saati_array[atananrow[l] * aracdizi.length + atanancolumn[l]].toLocaleString();
			var dolu_arac = "dolu" + eval(atanancolumn[l]+1);
			if(document.getElementById(dolu_arac).checked == false){
				cell5.innerHTML = "Araç boş"
			} else {
				cell5.innerHTML = Math.round(bos_mus_km[atananrow[l] * aracdizi.length + atanancolumn[l]]);
			}
		} else {
			cell.innerHTML = "-";
			cell2.innerHTML = "-";
			cell3.innerHTML = "-";
			cell4.innerHTML = "-";
			cell5.innerHTML = "-";
		}
		cell.align = "center";
		cell2.align = "center";
		cell3.align = "center";
		cell4.align = "center";
		cell5.align = "center";
	}
	var toplamlar = 0;
	var toplamlar2 = 0;
	row = table.insertRow(table.rows.length);
	cell = row.insertCell(0);
	cell.innerHTML = "Toplam:";
	cell.colSpan = 3;
	cell.style.backgroundColor = "#336699";
	cell.style.color = "#FFFFFF";
	cell.align = "center";
	cell = row.insertCell(1);
	for(i=2;i<table.rows.length-1;i++){
		var eleman = table.rows[i].getElementsByTagName('td');
		if(eleman[3].innerHTML != "-"){
			toplamlar = eval(toplamlar + parseInt(eleman[3].innerHTML));
		}
		if(eleman[4].innerHTML != "-"){
			toplamlar2 = eval(toplamlar2 + parseInt(eleman[4].innerHTML));
		}
	}
	cell.innerHTML = toplamlar;
	cell.style.backgroundColor = "#336699";
	cell.style.color = "#FFFFFF";
	cell.align = "center";
	cell = row.insertCell(2);
	cell.innerHTML = toplamlar2;
	cell.style.backgroundColor = "#336699";
	cell.style.color = "#FFFFFF";
	cell.align = "center";
	cell = row.insertCell(3);
	cell.colSpan = 3;
	cell.style.backgroundColor = "#336699";
	cell.style.color = "#FFFFFF";
	cell.align = "center";
	cell.innerHTML = "Boş km oranı: %" + Math.floor(100*toplamlar2/toplamlar);
	hesaplaText.innerHTML = '<b>Hesaplandı</b>';
}
	
function drawPath(posit) {
	var arac_dizisıra = 100000;
	var musteri_dizisıra = 100000;
	var degisim = 0;
	for(i=0;i<aracdizi.length;i++){
		if(aracdizi[i].position == posit){
			arac_dizisıra = i;
		}
	}
	for(i=0;i<musteridizi.length;i++){
		if(musteridizi[i].position == posit){
			musteri_dizisıra = i;
		}
	}
	if(arac_dizisıra != 100000){
		for(i=0;i<atanancolumn.length;i++){
			if(atanancolumn[i] == arac_dizisıra && atananrow[i] < musteridizi.length){
				arac_dizisıra = i;
				degisim = 1;
			}
		}
		if(degisim == 0){
			arac_dizisıra = 100000;
		}
	}
	degisim = 0;
	if(musteri_dizisıra != 100000){
		for(i=0;i<atananrow.length;i++){
			if(atananrow[i] == musteri_dizisıra && atanancolumn[i] < aracdizi.length){
				musteri_dizisıra = i;
				degisim = 1;
			}
		}
		if(degisim == 0){
			musteri_dizisıra = 100000;
		}
	}
	if(arac_dizisıra < 100000){
		i = arac_dizisıra;
	} else if(musteri_dizisıra < 100000){
		i = musteri_dizisıra;
	} else {
		i = 100000;
	}
	if(i<atananrow.length){
		chart = new google.visualization.ColumnChart(document.getElementById('elevation_chart'));
		var path = overview_path_array[i];
       	var pathRequest = {
       		'path'		: path,
       		'samples'	: 256
       	}
       	elevator.getElevationAlongPath(pathRequest, plotElevation);
	} else {
		document.getElementById('elevation_chart').style.border = '1px solid black';
		document.getElementById('elevation_chart').innerHTML = "<font face='Verdana' color='#000000' size='1' style='position:absolute; left:12%; right:10%; top:45%'>Lütfen rota oluşturulmuş bir müşteri ya da araç seçiniz.</font>";
	}
}

function plotElevation(results, status) {
   	if (status == google.maps.ElevationStatus.OK) {
   		elevations = results;
   		var elevationPath = [];
      	for (var i = 0; i < results.length; i++) {
      		elevationPath.push(elevations[i].location);
       	}
       	var data = new google.visualization.DataTable();
       	data.addColumn('string', 'Sample');
       	data.addColumn('number', 'Rakım');
       	for (i = 0; i < results.length; i++) {
       		data.addRow(['', elevations[i].elevation]);
       	}
       	document.getElementById('elevation_chart').style.display = 'block';
		document.getElementById('elevation_chart').style.border = '1px solid white';
       	chart.draw(data, {
       		legend: 'none',
       		titleY: 'Rota Rakım (m)',
			titleX: '                Araç---------------------------------------------------------------------Müşteri'
       	});
	}
}