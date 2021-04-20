function moveAndDrawOnImage(div, e, x = -1, y = -1){
    var mov_ele = div.getElementsByTagName("canvas")[0]
    var input_ele = div.getElementsByTagName("input")[0]
    if (x < 0 && y < 0){
        var x = e.pageX - div.offsetLeft - input_ele.clientLeft;
        var y = e.pageY - div.offsetTop - input_ele.clientTop;
    }
    if (x < input_ele.clientWidth && y < input_ele.clientHeight
        && x > 0 && y > 0
        ){

        // Redraw according to the new location
        let x_start = x - div.p_size / 2
        let y_start = y - div.p_size / 2
        div.x_s = x_start = x_start > 0 ? x_start : 0
        div.y_s = y_start = y_start > 0 ? y_start : 0
        let context = mov_ele.getContext('2d')
        context.drawImage(div.imageObj,
            x_start, y_start,
            div.p_size, div.p_size,
            0, 0,
            div.dis_size, div.dis_size);
        // Move the canvas
        mov_ele.style.setProperty("left", String(x) + "px");
        mov_ele.style.setProperty("top", String(y) + "px");
    }

    return [x, y];
}

function scrollAndResize(div, e, orig_p_size, p_size = -1){
    var mov_ele = div.getElementsByTagName("canvas")[0];

    // The change ratio defined by mousewheel
    console.log(p_size)
    if (p_size < 0){
        var size_change = - Math.fround(e.deltaY / 100);
        if (size_change > 0){
            div.p_size = div.p_size * Math.abs(size_change);
        }
        else {div.p_size = div.p_size * 1. / Math.abs(size_change);}
        // The range
        if (div.p_size < orig_p_size / 2) {div.p_size = orig_p_size / 2;}
        else if(div.p_size > orig_p_size * 1.5){div.p_size = orig_p_size * 1.5;}
    }
    else {div.p_size = p_size;}

    let context = mov_ele.getContext('2d');
    context.drawImage(div.imageObj,
        div.x_s, div.y_s,
        div.p_size, div.p_size,
        0, 0,
        div.dis_size, div.dis_size);

    return div.p_size;
}

window.onload = function(){
    input_div_list = document.getElementsByClassName("input_div")
    // Gloabl Variable
    let p_size = 50;  // The patch size
    let dis_size = 60;  // The resized size (the fixed magnifying glass size)

    for (var i=0; i<input_div_list.length; i++){
        input_div = input_div_list[i];

        mov_id = this.String(i)+"mov_p";
        canvas = Object.assign(document.createElement("canvas"), {"id": mov_id})
        // Canvas width and height setting are important
        canvas.width = dis_size
        canvas.height = dis_size

        input_src = input_div.getElementsByTagName("input")[0].src;
        let context = canvas.getContext('2d');
        let imageObj = new Image();

        imageObj.onload = function() {
            // Draw cropped image
            var sourceX = 100 - p_size / 2;
            var sourceY = 100 - p_size / 2;
            var sourceWidth = p_size;
            var sourceHeight = p_size;
            var destX = 0;
            var destY = 0;
            var destWidth = dis_size;
            var destHeight = dis_size;

            context.drawImage(imageObj, sourceX, sourceY,
                sourceWidth, sourceHeight,
                destX, destY, destWidth, destHeight);
        };
        imageObj.src = input_src;
        input_div.appendChild(canvas);

        // Initial sizes and image object
        input_div.dis_size = dis_size
        input_div.p_size = p_size
        input_div.imageObj = imageObj


        // Move the magnifying glasses
        input_div.addEventListener("mousemove", function(e){
            let start_coord = moveAndDrawOnImage(this, e);
            for (var i = 0; i < input_div_list.length; i++){
                moveAndDrawOnImage(input_div_list[i], e, start_coord[0], start_coord[1]);
            }
        })

        // Scroll the wheel to resize image
        input_div.addEventListener("mousewheel", function(e){
            let new_p_size = scrollAndResize(this, e, p_size);
            for (var i = 0; i < input_div_list.length; i++){
                scrollAndResize(input_div_list[i], e, p_size, new_p_size);
            }
        }, {passive: true})
    }

}