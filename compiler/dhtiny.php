<?php
/*
 * Simple DHTiny utility on server side
 *
 */
define("DHTINY_ROOT", "..");
define("DENY_DIR_PATTERN", "/(.git|nbproject|compiled|compiler|doc|docgen|demos|res|\/\.$|\/\.\.$)/");
define("ALLOW_FILE_PATTERN", "/\.js$/");

// Read all js file path
function readDHTinyTree( $path = '.', $level = 0, $nameOnly = true){
    $ret = array();
    
    $dh = @opendir( $path );
    // Open the directory to the handle $dh    
    while( false !== ( $file = readdir( $dh ) ) ){
        $fullPath = "$path/$file";
        if( is_dir($fullPath ) && preg_match(DENY_DIR_PATTERN, $fullPath ) != 1) {
            $ret[] = array("$file" => readDHTinyTree( $fullPath, ($level+1) ));
        } else if(preg_match(ALLOW_FILE_PATTERN, $fullPath)) {
            $ret[] = $file;
        }
    }
    
    // Close the directory handle
    closedir( $dh );    
    return $ret;
}

// Combine all given files into a single file
function combineDHTinyModules($files, &$loadedFiles = array(), &$ret= "") {
    $ret = "";
    foreach($files as $f) {
        // Complete full file path
        $f = strtolower($f);
        if (!strpos($f,".js")) {
            $f = $f . ".js";
        }
        $fullPath = DHTINY_ROOT . "/" . $f;
        if(preg_match("/\\.\\./", $fullPath)) {
            // Invalid file path (Prevent simple file path injection)
            continue;
        }
        if (!isset($loadedFiles[$f]) && file_exists($fullPath)) {
            $str = file_get_contents($fullPath);
            
            if (preg_match_all("/\\$(?:dh|dhtiny)\.Require\(\s*\[{0,1}([^\])]*)\]{0,1}\s*\)/", $str, $matchesarray)) {
                if (isset($matchesarray[1])) {
                    $requires = $matchesarray[1];
                    if (!is_array($requires)) $requires = array($requires);
                    
                    // Process items like 'ctr/richcanvas,animitem'
                    for ($i = 0; $i < count($requires); $i++) {
                        $rq = $requires[$i];
                        $rq= preg_replace("/[\s|'\"]+/", '', $rq);
                        if (strpos($rq, ",") && strpos($rq, "/")) {
                            $rq = explode(",", $rq);

                            $path = explode("/", $rq[0]);
                            $rq[0] = $path[count($path) -1]; // Save first file name in the list
                            array_pop($path);
                            $path = implode("/", $path) . "/";

                            // Remake the full list
                            //echo "Path: ".$path. ", files: ". print_r($rq, true) . "<br>";
                            $requires[$i] = $path . implode(",".$path, $rq);
                            //echo $requires[$i]."<br>---------------------</br>";
                        }
                    }
                    $requires = implode(",", $requires);
                    $requires = explode(",", $requires);
                    //echo "Res: ".print_r($requires, true) . "<br>";
                }                
                $ret .= combineDHTinyModules($requires, $loadedFiles);
            }
            
            $ret .= $str;
            $loadedFiles[$f] = true;
        }
    }    
    return $ret;
}

/*$str="\$dh.Require(['ctrl/animitem,slider', 'ctrl/imgbutton']);\$dh.Require('util/dragmanager');";

echo $str . "<br/>";
$files = preg_match_all("/\\$(?:dh|dhtiny)\.Require\(\s*\[{0,1}([^\])]*)\]{0,1}\s*\)/", $str, $matchesarray);
$requires = preg_replace("/[\s|'\"]+/", '', implode(",", $matchesarray[1]));
$requires = explode(",", $requires);
print_r($requires);
exit;*/

 
?>
