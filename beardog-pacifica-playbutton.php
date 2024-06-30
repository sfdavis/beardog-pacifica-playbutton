<?php
/*
include( plugin_dir_path( __FILE__ ) . '/confessor_api.php');
*/
function archive_get_filnam($idkey,$num = 0)
{
	$buf = file_get_contents("https://archive.kkfi.org/_sh_do_api.php?req=$idkey&num=$num");
	$ary = unserialize(base64_decode($buf));
	return($ary);
}


/**
 * Plugin Name: BearDog.com Pacifica Play Button Plugin
 * Plugin URI:  https://github.com/sfdavis/beardog-pacifica-playbutton
 * Description: Pull and display a playbutton
 * Version:     0.0.1
 * Author:      Steven F. Davis
 * Author URI:  https://www.linkedin.com/in/stevenfdavis/
 * License:     GPL3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 */

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );
if (!function_exists('write_log')) {
    function write_log ( $log )  {
        if ( true === WP_DEBUG ) {
            if ( is_array( $log ) || is_object( $log ) ) {
                error_log( print_r( $log, true ) );
            } else {
                error_log( $log );
            }
        }
    }
}



/**
 * On plugin activation - register settings.
 *
 * @since 0.0.1
 */
function beardog_pacifica_activate() {
}
register_activation_hook(__FILE__, 'beardog_pacifica_activate');

/**
 * On plugin deactivation - unregister settings.
 *
 * @since 0.0.1
 */
function beardog_pacifica_deactivate() {
}
register_deactivation_hook(__FILE__, 'beardog_pacifica_activate');

/**
 * On plugin uninstall - completely clean the settings in the database
 *
 * @since 0.0.1
 */
function beardog_pacifica_uninstall() {
}
register_uninstall_hook(__FILE__, 'beardog_pacifica_uninstall');

/***********************************************/
/*  Functions to generate the play button code */
/***********************************************/
function html5_button($id,$file_link,$private_flag,$class)
{   
    $imgdir =  plugins_url("images", __FILE__);
	return('<button id="' . $id . '" class="' . $class . '" mp3="' . $file_link . '" imgurl="' . $imgdir . '" private="' . $private_flag . '" onclick="add_html5(this);" ></button> ');
}   


function getshows($showdata, $idx) {
    $str = '<div class="pacifica_play_buttons">';
	/*
	$count = 0;
	
	foreach($showdata as $show)
	{
	    $count++;
		$str .= '<div id="show'.$count.'">';
		$str .= html5_button($count,$show["mp3"],0,"play_button");
		$str .= '</div>';
	}
	*/
	$show = $showdata[$idx];
	$str .= '<div id="show'.$idx.'">';
	$str .= html5_button($idx,$show["mp3"],0,"play_button");
	$str .= '</div>';

	$str .="</div>";
	return $str;
}




/** SHORTCODES **/
/**
 * Setup the Spinitron shortcodes 
 *  
 * @since 0.0.1
 */
function beardog_pacifica_shortcodes_init() {

	if(!defined("tz"))
		define("tz","America/Chicago");

	/** REMOVING UNSUPPORTED TIMEZONE FUNCTION date_default_timezone_set(tz); **/

	/** SHORT CODE TO DISPLAY PLAY BUTTON **/
	/** 
	 * Shortcode to pull a play button based on inpout show_id
	 * Example: [display_show_play_button show_id="blueskitchen" show_time='2019-05-08T13:00:00-0500']
	 * 
	 * @since 0.0.1
	 */
     function pacifica_playbutton_func( $atts =[] ) {
	    $id = $atts['show_id'];
		$imgdir =  plugins_url("images", __FILE__);

		# get  date from shortcode
		$showtime = new DateTime($atts['show_time']);
		$now =(new DateTime(date('Y-m-d H:i:s')));
		# test to see if it is week 1 or week 2
		$daysdiff = $now->diff($showtime)->days;
		# set variable for play button index
		$playbutton_idx = -1;
		if ( $daysdiff <= 7 ) 
		{
			$playbutton_idx = 0;
		}
		elseif ( $daysdiff <= 14 ) 
		{			
			$playbutton_idx = 1;
		}
		
		# IF more than 14 days then nothing to show
		if ( $playbutton_idx < 0 ) 
		{
			return "";
		}

		   


	 	$jstr = <<<FIFI
		<script type="text/javascript">
		var idkey = '$id';
		var imgurl = '$imgdir';
		var daysdiff = '$daysdiff';
		var mp3_flag = '';
		var init_vol = 0.8;
		var vol_exp = 2;
		function load_images()
		{
			(new Image()).src = '$imgdir/play.png';
			(new Image()).src = '$imgdir/pause.png';
			(new Image()).src = '$imgdir/stop.png';
			(new Image()).src = '$imgdir/play_button_desktop.png';
			(new Image()).src = '$imgdir/play_button_over_mob.png';
			(new Image()).src = '$imgdir/play_button_down_mob.png';
		}
		</script>
FIFI;

		$showdata = archive_get_filnam($id,$num = 0);

        $showplaybuttons = getshows($showdata, $playbutton_idx);  ### PASS IN PLAY BUTTON INDEX
		return $jstr . $showplaybuttons;
     }

    add_shortcode( "display_show_play_button", "pacifica_playbutton_func" );

}
add_action('init', 'beardog_pacifica_shortcodes_init');

/**
 ** Include Styles to format the play button output 
 *
 * @since 0.0.1
 */

function add_beardog_pacifica_stylesheet_js() {
	wp_register_style('beardog_pacifica_stylesheet', plugins_url( '/css/beardog-pacifica-play-button.css', __FILE__ ) );
	wp_enqueue_style('beardog_pacifica_stylesheet');
	wp_enqueue_script('beardog_pacifica_js', plugins_url('/js/paplayer.js', __FILE__));
}
add_action('wp_enqueue_scripts', 'add_beardog_pacifica_stylesheet_js');
