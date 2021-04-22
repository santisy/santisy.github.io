const magBundle = require("./src/magBundle").magBundle

window.onload = function(){
    var mag_bundle_div = document.getElementsByClassName("mag_bundle")[0];
    var mag_bundle = new magBundle(mag_bundle_div);
}