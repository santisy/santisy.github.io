function itemList(e, sortable){
    // e is the outmost div element of predefined `Item List`
    this.selectedItems = new Array();
    this.hiddenItems = new Array();
    this.hiddenDict = {};
    this.ul_e = e.querySelector("ul.items_list");
    this.ul_pop = e.querySelector("ul.settings_pop_out")
    this.action = "";
    this.enable_selecting = false;
    this.sortable = sortable;


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

    this.setDataset = function(dataset_name){
        if (this.hiddenItems.length != 0){
            // Save previous hidden items
            this.hiddenDict[this.d_name] = this.hiddenItems;
        }
        this.d_name = dataset_name;
        this.hiddenItems = this.hiddenDict[this.d_name] || new Array();
        this.hideItems();
    }

    window.addEventListener("click", function(ev){
        if (ev.target.parentNode != this.ul_pop &&
            this.ul_pop.style.display == "block" &&
            ev.target != this.settings_button
            ){
            this.ul_pop.style.display = "none";
            this.sortable.option("disabled", false);
        }
        }.bind(this)
    )
    
    // Do all the `li` under `ul` add clicked and selected event
    this.ul_e.addEventListener('click', function(ev) {
        if( ev.target.tagName === 'LI' && this.enable_selecting
            && ev.target.classList.contains("toselect")) {
            ev.target.classList.toggle('selected');
            if (ev.target.classList.contains("selected")){
                //this.selectedItems.push(ev.target);
                this.selectedItems.push(ev.target.index);
            }
            else {
                this.selectedItems.splice(this.selectedItems.indexOf(ev.target.index), 1);
            }
        }
    }.bind(this), false);

    this.ul_pop.addEventListener('click', function(ev) {
        if( ev.target.tagName == 'INPUT') {           
            // Change to appropriate selecting mode and style
            var li_list = this.ul_e.querySelectorAll("li");
            for (var i = 0; i < li_list.length; i++){
                if (ev.target.value == "Show" && this.hiddenItems.includes(i)
                    || ev.target.value == "Hide" && !this.hiddenItems.includes(i)
                    || ev.target.value == "Delete"){
                    li_list[i].classList.toggle("toselect");
                } 
                if (this.hiddenItems.includes(i)){
                    li_list[i].classList.toggle("hide_show");
                    li_list[i].style.setProperty("display", "block");
                }
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
            this.sortable.option("disabled", true);
        }
        else if (this.ul_pop.style.display == "block"){
            this.ul_pop.style.display = "none";
            this.enable_selecting = false;
            this.sortable.option("disabled", false);
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
            this.hideSelected();
        }
        else if (this.action == "Show"){
            this.showSelected();
        }
        // Reset the status
        this.reset();
    }
    
    // Reset
    this.reset = function(){
        // exit select mode
        var li_list = this.ul_e.querySelectorAll("li");
        for (var i = 0; i < li_list.length; i++){
            var li_e = li_list[i];
            if (li_e.classList.contains("toselect")){
                li_e.classList.toggle("toselect");
            }li_e
            if (li_e.classList.contains("selected")){
                li_e.classList.toggle("selected");
            }li_e
            if (li_e.classList.contains("hide_show")){
                li_e.classList.toggle("hide_show");
            }
        }
        // Other displaying
        this.settings_button.style.display = "inline-block";
        this.action_button.style.display = "none";
        this.cancel_button.style.display = "none";
        this.action = '';
        this.selectedItems = []; // Clear selected items
        this.enable_selecting = false;
        this.sortable.option("disabled", false);
        // Re-hide the list item
        var li_list = this.ul_e.querySelectorAll("li");
        for (var i = 0; i < this.hiddenItems.length; i++){
            li_list[this.hiddenItems[i]].style.setProperty("display", "none");
        }
    }
    // Remove items
    this.removeItems = function(){
        // TODO: 1. pop alert; 2. get to the server to remove related items
        var li_list = this.ul_e.querySelectorAll("li");
        for (var i = 0; i < this.selectedItems.length; i++){
            this.ul_e.removeChild(li_list[this.selectedItems[i]]);
        }
    }
    // Hide items
    this.hideItems = function(){
        var input_div_list = document.querySelectorAll(".mag_div_list .input_div");
        var li_list = this.ul_e.querySelectorAll("li");
        for (var i = 0; i < this.hiddenItems.length; i++){
            // hide canvas
            input_div_list[this.hiddenItems[i]].style.setProperty("display", "none");
            // hide list
            li_list[this.hiddenItems[i]].style.setProperty("display", "none");
        }
    }

    this.hideSelected = function(){
        for (var i = 0; i < this.selectedItems.length; i++){
            // add to hidden items
            this.hiddenItems.push(this.selectedItems[i]);
        }
        this.hideItems();
    }
    // Show all items
    this.showSelected = function(){
        var input_div_list = document.querySelectorAll(".mag_div_list .input_div");
        var li_list = this.ul_e.querySelectorAll("li");
        for (var i = 0; i < this.selectedItems.length; i++){
            // display canvas
            input_div_list[this.selectedItems[i]].style.setProperty("display", "inline-block");
            // display item list
            li_list[this.selectedItems[i]].style.setProperty("display", "block");
            // remove from hiden list (because has been shown again)
            this.hiddenItems.splice(this.hiddenItems.indexOf(this.selectedItems[i]), 1);
        }
        this.hideItems();
    }
}

export {itemList};