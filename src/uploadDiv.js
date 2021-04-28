const axios = require("axios");

function uploadDiv(e){
    var upload_data = new FormData();
    var dir_upload = e.querySelector(".upload_button");
    var input_frame = e.querySelector(".dataset_input")
    var upload_info = e.querySelector(".upload_info");
    var ok_button = e.querySelector(".OK")
    var cancel_button = e.querySelector(".Cancel")
    const accepted_img_types = ["jpg", "png", "jpeg", "JPEG"];

    function reset(){
        upload_info.style.setProperty("display", "none");
        dir_upload.value = '';
        upload_data = new FormData();
        if (upload_info.classList.contains("error_info")){
          upload_info.classList.toggle("error_info");
        }
        ok_button.style.setProperty("display", "inline-block");
    }

    function setInfo(info=String(""), error_flag=false){
      // The Info
      let p_e = upload_info.querySelector("p");
      p_e.innerHTML = info;
      if (error_flag){
        ok_button.style.setProperty("display", "none");
        if (!upload_info.classList.contains("error_info")){
          upload_info.classList.toggle("error_info");
        }
      }
      upload_info.style.setProperty("display", "block");
    }

    window.addEventListener("click", function(ev){
        if (ev.target != upload_info && 
          ev.target.parentNode != upload_info &&
          ev.target != dir_upload
          ){reset();}
        }
    )

    dir_upload.addEventListener("click", function(e){
      if (input_frame.value == ""){
        let info_now = "No " + "Dataset Name".bold() + " has been input!"
        setInfo(info_now, true);
        e.preventDefault();
      }
    })

    dir_upload.addEventListener("input", function(){
      //TODO: 
      // 1. Filter out the unqualified selected files (level and file type)
      // 2. Go into FormData and ready to send via middle ware?
      // 3. Verification?: the gt_names? or something
      // 4. Information pop out
      var exp_name = "";
      var upload_image_files = new Array();
      var upload_image_names = new Array();

      for (var i = 0; i < this.files.length; i++){
        let img_path = this.files[i].webkitRelativePath;
        let path_array = img_path.split("/");

        if (path_array.length == 2 && accepted_img_types.includes(path_array[1].split(".").pop())){
          exp_name = path_array[0]; 
          upload_image_files.push(this.files[i]);
          upload_image_names.push(path_array[1]);
        }
      }
      upload_image_names.map(name => upload_data.append('image_names', name));
      upload_image_files.map(file => upload_data.append('image_files', file));
      //upload_data.append("single_image", upload_image_files[0], upload_image_files[0].name)
      upload_data.append("dataset_name", input_frame.value);
      upload_data.append("exp_name", exp_name);

      // The Info
      if (upload_image_files.length > 0){
        let info_now = "Upload dataset: " + input_frame.value.bold() + ", exp_name: " 
          + exp_name.bold() + " with " + String(upload_image_files.length).bold() + " images?";
        setInfo(info_now);
      }
      else {
        let info_now = "No " + "qualified".bold() + 
          " image selected! There must been image files (.jpg)" + 
          " directly under the exp folder.";
        setInfo(info_now, true);
      }
      }
    )

    ok_button.addEventListener("click", function(){
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      } 
      axios.post('/upload/exp_images', upload_data, config).then(reset());
      }
    )

    cancel_button.addEventListener("click", function(){
      console.log("Canceled")
      reset();
      }
    )
}

export {uploadDiv};