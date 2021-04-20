import {Sortable, MultiDrag} from 'sortablejs'
Sortable.mount(new MultiDrag());
//window.onload = function(){
//    var items_div = this.document.getElementsByClassName("display_item_menu")[0];
//    var item_list = new itemList(items_div); // The item list methods instance
//}

function itemList(e){
    // e is the outmost div element of predefined `Item List`
    this.selectedItems = new Array();
    this.ul_e = e.querySelector("ul.items_list");
    this.ul_pop = e.querySelector("ul.settings_pop_out")
    this.action = "";
    this.enable_selecting = false;

    // Draggable main list
    new Sortable(this.ul_e, {
        onStart: function(evt){
            evt.item.classList.toggle("dragged");
        },
        onEnd: function(evt){
            evt.item.classList.toggle("dragged");
        }.bind(this)
        }
    );

    // Buttons
    this.settings_button = e.querySelector("input.settings_button");
    this.action_button = e.querySelector("input.action_button");
    this.cancel_button = e.querySelector("input.cancel_button");
    this.ul_pop.style.left = String(this.settings_button.offsetLeft) + "px";
    this.ul_pop.style.top = String(this.settings_button.offsetTop + this.settings_button.clientHeight - 12) + "px";
    this.ul_pop.style.display = "none"

    this.action_button.style.backgroundColor = "#45f787";
    this.cancel_button.style.backgroundColor = "#f54266";
    this.action_button.style.display = "none"
    this.cancel_button.style.display = "none"

    window.addEventListener("click", function(ev){
        if (ev.target.parentNode != this.ul_pop &&
            this.ul_pop.style.display == "block" &&
            ev.target != this.settings_button
            ){
            this.ul_pop.style.display = "none";
        }
        }.bind(this)
    )
    
    // Do all the `li` under `ul` add clicked and selected event
    this.ul_e.addEventListener('click', function(ev) {
        if( ev.target.tagName === 'LI' && this.enable_selecting) {
            ev.target.classList.toggle('selected');
            if (ev.target.classList.contains("selected")){
                this.selectedItems.push(ev.target);
            }
            else {
                this.selectedItems.splice(this.selectedItems.indexOf(ev.target), 1);
            }
        }
    }.bind(this), false);

    this.ul_pop.addEventListener('click', function(ev) {
        if( ev.target.tagName == 'INPUT') {
            if (ev.target.value == "Show All"){
                this.showItems();
                return;
            }

            // Change to select mode
            var li_list = this.ul_e.querySelectorAll("li");
            for (var i = 0; i < li_list.length; i++){
                li_list[i].classList.toggle("toselect");
            }

            this.enable_selecting = true;
            this.action = ev.target.value;
            // Show the new buttons
            this.settings_button.style.display = "none";
            this.action_button.style.display = "inline-block";
            this.cancel_button.style.display = "inline-block";
            this.action_button.value = this.action;
            this.ul_pop.style.display = "none";
        }
    }.bind(this), false);

    // Button for functions
    this.settings_button.addEventListener("click", function(){
        // Pop out the menu
        if (this.ul_pop.style.display == "none"){
            this.ul_pop.style.display = "block";
        }
        else if (this.ul_pop.style.display == "block"){
            this.ul_pop.style.display = "none";
            this.enable_selecting = false;
        }
        }.bind(this)
    )

    this.action_button.addEventListener('click',
        function(){
            var confirm_flag = true;
            if (this.action == "Delete"){
                confirm_flag = window.confirm("Really want to delete?\n******************"+
                "\nDELETE option will remove items from database."+
                " If you just want to hide items for convenience, please use HIDE" +
                " option instead.");
            }
            if (confirm_flag){
                this.do_action();
            }
        }.bind(this)
    )

    this.cancel_button.addEventListener('click',
        function(){
            this.reset();
        }.bind(this)
    )


    // ------------------------------------------------------------
    this.do_action = function(){
        // Do the action
        if (this.action == "Delete"){
            this.removeItems();
        }
        else if (this.action == "Hide"){
            this.hideItems();
        }
        else if (this.action == "Show All"){
            this.showItems();
        }
        // Reset the status
        this.reset();
    }
    
    // Reset
    this.reset = function(){
        // exit select mode
        var li_list = this.ul_e.querySelectorAll("li");
        for (var i = 0; i < li_list.length; i++){
            li_list[i].classList.toggle("toselect");
        }
        // Other displaying
        this.settings_button.style.display = "inline-block";
        this.action_button.style.display = "none";
        this.cancel_button.style.display = "none";
        //this.ul_pop.style.display = "none";
        this.action = '';
        for (var i = 0; i < this.selectedItems.length; i++){
            this.selectedItems[i].classList.toggle("selected");
        }
        this.selectedItems = []; // Clear selected items
        this.enable_selecting = false;
    }
    // Remove items
    this.removeItems = function(){
        // TODO: 1. pop alert; 2. get to the server to remove related items
        for (var i = 0; i < this.selectedItems.length; i++){
            this.ul_e.removeChild(this.selectedItems[i]);
        }
        this.selectedItems = []; // Clear selected items
    }
    // Hide items
    this.hideItems = function(){
        for (var i = 0; i < this.selectedItems.length; i++){
            this.selectedItems[i].style.setProperty("display", "none");
            this.selectedItems[i].classList.toggle("selected");
        }
        this.selectedItems = []; // Clear selected items
    }
    // Show all items
    this.showItems = function(){
        var li_list = this.ul_e.querySelectorAll("li");
        for (var i = 0; i < li_list.length; i++){
            li_list[i].style.setProperty("display", "block");
        }
    }
}

export {itemList};