var fs = require('fs');

var readStream = fs.createReadStream('copy.jpg');
var data = [];
readStream.on('data', function (chunk, err) {
    if(err){
        console.log('err', err);
    }
    for(let i=0; i<chunk.length; i++){
        chunk[i] = chunk[i]^10;
    }
    data.push(chunk);
});
readStream.on('end', function () {
    console.log('read end...');
    var writeStream = fs.createWriteStream('copy.jpg');
    for(let i=0; i<data.length; i++){
        var chunk = data[i];
        writeStream.write(chunk);
    }
    writeStream.on('finish', function () {
        console.log('write finished...');
    });
});