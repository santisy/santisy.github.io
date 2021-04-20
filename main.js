const itemList = require("./src/listItemDiv").itemList;
const magnifyingDiv = require("./src/magnifying").magnifyingDiv;

window.onload = function(){
    var items_div = this.document.getElementsByClassName("display_item_menu")[0];
    var item_list = new itemList(items_div); // The item list methods instance

    var mag_div_list = this.document.querySelectorAll(".mag_div_list .input_div");
    var magnifying_div = new magnifyingDiv(mag_div_list, 50, 60);
}