$dh.Require(["ctrl/richcanvas", "util/imglist"]);
$dh.isLoaded("ctrl/treeview");

$dh.newClass("DHTreeView", DHRichCanvas, {
    /* props {
        nodeHeight- node height value (px)
        listType-   0: odered list, 1: unodered list, default: rich list
        nobranch-  true: display brand image
    */
    init: function(container, props) {
        DHRichCanvas.prototype.init.apply(this, arguments);
        if ($dh.isNil(this.listType)) this.listType = 2;
	},
	setProp: function(p, value) {
	    this[p] = value;
	    switch(p) {
	        case "treeData":
	            this.rootList = this.createList(this.canvas, this.treeData, 0);
	            break;
	        default:
	            DHRichCanvas.prototype.setProp.apply(this,arguments);
	            break;
	    }
	},
    // Return a single node or a list with root node and its children
	createList: function (container, data, depth) {
		var list = this.createListContainer(container);
		list.depth = depth;
		
		for (var i = 0; i < data.length; i++) {
		    var node;
			if ($dh.isArr(data[i])) {
				node = this.createNode(list, data[i][0], depth); // Top node
				if (i== data.length-1) node.isLastChild = true;
                node.childList = this.createList(node, data[i][1], depth+1);
                
                if (node.status == "expanded")
                    this.setNodeStatus(node, "expanded");
                else
                    node.childList.style.display = "none";
			}
			else {// Create single node
				node = this.createNode(list, data[i], depth);
				if (i== data.length-1) node.isLastChild = true;
		    }
		    
		    if (this.listType ==2) // For rich list (tree view) only
		        this.decorateNode(list, node, depth);
		}
		return list;
	},
	createListContainer: function(container) {
	    var lc;	    
        if (this.listType == 0) lc = document.createElement("ol");
        else if (this.listType == 1) lc = document.createElement("ul");
        else {
            lc = document.createElement("div");
            lc.style.cssText += ";position:relative;display:block;margin:0px;padding:0px;width:100%;";
        }
        container.appendChild(lc);
        return lc;
	},
	createNode: function(container, data, depth) {
	    var node;
	    iconType = data.iconType? data.iconType: "default";
	        
	    if (this.listType != 2) {
            node = document.createElement("li");
            node.depth = depth;
            node.caption = document.createElement("div");
        }
        else {
            node = document.createElement("div");
            node.depth = depth;
            node.style.cssText +=";position:relative;margin:0px;";            
            
            if (depth>0) node.style.marginLeft= (this.iconwidth + this.captionpadding)+"px";
                        
            var icon = node.icon = document.createElement("img");
            node.iconType = iconType;
            node.appendChild(icon);
            $dh.css(icon, {"position":"relative", width: (this.iconwidth) + "px", height: (this.nodeHeight) + "px", left: "0px",top:"0px"});
            $dh.imgList.setImage(icon, this.imagePath + iconType + ".gif");
            
            node.caption = document.createElement("div");
    		node.caption.style.cssText +=";position:absolute;top:0px;left:"+(this.iconwidth + this.captionpadding)+"px;height:"+this.nodeHeight+"px;line-height:"+this.nodeHeight+"px;";
        }
        		
		node.caption.className = "normalNode";
		node.appendChild(node.caption);
		container.appendChild(node);
		this.setNodeData(node, data);
		this.setNodeEvents(node);	

		return node;
	},
	
	decorateNode: function(container, node, depth) {
	    // Decorate node
   	    var nn = container, res = [];	       	    
	    while (nn != this.canvas.childNodes[0]) {
            res.splice(0,0, nn.parentNode);
	        nn = nn.parentNode.parentNode;
	    }
	    res.push(node);	 
	    
	    var str ="";
	    for (var i =0; i < res.length ; i++)
	        str += i+":"+res[i].caption.innerHTML+":"+(res[i].isLastChild)+"\n";

        var unit = (this.iconwidth + this.captionpadding), dleft = -depth* unit;
        for (var i = 1; i < res.length; i++) { // Draw images
            var noImage = (i!= depth && res[i].isLastChild); // Parent is last node
            var icon = noImage ? document.createElement("div") : document.createElement("img");
            $dh.css(icon, {
                position:"absolute", width: (this.iconwidth) + "px",
                height: (node.offsetHeight) + "px",
                left: (dleft  + (i-1) * unit) + "px", top:"0px"
            });
            node.appendChild(icon);
            if (noImage != true) {         
                if (i == depth) {
                    if (node.isLastChild)
                         $dh.imgList.setImage(icon, this.imagePath + "2-angle.gif");
                    else $dh.imgList.setImage(icon, this.imagePath + "3-angle.gif");
                }
                else 
                    $dh.imgList.setImage(icon, this.imagePath + "v-dash.gif");
            }
        } 
	},
	setNodeEvents: function(node) {
		if (node.childList) // Hide child list
			node.childList.style.display = "none";
		var self = this;
		$dh.addEv(node.caption, "click",    function(ev) {self.nodeClick(node, ev);});
		if (node.icon)
		    $dh.addEv(node.icon, "click",    function(ev) {self.nodeClick(node, ev);});
	},
    
    getParentNode: function(node) {
        if (node.depth == 0) return null;
        return node.parentNode.parentNode;
    },
    
    getParentNodes: function(node) {
        var depth = node.depth, res = [];
        while (node.depth > 0) {
            res.unshift(node.parentNode.parentNode);
            node = node.parentNode.parentNode;
        }
        return res;
    },
	
	//=========== Event handling   ============*/
	collapseNode: function(node, ev) {
		if (!node.childList) return;
		node.childList.style.display = "none";
		this.setNodeStatus(node, "collapsed");
		this.raise("onnodecollapse",node,ev);
	},	
	expandNode: function(node, ev) {
		if (!node.childList) return;
		node.childList.style.display = "";
		this.setNodeStatus(node, "expanded");
		this.raise("onnodeexpand",node,ev);
	},	
	nodeClick: function(node, ev) {
	    $dh.evt(ev).stop();
		if (this.selectedNode && this.selectedNode != node)
	        this.setNodeStatus(this.selectedNode,"unselected", ev);	    
	        
	    this.selectedNode = node;
	    if (node.childList) {
		    if (node.childList.style.display == "none")
		        this.expandNode(node, ev);
		    else
		        this.collapseNode(node, ev);
		}
		this.setNodeStatus(this.selectedNode,"selected", ev);
		this.raise("onnodeclick",node,ev);
	},		
	nodeMouseOver: function (node, ev) {
		$dh.evt(ev).stop();
		this.raise("onnodeover",node,ev);
	},
	nodeMouseOut: function (node, ev) {
	    $dh.evt(ev).stop();
		this.raise("onnodeout",node,ev);
	},

	/*=========================================*/	
	setNodeData: function(node, data) {
		if (typeof data == "string")
			node.caption.innerHTML = data;
		else {
			$dh.set(node.caption, data);
            node.status = data.status;            
        }
	},
	
	setNodeStatus: function(node, status) {
        // Private function
        function setClass(className) {
            var classes = "expandedNode,normalNode,selectedNode,collapsedNode".split(",");
            for (var i = classes.length -1; i >= 0; i--) {
                if (classes[i] != className) {
                    $dh.rmClass(node.caption, classes[i]);
                }
            }            
            $dh.addClass(node.caption, className);
        }
        
		switch(status) {
		    case "unselected":
			    if (node.status == "") return;
			    if (node.status == "selected" && node.childList)
			        setClass("expandedNode");
		        node.status = "";                
		        setClass("normalNode");
		        //node.icon.src = this.imagePath + node.iconType + ".gif";
			    break;
		    case "selected":                
		        if (node.status == "selected") return;
		        node.status = "selected";
		        setClass("selectedNode");
			    break;
			case "collapsed":
			    if (node.childList) {   
			        if (node.icon)
			            $dh.imgList.setImage(node.icon, this.imagePath + node.iconType + ".gif");
			        node.childList.style.display = "none";
			        // Hack IE quirks mode
			        if ($dh.browser.name == "ie" && ($dh.browser.mode == "quirks" || $dh.browser.version+"" <= "6")) {
			            this.rootList.style.display = "none";
			            this.rootList.style.display = "";
			        }
			        node.status = "collapsed";
			        setClass("collapsedNode");
			    }
			    break;
			case "expanded":
			    if (node.childList) {
			        if (node.icon)
			            $dh.imgList.setImage(node.icon, this.imagePath + node.iconType + "_expanded.gif");
			        node.childList.style.display = "";
			        if ($dh.browser.name == "ie" && ($dh.browser.mode == "quirks" || $dh.browser.version+"" <= "6")) {
			            this.rootList.style.display = "none";
			            this.rootList.style.display = "";
			        }			        
			        node.status = "expanded";
			        setClass("expandedNode");
			    }
			    break;
		}
	}
});