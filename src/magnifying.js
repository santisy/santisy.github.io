function moveAndDrawOnImage(ratio_, div, e, x = -1, y = -1){
    var mov_ele = div.getElementsByTagName("canvas")[0];
    var input_ele = div.getElementsByTagName("input")[0];
    var cH = input_ele.clientWidth;
    var cW = input_ele.clientHeight;
    var p_size = div.p_size

    if (x < 0 && y < 0){
        //var x = e.pageX - div.offsetLeft - input_ele.clientLeft;
        //var y = e.pageY - div.offsetTop - input_ele.clientTop;
        var x = e.offsetX;
        var y = e.offsetY;
    }
    if (x < cW && y < cH && x > 0 && y > 0){
        // Redraw according to the new location
        let x_start = x - p_size / 2
        let y_start = y - p_size / 2

        x_start = x_start + p_size > cW ? cW - p_size : x_start;
        y_start = y_start + p_size > cH ? cH - p_size : y_start;

        div.x_s = x_start = x_start > 0 ? x_start : 0;
        div.y_s = y_start = y_start > 0 ? y_start : 0;
        let context = mov_ele.getContext('2d')
        context.drawImage(div.imageObj,
            Math.fround(x_start * ratio_), Math.fround(y_start * ratio_),
            Math.fround(p_size * ratio_), Math.fround(p_size * ratio_),
            0, 0,
            div.dis_size, div.dis_size);
        // Move the canvas
        mov_ele.style.setProperty("left", String(x) + "px");
        mov_ele.style.setProperty("top", String(y) + "px");
    }

    return [x, y];
}

function scrollAndResize(ratio_, div, e, orig_p_size, p_size = -1){
    var mov_ele = div.getElementsByTagName("canvas")[0];
    var x_c = div.x_s + div.p_size / 2;
    var y_c = div.y_s + div.p_size / 2;

    // The change ratio defined by mousewheel
    if (p_size < 0){
        var size_change = - Math.fround(e.deltaY / 50);
        if (size_change > 0){
            div.p_size = div.p_size * Math.abs(size_change);
        }
        else {div.p_size = div.p_size * 1. / (Math.abs(size_change) + 1e-5);}
        // Zoom upper and lower limit
        if (div.p_size < orig_p_size / 2) {div.p_size = orig_p_size / 2;}
        else if(div.p_size > orig_p_size * 1.5){div.p_size = orig_p_size * 1.5;}
    }
    else {div.p_size = p_size;}

    let x_start = x_c - div.p_size / 2;
    let y_start = y_c - div.p_size / 2;
    div.x_s = x_start > 0 ? x_start : 0;
    div.y_s = y_start > 0 ? y_start : 0;

    let context = mov_ele.getContext('2d');
    context.drawImage(div.imageObj,
        Math.fround(div.x_s * ratio_), Math.fround(div.y_s * ratio_),
        Math.fround(div.p_size * ratio_), Math.fround(div.p_size * ratio_),
        0, 0,
        div.dis_size, div.dis_size);

    return div.p_size;
}

// Main function
function magnifyingDiv(mag_div, 
    p_size = 50,        // The patch size on the original image (scaled to canvas)
    dis_size = 60,      // Display size (The magnifying glass size)
    input_width = 200,  // The input full image canvas width
    ){
    // Magnifying Variables, both are adjustable
    this.p_size = p_size;  // The patch size
    this.dis_size = dis_size;  // The resized size (the fixed magnifying glass size)
    var ratio_ = 1;
    this.mag_div = mag_div;

    this.drawInputCanvas = function(){
        var mag_div_list = this.mag_div.querySelectorAll(".input_div");
        // Generate and attach to each of them
        for (var i=0; i<mag_div_list.length; i++){
            var mag_div = mag_div_list[i];

            var mov_id = new String(i)+"mov_p";
            var canvas = Object.assign(document.createElement("canvas"), {"id": mov_id})
            // Canvas width and height setting are important
            canvas.width = dis_size
            canvas.height = dis_size

            var input_ele = mag_div.getElementsByTagName("input")[0]
            var input_src = input_ele.src;
            var imageObj = new Image();
            let context = canvas.getContext('2d');

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

                context.drawImage(imageObj, 
                    Math.fround(sourceX * ratio_), Math.fround(sourceY * ratio_),
                    Math.fround(sourceWidth * ratio_), Math.fround(sourceHeight * ratio_),
                    destX, destY, 
                    destWidth, destHeight);
            };
            mag_div.appendChild(canvas);
            imageObj.src = input_src;

            if (i == 0){
                this.watchRatio = setInterval(function(){
                   if(imageObj.width != 0){
                       ratio_ = imageObj.width / input_ele.width; 
                       stop();
                   }
                }, 200)
            }

            // Initial sizes and image object
            mag_div.dis_size = dis_size
            mag_div.p_size = p_size
            mag_div.imageObj = imageObj

            // Move the magnifying glasses
            mag_div.addEventListener("mousemove", function(e){
                let start_coord = moveAndDrawOnImage(ratio_, this, e);
                for (var j = 0; j < mag_div_list.length; j++){
                    moveAndDrawOnImage(ratio_, mag_div_list[j], e, start_coord[0], start_coord[1]);
                }
            })

            // Scroll the wheel to resize image
            mag_div.addEventListener("mousewheel", function(e){
                let new_p_size = scrollAndResize(ratio_, this, e, p_size);
                for (var j = 0; j < mag_div_list.length; j++){
                    scrollAndResize(ratio_, mag_div_list[j], e, p_size, new_p_size);
                }
            }, {passive: true})
        }
    }

    this.reattachImageObj = function(){
        var mag_div_list = this.mag_div.querySelectorAll(".input_div");
        for (var i=0; i<mag_div_list.length; i++){
            var mag_div = mag_div_list[i];
            var input_ele = mag_div.getElementsByTagName("input")[0]
            var imageObj = new Image();
            imageObj.src = input_ele.src;
            mag_div.imageObj = imageObj;
        }
    }
}

export {magnifyingDiv};