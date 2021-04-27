
function uploadDiv(e){
    var upload_json = {};
    var dir_upload = e.querySelector(".upload_button");
    var input_frame = e.querySelector(".dataset_input")
    var upload_info = e.querySelector(".upload_info");
    var ok_button = e.querySelector(".OK")
    var cancel_button = e.querySelector(".Cancel")
    const accepted_img_types = ["jpg", "png", "jpeg", "JPEG"];

    function reset(){
        upload_info.style.setProperty("display", "none");
        dir_upload.value = '';
        upload_json = {};
    }

    window.addEventListener("click", function(ev){
        if (ev.target != upload_info && ev.target.parentNode != upload_info){reset();}
        }
    )

    dir_upload.addEventListener("input", function(){
      //TODO: 
      // 1. Filter out the unqualified selected files (level and file type)
      // 2. Go into FormData and ready to send via middle ware?
      // 3. Verification?: the gt_names? or something
      // 4. Information pop out
      var exp_name = "";

      for (var i = 0; i < this.files.length; i++){
        let img_path = this.files[i].webkitRelativePath;
        let path_array = img_path.split("/");

        if (path_array.length == 2 && accepted_img_types.includes(path_array[1].split(".").pop())){
          exp_name = path_array[0]; 
          let img_list = upload_json[exp_name] || new Array();
          img_list.push(path_array[1]);
          upload_json[exp_name] = img_list;
        }
      }

      upload_json["dataset_name"] = input_frame.value;

      // The Info
      let p_e = upload_info.querySelector("p");
      p_e.textContent = "Upload dataset: " + input_frame.value + ", exp_name: " + exp_name +
        " with " + upload_json[exp_name].length + " images?";
      upload_info.style.setProperty("display", "block");
      }
    )

    ok_button.addEventListener("click", function(){
        console.log("Uploading......")
        reset();
        }
    )

    cancel_button.addEventListener("click", function(){
        console.log("Canceled")
        reset();
        }
    )
}

export {uploadDiv};