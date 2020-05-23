<?php
/**
 * Pressure to depth calculator.
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Don't allow direct access

$volume = $_GET['volume'] ? $_GET['volume'] : "50 in^3";
$weight = $_GET['weight'] ? $_GET['weight'] : "12 lb/ft^3";
$water = $_GET['water'] ? $_GET['water'] : "fresh";

?>

<div class="well calculator">
	<div class="calc-link">
		<a href="" id="link-a">Link to these results <i class="fa fa-link" aria-hidden="true"></i></a>
	</div>
	<form>
		<div class="form-group has-feedback" id="volumeInputGroup">
			<label for="volumeInput"><h3>Displacement of Object</h3></label>
			<div style="position:relative">
				<input type="text" class="form-control" id="volumeInput" onkeyup="runCalcs()" aria-describedby="inputSuccess2Status" value="<?php echo $volume; ?>" />
				<span class="fa fa-2x fa-check form-control-feedback" id="volumeInputIcon" aria-hidden="true"></span>
			</div>
		  	<span id="inputSuccess2Status" class="sr-only">(success)</span>
		  	<span id="helpBlock" class="help-block">Enter volume followed by unit. (e.g. "0.1 m^3" or "20 in^3")</span>
		</div>

		<div class="form-group has-feedback" id="weightInputGroup">
			<label for="weightInput">Object Weight, Mass, or Density</label>
			<div style="position:relative">
				<input type="text" class="form-control" id="weightInput" onkeyup="runCalcs()" aria-describedby="inputSuccess2Status" value="<?php echo $weight; ?>" />
				<span class="fa fa-2x fa-check form-control-feedback" id="weightInputIcon" aria-hidden="true"></span>
			</div>
		  	<span id="inputSuccess2Status" class="sr-only">(success)</span>
		  	<span id="helpBlock" class="help-block">Enter weight or density followed by unit. (e.g. "2.1 kg" or "12 lb/ft^3")</span>
		</div>

		<div class="">
		    <label class="<?php if($water=="fresh"){echo "active";} ?>">
		        <input type="radio" id="freshwater" name="waterType" value="fresh" <?php if($water=="fresh"){echo "checked";} ?> onchange="runCalcs()" /> Freshwater
		    </label><br />
		    <label class="">
		        <input type="radio" id="saltwater" name="waterType" value="salt" <?php if($water=="salt"){echo "checked";} ?> onchange="runCalcs()"  /> Saltwater
		    </label> 
		</div>
	</form>

	<br />
	<h3>Buoyancy Output:</h3>
	<br />

	<div class="row">
		<div class="col-sm-6">
			<table class="table table-hover table-condensed">
				<tr>
					<th>Net Buoyancy</th>
				</tr>
				<tbody id="netBuoyancyTableContent">
				</tbody>
			</table>
		</div>
		<div class="col-sm-6">
			<table class="table table-hover table-condensed">
				<tr>
					<th>Buoyancy</th>
				</tr>
				<tbody id="buoyancyTableContent">
				</tbody>
			</table>
		</div>
	</div>

	<div class="row">
		<div class="col-sm-6">
			<table class="table table-hover table-condensed">
				<tr>
					<th>Weight</th>
				</tr>
				<tbody id="weightTableContent">
				</tbody>
			</table>
		</div>
		<div class="col-sm-6">
			<table class="table table-hover table-condensed">
				<tr>
					<th>Average Density</th>
				</tr>
				<tbody id="densityTableContent">
				</tbody>
			</table>
		</div>
	</div>

</div>
