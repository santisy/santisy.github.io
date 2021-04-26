const itemList = require("./listItemDiv").itemList;
const magnifyingDiv = require("./magnifying").magnifyingDiv;

function magBundle(bundle_div){
    // TODO where does this come from? How to communicate with server
    var mag_div_e = document.querySelector(".mag_div_list");
    var items_div = bundle_div.querySelector(".mag_bundle >.display_item_menu");
    // Initialize the magnifying classes and methods
    var magnifying_div = new magnifyingDiv(mag_div_e, 50, 70);

    var dataset_index = 0;
    var image_index = 0;

    var dataset_names = ["dataset1", "dataset2", "dataset3"];
    var images_names = [["01.jpg", "02.jpg", "03.jpg"], ["01.jpg"], ["02.jpg"]];
    var exp_names_list = [["exp01", "exp02"], ["exp01"], ["exp_02"]];

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
    // Initialize the exp list and the canvas
    //<li><i class="far fa-square"></i><i class="fas fa-check-square"></i>Star</li>
    for (var i = 0; i < exp_names_list[0].length; i++){
        // ---------- Initialize the exp list ----------
        var text = exp_names_list[0][i];
        var li = document.createElement("li");

        var e_i_1 = document.createElement("i");
        e_i_1.classList.add("far", "fa-square");
        var e_i_2 = document.createElement("i");
        e_i_2.classList.add("fas", "fa-check-square");
        var e_text = document.createTextNode(text);
        li.append(e_i_1, e_i_2, e_text);

        this.exp_list.appendChild(li);

        // ---------- Initialize the canvas ----------
        var div_e = document.createElement("div");
        div_e.classList.add("input_div");

        // Image tag on top of the display overall
        var img_name_tag = document.createElement("div");
        img_name_tag.classList.add("img_name_tag");
        img_name_tag.innerHTML = exp_names_list[0][i] + ": "  + images_names[0][0];

        // Display overall
        var input_e = Object.assign(document.createElement("input"), 
            {"type": "image", 
            "src": images_names[0][0]}
            )
        div_e.append(img_name_tag, input_e);
        mag_div_e.appendChild(div_e);
    }
    magnifying_div.drawInputCanvas(); // Initialize input canvas


    // Two main div
    this.item_list = new itemList(items_div); // The item list methods instance


    // Change input images
    this.image_select_e.addEventListener("input", function(){
            var img_index_now = this.selectedIndex;
            if (img_index_now != image_index){
                // Change image src
                image_index = img_index_now;
                var input_canvas = mag_div_e.querySelectorAll("input");
                var img_name_tags = mag_div_e.querySelectorAll(".img_name_tag");
                for (var i = 0; i < input_canvas.length; i++){
                    input_canvas[i].src = images_names[dataset_index][img_index_now];
                    img_name_tags[i].innerHTML = img_name_tags[i].innerHTML.split(":")[0] +
                         ": " + images_names[dataset_index][img_index_now];
                }
                magnifying_div.reattachImageObj();
            }
        }
    );

    //this.exp_list.clearChildren();
}

export {magBundle};