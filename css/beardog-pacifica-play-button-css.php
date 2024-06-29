<?php header("Content-type: text/css; charset: UTF-8");
	$imgurl = plugins_url("images", __FILE__); 

	$css = <<<FIFI
.play_button { 
	cursor:pointer;
	height:30px;
	width:120px;
	background-image: url('$imgurl/play_button_desktop.png');
	background-repeat: no-repeat;
	background-position: center;
  background-size: contain;
  border:none;
}   
.play_button:link,.play_button:visited {
	background-image: url('$imgurl/play_button_desktop.png');
	background-repeat: no-repeat;
	background-position: center;
  background-size: contain;
}   
.play_button:hover {
	background-image: url('$imgurl/play_button_over_desktop.png');
}
.play_button:active {
	background-image: url('$imgurl/play_button_down_desktop.png');
}
.player_table_playing
{
	background-color:transparent;
	vertical-align: top;
	color:#ffffff;
	width:100%;
}
.player_table
{
	background-color:#000000;
	vertical-align: top;
	color:#ffffff;
	width:330px;
}
FIFI;

print($css);

?>

