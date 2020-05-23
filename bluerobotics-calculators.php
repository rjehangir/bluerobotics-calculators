<?php
/**
 * Plugin Name: Blue Robotics Calculators
 * Plugin URI: http://bluerobotics.com/guide-tag/calculators
 * Description: Calculators and tools for the Blue Robotics website
 * Author: Rustom Jehangir
 * Author URI: http://rstm.io
 * Version: 0.0.1
 *
 * Copyright: (c) 2020 Rustom Jehangir
 *
 * @author    Rustom Jehangir
 * @copyright Copyright (c) 2020, Rustom Jehangir
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License v3.0
 *
 */


if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * Register style sheet.
 */
function calculators_register_plugin_styles() {
	wp_register_style( 'bluerobotics-calculators-style', plugins_url( 'bluerobotics-calculators/css/style.css' ) );
	wp_enqueue_style( 'bluerobotics-calculators-style' );
}
add_action( 'wp_enqueue_scripts', 'calculators_register_plugin_styles' );

/**
 * Shortcode to display each calculator
 */
function calculator_func( $atts, $content = null, $tag = '' ) {
	// normalize attribute keys, lowercase
	$atts = array_change_key_case((array)$atts, CASE_LOWER);

	$atts = shortcode_atts( array(
		'type' => '',
	), $atts, $tag );

	$type = $atts['type'];

	switch($type) {
		case "pressure-depth":
			ob_start();
			include( dirname(__FILE__) . '/templates/pressure-depth.php');
			wp_enqueue_script('bluerobotics-calculators-pressure-depth', plugins_url('bluerobotics-calculators/js/pressure-depth.js'), array('jquery'));
			return ob_get_clean();
		case "voltage-drop":
			ob_start();
			include( dirname(__FILE__) . '/templates/voltage-drop.php');
			wp_enqueue_script('bluerobotics-calculators-voltage-drop', plugins_url('bluerobotics-calculators/js/voltage-drop.js'), array('jquery'));
			return ob_get_clean();
		case "buoyancy":
			ob_start();
			include( dirname(__FILE__) . '/templates/buoyancy.php');
			wp_enqueue_script('bluerobotics-calculators-buoyancy', plugins_url('bluerobotics-calculators/js/buoyancy.js'), array('jquery'));
			return ob_get_clean();
	}
}
add_shortcode( 'calculator', 'calculator_func' );

function calculators_javascript() {
	wp_enqueue_script('bluerobotics-calculators-core', plugins_url('bluerobotics-calculators/js/calculators.js'), array());
	wp_enqueue_script('bluerobotics-calculators-quantities', plugins_url('bluerobotics-calculators/js/quantities.js'), array());
}
add_action('wp_enqueue_scripts', 'calculators_javascript');

?>
