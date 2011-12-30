$dh.Require(["ctrl/dynablo/dynablo", "ctrl/animitem", "ctrl/slider", "ctrl/imgbutton"]);

JDI = {
    init: function(){
        createSlider();
        createAnimItems();
        createStory();
        createButtons();
        startTheShow();
    }
}
$dh.addLoader(JDI.init);