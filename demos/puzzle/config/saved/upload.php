<?php
// Process file type to determine upload folders
$fname = $_FILES['userfile']['name'];
$tmpname = $_FILES['userfile']['tmp_name'];
$dotpos =strripos($_FILES['userfile']['name'] ,".");
$fext = strtolower(substr($fname, $dotpos -strlen($fname)+1));
if (stripos("swf,avi,mp4,flv,", $fext ) >0) {
	$uploaddir = "../videos/";
}
else { 
	$uploaddir = '../images/';
}
echo "Uploading file type ".$fext." to ".$uploaddir."<br/>";

// Now do upload
$uploadfile = $uploaddir. basename($fname);
if (move_uploaded_file($tmpname, $uploadfile)) {
  echo "File was successfully uploaded.\n";
} else {
   echo "Upload failed";
}
?>