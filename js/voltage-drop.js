var gaugeInput;
var conductorsInput;
var voltageInput;
var distanceInput;
var loadInput;
var distanceUnits = ["meters","km","feet","mile","fathoms"];

jQuery(document).ready(check());

function check() {
    var isError = false;

    // js-quantities cannot handle AWG, so let's swap that out if necessary
    gaugeInput = document.getElementById("gaugeInput").value;
    if ( gaugeInput.includes('awg') || gaugeInput.includes('AWG') ) {
        gaugeInput = gaugeInput.replace(/[^\d.-]/g, '');
        gaugeInput = String(0.012668*Math.pow(92,((36-parseFloat(gaugeInput))/19.5))) + " mm^2";
    }

    // js-quantities also can't handle circular mils (cmil)
    if ( gaugeInput.includes('kcmil') ) {
        gaugeInput = gaugeInput.replace(/[^\d.-]/g, '');
        gaugeInput = String(parseFloat(gaugeInput)*0.506707479) + " mm^2";
    }
    if ( gaugeInput.includes('cmil') ) {
        gaugeInput = gaugeInput.replace(/[^\d.-]/g, '');
        gaugeInput = String(parseFloat(gaugeInput)*0.000506707479) + " mm^2";
    }

    gaugeInput = Qty.parse(gaugeInput);

    // If the input is length convert it to circular area
    if ( gaugeInput != null ) {
        if ( gaugeInput.kind() == 'length' ) {
            var gaugeValue = Number(gaugeInput.toString('mm').replace(/[^0-9.,]+/g, ''));
            gaugeInput = new Qty(Math.pow(gaugeValue,2)*Math.PI/4.0+" mm^2");
        }
    }

    if ( gaugeInput == null || !(gaugeInput.kind() == 'area') ) {
        setStatus("gaugeInputGroup","gaugeInputIcon",false);
        isError = true;
    } else {
        setStatus("gaugeInputGroup","gaugeInputIcon",true);
    }

    conductorsInput = Qty.parse(document.getElementById("conductorsInput").value);

    if ( conductorsInput == null || !(conductorsInput.kind() == 'unitless') ) {
        setStatus("conductorsInputGroup","conductorsInputIcon",false);
        isError = true;
    } else {
        setStatus("conductorsInputGroup","conductorsInputIcon",true);
    }

    voltageInput = Qty.parse(document.getElementById("voltageInput").value);

    if ( voltageInput == null || !(voltageInput.kind() == 'potential') ) {
        setStatus("voltageInputGroup","voltageInputIcon",false);
        isError = true;
    } else {
        setStatus("voltageInputGroup","voltageInputIcon",true);
    }

    distanceInput = Qty.parse(document.getElementById("distanceInput").value);

    if ( distanceInput == null || !(distanceInput.kind() == 'length') ) {
        setStatus("distanceInputGroup","distanceInputIcon",false);
        isError = true;
    } else {
        setStatus("distanceInputGroup","distanceInputIcon",true);
    }

    loadInput = Qty.parse(document.getElementById("loadInput").value);

    if ( loadInput == null || !(loadInput.kind() == 'current' || loadInput.kind() == 'potential') ) {
        setStatus("loadInputGroup","loadInputIcon",false);
        isError = true;
    } else {
        setStatus("loadInputGroup","loadInputIcon",true);
    }

    if ( isError ) {
        clearTable();
    } else {
        calculate();
    }
}

function setStatus(groupId, iconId, success) {
    if ( !success ) {
        document.getElementById(groupId).classList.remove("has-success");
        document.getElementById(groupId).classList.add("has-error");
        document.getElementById(iconId).classList.remove("fa-check");
        document.getElementById(iconId).classList.add("fa-times");
    } else {
        document.getElementById(groupId).classList.remove("has-error");
        document.getElementById(groupId).classList.add("has-success");
        document.getElementById(iconId).classList.remove("fa-times");
        document.getElementById(iconId).classList.add("fa-check");
    }
}

function calculate() {
    var area = Number(gaugeInput.toString('m2').split("m")[0]);
    var conductors = Number(conductorsInput.toString('').replace(/[^0-9.,]+/g, ''));
    var voltage = Number(voltageInput.toString('V').replace(/[^0-9.,]+/g, ''));
    var distance = Number(distanceInput.toString('m').replace(/[^0-9.,]+/g, ''));
    var resistivity = 1.68*Math.pow(10,-8); // Copper

    var condResistance = resistivity*distance/area;
    var resistance = condResistance/conductors;

    var voltageDrop;
    var current;
    var drop;
    var powerLoss;
    var powerTransmission;
    var voltageDropPercent;
    var efficiencyPercent;

    if ( loadInput.kind() == 'current' ) {
        var currentInput = Number(loadInput.toString('A').replace(/[^0-9.,]+/g, ''));
        current = new Qty(loadInput.toString('A'));
        drop = currentInput*resistance*2; // * 2 for full loop
        powerLoss = drop*currentInput;
        powerTransmission = voltage*currentInput - powerLoss;
        voltageDrop = new Qty(drop+" V"); 
    } else if ( loadInput.kind() == 'potential' ) {
        var voltageDropInput = Number(loadInput.toString('V').replace(/[^0-9.,]+/g, ''));
        var I = voltageDropInput/(resistance*2);
        current = new Qty(I+" A");
        voltageDrop = new Qty(loadInput.toString('V'));
        drop = voltageDropInput;
        powerLoss = drop*I;
        powerTransmission = voltage*I-powerLoss;
    }

    voltageDropPercent = new Qty(drop/voltage*100+" %");
    efficiencyPercent = new Qty(100-drop/voltage*100+" %");

    powerTransmission = new Qty(powerTransmission+" W");
    var specificPowerLoss = new Qty(powerLoss/distance+" W/m");
    powerLoss = new Qty(powerLoss+" W");

    var outputVoltage = new Qty((voltage-drop)+" V");

    var outputHTML = '';
    var gaugeTableHTML = '';
    var distanceTableHTML = '';

    if ( drop >= voltage ) {
        outputHTML += outputBox('Voltage Drop','- V','(this cable can\'t support this current)');
        outputHTML += outputBox('Output Voltage','- V','(this cable can\'t support this current)');
    } else {
        outputHTML += outputBox('Voltage Drop',voltageDrop.to('V').toPrec(0.01).toString(),voltageDropPercent.toPrec(0.1).toString()+' of supply voltage');
        outputHTML += outputBox('Output Voltage',outputVoltage.toPrec(0.01).toString(),'at the load');
    }
    
    var conductorNote;
    if ( conductors > 1 ) {
        conductorNote = 'shared between '+conductors+' conductors';
    } else {
        conductorNote = 'through a single conductor';
    }
    outputHTML += outputBox('Current',current.to('A').toPrec(0.01).toString(),conductorNote);
    
    outputHTML += outputBox('Power Loss',powerLoss.to('W').toPrec(0.1).toString(), 'lost as heat ('+specificPowerLoss.to('W/m').toPrec(0.01).toString()+')');

    outputHTML += outputBox('Power Transmission',powerTransmission.to('W').toPrec(0.1).toString(),'transmitted to the load at '+efficiencyPercent.toPrec(0.1).toString()+' efficiency');

    var diameter = Math.sqrt(area*1000*1000/Math.PI*4);
    var equivDiameter = Math.sqrt(conductors*area*1000*1000/Math.PI*4);
    var totalArea = new Qty(conductors*area*1000*1000+" mm2");

    var hideCol2;
    if ( conductors > 1 ) {
        gaugeTableHTML += '<thead><tr><th>Each Conductor</th><th>Combined Conductors</th></tr></thead>';
        hideCol2 = 'style="visibility:visible"';
    } else {
        gaugeTableHTML += '<thead><tr><th>Conductors</th><th></th></tr></thead>';
        hideCol2 = 'style="visibility:hidden"';
    }
    gaugeTableHTML += '<tbody>';
    gaugeTableHTML += '<tr><td>'+(-39*Math.log(diameter/0.127)/Math.log(92)+36).toFixed(1)+' AWG </td><td><span '+hideCol2+'>'+(-39*Math.log(equivDiameter/0.127)/Math.log(92)+36).toFixed(1)+' AWG equivalent</span></td></tr>';
    gaugeTableHTML += '<tr><td>'+gaugeInput.to('mm^2').toPrec(0.01).toString()+'</td><td><span '+hideCol2+'>'+totalArea.to('mm^2').toPrec(0.01).toString()+' total</span></td></tr>';
    gaugeTableHTML += '<tr><td>'+(area/(5.067*Math.pow(10,-10))).toFixed(0)+' circular mils (cmil)</td><td><span '+hideCol2+'>'+(conductors*area/(5.067*Math.pow(10,-10))).toFixed(0)+' cmil total</span></td></tr>';
    gaugeTableHTML += '<tr><td>'+diameter.toFixed(2)+' mm diameter</td><td><span '+hideCol2+'>'+equivDiameter.toFixed(2)+' mm diameter equivalent</span></td></tr>';
    gaugeTableHTML += '</tbody>';

    for ( i = 0 ; i < distanceUnits.length ; i++ ) {
        distanceTableHTML += '<tr><td>'+distanceInput.to(distanceUnits[i]).toPrec(0.01).toString()+'</td></tr>';
    }

    document.getElementById("outputContent").innerHTML = outputHTML;
    document.getElementById("gaugeTableContent").innerHTML = gaugeTableHTML;
    document.getElementById("distanceTableContent").innerHTML = distanceTableHTML;

    updateLink();
}

function outputBox(label,value,note='&nbsp;') {
    var html = '';

    html += '<div class="col-sm-4">';
    html += '<div class="text-center outputBox">';
    html += '<h4>'+label+'</h4>';
    html += '<h2>'+value+'</h2>';
    html += '<h5>'+note+'</h5>';
    html += '</div></div>';

    return html;
}

function clearTable() {
	var outputHTML = '';
    var gaugeTableHTML = '';
	var distanceTableHTML = '';

    outputHTML += outputBox('Voltage Drop','- V');
    outputHTML += outputBox('Output Voltage','- V');
    outputHTML += outputBox('Current','- A');
    outputHTML += outputBox('Power Loss','- W');
    outputHTML += outputBox('Power Transmission','- W');

	gaugeTableHTML += '<tr><td>- AWG</td></tr>';
	gaugeTableHTML += '<tr><td>- mm2</td></tr>';
    gaugeTableHTML += '<tr><td>- mm diameter</td></tr>';

	for ( i = 0 ; i < distanceUnits.length ; i++ ) {
		distanceTableHTML += '<tr><td>- '+distanceUnits[i]+'</td></tr>';
	}

    document.getElementById("outputContent").innerHTML = outputHTML;
	document.getElementById("gaugeTableContent").innerHTML = gaugeTableHTML;
	document.getElementById("distanceTableContent").innerHTML = distanceTableHTML;
}

function updateLink() {
	var url = "";
	url += "?";
	url += "gauge="+encodeURI(document.getElementById("gaugeInput").value);
	url += "&";
	url += "conductors="+encodeURI(document.getElementById("conductorsInput").value);
	url += "&";
	url += "voltage="+encodeURI(document.getElementById("voltageInput").value);
	url += "&";
	url += "length="+encodeURI(document.getElementById("distanceInput").value);
	url += "&";
	url += "input="+encodeURI(document.getElementById("loadInput").value);

	document.getElementById("link-a").href = url;
}
