var arrayInst = new Array();
arrayInst.currentIndex = -1;

function main() {
    pix = new Line();

    try {
        pix.xmid = pix.evalInput('xmid');
        pix.ymid = pix.evalInput('ymid');
        pix.inc_angle = pix.evalInput('inc_angle');
        pix.radio = pix.evalInput('init_radio');
        pix.inc_radio = pix.evalInput('inc_radio');
    } catch (err) {
        console.error(err);
        alert(err.name + ': ' + err.message);
        throw err;
    }

    pix.setEvalInput('toevalX', 'toevalY');

    if (document.getElementById('shadow').checked) {
        pix.shadow = true
    }

    pix.hInterval = setInterval(function() { pix.timeAnimation() }, 67);
}

function updateInstStatistics() {
    document.getElementById('inst_number').innerHTML = arrayInst.currentIndex + 1;
    document.getElementById('inst_counter').innerHTML = arrayInst.length;
}

function takeCanvasPreview(imageId) {
    if (typeof imageId != 'string')
        throw 'Invalid parameter type';

    if (!imageId.length)
        throw 'The imageId parameter is empty';

    var img = document.getElementById(imageId);
    if (!img)
        throw 'The image element no exists';

    var dataURL = canvas.toDataURL();
    arrayInst.push(dataURL);
    arrayInst.currentIndex = arrayInst.length - 1;

    img.src = dataURL;
    img.width = 320;
    img.height = 240;

    updateInstStatistics();
}

function show_inst(imageId, dir) {
    if (!arrayInst.length) {
        var img = document.getElementById(imageId);
        img.src = 'images/empty-image.png';
        updateInstStatistics();
        return false;
    }

    if (dir < 0) //Hacia atras
        if (arrayInst.currentIndex == 0)
            arrayInst.currentIndex = arrayInst.length - 1;
        else
            arrayInst.currentIndex--;
    else if (dir > 0) //Hacia delante
        if (arrayInst.currentIndex == arrayInst.length - 1)
            arrayInst.currentIndex = 0;
        else
            arrayInst.currentIndex++;

    var img = document.getElementById(imageId);
    if (!img) throw 'The image element no exists';

    if (arrayInst.length) {
        img.src = arrayInst[arrayInst.currentIndex];
        img.width = 320;
        img.height = 240;
    }
    updateInstStatistics();
}

function show_inst_first(imageId) {
    if (!arrayInst.length) return false;
    arrayInst.currentIndex = 1;
    show_inst(imageId, -1);
}

function show_inst_last(imageId) {
    if (!arrayInst.length) return false;
    arrayInst.currentIndex = arrayInst.length - 2;
    show_inst(imageId, 1);
}

function delete_inst(imageId) {
    if (!arrayInst.length) return false;

    var tmpArr = new Array();
    var currIdx = arrayInst.currentIndex;
    var x;
    for (x in arrayInst) {
        if (x != arrayInst.currentIndex && !isNaN(parseInt(x))) {
            tmpArr.push(arrayInst[x]);
        }
    }

    if (currIdx > tmpArr.length - 1)
        currIdx = tmpArr.length - 1;

    arrayInst = tmpArr;
    arrayInst.currentIndex = currIdx;

    show_inst(imageId, 0);
}

function delete_all_inst(imageId) {
    arrayInst = new Array();
    arrayInst.currentIndex = -1;
    show_inst(imageId, 0);
}

function onClicSelect() {
    var val, i;
    var options = document.getElementById('sel_predefined').children;
    for (i = 0; i <= options.length - 1; i++) {
        if (options[i].selected) {
            var imgData = JSON.parse(options[i].value);

            document.getElementById('xmid').value = imgData.xmid;
            document.getElementById('inc_angle').value = imgData.inc_angle;
            document.getElementById('ymid').value = imgData.ymid;
            document.getElementById('init_radio').value = imgData.init_radio;
            document.getElementById('toevalX').value = imgData.toevalX;
            document.getElementById('inc_radio').value = imgData.inc_radio;
            document.getElementById('toevalY').value = imgData.toevalY;
            document.getElementById('shadow').checked = imgData.shadow;
        }
    }
}

function animToJSON() {
    var obj = {
        xmid: document.getElementById('xmid').value,
        inc_angle: document.getElementById('inc_angle').value,
        ymid: document.getElementById('ymid').value,
        init_radio: document.getElementById('init_radio').value,
        toevalX: document.getElementById('toevalX').value,
        inc_radio: document.getElementById('inc_radio').value,
        toevalY: document.getElementById('toevalY').value,
        shadow: document.getElementById('shadow').checked,
    };
    var div = $('<div class="float_div"><textarea readonly title="Doble click para cerrar"></textarea></div>');
    div.appendTo('body');
    var t = JSON.stringify(obj).replace('\",\"', '\",\r\n\"');
    while (t.indexOf('\",\"') != -1) t = t.replace('\",\"', '\",\r\n\"');
    div.children('textarea')[0].value = t;
    div.children('textarea').bind('dblclick', function() { $('div.float_div').remove(); });
    div.css({ 'display': 'block', 'left': screen.availWidth / 2 - parseInt(div.css('width')) / 2, 'top': screen.availHeight * 15 / 100 });
}
