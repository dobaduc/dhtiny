<?php
error_reporting(E_ALL);
require_once 'dhtiny.php';
require_once 'yuicompressor.php';
$dhtinyTreeData = json_encode(readDHTinyTree(DHTINY_ROOT));

if (isset($_REQUEST["dhtiny-modules"])) {
    // INCLUDE COMPRESSOR CLASS
    include('yuicompressor.php');

    // INVOKE CLASS
    $yui = new YUICompressor("./", "./tmp", $options);

    // ADD FILES
    foreach ($_REQUEST["file_list"] as $f) {
        $yui->addFile($f);
    }    
    // ADD STRING    //$yui->addString($string);
    // COMPRESS
    $compiledCode = $yui->compress();
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
    <style type="text/css">
        body {margin:0px; padding: 0px; overflow:hidden;}
        .DHTreeView {
            padding: 0px;
            margin:0px;
            font-family:Times New Roman;
            font-size:14px;
            background: #f5fcfc;
            border:solid 1px green;
            overflow: auto;
            position:absolute;
            left:5px;
            top:20px;
            width:220px;
        }
        .DHTreeView li div:hover{text-decoration:underline;}
        .DHTreeView div{ cursor:pointer;}
        .DHTreeView .selectedNode { color:#af0000;background:#ECE9D8; font-weight:bold;}
        .DHTreeView .expandedNode { color: #af0000;font-weight:normal;}
        .DHTreeView .normalNode { color: #af0000;font-weight:normal;}
        #output {
            position: absolute;
            left: 235px;
            width:800px;
            color: purple;
            font-family:monospace;
        }
    </style>
    <?php 
        echo "<script type='text/javascript'> TreeData = ". $dhtinyTreeData . ";</script>";
    ?>
    <script type="text/javascript">
        $dh.addLoader(function() {
            // Process TreeData
            var bs = $dh.bodySize();
            $dh.set($dh.el("output"), {
                value: "<?php echo isset($compiledCode)? $compiledCode : ""; ?>",
                style: {height: bs.height - 20 }
            });
            
            // Process & sort tree data
            function processTree(data) {                
                var i, ret = [];                
                for (i = 0; i < data.length; i ++) {
                    if ($dh.isObj(data[i])){
                        for (var key in data[i]) {                            
                            ret.push([
                                // root node
                                {innerHTML: key, iconType: "folder"},
                                // child nodes
                                processTree(data[i][key])
                            ]);
                            break;
                        }
                    }
                }
                for (i = 0; i < data.length; i ++) {
                    if (typeof data[i] != "object") {
                        ret.push({innerHTML: data[i], iconType: "file"});
                    }
                }
                return ret;
            }

            var resultData = processTree(TreeData),                
                treeView = new DHTreeView(document.body, {
                    height: bs.height - 20,
                    nodeHeight: 22, imagePath: $dh.root + "res/images/DHTreeView/",
                    listType: 2, captionpadding: 4, iconwidth: 20,
                    className: "DHTreeView",
                    treeData: resultData          
                });
        });
    </script>
<body>

<div>
Select components, then click <button onclick="compileCode()">Compile</button>
</div>
<textarea id="output"></textarea>
</body>
</html>