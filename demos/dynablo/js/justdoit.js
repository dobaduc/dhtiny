$dh.Require("ctrl/animplayer,dialog");

JDI = {
    init: function(){
        JDI.createPlayer(0);
        JDI.prepareItems();
    //JDI.startTheShow();
    },
    createPlayer: function(mode) {
        modeArr = [{
            width:500, 
            height:200
        }, {
            width:500, 
            height:500
        }];
        var controlerHeight = 60;
        var dragableHeight = 50;
        JDI.dragableContainer = $dh.New("div", {
            id : "DragableContainer", 
            className: "BodyWrapper", 
            parentNode: document.body, 
            style:"background-image:url('images/drag_icon.png'); background-repeat: no-repeat;"
        } )
        JDI.player = new DHAnimPlayer("DragableContainer", {
            controllerHeight:controlerHeight,
            width: modeArr[mode].width, 
            height: modeArr[mode].height,
            style:"margintop:"+dragableHeight+"px",
            sliderProps: {
                left: 90, 
                width:360, 
                height:8, 
                top: 22,
                pointerProps: {
                    mintop: -5, 
                    top:-5, 
                    height:19, 
                    width: 10
                }
            },
            percentageProps: {
                top:20, 
                right:10, 
                fontSize: 14
            },

            buttonWidth: 30, 
            buttonHeight: 30, // this common prop. wil be overwitten by specified button size
            imagePath: "images",
            buttonProps: [
            // Button play
            {
                position:"absolute",
                left: 40, 
                top: 14, 
                width: 30, 
                cursor:"pointer",
                //image: "images/play.png",                    
                images:[
                {
                    src: "play.png", 
                    clickIdx: 1,
                    handler: function(animplayer, buttonIdx) {
                        alert("Clicked on button "+buttonIdx+", info: "+ animplayer.buttons[buttonIdx].icon.src);
                    }
                },
                {
                    src: "pause.png", 
                    clickIdx: 0
                },

                {
                    src: "restart.png", 
                    clickIdx: 1
                }
                ]
            },
            // Button stop/ close
            {
                position:"absolute",
                left: 8, 
                top: 14, 
                width: 30, 
                cursor:"pointer",
                //image: "images/play.png",
                images:[{
                    src: "minus.png", 
                    handler: function(animplayer, buttonIdx) {
                        alert("Clicked on button "+buttonIdx+", info: "+ animplayer.buttons[buttonIdx].icon.src);
                    }
                }]
            }
            ]
        });
        
        var dialog = new DHDialog("DragableContainer", {
            id : "MyDialog",
            titleTxt: "Gửi bình luận",
            color: "yellow",
            titlebarHeight: 35,
            zIndex: 999999,
            imgPath: $dh.root + "res/images/dialog/theme2/"
        });
        var textarea = document.createElement("textarea");
        textarea.style.cssText += "border:none;width:100%;height:100px;position:absolute;top:0px;left:0px;";
        dialog.body.canvas.appendChild(textarea);
        
        var submitButton = document.createElement("input");
        submitButton.value = "Gửi";
        submitButton.style.cssText="position:absolute;top:110px;right:0px;float:right";
        submitButton.type = "button";
        dialog.body.canvas.appendChild(submitButton);
        submitButton.onclick = function(sender){
            dialog.close();
            var newComment = document.createElement("div");
            newComment.style.cssText = "position:absolute;top:"+dialog.canvas.style.top+";left:"+dialog.canvas.style.left+";background: none repeat scroll 0 0 #333333; width:400px; padding:10px;font-family:arial;color:yellow;font-size:12px;border:solid 1px yellow";
            newComment.innerHTML = "abc";
            document.getElementById("DragableContainer").appendChild(newComment);
        };
        dialog.bodypart.setProp("background", "rgb(51,51,51)");
        dialog.title.style.cssText += ";text-align:center;font-weight:bold;border-bottom:solid 1px #aaaaaa;font-family:arial"; // For FF
        dialog.title.style.cursor = "default";
        dialog.title2.canvas.style.borderBottom = "solid 1px #aaaaaa"; // For IE

        JDI.player.addEv("onclick", function(sender, ev) {
            //var pos =  $dh.msPos(ev);
            var pos = $dh.msOffset(ev, JDI.player.canvas);
            if (pos.top > modeArr[mode].height - controlerHeight) return;
            var bs = $dh.bodySize();
            var dw = 400, dh = 200;
            dialog.top = pos.top+dragableHeight;
            dialog.left = pos.left;
            dialog.show();
            dialog.draw({
                top: pos.top+dragableHeight, 
                left: pos.left, 
                width: 5, 
                height: 5
            });
            dialog.draw({
                top: pos.top+dragableHeight, 
                left: pos.left, 
                width: dw, 
                height: dh
            }, 1);
        });
    },
    prepareItems: function() {
        W= 500; //JDI.player.contentArea.getProp("width");       
        H= JDI.player.contentArea.getProp("height");
        JDI.player.smileys = [];
        
        // Number of smiley
        NN = 12;
        // Smiley image size
        w = 24;
        h = 24;
        
        // Prepare images
        IMGS = ["smiley","balloon", "smiley-lol"];
        for (i=0; i < IMGS.length; i++)
            $dh.imgList.add("imgs"+i, "images/"+IMGS[i]+".png")

        for (i=0; i < NN; i++) {
            JDI.player.smileys[i] = new DHAnimItem(JDI.player.contentArea.canvas,{
                position:"absolute", 
                width:w, 
                height: w,
                top: Math.floor(Math.random()* (H -h)),
                left: Math.floor(Math.random()* (W -w)),
                innerHTML: "<img style='width:100%;height:100%;position:absolute;' src='images/"  +
                IMGS[Math.floor(Math.random()*3)] +
                ".png' />"

            });
            JDI.player.smileys[i].smIndex= i;
            JDI.player.smileys[i].addEv("onstop", function(sender) {
                sender.setProp("zIndex", "0");
                idx = sender.smIndex + 1;
                if (idx >= NN) idx = 0;
                JDI.generateParams(JDI.player.smileys[idx]);
                JDI.player.smileys[idx].setProp("zIndex","10")
                JDI.player.smileys[idx].start();
            });            
        }
        JDI.generateParams(JDI.player.smileys[0]);
        JDI.player.smileys[0].start();
    },
    generateParams: function(animItem){
        w = Math.floor(Math.random()*120)+ 20;
        h = Math.floor(Math.random()*120)+ 20;
        var animDes = {
            top: Math.floor(Math.random()* (H - h)),
            left: Math.floor(Math.random()* (W -w)),
            width: w,
            height: h,
            opac: Math.random()* 90 + 10
        }

        duration = (Math.random()*1)+0.5;

        effectIdx = Math.floor(Math.random() * 16);
        var exeFunc;
        var idx =0;
        for (p in DHMotion.AnimEffects) {
            if (idx == effectIdx) {
                exeFunc = DHMotion.AnimEffects[p];
            }
            idx ++;
        }
        animItem.setAnimation(animDes, duration, exeFunc);
    }
}
$dh.addLoader(JDI.init);