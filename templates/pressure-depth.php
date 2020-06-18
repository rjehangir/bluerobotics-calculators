<?php
/**
 * Pressure to depth calculator.
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Don't allow direct access

$depth = $_GET['input'] ? $_GET['input'] : "100 m";

?>

<div class="well calculator">
	<div class="calc-link">
		<a href="javascript: void(0)" id="link-a" onclick="copyResults()">Link to these results <i class="fa fa-link" aria-hidden="true"></i></a>
	</div>
	<form onsubmit="return false;">
		<div class="form-group has-feedback" id="depthInputGroup">
			<label for="depthInput"><h3>Pressure or Depth Input:</h3></label>
			<div style="position:relative;">
				<input type="text" class="form-control" id="depthInput" placeholder="100 m" onkeyup="checkValidDepth()" aria-describedby="inputSuccess2Status" value="<?php echo $depth; ?>" />
				<span class="fa fa-2x fa-check form-control-feedback" id="depthInputIcon" aria-hidden="true"></span>
			</div>
		  	<span id="inputSuccess2Status" class="sr-only">(success)</span>
		  	<span id="helpBlock" class="help-block">Enter depth or pressure followed by unit. (e.g. "110 psi" or "450 ft")</span>
		</div>
		<div class="">
		    <label class="active">
		        <input type="radio" id="freshwater" name="waterType" value="fresh" checked="checked" onchange="checkValidDepth()" /> Freshwater
		    </label><br />
		    <label class="">
		        <input type="radio" id="saltwater" name="waterType" value="salt" onchange="checkValidDepth()"  /> Saltwater
		    </label> 
		</div>
	</form>

	<br />
	<h3>Pressure and Depth Output:</h3>
	<br />
	<div class="row">
		<div class="col-sm-6">
			<table class="table table-hover table-condensed">
				<thead>
					<tr>
						<th>Depth</th>
					</tr>
				</thead>
				<tbody id="depthTableContent">
				</tbody>
			</table>
		</div>
		<div class="col-sm-6">
			<table class="table table-hover table-condensed">
				<thead>
					<tr>
						<th>Pressure</th>
					</tr>
				</thead>
				<tbody id="pressureTableContent">
				</tbody>
			</table>
		</div>
	</div>
</div>