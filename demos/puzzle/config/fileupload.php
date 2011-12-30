<?php
//$upload_dir = dirname(__FILE__)."/../videos";//getcwd(); // Path without "/"

function getFileExt($fname) {
	$dotpos =strripos($fname,".");
	return strtolower(substr($fname, $dotpos -strlen($fname)+1));
}

if (isset($_POST['fileframe'])) {
	$result = 'ERROR';
	$result_msg = 'No FILE field found';
	if (isset($_FILES['upload_file']))  // file was send from browser    
	{        
		if ($_FILES['upload_file']['error'] == UPLOAD_ERR_OK)  // no error        
		{            
			$filename = basename($_FILES['upload_file']['name']); // file name  
			$fsvname = basename($_POST['upload_fsvname']); // file name on server
			$fext = strtolower(getFileExt($filename));
			// Auto deliver file to folders
			if (stripos(",swf,avi,mp4,flv,", $fext ) >0) {
				$upload_dir = dirname(__FILE__)."/../videos";
			}
			else { 
				$upload_dir = dirname(__FILE__)."/../images";
			}
			// main action -- move uploaded file to $upload_dir          
			if (move_uploaded_file($_FILES['upload_file']['tmp_name'], $upload_dir.'/'.$filename)) {
				$result = 'OK'; $result_msg = $upload_dir;
			}
			else
				$result = "ERROR";
			
			if ($fsvname != "") {
				rename($upload_dir.'/'.$filename, $upload_dir.'/'.$fsvname.'.'.$fext);
			}
		}        
		elseif ($_FILES['upload_file']['error'] == UPLOAD_ERR_INI_SIZE) {       
			$result_msg = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
		} else {
			$result_msg = 'Unknown error';       
			// you may add more error checking, see http://www.php.net/manual/en/features.file-upload.errors.php for details     
		}    
	}

	// Outputing trivial html with javascript code     
	// (return data to document)    
	echo '<html><head><title>-</title></head><body>';
	echo '<script language="JavaScript" type="text/javascript">'."\n";	
	echo "window.parent.\$dh.onUploadResponse('".$result."','".$result_msg."');";
	echo "\n".'</script></body></html>';
	exit(); // do not go futher }// FILEFRAME 
}

if (isset($_POST['settingframe'])) {
	$result = "OK";
	$result_msg = "";
	// Write all parameters to config file
	try {
		$f = fopen(dirname(__FILE__).'/../config/config.js', "w");
		fwrite($f, $_POST['settingdatas']);  //str_replace(",",",\r\n",$_POST['settingdatas']));
		fclose($f);
	} catch (Exception $e) {
		$result = "ERROR";
		$result_msg = $e->getMessage();
	}
	
	echo '<html><head><title>-</title></head><body>';
	echo '<script language="JavaScript" type="text/javascript">'."\n";	
	echo "window.parent.\$dh.onSaveSettingResponse('".$result."','".$result_msg."');";
	echo "\n".'</script></body></html>';
	exit();
}

/*/ FILEFRAME section END just userful functions which 'quotes' all HTML-tags and special symbols 
// from user input 
function safehtml($s){
	$s=str_replace("&", "&amp;", $s);
	$s=str_replace("<", "&lt;", $s);
	$s=str_replace(">", "&gt;", $s);
	$s=str_replace("'", "&apos;", $s);
	$s=str_replace("\"", "&quot;", $s);
	return $s;
}
if (isset($_POST['description']))
{
	$filename = $_POST['filename'];
	$size = filesize($upload_dir.'/'.$filename);
	$date = date('r', filemtime($upload_dir.'/'.$filename));
	$description = safehtml($_POST['description']);
	$html ="<html>"
			."<head><title>{$filename} [uploaded by IFRAME Async file uploader]</title></head>"
		."<body>"
			."<h1>{$filename}</h1>"
			."<p>This is a file information page for your uploaded file. Bookmark it, or send to anyone...</p>"
			."<p>Date: {$date}</p>"
			."<p>Size: {$size} bytes</p>"
			."<p>Description: <pre>{$description}</pre></p>"
			."<p>"
				."<a href=\"{$web_upload_dir}/{$filename}\" style=\"font-size: large;\">download file</a><br>"
				."<a href=\"{$PHP_SELF}\" style=\"font-size: small;\">back to file uploading</a><br>"
				."<a href=\"{$web_upload_dir}/upload-log.html\" style=\"font-size: small;\">upload-log</a>"
			."</p><br><br>"
			."Example by <a href=\"http://www.anyexample.com/\">AnyExample</a>"
		."</body>"
		."</html>";
	
	// save HTML
	$f = fopen($upload_dir.'/'.$filename.'-desc.html', "w");
	fwrite($f, $html);
	fclose($f);
	$msg = "File {$filename} uploaded, <a href='{$web_upload_dir}/{$filename}-desc.html'>see file information page</a>";
	
	// Save to file upload-log
	$f = fopen($upload_dir."/upload-log.html", "a");
	fwrite($f, "<p>$msg</p>\n");
	fclose($f);
	
	// setting result message to cookie
	//setcookie('msg', $msg);
	// redirecting to the script main page, we're doing so 
	// to avoid POST form reposting this method of outputting messages is called 'flash' in Ruby on Rails
	header("Location: http://".$_SERVER['HTTP_HOST'].$PHP_SELF);
	exit();     // redirect was send, so we're exiting now}
}
*/
// Check permission
/*
$tf = $upload_dir.'/'.basename(md5(rand()).".test"); // Temp folder
$f = @fopen($tf, "w");
if ($f == false)
	die("Fatal error! {$upload_dir} is not writable. Set 'chmod 777 {$upload_dir}' or something like this");
fclose($f);
unlink($tf);*/

?>