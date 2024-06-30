var PacificaPlayer = {
    clear_bars: function(id) {
        var topdiv = document.getElementById("bars_" + id);
        for (var i = 0; i < 5; i++) {
            topdiv.childNodes[i].style.backgroundColor = '#ffffff';
        }
    },
    set_bar: function(vol, id) {
        if (vol > 0.0) {
            var topdiv = document.getElementById("bars_" + id);
            for (var i = 0; i < 5; i++) {
                var div = topdiv.childNodes[i];
                if (div.getAttribute("vol") == vol) {
                    div.style.backgroundColor = '#00ccff';
                    break;
                }
            }
        }
    },
    vol_up: function(id) {
        var idstr = "au_" + id;
        var obj = document.getElementById("au_" + id);
        var log_vol = obj.volume;
        var vol = Math.pow(log_vol, (1 / vol_exp));
        if (vol < 1.0) {
            var nu_vol = new Number(vol + 0.2).toFixed(1);
            var log_vol = Math.pow(nu_vol, vol_exp);
            obj.volume = log_vol;
            this.clear_bars(id);
            this.set_bar(Number(nu_vol), id);
        }
    },
    vol_down: function(id) {
        var idstr = "au_" + id;
        var obj = document.getElementById("au_" + id);
        var log_vol = obj.volume;
        var vol = Math.pow(log_vol, (1 / vol_exp));
        if (vol > 0.0) {
            var nu_vol = new Number(vol - 0.2).toFixed(1);
            var log_vol = Math.pow(nu_vol, vol_exp);
            obj.volume = Math.pow(nu_vol, vol_exp);
            this.clear_bars(id);
            if (Number(nu_vol) > 0.0) this.set_bar(Number(nu_vol), id);
        }
    },
    do_vol: function(obj) {
        var id = obj.parentNode.id.match(/bars_(\d+)/)[1];
        var aud = document.getElementById("au_" + id);
        var cur_vol = Math.pow(aud.volume, (1 / vol_exp));
        this.clear_bars(id);
        var nu_vol = obj.getAttribute("vol");
        this.set_bar(nu_vol, id);
        aud.volume = Math.pow(nu_vol, vol_exp);
    },
    create_bar: function(height) {
        var div = document.createElement("div");
        div.setAttribute("vol", height / 20);
        div.style.position = "absolute";
        div.style.bottom = '0px';
        div.style.height = height + 'px';
        div.style.width = '3px';
        div.style.left = (height * 1.5) + 'px';
        div.style.cursor = 'pointer';
        if ((height / 20) == init_vol) {
            div.style.backgroundColor = '#00ccff';
            div.setAttribute("cur", true);
        } else {
            div.style.backgroundColor = '#ffffff';
        }
        div.onclick = function() {
            this.do_vol(div);
        }.bind(this);
        return (div);
    },
    // Add commas between the rest of the methods
    check_player: function() {
        var obj = document.createElement('audio');
        if (obj.canPlayType) mp3_flag = obj.canPlayType('audio/mpeg');
    },
    get_show_er: function(ret) {
        ;
    },
    check_ret_for_ie: function(e) {
        if (e.target) var obj = e.target;
        else {
            e = window.event;
            var obj = e.srcElement;
        }
        if (e.keyCode == 13) {
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
            e.returnValue = false;
            e.cancelBubble = true;
            do_search(obj);
            return (false);
        } else return (true);
    },
    build_bars: function(id) {
        var idnum = "bars_" + id;
        var obj = document.getElementById(idnum);
        for (var i = 1; i < 6; i++) {
            var bar = this.create_bar(i * 4)
            obj.appendChild(bar);
        }
    },
    is_touch_device: function() {
        var retval = 0;
        try {
            document.createEvent("TouchEvent");
            retval = true;
        } catch (e) {
            retval = false;
        }
        return (retval);
    },
    touch_capable: function() {
        var retval = 0;
        try {
            document.createEvent("TouchEvent");
            retval = true;
        } catch (e) {
            retval = false;
        }
        return (retval);
    },
    do_onplay: function(obj) {
        document.getElementById(obj.getAttribute("button")).children[0].src = obj.getAttribute("imgurl") + '/pause.png';
    },
    do_onpause: function(obj) {
        document.getElementById(obj.getAttribute("button")).children[0].src = obj.getAttribute("imgurl") + '/play.png';
    },
    updateXY: function(e) {
        var search = /\w\w_(\d*)/;
        var id = e.currentTarget.id.match(search)[1];
        var obj = e.currentTarget;
        var move_x = e.pageX;
        var move_y = e.pageY;
        var x = move_x - diff_x;
        var y = move_y - diff_y;
        this.update_audio(document.getElementById(obj.getAttribute("audio")), x);
        obj.style.left = x;
        e.preventDefault();
        return (true);
    },
    do_play: function(obj) {
        var ary = document.getElementsByTagName("audio");
        var lim = ary.length;
        for (var i = 0; i < lim; i++) {
            if (ary[i] != obj) {
                if (!ary[i].paused) {
                    ary[i].pause();
                    var tbl_obj = document.getElementById(ary[i].getAttribute("tbl"));
                    tbl_obj.className = 'player_table';
                    break;
                }
            }
        }
        var tbl_obj = document.getElementById(obj.getAttribute('tbl'));
        if (obj.paused) {
            tbl_obj.className = 'player_table';
        } else {
            tbl_obj.className = 'player_table_playing';
            now_playing = obj;
        }
        return (false);
    },
    do_rewind: function(obj) {
        var audio_obj = document.getElementById(obj.getAttribute("audio"));
        this.update_audio(audio_obj, 0);
    },
    play_pause_all: function(obj) {
        if (now_playing) {
            if (now_playing.paused) {
                now_playing.play();
                obj.value = 'Pause';
            } else {
                now_playing.pause();
                obj.value = 'Play';
            }
        }
    },
    play_pause: function(obj) {
        var search = /bu_(\d*)/;
        var id = obj.id.match(search)[1];
        var cvid = obj.getAttribute("canvas");
        var auid = obj.getAttribute("audio");
        var canvas_obj = document.getElementById(obj.getAttribute("canvas"));
        var audio_obj = document.getElementById(obj.getAttribute("audio"));
        if (audio_obj.paused) {
            audio_obj.play();
        } else {
            audio_obj.pause();
        }
        this.do_play(audio_obj);
        return (false);
    },
    get_hms_str: function(secs) {
        var str = '';
        if (!isNaN(secs)) {
            var hr = Math.floor(secs / 3600);
            var min = Math.floor((secs - (hr * 3600)) / 60);
            var sec = Math.floor(secs % 60);
            if (hr > 0) str += hr.toString() + ':';
            str += (min.toString().length < 2 ? '0' : '') + min.toString() + ':' + (sec.toString().length < 2 ? '0' : '') + sec.toString();
        }
        return (str);
    },
    do_ended: function(obj) {
        var button_obj = document.getElementById(obj.getAttribute("button"));
        var pointer_obj = document.getElementById(obj.getAttribute("pointer"));
        var canvas_obj = document.getElementById(obj.getAttribute("canvas"));
        var pointer_pos = 0;
        var imgurl = obj.getAttribute("imgurl");
        button_obj.children[0].src = imgurl + '/play.png';
        pointer_obj.style.left = pointer_pos + 'px';
        this.update_audio(obj, 0);
        obj.pause();
    },
    update_audio: function(oAudio, pointer_pos) {
        if (!oAudio.buffered.length && !oAudio.duration) return;
        var total_time = Math.round(oAudio.duration);
        var canvas = document.getElementById(oAudio.getAttribute("canvas"));
        var dur = oAudio.duration / canvas.clientWidth;
        var nu_time = pointer_pos * dur;
        oAudio.currentTime = nu_time;
        this.do_progress(oAudio);
    },
    do_progress: function(oAudio) {
        var total_time = Infinity;
        var search = /au_(.*)/;
        if (oAudio.paused) return;
        var id = oAudio.id.match(search)[1];
        if (id != "0") total_time = Math.round(oAudio.duration);
        var elapsedTime = Math.round(oAudio.currentTime);
        try {
            var buffered_time = Math.round(oAudio.buffered.end(0));
        } catch (e) {
            var buffered_time = oAudio.duration;
        }
        buffered_time = Math.round(buffered_time);
        var canvas = document.getElementById(oAudio.getAttribute("canvas"));
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
            var font_size = Math.floor(canvas.clientHeight);
            var cw = Number(canvas.clientWidth - 90);
            var dur = Number(oAudio.duration);
            if (oAudio.readyState == 4) var dur_str = 'Live';
            else var dur_str = 'Loading';
            if (isFinite(dur)) dur_str = Math.round(dur).toString();
            var dur_width = ctx.measureText(dur_str).width;
            var bar_width = elapsedTime / oAudio.duration * canvas.clientWidth;
            var str = '';
            if (isFinite(dur)) var str = this.get_hms_str(dur_str);
            else var str = dur_str;
            ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            var pointer_obj = document.getElementById(oAudio.getAttribute("pointer"));
            ctx.fillStyle = "rgb(0,0,255)";
            var fWidth = (elapsedTime / oAudio.duration) * (canvas.clientWidth);
            if (fWidth > 0) {
                ctx.fillRect(0, 0, fWidth, canvas.clientHeight);
                pointer_obj.style.left = fWidth + "px";
            }
            ctx.fillStyle = "rgb(0,180,0)";
            var bufWidth = (buffered_time / dur) * (canvas.clientWidth) - fWidth;
            if (bufWidth > 0) {
                ctx.fillRect(fWidth, 0, bufWidth, canvas.clientHeight);
            }
            ctx.font = 'bold ' + font_size.toString() + 'px Helvetica';
            ctx.textBaseline = "bottom";
            ctx.fillStyle = "rgb(255,255,255)";
            var txt_pos = canvas.clientHeight * 1.10;
            ctx.fillText(str, canvas.width - ctx.measureText(str).width, txt_pos);
            str = this.get_hms_str(oAudio.currentTime);
            ctx.fillText(str, 2, txt_pos);
        }
    },
    do_canvas_click: function(e) {
        var obj = e.currentTarget;
        var off_left = 0;
        for (var p = obj; p; p = p.offsetParent) off_left += p.offsetLeft;
        diff_x = off_left + 8;
        diff_y = obj.offsetTop + obj.parentNode.offsetTop + 20;
        this.updateXY(e);
    },
    build_audio: function(obj) {
        var search = /bu_(\d*)/;
        var id = obj.id.match(search)[1];
        var au_obj = document.getElementById("au_" + id);
        obj.style.display = 'none';
        au_obj.style.display = '';
    },
    eet_canvas: function() {
        var cary = document.getElementsByTagName("canvas");
        var lim = cary.length;
        for (var i = 0; i < lim; i++) {
            if (!cary[i].hasAttribute("private")) cary[i].addEventListener("click", this.do_canvas_click.bind(this), true);
        }
    },
    add_html5: function(obj) {
        var id = obj.id;
        var imgurl = obj.getAttribute("imgurl");
        var file_link = obj.getAttribute("mp3");
        var private_flag = Number(obj.getAttribute("private"));
        var str = '<table class="player_table" id="tl_' + id + '">';
        str += '<audio src="' + file_link + '" id="au_' + id + '" preload="none"';
        str += ' button="bu_' + id + '" tbl="tl_' + id + '" top="tt_' + id + '" canvas="cv_' + id + '"';
        str += ' pointer="pt_' + id + '" imgurl="' + imgurl + '" ontimeupdate="PacificaPlayer.do_progress(this);" onprogress="PacificaPlayer.do_progress(this);"';
        str += ' onended="PacificaPlayer.do_ended(this);" onplay="PacificaPlayer.do_onplay(this);" onpause="PacificaPlayer.do_onpause(this);"></audio>';
        str += '<tr height="15px" style="vertical-align:bottom;">';
        if (id > 0) {
            str += '<td style="width:10px;">';
            str += '<a id="rw_' + id + '" pointer="au_' + id + '" audio="au_' + id + '" canvas="cv_' + id + '"';
            str += '" imgurl="' + imgurl + '" style="cursor:pointer;" onclick="PacificaPlayer.do_rewind(this);">';
            str += '<img style="vertical-align:top;" src="' + imgurl + '/rewind.png" border="0"></a>';
            str += '</td>';
        }
        str += '<td style="width:10px;">';
        str += '<a id="bu_' + id + '" audio="au_' + id + '" canvas="cv_' + id + '" style="cursor:pointer;"';
        str += '" imgurl="' + imgurl + '" onclick="PacificaPlayer.play_pause(this);"><img style="vertical-align:top;" src="' + imgurl + '/play.png" border="0"></a>';
        str += '</td>';
        str += '<div id="pc_' + id + '" class="au_pc">';
        str += '<div id="pt_' + id + '" dragger="1" style="position:absolute;left:0;">&nbsp;';
        str += '</div></div>';
        str += '<td width="200">';
        str += '<canvas class="canvas_class" id="cv_' + id + '" audio="au_' + id + '" ';
        if (private_flag) str += ' private="1"';
        else str += ' style="cursor:pointer;" onclick="PacificaPlayer.do_canvas_click(event);"';
        str += ' width="200"';
        str += ' height="10" style="border:1px solid #838383;background-color:#888888;" >';
        str += ' canvas not supported ';
        str += ' </canvas></td>';
        str += '<td><img src="' + imgurl + '/earphones_small.png" onclick="PacificaPlayer.vol_down(' + id + ');"></td>';
        str += '<td><div id="bars_' + id + '" style="position:relative;top:0px;left:-6px;width:35px;height:20px;"></div></td>';
        str += '<td><img src="' + imgurl + '/earphones_big.png" style="position:relative;left:-6px;" onclick="PacificaPlayer.vol_up(' + id + ');"></td>';
        str += '</tr></table>';
        obj.parentNode.innerHTML = str;
        var audio_obj = document.getElementById("au_" + id);
        audio_obj.load();
        var button_obj = document.getElementById("bu_" + id);
        audio_obj.volume = Math.pow(init_vol, vol_exp);
        this.play_pause(button_obj);
        this.build_bars(id);
        return (id);
    },
    addflashplayer: function(obj) {
        var idnum = obj.getAttribute("playbutton");
        var id = obj.id;
        var mp3url = obj.getAttribute('mp3');
        var tmp = location.href;
        var myurl = tmp.substr(0, tmp.lastIndexOf('/'));
        var td_obj = obj.parentNode.parentNode;
        var title = obj.getAttribute("title");
        var newobj = '<object type="application/x-shockwave-flash" data="' + myurl + '/audioplayer/player.swf" height="20" width="260">';
        newobj += '<param name="movie" value="' + myurl + '/audioplayer/player.swf">';
        newobj += '<param name="FlashVars" value="playerID=' + idnum + '&amp;soundFile=' + mp3url;
        newobj += '&amp;autostart=yes';
        newobj += '&amp;titles=' + title + '">';
        newobj += '<param name="quality" value="high">';
        newobj += '<param name="menu" value="false">';
        newobj += '<param name="wmode" value="transparent"></object>';
        var div_obj = document.createElement('div');
        div_obj.innerHTML = newobj;
        var big_div = document.getElementById('ad_' + id);
        td_obj.replaceChild(div_obj, big_div);
    },
    add_player: function(obj) {
        if (mp3_flag != '') {
            this.add_html5(obj);
        } else {
            this.addflashplayer(obj);
        }
    }
}

