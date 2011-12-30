<?php
function getFileExt($fname) {
	$dotpos =strripos($fname,".");
	return strtolower(substr($fname, $dotpos -strlen($fname)+1));
}

function writeFileList($path, $listName, $exts) {
	$dir = dirname(__FILE__)."/../".$path;
	$dh = opendir($dir);
	$str = $listName.":[";
	while (($file = readdir($dh)) !== false) {
		if (stripos($exts, getFileExt($file) ) >0)
			$str = $str.'"'.$path.'/'.$file.'",';
	}
	$str = substr($str, 0, strlen($str) -1).']';
	closedir($dh);
	return $str;
}
echo "{".writeFileList("images", "svImgNames",",jpg,gif,png,").",".writeFileList("videos", "svVidNames",",swf,flv,")."}";
?>