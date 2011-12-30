/*
 * Animation player - Just like general media player
 */

$dh.Require(["ctrl/animitem", "ctrl/slider", "ctrl/imgbutton"]);
$dh.isLoaded("ctrl/animplayer", true);

$dh.newClass("DHAnimPlayer", DHAnimItem, {
    init : function(container, props) {
         DHAnimItem.prototype.init.apply(this, [container, props]);

         this.innerCanvas = $dh.New("div",{
             parentNode: this.canvas,
             className: "innerCanvas",
             style: "position:relative;width:100%;height:100%;margin:0px;padding:0px;"
         });

         this.setContentArea(props);
         this.setControllerProps(props.controllerProps);
         this.setButtonProps(props.buttonProps);
         this.setSliderProps(props.sliderProps);
    },

    setContentArea: function() {
        this.contentArea    = new DHAnimItem(this.innerCanvas, {
            className: "contentArea",
            style:"position:absolute;overflow:hidden;width:100%;left:0px;top:0px;padding:0px;margin:0px;",
            height: this.height - this.controllerHeight
        });        
    },
    
    setControllerProps: function(ctrlProps) {
        if (!this.contentArea) return;
        
        controllerProps = {
                          className: "controller",
                          style:"position:absolute;width:100%;bottom:0px;left:0px;",
                          height: this.controllerHeight
                      };
        if (ctrlProps) $dh.set(controllerProps, ctrlProps);
        if (!this.controller){
            this.controller = new DHRichCanvas(this.innerCanvas, controllerProps);
        } else {
            this.controller.setProps(controllerProps);
        }
    },
    
    setButtonProps: function(buttonProps) {
        if (!this.controller) return;
        if (!buttonProps) return;
        
        if (!$dh.isArr(buttonProps)) buttonProps = [buttonProps] ;
        if (!this.buttons) this.buttons = [];

        // Pointer holder
        var self = this;
        
        for (i = 0; i < buttonProps.length; i++) {
            // For reusing existing items
            if (this.buttons[i]) {
                this.buttons[i].style.display = "";
            }

            // Overwrite default props
            props = {style:"position:absolute;", width: this.buttonWidth, height: this.buttonHeight};
            $dh.set(props, buttonProps[i]);
            props.image = this.imagePath + "/" + buttonProps[i].images[0].src;
            this.buttons[i] = new DHImgButton(this.controller.canvas, props);
            this.buttons[i].buttonIdx = i;
            this.buttons[i].statusIdx = 0;

            // Set click event - temporary support click only

            this.buttons[i].addEv("onclick", function(sender) {                
                if (sender.images[sender.statusIdx].handler)
                    sender.images[sender.statusIdx].handler.apply(self,[self, sender.buttonIdx]);
                clickIdx = sender.images[sender.statusIdx].clickIdx;
                if (!$dh.isNil(clickIdx))
                    self.setButton(sender.buttonIdx, clickIdx);
            });
        }

        // For reusing existing items
        for (i = buttonProps.length; i < this.buttons.length; i++) {
            if (this.buttons[i]) this.buttons[i].style.display = "none";
        }
    },

    setButton: function(buttonIdx, statusIdx) {
        this.buttons[buttonIdx].setImage(this.imagePath+"/"+this.buttons[buttonIdx].images[statusIdx].src);
        this.buttons[buttonIdx].statusIdx = statusIdx;
    },
    
    setSliderProps: function(sldProps) {
        // Because we don't know when playerProps will be set, so we must check for sure
        if (!this.controller) return;
        
        // Defaults slider props
        sliderProps = {
            className: "slider",
            style: "position:absolute;",
            minval:0, maxval:100,
            type: "horizontal",
            pointerProps: {className: "pointer", minleft: 0},
            progressProps: {className: "progressbar"}
        };
        // Update props
        $dh.set(sliderProps, sldProps || {});
        if (!this.slider) {
            this.slider = new DHSlider(this.controller.canvas, sliderProps);
            this.setPercentage(0);
        }
        else {
            this.slider.setProps(sliderProps);
        }

        // Set sliding event
        var self = this;
        this.slider.addEv("onslide", function(sender){
            self.setPercentage(Math.floor( sender.getCurrentVal() ));
            if (self.locked) return;
            self.seek(sender.currentval/(sender.maxval - sender.minval));
        });
    },
    setPercentage: function(percent) {
        // Percentage label props
        if (!this.percentage) {
            if (!this.slider) return;
            percentProps = {               
                className: "percentage",
                style:"position:absolute; right: 0px;heigh:100%;"
            } //width:35px;font-size: 12px;
            $dh.set(percentProps, this.percentageProps || {} );            
            this.percentage = new DHRichCanvas(this.controller.canvas, percentProps);
        }
        this.percentage.canvas.innerHTML = percent+"%";
    }
});