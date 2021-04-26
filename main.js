const magBundle = require("./src/magBundle").magBundle

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

    var dir_upload = document.querySelector(".upload_button");
    var input_frame = document.querySelector(".dataset_input")
    dir_upload.addEventListener("input", function(){
      console.log(this.files);
      console.log(input_frame.value);
      }
    )
}