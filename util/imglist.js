$dh.isLoaded("util/imglist", true);
$dh.imgList = {
    items: {},
    defaultExt: "gif",
    add: function(_id, _src) {
        var img = new Image();
        img.src = this.fillExt(_src);
        this.items[_id] = img;
    },
    setDefaultExt: function(ext) {
      this.defaultExt = ext;  
    },
    fillExt: function(filename) {       
        if (!filename.match(new RegExp("\..+$")) )
            return filename+"."+this.defaultExt;
        else return filename;
    },
    getItem: function(_src) {
        _src= this.fillExt(_src);
        if (!this.items[_src]) this.add(_src, _src);
        return this.items[_src];
    },    
    remove: function(_id) {delete this.items[_id];},
    setImage: function(img, src) {img.src = this.getItem(src).src;},
    dispose: function() {for (var x in this.items) delete this.items[x];}
};