var http = require('http');
var fs = require('fs');
var path = require('path');
var saveFile = require('./saveFile');
var cheerio = require('cheerio');

var filePath = './imgs3';
fs.exists(filePath, function (exists) {
    if(exists){
        console.log('dir has been already created...');
    }
    else{
        console.log('dir is not exists, start create it now...');
        // var paths = path.dirname(filePath);
        fs.mkdir(filePath);
        console.log(filePath + ' create finish...');
    }
});

http.get('http://www.netbian.com/index_3.htm', function (res) {
    var data = [];
    res.on('data', function (chunk, err) {
        if(err){
            return console.log(err);
        }
        data.push(chunk);
    });
    res.on('end', function () {
        console.log('page request end...');
        var htmlStr = data.join('');
        rquestDataHandler(htmlStr);
    });
});

var isLastSave = false;
function rquestDataHandler(htmlStr) {
    var $ = cheerio.load(htmlStr);
    var alinks = $('div.list>ul>li>a');
    var url;
    for(var i=1;i<alinks.length;i++){
        var id = alinks[i].attribs.href;
        id = /(\d+)/.exec(id)[1];
        url = 'http://www.netbian.com/desk/'+id+'-1920x1080.htm';
        toTargePage(url, i==alinks.length-1);
    }
}
var count = 1;
var saveQueue = [];
function toTargePage(url, _isLastSave) {
    http.get(url, function (res) {
        var data = [];
        res.on('data', function (chunk, err) {
            if(err){
                return console.log(err);
            }
            data.push(chunk);
        });
        res.on('end', function () {
            console.log('targePage request end...');
            var htmlstr = data.join('');
            var $ = cheerio.load(htmlstr);
            var url;
            var el = $('#main>table>tbody>tr>td>a');
            var src = el&&el[0] ? el[0].attribs.href : '';
            if (src){
                var save = function () {
                    saveFile.saveFile(path.join(filePath, (count++)+'.jpg'), src);
                }
                saveQueue.push(save);
                isLastSave = _isLastSave;
            }
        });
    });
}

var clock = setInterval(function () {
    console.log('time...');
    if(saveQueue.length == 0){
        if(isLastSave) {
            clearInterval(clock);
        }
        return;
    }
    var currentSaveFn = saveQueue[0];
    saveQueue.splice(0,1);
    currentSaveFn();
},4000);
