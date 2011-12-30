$dh.Require("ctrl/richcanvas");
$dh.isLoaded("ctrl/loginform");

$dh.newClass("DHLoginForm", DHRichCanvas, {
    __defaults__: {txtStyle: "position:absolute;left:0px;text-align:left;", lbStyle: ";color:gray;position:absolute;left:0px;text-align:left;", btStyle: "border:solid 1px gray;", lineHeight: 25, boundPadding: 10, loginText: "Login", idText: "ID", pwText: "PASSWORD"},
    init: function(container, props) {
        DHRichCanvas.prototype.init.apply(this, arguments);
        this.drawParts("ID");
        this.drawParts("PASSWORD");
        this.drawButtons();
    },
    drawParts: function(where) {
        var label = this["lb" + where] = document.createElement("div");
        var txt = this["txt" + where] = document.createElement("input");
        txt.type = (where == "ID") ?"text": "password";
        var top = (where == "ID") ? 0 : this.lineHeight * 2;
        var twidth = this.getProp("width") - 2 * this.boundPadding;

        label.style.cssText += ";" + this.lbStyle + ";margin:" + this.boundPadding + "px;top:" + top + "px;width:" + twidth + "px";
        txt.style.cssText += ";" + this.txtStyle + ";margin:" + this.boundPadding + "px;top:" + (top + this.lineHeight) + "px;width:" + twidth + "px";

        label.innerHTML = (where == "ID") ? this.idText : this.pwText;
        this.canvas.appendChild(label);
        this.canvas.appendChild(txt);

        var self = this;
        txt.onkeypress = function(ev) {
            if ($ev(ev).keyCode == 13)
                self.onLogin();
        }
    },
    drawButtons: function() {
        var div = document.createElement("div");
        var top = this.lineHeight * 4 + 5;
        var twidth = this.getProp("width") - 2 * this.boundPadding;
        div.style.cssText += ";position:absolute;text-align:center;height:" + this.lineHeight + "px;margin:" + this.boundPadding + "px;top:" + top + "px;left:0px;width:" + twidth + "px";

        var lgBut = this.butLogin = document.createElement("button");
        lgBut.style.cssText += ";" + this.btStyle;
        lgBut.innerHTML = this.loginText;
        div.appendChild(lgBut);

        var self = this;
        $dh.addEv(lgBut, "click", function() {self.onLogin();});
        this.canvas.style.border = "solid 1px red";
        this.canvas.appendChild(div);
    },
    onLogin: function() {
        this.broadcast("onlogin", this.txtID.value, this.txtPASSWORD.value);
    }
});