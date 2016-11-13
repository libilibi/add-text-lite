$(function() {
    $('#img_file').change(function(e) {
        fileChanged(e.originalEvent);
    });
    $('#c1').hide();
    $('#layout').change(function() {
        updateCanvas();
        updateImage();
    });
    
    $('#text').keyup(function() {
        updateCanvas();
    });
    $('#text').change(function() {
        updateImage();
    });
    $('#colors').change(function() {
        updateCanvas();
        updateImage();
    });
    $('input[name=orientation]').change(function() {
        updateCanvas();
        updateImage();
    });
});

var mainImage;
var scale;

function fileChanged(e) {
    var files = e.target.files;
    if (!files[0]) {
        return;
    }
    
    var image = new Image();
    image.onload = function() {
        if (image.width < 1000 || image.height < 1000) {
            scale = 2.0;
        } else {
            scale = 1.0;
        }
        $('#c1').attr('width', image.width * scale).attr('height', image.height * scale);
        mainImage = image;
        updateCanvas();
    };
    image.src = URL.createObjectURL(files[0]);
}

function updateCanvas() {
    if (!mainImage) {
        return;
    }
    
    if ($('#layout').val() == 'overlay') {
        $('#c1').attr('width', mainImage.width * scale);
        $('#c1').attr('height', mainImage.height * scale);
    } else if ($('#layout').val() == 'right') {
        $('#c1').attr('width', mainImage.width * scale * 2);
        $('#c1').attr('height', mainImage.height * scale);
    } else if ($('#layout').val() == 'bottom') {
        $('#c1').attr('width', mainImage.width * scale);
        $('#c1').attr('height', mainImage.height * scale * 2);
    }
    
    var ctx = $('#c1')[0].getContext('2d');
    var fontSize = Math.floor(mainImage.width * scale / 32);
    var textX = fontSize / 2;
    var textY = fontSize / 2;
    var shadowOffset = 10;
    var fontFrameColor = '#ff0000';
    var backgroundColor = '#000000';
    
    if ($('input[name=orientation]:checked').val() == 'portrait') {
        textX = Math.floor(mainImage.width * scale - fontSize * 1.5);
    }
    
    if ($('#colors').val() == 'purple-purple') {
        fontFrameColor = '#7800af';
        backgroundColor = 'rgba(31, 4, 48, 0.8)';
    } else if ($('#colors').val() == 'red-black') {
        fontFrameColor = '#d00000';
        backgroundColor = 'rgba(0, 0, 0, 0.8)';
    }
    if ($('#layout').val() == 'right') {
        ctx.drawImage(mainImage, mainImage.width * scale, 0, mainImage.width * scale, mainImage.height * scale);
        textX = mainImage.width * scale + fontSize / 2;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(mainImage.width, 0, mainImage.width, mainImage.height);
    } else if ($('#layout').val() == 'bottom') {
        ctx.drawImage(mainImage, 0, mainImage.height, mainImage.width, mainImage.height);
        textY = mainImage.height * scale + fontSize / 2;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, mainImage.height, mainImage.width, mainImage.height);
    }
    
    ctx.miterLimit = 2;
    ctx.fillStyle = '#ffffff';
    ctx.font = fontSize + 'px sans-serif';
    ctx.lineWidth = 5;
    ctx.textBaseline = 'top';
    ctx.strokeStyle = fontFrameColor;
    
    var lines = $('#text').val().split('\n');
    var maxWidth = 0;
    var maxHeight = lines.length * fontSize * 1.5;
    for (let i = 0; i < lines.length; i++) {
        maxWidth = Math.max(ctx.measureText(lines[i]).width, maxWidth);
    }
    if ($('input[name=orientation]:checked').val() == 'portrait') {
        maxWidth = lines.length * fontSize * 1.5;
        
        for (let i = 0; i < lines.length; i++) {
            maxHeight = Math.max(lines[i].length * fontSize * 1.1, maxHeight);
        }
    }
    
    if ($('#layout').val() == 'right') {
        $('#c1').attr('width', Math.floor(mainImage.width * scale + maxWidth + fontSize * 1.5));
    } else if ($('#layout').val() == 'bottom') {
        $('#c1').attr('height', Math.floor(mainImage.height * scale + maxHeight + fontSize * 1.5));
    }
    
    ctx.clearRect(0, 0, $('#c1').attr('width'), $('#c1').attr('height'));
    ctx.drawImage(mainImage, 0, 0, mainImage.width * scale, mainImage.height * scale);
    
    ctx.miterLimit = 2;
    ctx.fillStyle = '#ffffff';
    ctx.font = fontSize + 'px sans-serif';
    ctx.lineWidth = Math.floor(fontSize / 5);
    ctx.textBaseline = 'top';
    ctx.strokeStyle = fontFrameColor;
    if ($('#layout').val() == 'right') {
        ctx.drawImage(mainImage, mainImage.width * scale, 0, mainImage.width * scale, mainImage.height * scale);
        
        if ($('input[name=orientation]:checked').val() == 'portrait') {
            textX = mainImage.width * scale + maxWidth - fontSize / 2;
        } else {
            textX = mainImage.width * scale + fontSize / 2;
        }
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(mainImage.width * scale, 0, mainImage.width * scale, mainImage.height * scale);
    } else if ($('#layout').val() == 'bottom') {
        ctx.drawImage(mainImage, 0, mainImage.height * scale, mainImage.width * scale, mainImage.height * scale);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, mainImage.height * scale, mainImage.width * scale, mainImage.height * scale);
    }
    ctx.fillStyle = '#ffffff';
    
    for (let i = 0; i < lines.length; i++) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#000000';
        ctx.shadowOffsetX = shadowOffset;
        ctx.shadowOffsetY = shadowOffset;
        
        if ($('input[name=orientation]:checked').val() == 'portrait') {
            strokeTextPortrait(ctx, lines[i], fontSize, -fontSize * i * 1.5 + textX, textY);
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            fillTextPortrait(ctx, lines[i], fontSize, -fontSize * i * 1.5 + textX, textY);
        } else {
            ctx.strokeText(lines[i], textX, fontSize * i * 1.5 + textY);
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.fillText(lines[i], textX, fontSize * i * 1.5 + textY);
        }
    }
    
    $('#c1').show();
    $('#img_output').hide();
}

function updateImage() {
    $('#c1').hide();
    $('#img_output').show();
    var img = new Image();
    img.src = $('#c1')[0].toDataURL('image/png');
    $('#c2').attr('width', $('#c1').attr('width') / scale).attr('height', $('#c1').attr('height') / scale);
    var ctx2 = $('#c2')[0].getContext('2d');
    ctx2.drawImage(img, 0, 0, img.width / scale, img.height / scale);
    $('#img_output').attr('src', $('#c2')[0].toDataURL('image/jpeg'));
}

function strokeTextPortrait(context, text, fontHeight, x, y) {
    var varticalMargin = 1.1;
    for (var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        if ('「」ー（）()'.indexOf(c) >= 0) {
            context.translate(x + fontHeight / 2, y + fontHeight * varticalMargin * i + fontHeight * varticalMargin / 2);
            context.rotate(Math.PI / 2);
            context.strokeText(c, -fontHeight / 2, -fontHeight * varticalMargin / 2);
            context.rotate(-Math.PI / 2);
            context.translate(-(x + fontHeight / 2), -(y + fontHeight * varticalMargin * i + fontHeight * varticalMargin / 2));
        } else if ('、。'.indexOf(c) >= 0) {
            context.strokeText(c, x + fontHeight * varticalMargin / 2, y + fontHeight * i * varticalMargin - fontHeight * varticalMargin / 2);
        } else {
            context.strokeText(c, x, y + fontHeight * i * varticalMargin);
        }
    }
}

function fillTextPortrait(context, text, fontHeight, x, y) {
    var varticalMargin = 1.1;
    for (var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        if ('「」ー（）()'.indexOf(c) >= 0) {
            context.translate(x + fontHeight / 2, y + fontHeight * varticalMargin * i + fontHeight * varticalMargin / 2);
            context.rotate(Math.PI / 2);
            context.fillText(c, -fontHeight / 2, -fontHeight * varticalMargin / 2);
            context.rotate(-Math.PI / 2);
            context.translate(-(x + fontHeight / 2), -(y + fontHeight * varticalMargin * i + fontHeight * varticalMargin / 2));
        } else if ('、。'.indexOf(c) >= 0) {
            context.fillText(c, x + fontHeight * varticalMargin / 2, y + fontHeight * i * varticalMargin - fontHeight * varticalMargin / 2);
        } else {
            context.fillText(c, x, y + fontHeight * i * varticalMargin);
        }
    }
}
