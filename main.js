const itemList = require("./src/listItemDiv").itemList;

window.onload = function(){
    var items_div = this.document.getElementsByClassName("display_item_menu")[0];
    var item_list = new itemList(items_div); // The item list methods instance
}