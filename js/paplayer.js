function clear_bars(id)
{
	var topdiv = document.getElementById("bars_" + id);
	for(var i=0; i<5; i++)
	{
		topdiv.childNodes[i].style.backgroundColor = '#ffffff';
	}
}

function set_bar(vol,id)
{
	if(vol > 0.0)
	{
		var topdiv = document.getElementById("bars_" + id);
		for(var i=0; i<5; i++)
		{
			var div = topdiv.childNodes[i];
			if(div.getAttribute("vol") == vol)
			{
				div.style.backgroundColor = '#00ccff';
				break;
			}
		}
	}
}

function vol_up(id)
{
	var idstr = "au_" + id;
	var obj = document.getElementById("au_" + id)
	var log_vol = obj.volume;
	var vol = Math.pow(log_vol,(1/vol_exp));
	if(vol < 1.0)
	{
		var nu_vol = new Number(vol + 0.2).toFixed(1);
		var log_vol = Math.pow(nu_vol, vol_exp);
		obj.volume = log_vol;
		clear_bars(id);
		set_bar(Number(nu_vol),id);
	}
}

function vol_down(id)
{
	var idstr = "au_" + id;
	var obj = document.getElementById("au_" + id)
	var log_vol = obj.volume;
	var vol = Math.pow(log_vol,(1/vol_exp));
	if(vol > 0.0)
	{
		var nu_vol = new Number(vol - 0.2).toFixed(1);
		var log_vol = Math.pow(nu_vol,vol_exp);
		obj.volume = Math.pow(nu_vol,vol_exp);

		clear_bars(id);
		if(Number(nu_vol) > 0.0)
			set_bar(Number(nu_vol),id);
	}
	var foo = 1;
}

function do_vol(obj)
{
	var id = obj.parentNode.id.match(/bars_(\d+)/)[1];
	var aud = document.getElementById("au_" + id);
	var cur_vol = Math.pow(aud.volume,(1/vol_exp));
	clear_bars(id);
	var nu_vol = obj.getAttribute("vol");
	set_bar(nu_vol,id);
	aud.volume = Math.pow(nu_vol,vol_exp);
	var foo = 1;
}

function create_bar(height)
{
	var div = document.createElement("div");
	div.setAttribute("vol",height / 20);
	div.style.position = "absolute";
	div.style.bottom = '0px';
	div.style.height = height + 'px';
	div.style.width = '3px';
	div.style.left = (height * 1.5) + 'px';
	div.style.cursor = 'pointer';
	if((height / 20) == init_vol)
	{
		div.style.backgroundColor = '#00ccff';
		div.setAttribute("cur",true);
	}
	else
	{
		div.style.backgroundColor = '#ffffff';
	}
	div.onclick = function() { do_vol(div); };
	return(div);
}

function check_player()
{
	var obj = document.createElement('audio');
	if(obj.canPlayType)
		mp3_flag = obj.canPlayType('audio/mpeg');
// TESTING - force flash
//	mp3_flag = '';
}

function get_show_er(ret)
{
	;
}

function check_ret_for_ie(e)
{
	if(e.target)
		var obj = e.target;
	else
	{
		e = window.event;
		var obj = e.srcElement;
	}
	if(e.keyCode == 13)
	{
		if(e.preventDefault)
			e.preventDefault();
		if(e.stopPropagation)
			e.stopPropagation();
//		if(e.returnValue)
			e.returnValue = false;
		e.cancelBubble = true;
		do_search(obj);
		return(false);
	}
	else
		return(true);
}

function build_bars(id)
{
	var idnum = "bars_" + id;
	var obj = document.getElementById(idnum);	
	for(var i=1; i<6; i++)
	{
		var bar = create_bar(i * 4)
		obj.appendChild(bar);
	}
}

function is_touch_device() 
{
	var retval = 0;

	try {
		document.createEvent("TouchEvent");
		retval = true;
	}
	catch (e) {
		retval = false;
	}
//	alert("touch is " + retval ? " true" : " false");
	return(retval);
}

var touch_capable = is_touch_device();

function do_onplay(obj)
{
    
	document.getElementById(obj.getAttribute("button")).children[0].src = obj.getAttribute("imgurl") + '/pause.png';
}

function do_onpause(obj)
{
	document.getElementById(obj.getAttribute("button")).children[0].src = obj.getAttribute("imgurl") + '/play.png';
}

function updateXY(e) 
{
	var search = /\w\w_(\d*)/;
	var id = e.currentTarget.id.match(search)[1];
	var obj = e.currentTarget;
	var move_x = e.pageX;
	var move_y = e.pageY;

	var x = move_x - diff_x;
	var y = move_y - diff_y;
//	alert("diff_x=" + diff_x + " x=" + x);
	update_audio(document.getElementById(obj.getAttribute("audio")),x);

	obj.style.left = x;
	e.preventDefault();
	return(true);
}

function do_play(obj)
{
	var ary = document.getElementsByTagName("audio");
	var lim = ary.length;
	for(var i=0; i<lim; i++)
	{
		if(ary[i] != obj)
		{
			if(!ary[i].paused)
			{
				ary[i].pause();
				var tbl_obj = document.getElementById(ary[i].getAttribute("tbl"));
				tbl_obj.className = 'player_table';
//				var tt_obj = document.getElementById(ary[i].getAttribute("top"));
//				tt_obj.style.border = '';
				break;
			}
		}
	}
	var tbl_obj = document.getElementById(obj.getAttribute('tbl'));
//	var tt_obj = document.getElementById(obj.getAttribute('top'));
	if(obj.paused)
	{
		tbl_obj.className = 'player_table';
//		tt_obj.style.border = '';
	}
	else
	{
		tbl_obj.className = 'player_table_playing';
		now_playing = obj;
//		tt_obj.style.border = '1px solid #ffffff';
	}
	return(false);
}

function do_rewind(obj)
{
	var audio_obj = document.getElementById(obj.getAttribute("audio"));
	update_audio(audio_obj,0);
}

function play_pause_all(obj)
{
	if(now_playing)
	{
		if(now_playing.paused)
		{
			now_playing.play();
			obj.value = 'Pause';
		}
		else
		{
			now_playing.pause();
			obj.value = 'Play';
		}
	}
}

function play_pause(obj)
{
//	cancel_show_name();
	var search = /bu_(\d*)/;
	var id = obj.id.match(search)[1];
	var cvid = obj.getAttribute("canvas");
	var auid = obj.getAttribute("audio");
	var canvas_obj = document.getElementById(obj.getAttribute("canvas"));
	var audio_obj = document.getElementById(obj.getAttribute("audio"));

	if(audio_obj.paused)
	{
		audio_obj.play();
//		if(id == 0)
//			add_show_name();
//		obj.children[0].src = "images/pause.png";
	}
	else
	{
		audio_obj.pause();
//		obj.children[0].src = "images/play.png";
	}
	do_play(audio_obj);
	return(false);
}

function get_hms_str(secs)
{
	var str = '';
	if(!isNaN(secs))
	{
		var hr = Math.floor(secs / 3600);
		var min = Math.floor((secs - (hr * 3600)) / 60);
		var sec = Math.floor(secs % 60);
		if(hr > 0)
			str += hr.toString() + ':';
		str += (min.toString().length < 2 ? '0' : '') + min.toString() + ':' + (sec.toString().length < 2 ? '0' : '') + sec.toString();
	}
	return(str);
}

function do_ended(obj)
{
	var button_obj = document.getElementById(obj.getAttribute("button"));
	var pointer_obj = document.getElementById(obj.getAttribute("pointer"));
	var canvas_obj = document.getElementById(obj.getAttribute("canvas"));
	var pointer_pos = 0;
	var imgurl = obj.getAttribute("imgurl");
	button_obj.children[0].src = imgurl+'/play.png';
	pointer_obj.style.left = pointer_pos + 'px';
	update_audio(obj,0);
	obj.pause();
}

function update_audio(oAudio,pointer_pos)
{
//alert("buf_len=" + oAudio.buffered.length + " duration=" + oAudio.duration);
	if(!oAudio.buffered.length && !oAudio.duration)
		return;
	var total_time = Math.round(oAudio.duration);
	var canvas = document.getElementById(oAudio.getAttribute("canvas"));
	var dur = oAudio.duration / canvas.clientWidth;
	var nu_time = pointer_pos * dur;
//alert("total_time=" + total_time + " nu_time=" + nu_time);
	oAudio.currentTime = nu_time;
	do_progress(oAudio);
}

function do_progress(oAudio) 
{ 
	var total_time = Infinity;
	var search = /au_(.*)/
	if(oAudio.paused)
		return;
	var id = oAudio.id.match(search)[1];
	//get current time in seconds
	if(id != "0")
		total_time = Math.round(oAudio.duration);
	var elapsedTime = Math.round(oAudio.currentTime);

// because not everyone bothers with buffered... (read android)
	try
	{
		var buffered_time = Math.round(oAudio.buffered.end(0));
	}
	catch(e)
	{
		// end(0) throws
//alert("bufftime throws");
		var buffered_time = oAudio.duration;
	}
	buffered_time = Math.round(buffered_time);
	var canvas = document.getElementById(oAudio.getAttribute("canvas"));
	//update the progress bar
	if (canvas.getContext) 
	{
		var ctx = canvas.getContext("2d");
		var font_size = Math.floor(canvas.clientHeight);
		var cw = Number(canvas.clientWidth - 90);
		var dur = Number(oAudio.duration);
		if(oAudio.readyState == 4)
			var dur_str = 'Live';
		else
			var dur_str = 'Loading';

		if(isFinite(dur))
			dur_str = Math.round(dur).toString();

//	alert("dur_str=" + dur_str);

		var dur_width = ctx.measureText(dur_str).width;
		var bar_width = elapsedTime / oAudio.duration * canvas.clientWidth;
		var str = '';
		if(isFinite(dur))
			var str = get_hms_str(dur_str);
		else
			var str = dur_str;
		//clear canvas before painting

		ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

		// progress bar
		var pointer_obj = document.getElementById(oAudio.getAttribute("pointer"));
		ctx.fillStyle = "rgb(0,0,255)";
		var fWidth = (elapsedTime / oAudio.duration) * (canvas.clientWidth);
		if (fWidth > 0) 
		{
			ctx.fillRect(0, 0, fWidth, canvas.clientHeight);
			pointer_obj.style.left = fWidth + "px";
		}
		ctx.fillStyle = "rgb(0,180,0)";
		var bufWidth = (buffered_time / dur) * (canvas.clientWidth) - fWidth;
		if(bufWidth > 0)
		{
			ctx.fillRect(fWidth,0,bufWidth,canvas.clientHeight);
		}
		ctx.font = 'bold ' + font_size.toString() + 'px Helvetica';
		ctx.textBaseline = "bottom";
		ctx.fillStyle = "rgb(255,255,255)";
		var txt_pos = canvas.clientHeight * 1.10;
		ctx.fillText(str,canvas.width - ctx.measureText(str).width,txt_pos);
		str = get_hms_str(oAudio.currentTime);
		ctx.fillText(str,2,txt_pos);
	}
}

function do_canvas_click(e)
{
	var obj = e.currentTarget;

	var off_left = 0;
	for(var p=obj; p; p=p.offsetParent)
		off_left += p.offsetLeft;

	diff_x = off_left + 8;
	diff_y = obj.offsetTop + obj.parentNode.offsetTop + 20;
//	alert("diff_x=" + diff_x);
	updateXY(e);
}

function build_audio(obj)
{
	var search = /bu_(\d*)/;
	var id = obj.id.match(search)[1];
	var au_obj = document.getElementById("au_" + id);

	obj.style.display = 'none';
	au_obj.style.display = '';
}

function set_canvas()
{
	var cary = document.getElementsByTagName("canvas");
	var lim = cary.length;
	for(var i=0; i<lim; i++)
	{
		if(!cary[i].hasAttribute("private"))
			cary[i].addEventListener("click",do_canvas_click,true);
	}
}

function add_html5(obj)
{
	var foo = 1;
	var id = obj.id;
	var imgurl = obj.getAttribute("imgurl");
	var file_link = obj.getAttribute("mp3");
	var private_flag = Number(obj.getAttribute("private"));


	var str = '<table class="player_table" id="tl_' + id + '">';
//	str += '<audio src="' + file_link + '" type="audio/mpeg" id="au_' + id + '" preload="none"';
	str += '<audio src="' + file_link + '" id="au_' + id + '" preload="none"';
	str += ' button="bu_' + id + '" tbl="tl_' + id + '" top="tt_' + id + '" canvas="cv_' + id + '"';
	str += ' pointer="pt_' + id + '" imgurl="' + imgurl+ '" ontimeupdate="do_progress(this);" onprogress="do_progress(this);"';
	str += ' onended="do_ended(this);" onplay="do_onplay(this);" onpause="do_onpause(this);"></audio>';
	str += '<tr height="15px" style="vertical-align:bottom;">';
	if(id > 0)
	{
		str += '<td style="width:10px;">';
		str += '<a id="rw_' + id + '" pointer="au_' + id + '" audio="au_' + id + '" canvas="cv_' + id + '"';
		str += '" imgurl="' + imgurl +'" style="cursor:pointer;" onclick="do_rewind(this);">';
		str += '<img style="vertical-align:top;" src="'+imgurl+'/rewind.png" border="0"></a>';
		str += '</td>';
	}
	str += '<td style="width:10px;">';
	str += '<a id="bu_' + id + '" audio="au_' + id + '" canvas="cv_' + id + '" style="cursor:pointer;"';
	str += '" imgurl="' + imgurl +'" onclick="play_pause(this);"><img style="vertical-align:top;" src="'+imgurl+'/play.png" border="0"></a>';
	str += '</td>';
	str += '<div id="pc_' + id + '" class="au_pc">';
	str += '<div id="pt_' + id + '" dragger="1" style="position:absolute;left:0;">&nbsp;';
	str += '</div></div>';
	str += '<td width="200">';
	str += '<canvas class="canvas_class" id="cv_' + id + '" audio="au_' + id + '" ';
	if(private_flag)
		str += ' private="1"';
	else
		str += ' style="cursor:pointer;" onclick="do_canvas_click(event);"';
	str += ' width="200"';
	str += ' height="10" style="border:1px solid #838383;background-color:#888888;" >';
	str += ' canvas not supported ';
	str += ' </canvas></td>';
	str += '<td><img src="'+imgurl+'/earphones_small.png" onclick="vol_down(' + id + ');"></td>';
	str += '<td><div id="bars_' + id + '" style="position:relative;top:0px;left:-6px;width:35px;height:20px;"></div></td>';
	str += '<td><img src="'+imgurl+'/earphones_big.png" style="position:relative;left:-6px;" onclick="vol_up(' + id + ');"></td>';
	str += '</tr></table>';

	obj.parentNode.innerHTML = str;
	var audio_obj = document.getElementById("au_" + id);
	audio_obj.load();
	var button_obj = document.getElementById("bu_" + id);
	audio_obj.volume = Math.pow(init_vol,vol_exp);
	play_pause(button_obj);
	build_bars(id);
	return(id);
}

function addflashplayer(obj)
{
	//	var search = /playbutton_([\d]+)/
	var idnum = obj.getAttribute("playbutton");
//	var ary = obj.id.match(search);
//	var idnum = ary[1];
	var id = obj.id;
	var mp3url = obj.getAttribute('mp3');
	var tmp = location.href;
	var myurl = tmp.substr(0,tmp.lastIndexOf('/'));
	var td_obj = obj.parentNode.parentNode;
	var len = td_obj.parentNode.cells.length;
	var title = obj.getAttribute("title");

	var newobj = '<object type="application/x-shockwave-flash" data="' + myurl + '/audioplayer/player.swf" height="20" width="260">';
	newobj += '<param name="movie" value="' + myurl + '/audioplayer/player.swf">';
	newobj += '<param name="FlashVars" value="playerID=' + idnum + '&amp;soundFile=' + mp3url;
//	newobj += '&amp;titles={$gl_row["gl_user"]} Archive">';
	newobj += '&amp;autostart=yes';
	newobj += '&amp;titles=' + title + '">';
	newobj += '<param name="quality" value="high">';
	newobj += '<param name="menu" value="false">';
	newobj += '<param name="wmode" value="transparent"></object>';

	var div_obj = document.createElement('div');
	div_obj.innerHTML = newobj;
	var big_div = document.getElementById('ad_' + id);
	td_obj.replaceChild(div_obj,big_div);
//	td_obj.appendChild(div_obj);
//	obj.style.display = 'none';

//	obj.parentNode.innerHTML = newobj;
}

function add_player(obj)
{
	var id = 0;
	if(mp3_flag != '')
	{
		add_html5(obj);
	}
	else
	{
		addflashplayer(obj);
	}
}

