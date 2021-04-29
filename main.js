const magBundle = require("./src/magBundle").magBundle
const uploadDiv = require("./src/uploadDiv").uploadDiv

if( typeof Element.prototype.clearChildren === 'undefined' ) {
    Object.defineProperty(Element.prototype, 'clearChildren', {
      configurable: true,
      enumerable: false,
      value: function() {
        while(this.firstChild) this.removeChild(this.lastChild);
      }
    });
}

window.onload = function(){
    var mag_bundle_div = document.getElementsByClassName("mag_bundle")[0];
    var mag_bundle = new magBundle(mag_bundle_div);
    var upload_div = new uploadDiv(mag_bundle_div, mag_bundle);
}