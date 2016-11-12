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
});

var mainImage;

function fileChanged(e) {
    var files = e.target.files;
    if (!files[0]) {
        return;
    }
    
    var image = new Image();
    image.onload = function() {
        $('#c1').attr('width', image.width).attr('height', image.height);
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
        $('#c1').attr('width', mainImage.width);
        $('#c1').attr('height', mainImage.height);
    } else if ($('#layout').val() == 'right') {
        $('#c1').attr('width', mainImage.width * 2);
        $('#c1').attr('height', mainImage.height);
    } else if ($('#layout').val() == 'bottom') {
        $('#c1').attr('width', mainImage.width);
        $('#c1').attr('height', mainImage.height * 2);
    }
    
    var ctx = $('#c1')[0].getContext('2d');
    var fontSize = Math.floor(mainImage.width / 32);
    var textX = fontSize / 2;
    var textY = fontSize / 2;
    var shadowOffset = 10;
    var fontFrameColor = '#ff0000';
    var backgroundColor = '#000000';
    if ($('#colors').val() == 'purple-purple') {
        fontFrameColor = '#7800af';
        backgroundColor = 'rgba(31, 4, 48, 0.8)';
    } else if ($('#colors').val() == 'red-black') {
        fontFrameColor = '#d00000';
        backgroundColor = 'rgba(0, 0, 0, 0.8)';
    }
    if ($('#layout').val() == 'right') {
        ctx.drawImage(mainImage, mainImage.width, 0, mainImage.width, mainImage.height);
        textX = mainImage.width + fontSize / 2;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(mainImage.width, 0, mainImage.width, mainImage.height);
    } else if ($('#layout').val() == 'bottom') {
        ctx.drawImage(mainImage, 0, mainImage.height, mainImage.width, mainImage.height);
        textY = mainImage.height + fontSize / 2;
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
    if ($('#layout').val() == 'right') {
        $('#c1').attr('width', Math.floor(mainImage.width + maxWidth + fontSize * 1.5));
    } else if ($('#layout').val() == 'bottom') {
        $('#c1').attr('height', Math.floor(mainImage.height + maxHeight + fontSize * 1.5));
    }
    
    ctx.clearRect(0, 0, $('#c1').attr('width'), $('#c1').attr('height'));
    ctx.drawImage(mainImage, 0, 0, mainImage.width, mainImage.height);
    
    ctx.miterLimit = 2;
    ctx.fillStyle = '#ffffff';
    ctx.font = fontSize + 'px sans-serif';
    ctx.lineWidth = Math.floor(fontSize / 5);
    ctx.textBaseline = 'top';
    ctx.strokeStyle = fontFrameColor;
    if ($('#layout').val() == 'right') {
        ctx.drawImage(mainImage, mainImage.width, 0, mainImage.width, mainImage.height);
        textX = mainImage.width + fontSize / 2;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(mainImage.width, 0, mainImage.width, mainImage.height);
    } else if ($('#layout').val() == 'bottom') {
        ctx.drawImage(mainImage, 0, mainImage.height, mainImage.width, mainImage.height);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, mainImage.height, mainImage.width, mainImage.height);
    }
    ctx.fillStyle = '#ffffff';
    
    for (let i = 0; i < lines.length; i++) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#000000';
        ctx.shadowOffsetX = shadowOffset;
        ctx.shadowOffsetY = shadowOffset;
        
        ctx.strokeText(lines[i], textX, fontSize * i * 1.5 + textY);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillText(lines[i], textX, fontSize * i * 1.5 + textY);
    }
    
    $('#c1').show();
    $('#img_output').hide();
}

function updateImage() {
    $('#c1').hide();
    $('#img_output').show();
    $('#img_output').attr('src', $('#c1')[0].toDataURL('image/jpeg'));
}
