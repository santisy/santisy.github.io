import {MDCTopAppBar} from '@material/top-app-bar';


window.onload = function(){
  // Instantiation
  const topAppBarElement = document.querySelector('.mdc-top-app-bar');
  const topAppBar = new MDCTopAppBar(topAppBarElement);

  var school_logo_img = topAppBarElement.querySelector('.school-logo img');
  school_logo_img.addEventListener("click", function(e){
    window.open('https://www.sfu.ca', '_blank');
  }
  )
}