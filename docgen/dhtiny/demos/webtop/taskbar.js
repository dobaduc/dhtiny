// JScript ファイル
$dh.newClass("Taskbar", GridManager, { // Only one taskbar
    deltaHeight: 5,
    init: function(_height) { 
        _height= _height || 28;
        GridManager.prototype.init.apply(this, [90,3, 1, 5, 100, _height-3,0]);
        window.Taskbar = this; // Only one?
        this._height = _height;
        
        var bs = $dh.bodySize();
        $dh.bounds(this, [0, bs.height - _height, bs.width, _height]);
        
        $dh.addEv(window,"resize", function(){
            var bs = $dh.bodySize();
            $dh.bounds(window.Taskbar, [0, bs.height - window.Taskbar._height, bs.width-2, window.Taskbar._height]);
        });
        this.drawStartButton();
    },
    
    drawStartButton: function() {
        this.startButton = $dh.New("img",{src: "images/startbut.gif", opac: 70, bounds:[0,0,98,27]});
        $dh.addCh(this, this.startButton);
        window.Taskbar.startButton.direction = 1;
        window.Taskbar.startButton.timeCount = 0;
        window.Taskbar.startButton.timer = setInterval(function() { 
                         var opac = $dh.opac(window.Taskbar.startButton) + window.Taskbar.startButton.direction*20;
                         if (opac >= 100 || opac <= 0) { window.Taskbar.startButton.direction *= -1;}
                         $dh.opac(window.Taskbar.startButton, opac);
                         if (window.Taskbar.startButton.timeCount++ > 60)
                            clearInterval(window.Taskbar.startButton.timer);
                     },
                   50);
        this.startButton.onmouseover = function() {
            $dh.opac(this, 100);
        };
        this.startButton.onmouseout = function() {$dh.opac(this, 70)};
    }
});