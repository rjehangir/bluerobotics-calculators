<?php
/**
 * Pressure to depth calculator.
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Don't allow direct access

$gauge = $_GET['gauge'] ? $_GET['gauge'] : "16 AWG";
$conductors = $_GET['conductors'] ? $_GET['conductors'] : "1";
$voltage = $_GET['voltage'] ? $_GET['voltage'] : "12 V";
$length = $_GET['length'] ? $_GET['length'] : "50 m";
$input = $_GET['input'] ? $_GET['input'] : "1.0 A";

?>

<div class="well calculator">
    <form onsubmit="return false;">
        <div class="row">
            <div class="col-sm-6">
                <div class="form-group has-feedback" id="gaugeInputGroup">
                    <label for="gaugeInput"><h4>Wire Gauge or Area:</h4></label>
                    <div style="position:relative;">
                    	<input type="text" class="form-control" id="gaugeInput" onkeyup="check()" aria-describedby="gaugeInputStatus" value="<?php echo $gauge; ?>" />
                        <span class="fa fa-2x fa-check form-control-feedback" id="gaugeInputIcon" aria-hidden="true"></span>
                    </div>
                    <span id="gaugeInputStatus" class="sr-only">(success)</span>
                    <span id="helpBlock" class="help-block">Enter the wire gauge, diameter, or circular area. (e.g. "16 AWG", "1.3 mm", "1.33 mm2", or "2580 cmil")</span>
                    <br /><br />
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group has-feedback" id="conductorsInputGroup">
                    <label for="conductorsInput"><h4>Number of Parallel Conductors in the Circuit:</h4></label>
                    <div style="position:relative;">
                    	<input type="number" class="form-control" id="conductorsInput" onchange="check()" onkeyup="check()" aria-describedby="conductorsInputStatus" value="<?php echo $conductors; ?>" />
                        <span class="fa fa-2x fa-check form-control-feedback" id="conductorsInputIcon" aria-hidden="true"></span>
                    </div>
                    <span id="gaugeInputStatus" class="sr-only">(success)</span>
                    <span id="helpBlock" class="help-block">Enter the number of conductors in parallel (default is 1).</span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-6">
                <div class="form-group has-feedback" id="voltageInputGroup">
                    <label for="voltageInput"><h4>Supply Voltage:</h4></label>
                    <div style="position:relative;">
                    	<input type="text" class="form-control" id="voltageInput" onkeyup="check()" aria-describedby="voltageInputStatus" value="<?php echo $voltage; ?>" />
                         <span class="fa fa-2x fa-check form-control-feedback" id="voltageInputIcon" aria-hidden="true"></span>
                    </div>
                    <span id="voltageInputStatus" class="sr-only">(success)</span>
                    <span id="helpBlock" class="help-block">Enter the supply voltage. (e.g. "12 V")</span>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group has-feedback" id="phaseInputGroup">
                    <label for="phaseInput"><h4>Voltage Phase (not supported yet):</h4></label><br />
                    <label class="active">
                        <input type="radio" id="dc" name="phaseInput" value="dc" checked="checked" onchange="check()" disabled /> DC
                    </label><br />
                    <label class="">
                        <input type="radio" id="ac" name="phaseInput" value="ac" onchange="check()" disabled /> AC
                    </label> 
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-6">
                <div class="form-group has-feedback" id="distanceInputGroup">
                    <label for="distanceInput"><h4>Cable Length or Distance:</h4></label>
                    <div style="position:relative;">
                    	<input type="text" class="form-control" id="distanceInput" onkeyup="check()" aria-describedby="distanceInputStatus" value="<?php echo $length; ?>" />
                         <span class="fa fa-2x fa-check form-control-feedback" id="distanceInputIcon" aria-hidden="true"></span>
                    </div>
                    <span id="distanceInputStatus" class="sr-only">(success)</span>
                    <span id="helpBlock" class="help-block">Enter the <em>one-way</em> cable length or distance. (e.g. "50 m", "150 ft", or "1.5 km")</span>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group has-feedback" id="loadInputGroup">
                    <label for="loadInput"><h4>Load Current <u>OR</u> Voltage Drop:</h4></label>
                    <div style="position:relative;">
                    	<input type="text" class="form-control" id="loadInput" onkeyup="check()" aria-describedby="loadInputStatus" value="<?php echo $input; ?>" />
                         <span class="fa fa-2x fa-check form-control-feedback" id="loadInputIcon" aria-hidden="true"></span>
                    </div>
                    <span id="loadInputStatus" class="sr-only">(success)</span>
                    <span id="helpBlock" class="help-block">Enter the load current OR desired voltage drop and the other will be calculated. (e.g. "1.0 A" or "2 V")</span>
                </div>
            </div>
        </div>
    </form>

	<br />
	<div class="calc-link">
		<a href="" id="link-a">Link to these results <i class="fa fa-link" aria-hidden="true"></i></a>
	</div>
	<h3>Output:</h3>
	<br />
	<div class="row" id="outputContent">
	</div>
	<br />
	<div class="row">
		<div class="col-sm-6">
			<div class="outputBox">
				<table class="table table-hover table-condensed" id="gaugeTableContent">
				</table>
			</div>
		</div>
		<div class="col-sm-6">
			<div class="outputBox">
				<table class="table table-hover table-condensed">
					<thead><tr>
						<th>Cable Length</th>
					</tr></thead>
					<tbody id="distanceTableContent">
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
