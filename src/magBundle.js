const itemList = require("./listItemDiv").itemList;
const magnifyingDiv = require("./magnifying").magnifyingDiv;
import {Sortable, MultiDrag} from 'sortablejs'
//Sortable.mount(new MultiDrag());

function magBundle(bundle_div){
    // TODO where does this come from? How to communicate with server
    var mag_div_e = document.querySelector(".mag_div_list");
    var items_div = bundle_div.querySelector(".mag_bundle >.display_item_menu");
    // Initialize the magnifying classes and methods
    var magnifying_div = new magnifyingDiv(mag_div_e, 50, 70);

    var dataset_index = 0;

    // --------------------------------------------------
    // META DATA`
    // --------------------------------------------------
    var img_index_dict = {"dataset1": 0, "dataset2": 0, "dataset3": 0};
    var dataset_names = ["dataset1", "dataset2", "dataset3"]; // Dataset determine
    var img_paths_list = [
        {"exp01":["exp01/01.jpg", "exp01/03.jpg"], "exp02":["exp02/01.jpg", "exp02/03.jpg"]}, 
        {"exp01":["exp01/01.jpg"]}, 
        {"exp02":["exp02/01.jpg"]}];
    var img_names = [["01.jpg", "03.jpg"], ["01.jpg"], ["01.jpg"]]; // maximum common names
    var exp_names_list = [["exp01", "exp02"], ["exp01"], ["exp02"]];

    var dataset_list = bundle_div.querySelector(".title .dropdown-content"); // The dataset (at title) dropdown menu
    var title = bundle_div.querySelector(".title").childNodes[0];
    var image_select_e = bundle_div.querySelector("#image_name_select"); // Image select element
    var exp_list = bundle_div.querySelector(".scrollable_content .items_list"); // The item list
    

    // Draggable item list
    var sortable = new Sortable(document.querySelector("ul.items_list"), {
        onStart: function(evt){
            evt.item.classList.toggle("dragged");
        },
        onEnd: function(evt){
            evt.item.classList.toggle("dragged");
            reDisplay(img_index_dict[dataset_names[dataset_index]]);
        }
    }
    )

    // item list instance initialization
    var item_list = new itemList(items_div, sortable); // The item list methods instance

    // Initialize the dataset(title) dropdown
    for (var i = 0; i < dataset_names.length; i++){
        var a_element = Object.assign(document.createElement("a"), {"href": "#"});
        var text = document.createTextNode(dataset_names[i]);
        a_element.appendChild(text);
        dataset_list.appendChild(a_element);
    }
    dataset_list.addEventListener("click", function(e){
        if (e.target.tagName == "A"){
            title.nodeValue = e.target.textContent;
            for (var i = 0; i < dataset_names.length; i++){
                if (dataset_names[i] == e.target.textContent){
                    dataset_index = i;
                    reCreate(dataset_index, 0);
                }
            }
        }
    }
    )
    title.nodeValue = dataset_names[0];

    // ---------- Main displaying part ----------
    function reCreate(d_index, img_index){

        // Clear Children if any
        exp_list.clearChildren();
        mag_div_e.clearChildren();
        while (image_select_e.length > 0){
            image_select_e.remove(0);
        }

        // Initialize the image dropdown
        for (var i = 0; i < img_names[d_index].length; i++){
            var option = document.createElement("option");
            option.text = img_names[d_index][i];
            image_select_e.add(option);
        }

        // Initialize the exp list and the canvas
        for (var i = 0; i < exp_names_list[d_index].length; i++){
            // ---------- Initialize the exp list ----------
            var text = exp_names_list[d_index][i];
            var li = document.createElement("li");

            var e_i_1 = document.createElement("i");
            e_i_1.classList.add("far", "fa-square");
            var e_i_2 = document.createElement("i");
            e_i_2.classList.add("fas", "fa-check-square");
            var e_text = document.createTextNode(text);
            li.append(e_i_1, e_i_2, e_text);
            li.index = i;

            exp_list.appendChild(li);

            // ---------- Initialize the canvas ----------
            var div_e = document.createElement("div");
            div_e.classList.add("input_div");

            // Image tag on top of the display overall
            var img_name_tag = document.createElement("div");
            var img_path = img_paths_list[d_index][exp_names_list[d_index][i]][img_index];
            img_name_tag.classList.add("img_name_tag");
            img_name_tag.innerHTML = exp_names_list[d_index][i] + ": "  + img_names[d_index][img_index];

            // Display overall
            var input_e = Object.assign(document.createElement("input"), 
                {"type": "image", 
                "src": img_path}
                )
            div_e.append(img_name_tag, input_e);
            mag_div_e.appendChild(div_e);
        }
        magnifying_div.drawInputCanvas(); // Initialize input canvas

        // Set dataset name to item list
        item_list.setDataset(dataset_names[d_index]);
    };
    reCreate(0, 0);



    // Redisplay the canvas and change the tags when changing images, exp order, or datasets
    function reDisplay(index_now){
        var input_canvas = mag_div_e.querySelectorAll("input");
        var img_name_tags = mag_div_e.querySelectorAll(".img_name_tag");
        var item_list = exp_list.querySelectorAll("li")

        // Reattach indices
        for (var i = 0; i < item_list.length; i++){
            item_list[i].inex = i;
        }
        // Reattach images
        for (var i = 0; i < input_canvas.length; i++){
            let exp_name = item_list[i].textContent;
            input_canvas[i].src = img_paths_list[dataset_index][exp_name][index_now];
            img_name_tags[i].innerHTML = exp_name + ": " + img_names[dataset_index][index_now];
        }
        magnifying_div.reattachImageObj();
    }

    // Redisplay when change image
    image_select_e.addEventListener("input", function(){
            var img_index_now = this.selectedIndex;
            if (img_index_now != img_index_dict[dataset_names[dataset_index]]){
                img_index_dict[dataset_names[dataset_index]] = img_index_now;
                reDisplay(img_index_now);
            }
        }
    );

    // Sync the meta infomation
    this.sync_meta_data = function(){
        for (var i = 0; i < dataset_names.length; i++){
            var res_exp = this.res_exp_name;
            var res_d = this.res_d_name;
            if (dataset_names[i] == res_d){
                img_paths_list[i][res_exp] = this.res_file_paths;
                exp_names_list[i].push(res_exp);
                img_names[i] = this.res_img_names;
                if (dataset_index == i){ 
                    // If the uploaded dataset happens to be the current one
                    reCreate(dataset_index, img_index_dict[dataset_names[dataset_index]]);
                }
                return;
            }
            // New dataset
            dataset_names.push(res_d);
            img_names.push(this.res_img_names);
            img_paths_list.push({res_exp: this.res_file_paths});
            exp_names_list.push([res_exp]);

            // Add the dataset option to the drop-down list
            let a_element = Object.assign(document.createElement("a"), {"href": "#"});
            let text = document.createTextNode(res_d);
            a_element.appendChild(text);
            dataset_list.appendChild(a_element);
        }
    };
}

export {magBundle};