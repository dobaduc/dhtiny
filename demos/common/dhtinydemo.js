/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$dh.Require("ctrl/richcanvas");

function initDHTinyDemo(title) {
    $dh.addLoader(function() {
        var BodyWrapper = new DHRichCanvas(document.body, {
            className: "BodyWrapper",
            id: "BodyWrapper"
        });
        var DemoHeader = new DHRichCanvas(BodyWrapper.canvas, {
            className: "DemoHeader",
            id: "DemoHeader",
            innerHTML: "<span class='DHTinyTitle'>dhtiny ::</span>"+
                  "<span class='DemoTitle'>&nbsp;&nbsp;"+ title +" </span>" +
                  "<div class='CopyrightPart'>Copyright&nbsp;&copy;&nbsp;KeyboardDigger</div>"
        });
        
        var DemoBody = new DHRichCanvas(BodyWrapper.canvas, {
            className: "DemoBody",
            id: "DemoBody"
        });
    });
}