/*
  Title: ImageList - Image management module
  
  *Author*:   Do Ba Duc
  
  Group: Introduction
  		This module support loading image before using to improve application speed.
  		Once this module is loaded, it can be called through $dhtiny.imgList   
   
  Group: Properties
  
  Variable: items
    Set of all loaded images
  
  Variable: defaultExt
  	Default image extension: *gif*. In case of loading an image with unspecified extension, *defaultExt* will be used.
  	
 */
$dh.imgList = {
    items: {},
    defaultExt: "gif",
    /*
      Function: add
      		Load a new image with specified ID.
      
      Parameters:
      		_id - id of the image
      		_src = Source path of the image  		      
     */
    add: function(_id, _src) {}
    /*
      Function: setDefaultExt
      		Change default image extension
      
      Parameters:
      		ext - Image extension (Eg: jpg, png,...)  		
      		      
     */
    setDefaultExt: function(ext) {},
    
    /*
      Function: getItem
      		Get an image object, load the image if it does not exist in the loaded file list.
      
      Return:
      		image file path or null.
      
     */
    getItem: function(_src) {},
    /*
      Function: remove
      		Remove an item from list
      
      Parameter:
      		_id - _id of the image
     */
    
    remove: function(_id) {delete this.items[_id];},
    /*
      Function: setImage
      		Set src property for an image after confirming about the image's availbility
      
      Parameter:
      		img - The image object
      		src - New image source path
     */
        setImage: function(img, src) {},
    /*
      Function: dispose
      		Clean up all images
      
     */
    dispose: function() {for (var x in this.items) delete this.items[x];}
};