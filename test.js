var fs = require('fs');

var readerStream = fs.createReadStream('44.jpg');
var writeStream = fs.createWriteStream('copy.jpg');

readerStream.on('data', function (chunk, err) {
    if(err){
        console.log('err: ', err);
    }
    // console.log('chunk: ', chunk);
    console.log('chunk.length: ', chunk.length);
    for(var i=0;i<chunk.length;i++){
        chunk[i] = chunk[i]^10;
    }
    writeStream.write(chunk);
});
