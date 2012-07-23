<?php
error_reporting(E_ALL);
require_once 'dhtiny.php';
$dhtinyTreeData = json_encode(readDHTinyTree(DHTINY_ROOT));

if (isset($_REQUEST["dhtinymodules"])) {
    $fileList = $_REQUEST["dhtinymodules"];
    
    // Make sure that DHTiny is included
    if (!in_array("dhtiny", $fileList) && !in_array("dhtiny.js", $fileList)) {
        array_unshift($fileList, "dhtiny.js");
    }
            
    // INCLUDE COMPRESSOR CLASS
    include('yuicompressor.php');
    // INVOKE CLASS
    $yui = new YUICompressor("./yuicompressor-2.4.7.jar", "./tmp", $options);
    // ADD FILES
    foreach ($fileList as $f) {
        $yui->addFile(__DIR__ ."/../".$f);
    }
    // ADD STRING    //$yui->addString($string);
    // COMPRESS
    $compiledCode = $yui->compress();
    
    echo $compiledCode;
    //echo "CHIMTO";
    exit;
}

// Testing
/*echo "<textarea style='width:100%;height:100%;'>";
require_once('yuicompressor.php');
$yui = new YUICompressor("./yuicompressor-2.4.7.jar", "./tmp");
//$yui->addFile(__DIR__ ."/../dhtiny.js");
//echo $yui->compress();
//$yui->addString(combineDHTinyModules(array("util/dragmanager")));
$yui->addString(combineDHTinyModules(array("dhtiny","ctrl/animplayer")));
echo $yui->compress();
echo "</textarea>";
exit;*/
?>

<html>
<title>DHTiny compiler</title>
<script type="text/javascript" src="../dhtiny.js"></script>
<script type="text/javascript" src="../dhtiny-dom.js"></script>
<script type="text/javascript" src="../ctrl/treeview.js"></script>
<link rel="stylesheet" href="css/main.css" />
<?php 
    echo "<script type='text/javascript'>".
         "TreeData = ". $dhtinyTreeData . ";".
         "CompiledSource = \"". (isset($compiledCode) ? $compiledCode: "") . "\";".
         "</script>";
?>
<script type="text/javascript" src="js/main.js"></script>
<body>

<div>
&nbsp;Available components
</div>

<div id="selectedModules">
Selected components <button id="compileButton" onclick="getCompiledCode()">Compile</button>
    <ul id="moduleList">
    </ul>
</div>
    
<textarea id="output"></textarea>
</body>
</html>