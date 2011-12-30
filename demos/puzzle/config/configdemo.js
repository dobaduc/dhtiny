// Read game configurations from server
$dh.GC = eval('('+unescape($dh.ajax.GET("config.js?ppx=" + (new Date().getTime())))+')');
//$dh.GC = eval('('+$dh.ajax.GET("config.js?ppx=" + (new Date().getTime()))+')');

// Read images and videos' name from server
var $$_x_$$ = eval('('+$dh.ajax.GET("filelistup.php?ppx=" + (new Date().getTime()))+')');
$dh.svImgNames = $$_x_$$.svImgNames;
$dh.svVidNames = $$_x_$$.svVidNames;
//["images/loading.gif","images/background.gif","images/butstart.gif", "images/butstartover.gif","images/gamepic1.jpg"];
//["videos/test0.swf","videos/test1.swf","videos/test2.swf","videos/test3.swf","videos/test4.swf","videos/test5.swf"];
//$dh.svCurNames = //["cursors/harrow.cur", "cursors/hmove.cur"];

$dh.addLoader(function() {
    // Write configuration information to table    
    $dh.writeTable();
	// Add simple wrap effect
    $dh.addEv(document.body, "onclick", function(ev){
        var tar = $dh.evt(ev).target;
        if (!$dh.isStr(tar.tagName)) return;
        while(tar.tagName.toLowerCase() != "tr") {
            tar = tar.parentNode;
            if (!tar || !$dh.isStr(tar.tagName)) return;
        }
		        
        if (tar.cells[0].className != "SectionHeader") return;
		
		var tbody = tar.parentNode;
		var ridx = tar.rowIndex;	
        var now = tbody.rows[ridx+1].style.display || "";
        var next = (now == "") ? "none":"";
        
        tar.cells[0].style.color = (now == "") ? "darkblue":"";
        
        while (tbody.rows[ridx+1].style.display == now 
            && tbody.rows[ridx+1].className != "Final" 
            && tbody.rows[ridx+1].cells[0] && tbody.rows[ridx+1].cells[0].className != "SectionHeader") {
            	tbody.rows[ridx+1].style.display = next;
            	ridx ++;
        	}
    });
    
    // Add banner fade effect
	window.bannerOpacDir = -1;
	window.bannerCurrOpac = 100;
	setInterval("$dh.__changeBannerOpac()",60);
});

$dh.writeTable = function() {
    // Automatically fill named parameters inside table
    for (var p in $dh.GC) {
        var res = document.getElementsByName(p);

        if (res && res[0]) {
            if ( ",img,vid,cur,med,".indexOf(p.substr(p.length-3)) > 0)
                $dh.putMediaNames(res[0], p.substr(p.length-3), $dh.GC[p]);
            else {    // // Set text/number text box
                if (res[0].tagName.toLowerCase() == "input") {
                    res[0].value = $dh.GC[p];                    
                }
                else {                    
                    //alert("Excluded " + p);
                    //res[0].innerHTML = $dh.GC[p];
                }               
            }
            res[0].onchange = function() { // Set on change event to update new data value
                $dh.GC[this.name] = this.value;
            }
        }
    }
    
    // Specially set some props and event for max level
    var maxlv = document.getElementsByName("maxlevel")[0];
    var currentlevel = document.getElementsByName("currentlevel")[0];
    var npieceonrow = document.getElementsByName("npieceonrow")[0];
    var npieceoncol = document.getElementsByName("npieceoncol")[0];
    var availabletime = document.getElementsByName("availabletime")[0];
    var puzzlemedia = document.getElementsByName("puzzlemedia")[0];
    var fullpuzzlemedia = document.getElementsByName("fullpuzzlemedia")[0];
    var maxpiece = 8;
    
    // Make data for puzzle media select boxes
    $dh.putMediaNames(puzzlemedia, "mix");
    $dh.putMediaNames(fullpuzzlemedia, "mix");        
    
    var opx = document.createElement("option"); // Blank value for full media select box
    opx.value = opx.innerHTML = "";
    fullpuzzlemedia.insertBefore(opx,fullpuzzlemedia.childNodes[0]);
    
    for (var i = 1; i < $dh.GC.leveldata.length; i ++) {
        // For max level
        var op = opx.cloneNode(true);
        op.value = op.innerHTML = i;
        if (i == $dh.GC.maxlevel)
            op.selected = true;
        maxlv.appendChild(op);
        // For current level
        currentlevel.appendChild(op.cloneNode(true));
        // For other params
        if (i < maxpiece) {
            npieceoncol.appendChild(op.cloneNode(true));
            npieceonrow.appendChild(op.cloneNode(true));
        }
    }
    
    // For time only
    for (var i = 3; i < 80; i++) {
        var op = opx.cloneNode(true);
        op.innerHTML = op.value = i* 10;
        availabletime.appendChild(op);
    }
    
    // Math parameters with level on the first time
    $dh.loadCurrentLevelParams();
    
    // Specially set some events for level parameters
    currentlevel.onchange= function() { $dh.loadCurrentLevelParams();};
    npieceonrow.onchange = function() { $dh.updateCurrentLevelParams();};
    npieceoncol.onchange = function() { $dh.updateCurrentLevelParams();};
    puzzlemedia.onchange = function() { $dh.updateCurrentLevelParams();};
    fullpuzzlemedia.onchange = function() { $dh.updateCurrentLevelParams();};
    availabletime.onchange = function() { $dh.updateCurrentLevelParams();};
}

$dh.loadCurrentLevelParams = function() {
    var lv = parseInt(document.getElementsByName("currentlevel")[0].value,10);
    var map = {"npieceonrow" : "r", "npieceoncol":"c", "puzzlemedia": "v", "fullpuzzlemedia":"fullv", "availabletime":"t"};
    for (var p in map) {
        var el = document.getElementsByName(p)[0];
        var found = false;
        for (var i = 0 ; i < el.childNodes.length; i++) {
            if (el.childNodes[i].value == $dh.GC.leveldata[lv][map[p]]) {
                el.childNodes[i].selected = true;
                found = true;
            }
        }
        if (!found)
            el.childNodes[0].selected = true;
    }
}

$dh.updateCurrentLevelParams = function() {
    var lv = parseInt(document.getElementsByName("currentlevel")[0].value,10);
    var map = {"npieceonrow" : "r", "npieceoncol":"c", "puzzlemedia": "v", "fullpuzzlemedia":"fullv", "availabletime":"t" };
    for (var p in map) {
        var el = document.getElementsByName(p)[0];
        $dh.GC.leveldata[lv][map[p]] = el.value;        
    }
}

// Write selectable media names to selection box
$dh.putMediaNames = function(select, type, currentVal) {
    var data;
    if (type == "img") data = $dh.svImgNames;
    if (type == "vid") data = $dh.svVidNames;
    if (type == "cur") data = $dh.svCurNames;
    if (type == "mix") data = $dh.svVidNames.concat($dh.svImgNames);
        
    select.innerHTML = "";
    for (var i = 0; i < data.length; i++) {
        var op = document.createElement("option");
        op.value = data[i];
        op.innerHTML = data[i].substr(data[i].lastIndexOf("/")+1);
        if (data[i] == currentVal)
            op.selected = true;
        select.appendChild(op);
    }
}

$dh.__changeBannerOpac = function(){
	var ban = $dh.el("Banner");
	window.bannerCurrOpac = (window.bannerCurrOpac + window.bannerOpacDir * 5);
	if (window.bannerCurrOpac < 25 || window.bannerCurrOpac > 100)
		window.bannerOpacDir = -window.bannerOpacDir;
	if (window.bannerCurrOpac>100)	window.bannerCurrOpac= 100;
	$dh.opac(ban, window.bannerCurrOpac);
}

$dh.startUpload = function() {
	var uform = $dh.el("upload_form");
	var upload_field = $dh.el("upload_file");
	
	var re_text = /\.gif|\.jpg|\.png|\.swf|\.flv/i;
	var filename = upload_field.value;
	/* Checking file type */
	if (filename.toLowerCase().search(re_text) == -1)    {
		alert("File does not have allowed (gif|jpg|png|swf|avi|flv) extensions");
		uform.reset();
		return false;
	}
	$dh.el('upload_status').innerHTML = "Uploading file...";
	uform.submit();
	upload_field.disabled = true;
	return true;
}

$dh.onUploadResponse = function(res, msg) {
	if (res =="OK")
		$dh.el('upload_status').innerHTML = "File was successfully uploaded! ";
	else
		$dh.el('upload_status').innerHTML = "Uploading failed!";
	$dh.el("upload_file").disabled = false;
	$dh.el("upload_fsvname").value ="";
}

$dh.onSubmitSettings = function() {
    $dh.el("savesettingbut").focus(); // --> Force onchange event of all input elements to update $dh.GC
    $dh.el("savesettingbut").blur();
    // Submit all data
    var sform = $dh.el("setting_form");
    $dh.el("savesetting_status").innerHTML = "Saving all settings....";
    var pos = JSON.stringify($dh.GC).replace(/\{\"/g,"\{");
    pos = pos.replace(/\,\"/g,"\,");
    pos = pos.replace(/\"\:/g,"\:");   
    $dh.el("settingdatas").value = escape(pos);
    sform.submit();
}

$dh.onSaveSettingResponse = function(res, msg) {
    if (res == "OK")
        $dh.el("savesetting_status").innerHTML = res+": Settings have been saved";
    else
        $dh.el("savesetting_status").innerHTML = res+": "+ msg;
}