var customers = [],
	vehicles = [],
	atanancolumn = [],
	atananrow = [],
	bos_km = [],
	bos_mus_km = [],
	bosaltma_noktalar = [],
	date,
	delivery_dizi = [],
	directionsDisplay= new google.maps.DirectionsRenderer(),
	directionsService = new google.maps.DirectionsService(),
	gumrukdizi = [],
	hesaplaText,
	km = [],
	map,
	overview_path_array = [],
	pinType = 1,
	renk,
	taseron_sayisi = 0,
	varis_olasilik_tablo = [],
	varis_saati_array = [];

$(document).ready(function(){
	initialize();
	$(".mainContent").on("click", ".delBox", function(e){
		e.preventDefault();
		$(this).closest(".panel").remove();
	});
	$(".mainContent label").click(function(){
		if($(this).hasClass("first")){
			pinType = 1;
		} else {
			pinType = 0;
		}
	});
});

var renderDirections = function(result){
	renk = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
	var rendererOptions = {
		map: map,
		polylineOptions : {
			strokeColor: renk,
			strokeOpacity: 1.0,
			strokeWeight: 5
		}
	};
    var directionsRenderer = new google.maps.DirectionsRenderer(rendererOptions);
    directionsRenderer.setDirections(result);
};

var check_routable = function(location){
	var testDestination= new google.maps.LatLng(46.20279, 5.21924599999999);
	var request = {
		origin      :location,
		destination :testDestination,
		travelMode  :google.maps.DirectionsTravelMode.DRIVING
	};
	directionsService.route(request, function(result, status) {
		if (status !== google.maps.DirectionsStatus.OK) {
			alert("Cannot build route. Please change the marker location!");
		}
	});
};
  
var addMarker = function(location) {
	var marker = new google.maps.Marker({
		position : location,
		map		 : map,
		draggable: true
	});
	google.maps.event.addListener(marker, 'click', function(event) {
		drawPath(event.latLng);
		check_routable(event.latLng);
	});
	google.maps.event.addListener(marker, 'dragend', function(event) {
		check_routable(event.latLng);
	});
	if(pinType){
		vehicles.push(new Vehicle(marker));
		$("#vehicles").append($(".addVehicleTemplate").find("tbody").html());
	} else {
		customers.push(new Customer(marker));
		$("#customers").append($(".addCustomerTemplate").find("tbody").html());
	}
};

var initialize = function() {
	var center = new google.maps.LatLng(48.85605278, 12.297894444);
	var options = {                                                                      
		zoom: 4,
		center: center,
		streetViewControl: false
	};
	map = new google.maps.Map($('#map-canvas')[0], options);
	google.maps.event.addListener(map, 'click', function(event){
		addMarker(event.latLng);
	});
	directionsDisplay.setMap(map);
};

var calcRoute = function(i,j) {
	hesaplaText.innerHTML = 'Working on route(%' + Math.round((((i*vehicles.length+j)/(vehicles.length*customers.length))*100)) + ')';
	if(!i && !j){
		date = new Date();
	}
	var dist_after_empty = 0;
	var start = vehicles[j].position;
	var end = customers[i].position;
	var gum = gumrukdizi[i].position;
	var waypts = [];
	var selid = "dolu" + (j+1);
	selid = document.getElementById(selid);
	for(var p=0;p<bosaltma_noktalar[j].length;p++){
		waypts.push({location:bosaltma_noktalar[j][p].konum, stopover:false});
	}
	if(selid.checked) {
		var ihr = delivery_dizi[j].position;
		waypts.push({location:ihr, stopover:true});
	} else {
		waypts.push({location:start, stopover:true});
	}
	waypts.push({location:end, stopover:true});
	waypts.push({location:gum, stopover:false});
	var kapi = "transit" + (j+1);
	var karse = document.getElementById(kapi);
	var cells = document.getElementById('aractablo').rows[j+2].getElementsByTagName('td');
	var bitis = new google.maps.LatLng(47.76830278, 12.94341111);
	if(cells[2].innerHTML == "Kara" || cells[2].innerHTML == "Oms.Romanya") {
		bitis = new google.maps.LatLng(48.40568611, 13.42816111);
	} else if(karse.checked){
		bitis = new google.maps.LatLng(45.13928889, 6.690794444);
	}
	var request = {                                                              
		origin      :start,      
		destination :bitis,
		waypoints   :waypts,
		travelMode  :google.maps.DirectionsTravelMode.DRIVING   
	};
	directionsService.route(request, function(result, status) {
		if (status === google.maps.DirectionsStatus.OK) {
			for(var k=1; k<result.routes[0].legs.length; k++){
				dist_after_empty = dist_after_empty + (result.routes[0].legs[k].distance.value/1000);
			}
			km.push(dist_after_empty);
			bos_km.push(result.routes[0].legs[1].distance.value/1000);
			bos_mus_km.push(result.routes[0].legs[0].distance.value/1000);
			if(km.length < customers.length*vehicles.length){
				if(j < (vehicles.length-1)){
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
};
	
var maliyet_hesapla = function() {
	hesaplaText.innerHTML = 'Maliyetler hesaplanıyor';
	var bos_gunu,
		bos_mus_mal,
		bosaltma_musteri_ismi,
		c = 0,
		dolu_mu,
		earliest_loading_hour,
		en_erken_yukleme_saati,
		en_gec_yukleme_saati,
		gec_varis_maliyeti,
		iyimser_varis_saati = new Date(),
		kac_saatte,
		kotu_olasilik,
		kotumser_var_saa = new Date(),
		latest_loading_hour,
		mal_tabl_boyutu,
		musteri_ismi,
		navlun,
		p_iyi_olasilik,
		service_time,
		taseron_id,
		taseron_id2,
		taseron_varmi,
		taseronlar = [],
		tasidtekrar,
		yuk_gunu,
		zero_found,
		i, j, length;
	for(i=0,length=customers.length; i<length; i++){
		tasidtekrar = 0;
		taseron_varmi = "tasols" + (i+1);
		taseron_id = "tasid" + (i+1);
		taseron_varmi = document.getElementById(taseron_varmi);
		taseron_id = document.getElementById(taseron_id);
		if(taseron_varmi.checked){
			for(j=0; j<i; j++){	
				taseron_id2 = "tasid"+ (j+1);
				taseron_id2 = document.getElementById(taseron_id2);
				if(taseron_id.value === taseron_id2.value && taseron_id.value !== ""){
					tasidtekrar = 1;
				}
			}
			if(tasidtekrar === 0 && taseron_id.value !== ""){
				taseron_sayisi = taseron_sayisi + 1;
				taseronlar[taseron_sayisi-1] = taseron_id.value;
			}
		}
	}
	mal_tabl_boyutu = Math.max((vehicles.length + taseron_sayisi),customers.length);
	c = 0;
	var maliyet_tablo = new Array(mal_tabl_boyutu);
	var taboo = new Array(mal_tabl_boyutu);
	for(i=0,length=customers.length; i<length; i++){
		maliyet_tablo[i] = new Array(mal_tabl_boyutu);
		musteri_ismi = "customer" + (i+1);
		navlun = "navlun" + (i+1);
		taseron_id = "tasid" + (i+1);
		var adr_talep = "adr_talep" + (i+1);
		adr_talep = document.getElementById(adr_talep);
		musteri_ismi = document.getElementById(musteri_ismi);
		navlun = document.getElementById(navlun);
		taseron_id = document.getElementById(taseron_id);
		/*
		bos_mus_mal = json.customers[musteri_ismi.options[musteri_ismi.selectedIndex].value].Araç_Verememe_Maliyeti;
		earliest_loading_hour = json.customers[musteri_ismi.options[musteri_ismi.selectedIndex].value].En_Erken_Yükleme_Saati;
		latest_loading_hour = json.customers[musteri_ismi.options[musteri_ismi.selectedIndex].value].En_Gec_Yükleme_Saati;
		*/
		for(j=0; j<vehicles.length; j++){
			bosaltma_musteri_ismi = "ihrcustomer" + eval(j+1);
			var arac_ozellik = document.getElementById("transmod" + eval(j+1)).selectedIndex;
			var romork_yandan = "yandan" + eval(j+1);
			var romork_yandan_talep = "yandan_talep" + eval(i+1);
			var romork_ustten = "ustten" + eval(j+1);
			var romork_ustten_talep = "ustten_talep" + eval(i+1);
			var romork_catiyukselen = "catiyukselen" + eval(j+1);
			var romork_cati_yukselen_talep = "cati_yukselen_talep" + eval(i+1);
			var kara_talep = "kara_talep" + eval(i+1);
			/*
			var ortalama_hiz = json.drivers[document.getElementById("driver" + eval(j+1)).options[document.getElementById("driver" + eval(j+1)).selectedIndex].value].Ortalama_Hız;
			*/
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
						/*
						service_time = json.customers[bosaltma_musteri_ismi.options[bosaltma_musteri_ismi.selectedIndex].value].Servis_Süresi;
						*/
						kac_saatte = Math.floor(bos_mus_km[i*vehicles.length + j]/(ortalama_hiz/60));
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
					kac_saatte = Math.floor(bos_km[i*vehicles.length + j]/(ortalama_hiz/60));
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
				/*
				gec_varis_maliyeti = json.customers[musteri_ismi.options[musteri_ismi.selectedIndex].value].Geç_Kalma_Maliyeti;
				*/
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
		for(j=vehicles.length;j<(vehicles.length + taseron_sayisi);j++){
			if(taseron_id.value == "" && navlun.value != ""){
				alert("Lütfen taşeronu niteleyecek (plaka...vs.) bir değer giriniz!");
				hesaplaText.innerHTML = 'HESAPLA';
				return;
			} else if(taseronlar[j-vehicles.length] == taseron_id.value){
				maliyet_tablo[i][j] = navlun.value;
			} else {
				maliyet_tablo[i][j] = 100000;
			}
		}
		for(j=(vehicles.length + taseron_sayisi);j<mal_tabl_boyutu;j++){
			maliyet_tablo[i][j] = bos_mus_mal;
		}
	}
	for(i=customers.length;i<mal_tabl_boyutu;i++){
		maliyet_tablo[i] = new Array(mal_tabl_boyutu);
		for(j=0;j<vehicles.length;j++){
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
		for(j=vehicles.length;j<mal_tabl_boyutu;j++){
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
		var atandi = 1;
		while(atandi == 1){
			atandi = 0;
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
									atandi = 1;
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
									atandi = 1;
								}
							}
						}
					}
				}
			}
			if(atandi == 0){
				for(i=0;i<mal_tabl_boyutu;i++){
					j=0;
					while(j<mal_tabl_boyutu && atandi == 0){
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
								atandi = 1;
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
	for(i=0;i<customers.length;i++){
		var rowCount = table.rows.length;
		var row = table.insertRow(rowCount);
		for(j=0;j<vehicles.length;j++){
			var cell = row.insertCell(j);
			cell.innerHTML = km[c];
			cell.align = "center";
			c=c+1;
		}
	}
};

var calcFinalRoute = function(i) {
	if(atananrow[i] < customers.length && atanancolumn[i] < vehicles.length) {
		var start = vehicles[atanancolumn[i]].position;
		var end = customers[atananrow[i]].position;
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
};

var ozet_tablo_yazdir = function() {
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
		if(atananrow[l] < customers.length){
			mu_ta_ce = document.getElementById(mu_ta_ce);
		}
		if(atanancolumn[l] < vehicles.length){
			ar_ta_ce = document.getElementById(ar_ta_ce);
			arac_table = document.getElementById("aractablo").rows[atanancolumn[l]+2].getElementsByTagName('td');
		}
		rowCount = table.rows.length;
		row = table.insertRow(rowCount);
		cell = row.insertCell(0);
		cell.innerHTML = rowCount-1;
		cell.align = "center";
		cell = row.insertCell(1);
		if(atananrow[l] < customers.length){
			cell.innerHTML = eval(atananrow[l]+1) + ". " + mu_ta_ce.options[mu_ta_ce.selectedIndex].text;
		} else {
			cell.innerHTML = "Planlanmayan araç";
		}
		cell.align = "center";
		cell = row.insertCell(2);
		if(atanancolumn[l] < vehicles.length){
			cell.innerHTML = eval(atanancolumn[l]+1) + ". " + ar_ta_ce.options[ar_ta_ce.selectedIndex].text;
		} else if(atanancolumn[l] < (vehicles.length+taseron_sayisi)){
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
		if(atanancolumn[l] < vehicles.length && atananrow[l] < customers.length){
			if(arac_table[2].innerHTML == "Kara" || arac_table[2].innerHTML=="Oms.Romanya"){
				cell.innerHTML = Math.round(km[atananrow[l] * vehicles.length + atanancolumn[l]]+2119);
			} else {
				cell.innerHTML = Math.round(km[atananrow[l] * vehicles.length + atanancolumn[l]]+380);
			}
			cell2.innerHTML = Math.round(bos_km[atananrow[l] * vehicles.length + atanancolumn[l]]);
			cell3.innerHTML = "%" + Math.round(varis_olasilik_tablo[atananrow[l] * vehicles.length + atanancolumn[l]]*100);
			cell4.innerHTML = varis_saati_array[atananrow[l] * vehicles.length + atanancolumn[l]].toLocaleString();
			var dolu_arac = "dolu" + eval(atanancolumn[l]+1);
			if(document.getElementById(dolu_arac).checked == false){
				cell5.innerHTML = "Araç boş"
			} else {
				cell5.innerHTML = Math.round(bos_mus_km[atananrow[l] * vehicles.length + atanancolumn[l]]);
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
};
	
var drawPath = function(posit) {
	var arac_dizisira = 100000,
		musteri_dizisira = 100000,
		degisim = 0,
		i, x;
	for(i=0, x=vehicles.length; i<x ;i++){
		if(vehicles[i].position == posit){
			arac_dizisira = i;
		}
	}
	for(i=0;i<customers.length;i++){
		if(customers[i].position == posit){
			musteri_dizisira = i;
		}
	}
	if(arac_dizisira != 100000){
		for(i=0;i<atanancolumn.length;i++){
			if(atanancolumn[i] == arac_dizisira && atananrow[i] < customers.length){
				arac_dizisira = i;
				degisim = 1;
			}
		}
		if(degisim == 0){
			arac_dizisira = 100000;
		}
	}
	degisim = 0;
	if(musteri_dizisira != 100000){
		for(i=0;i<atananrow.length;i++){
			if(atananrow[i] == musteri_dizisira && atanancolumn[i] < vehicles.length){
				musteri_dizisira = i;
				degisim = 1;
			}
		}
		if(degisim == 0){
			musteri_dizisira = 100000;
		}
	}
	if(arac_dizisira < 100000){
		i = arac_dizisira;
	} else if(musteri_dizisira < 100000){
		i = musteri_dizisira;
	} else {
		i = 100000;
	}
};