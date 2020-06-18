var densityUnits = ["kg/m^3","g/mL","lb/ft^3","oz/in3"];
var buoyancyUnits = ["kg","g","lb","oz"];
var netBuoyancyUnits = buoyancyUnits;
var weightUnits = ["kg","g","lb","oz"];

function runCalcs() {
	var volumeInput = Qty.parse(document.getElementById("volumeInput").value);
	var weightInput = Qty.parse(document.getElementById("weightInput").value);

	var goodForm = true;

	if ( volumeInput == null || !(volumeInput.kind() == 'volume') ) {
		document.getElementById("volumeInputGroup").classList.remove("has-success");
		document.getElementById("volumeInputGroup").classList.add("has-error");
		document.getElementById("volumeInputIcon").classList.remove("fa-check");
		document.getElementById("volumeInputIcon").classList.add("fa-times");
		
		goodForm = false;
	}

	if ( weightInput == null || !(weightInput.kind() == 'force' || weightInput.kind() == 'mass' || weightInput.kind() == 'mass_concentration' ) ) {
		document.getElementById("weightInputGroup").classList.remove("has-success");
		document.getElementById("weightInputGroup").classList.add("has-error");
		document.getElementById("weightInputIcon").classList.remove("fa-check");
		document.getElementById("weightInputIcon").classList.add("fa-times");
		
		goodForm = false;
	}

	if ( goodForm ) {		
		document.getElementById("volumeInputGroup").classList.remove("has-error");
		document.getElementById("volumeInputGroup").classList.add("has-success");
		document.getElementById("volumeInputIcon").classList.remove("fa-times");
		document.getElementById("volumeInputIcon").classList.add("fa-check");

		document.getElementById("weightInputGroup").classList.remove("has-error");
		document.getElementById("weightInputGroup").classList.add("has-success");
		document.getElementById("weightInputIcon").classList.remove("fa-times");
		document.getElementById("weightInputIcon").classList.add("fa-check");

		calculate();
	} else {
		clearTable();
	}
}

function calculate() {
	var freshwaterDensity = 999.97;
	var saltwaterDensity = 1024;
	var gravity = 9.81;

	var volumeInput = Qty.parse(document.getElementById("volumeInput").value);
	var weightInput = Qty.parse(document.getElementById("weightInput").value);

	var rawMetricVolume;
	var rawMetricMass;
	var input;

	rawMetricVolume = Number(volumeInput.toString('m^3').replace(/[^0-9.,]\w+/g, ''));

	if ( weightInput.kind() == 'mass_concentration' ) {
		rawMetricMass = rawMetricVolume*Number(weightInput.toString('kg/m^3').replace(/[^0-9.,]\w+/g, ''));
	} else if ( weightInput.kind() == 'mass' ) {
		rawMetricMass = Number(weightInput.toString('kg').replace(/[^0-9.,]\w+/g, ''));	
	} else if ( weightInput.kind() == 'force' ) {
		rawMetricMass = Number(weightInput.toString('N').replace(/[^0-9.,]\w+/g, ''))/gravity;	
	}

	var rho;
	var density;
	var buoyancy;
	var netBuoyancy;
	var weight;

	if ( document.getElementById("freshwater").checked ) {
	  rho = freshwaterDensity;
	} else {
		rho = saltwaterDensity;
	}

	density = new Qty(rawMetricMass/rawMetricVolume+" kg/m^3");
	buoyancy = new Qty(rho*rawMetricVolume+" kg");
	netBuoyancy = new Qty((rho-rawMetricMass/rawMetricVolume)*rawMetricVolume+" kg");
	weight = new Qty(rawMetricMass+" kg");

	var densityTableHTML = '';
	var buoyancyTableHTML = '';
	var netBuoyancyTableHTML = '';
	var weightTableHTML = '';

	for ( i = 0 ; i < densityUnits.length ; i++ ) {
		densityTableHTML += '<tr><td>'+density.to(densityUnits[i]).toPrec(0.01).toString()+'</td></tr>';
	}

	for ( i = 0 ; i < buoyancyUnits.length ; i++ ) {
		buoyancyTableHTML += '<tr><td>'+buoyancy.to(buoyancyUnits[i]).toPrec(0.01).toString()+'</td></tr>';
	}

	for ( i = 0 ; i < netBuoyancyUnits.length ; i++ ) {
		netBuoyancyTableHTML += '<tr><td>'+netBuoyancy.to(netBuoyancyUnits[i]).toPrec(0.01).toString()+'</td></tr>';
	}

	for ( i = 0 ; i < weightUnits.length ; i++ ) {
		weightTableHTML += '<tr><td>'+weight.to(weightUnits[i]).toPrec(0.01).toString()+'</td></tr>';
	}

	document.getElementById("densityTableContent").innerHTML = densityTableHTML;
	document.getElementById("buoyancyTableContent").innerHTML = buoyancyTableHTML;
	document.getElementById("netBuoyancyTableContent").innerHTML = netBuoyancyTableHTML;
	document.getElementById("weightTableContent").innerHTML = weightTableHTML;

	updateLink();
}

function clearTable() {
	var densityTableHTML = '';
	var buoyancyTableHTML = '';
	var netBuoyancyTableHTML = '';
	var weightTableHTML = '';

	for ( i = 0 ; i < densityUnits.length ; i++ ) {
		densityTableHTML += '<tr><td>- '+densityUnits[i]+'</td></tr>';
	}

	for ( i = 0 ; i < buoyancyUnits.length ; i++ ) {
		buoyancyTableHTML += '<tr><td>- '+buoyancyUnits[i]+'</td></tr>';
	}

	for ( i = 0 ; i < netBuoyancyUnits.length ; i++ ) {
		netBuoyancyTableHTML += '<tr><td>- '+netBuoyancyUnits[i]+'</td></tr>';
	}

	for ( i = 0 ; i < weightUnits.length ; i++ ) {
		weightTableHTML += '<tr><td>- '+weightUnits[i]+'</td></tr>';
	}	

	document.getElementById("densityTableContent").innerHTML = densityTableHTML;
	document.getElementById("buoyancyTableContent").innerHTML = buoyancyTableHTML;
	document.getElementById("netBuoyancyTableContent").innerHTML = netBuoyancyTableHTML;
	document.getElementById("weightTableContent").innerHTML = weightTableHTML;
}

function setDensity(density) {
	document.getElementById("weightInput").value = density;
	runCalcs();
}

function loadJSON(callback) {   

  var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
  xobj.open('GET', '/wp-content/plugins/bluerobotics-calculators/js/materialData.json', true);
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
          callback(xobj.responseText);
        }
  };
  xobj.send(null);  
}

function initMaterialTable() {
	var materialTableHTML = '';

 	loadJSON(function(response) {
  // Parse JSON string into object
    var data = JSON.parse(response);

    data["materials"].forEach(function(item){
    	var matDensity = Qty(item.density);

    	materialTableHTML += "<tr><td>";
    	if ( item.link != undefined ) {
    		materialTableHTML += "<a href='"+item.link+"'>";
    		materialTableHTML += item.name;
    		materialTableHTML += "</a>";
    	} else {
    		materialTableHTML += item.name;
    	}
    	materialTableHTML += "</td><td>";
    	materialTableHTML += "<a href='javascript:void' onclick='setDensity(\""+matDensity.to("kg/m3").toPrec(0.01).toString()+"\")'>";
    	materialTableHTML += matDensity.toString("kg/m3");
    	materialTableHTML += "</a></td><td>";
    	materialTableHTML += "<a href='javascript:void' onclick='setDensity(\""+matDensity.to("lb/ft3").toPrec(0.01).toString()+"\")'>";
    	materialTableHTML += matDensity.to("lb/ft3").toPrec(0.01).toString();
    	materialTableHTML += "</a></td></tr>\n";

		});

		document.getElementById("materialTableContent").innerHTML = materialTableHTML;
 });
}	

function updateLink() {
	document.getElementById("link-a").innerHTML = 'Link to these results <i class="fa fa-link" aria-hidden="true"></i>';
}

function textToClipboard (text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function copyResults() {
	var url = window.location.origin+window.location.pathname;
	url += "?";
	url += "volume="+encodeURI(document.getElementById("volumeInput").value);
	url += "&";
	url += "weight="+encodeURI(document.getElementById("weightInput").value);
	url += "&";
	if ( document.getElementById("freshwater").checked ) {
	  	url += "water=fresh";
	} else {
		url += "water=salt";
	}

	textToClipboard(url);

	document.getElementById("link-a").innerHTML = 'Copied to clipboard <i class="fa fa-check" aria-hidden="true"></i>';
}

jQuery(document).ready( function() {
	runCalcs();
	initMaterialTable();
});
