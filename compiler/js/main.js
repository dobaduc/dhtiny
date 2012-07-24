/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$dh.addLoader(function() {
    // Process TreeData
    var bs = $dh.bodySize();
    $dh.set($dh.el("output"), {
        value: "-- Compiled source --"
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
            height: "50%",
            nodeHeight: 22, imagePath: $dh.root + "res/images/DHTreeView/",
            listType: 2, captionpadding: 4, iconwidth: 20,
            className: "DHTreeView",
            treeData: resultData          
        });
    
    treeView.addEv("onnodeclick", function(sender, node, ev) {
        var parents, i, line;
        
        if (node.iconType == "folder") return;
        node.compileSelected = (node.compileSelected == true)? false : true;
        
        if (node.compileSelected) {
            $dh.addClass(node.caption, "compileSelectedNode");
            if (!node.fullPath) {
                node.fullPath = "";
                parents = treeView.getParentNodes(node);
                
                // Find the full path
                for (i = 0; i < parents.length; i++) {
                    node.fullPath += parents[i].caption.innerHTML + "/";
                }
                node.fullPath += node.caption.innerHTML;
            }
                
            // Add a selected module to the list
            $dh.New("li", {
                id: node.fullPath,
                html:node.fullPath,
                parentNode: "moduleList"
            });
        } else {
            $dh.rmClass(node.caption, "compileSelectedNode");
            // Remove from selected list
            if ($dh.el(node.fullPath)) {
                $dh.rmCh($dh.el("moduleList"), $dh.el(node.fullPath));
            }
        }
    });
});


function getCompiledCode() {
    // Get file list
    var modules = $dh.el("moduleList").children, postData=[];
    for (var i = 0; i < modules.length; i ++) {
        if (modules[i].innerHTML != "") {
            postData.push(modules[i].id);
        }
    }
    $dh.ajax.POST("index.php","dhtinymodulesdhtinymodules="+encodeURI(postData), function(res){
        $dh.el("output").value = res;
    });
}