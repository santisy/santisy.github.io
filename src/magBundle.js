const itemList = require("./listItemDiv").itemList;
const magnifyingDiv = require("./magnifying").magnifyingDiv;

function magBundle(bundle_div){
    // TODO where does this come from? How to communicate with server
    var dataset_names = ["dataset1", "dataset2", "dataset3"];
    var images_names = [["01.jpg", "02.jpg"], ["01.jpg"], ["02.jpg"]];
    var exp_names = [["exp01", "exp02"], ["exp01"], ["exp_02"]];

    this.dataset_list = bundle_div.querySelector(".title .dropdown-content"); // The dataset (at title) dropdown menu
    this.title = bundle_div.querySelector(".title").childNodes[0];
    this.image_select_e = bundle_div.querySelector("#image_name_select"); // Image select element
    this.exp_list = bundle_div.querySelector(".scrollable_content .items_list"); // The item list
    

    // Initialize the dataset(title) dropdown
    for (var i = 0; i < dataset_names.length; i++){
        var a_element = Object.assign(document.createElement("a"), {"href": "#"});
        var text = document.createTextNode(dataset_names[i]);
        a_element.appendChild(text);
        this.dataset_list.appendChild(a_element);
    }
    this.title.nodeValue = dataset_names[0];

    // Initialize the image dropdown
    for (var i = 0; i < images_names[0].length; i++){
        var option = document.createElement("option");
        option.text = images_names[0][i];
        this.image_select_e.add(option);
    }
    // Initialize the exp list
    //<li><i class="far fa-square"></i><i class="fas fa-check-square"></i>Star</li>
    for (var i = 0; i < exp_names[0].length; i++){
        var text = exp_names[0][i];
        var li = document.createElement("li");

        var e_i_1 = Object.assign(document.createElement("i"), {"class": "far fa-square"});
        var e_i_2 = Object.assign(document.createElement("i"), {"class": "fas fa-check-square"});
        var e_text = document.createTextNode(text);

        li.append(e_i_1, e_i_2, e_text);

        this.exp_list.appendChild(li);
    }

    this.image_select_e.addEventListener("input", function(){
            console.log(this.selectedIndex);
        }
    );

    // Two main div
    var items_div = bundle_div.querySelector(".mag_bundle >.display_item_menu");
    this.item_list = new itemList(items_div); // The item list methods instance

    // TODO: associate with this
    var mag_div_list = document.querySelectorAll(".mag_div_list .input_div");
    this.magnifying_div = new magnifyingDiv(mag_div_list, 50, 60);

}

export {magBundle};