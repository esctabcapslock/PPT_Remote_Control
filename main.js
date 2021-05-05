const http = require('http');
const fs = require('fs');
const port = 80;
const my_ip = require("./my_ip").my_ip();
console.log('내 컴퓨터 주소:',my_ip)
var show_list=[]
var show_number=0;
var who_ch = false;

function show_number_add(x){
    if ((show_number+x)>= show_list.length) return;
    if ((show_number+x)<0) return;
    console.log('show_number',x, show_number, '->', show_number+x);
    show_number+=x;
}

// 요약기능....
var book_list=[];
fs.readdir('./slide',(err,file_list)=>{show_list = file_list;})


const server = http.createServer(function(req,res){
    const url = req.url;
    const url_arr = req.url.split('/')
    const referer = req.headers.referer;
    if (!url.includes('number'))
    console.log('[request]', url, '[referer]', referer)
    
    function ok(xx){
    var a = ["\\",'"', "'", '<', '>', '?', '|', '*', '..', '%'];
    for (var i=0; i<a.length; i++) if (xx.includes(a[i])) return false;
    return true;
    }

    function fs_readfile(res, url, encode, file_type, callback){
        //console.log('fs_readfile', url)
        var name = url.split('/').reverse()[0]
        var url_arr = url.split('/');
        if ( name.includes('.xhtml') || name.includes('.html')) encode='utf-8';
        
        fs.readFile(url, encode, (err,data)=>{
            if(err){ 
                console.error('[error] fs_readfile', err, url, encode, file_type)
                res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
                res.end('Page Not Found');
            }else{
                res.writeHead(200, {'Content-Type':file_type});
                res.end(data)
            }
        })
    callback();
    }

    function _404(res, url, err){
        console.error('_404 fn err', url, err)
        res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
        res.end('Page Not Found');
    }
    
    
    if(url=='/'){
        
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8', 'Content-Location': '/main'});
        res.end('<meta http-equiv="refresh" content="0; url=/main" />');
    } 
    
    else if (url=='/main'){
        //show_number=0;
      fs_readfile(res, 'asset/index.html', 'utf-8', 'text/html; charset=utf-8', ()=>{})  
    } 
    
    else if (url=='/get.js') fs_readfile(res, 'asset/get.js', 'utf-8', 'text/JavaScript; charset=utf-8', ()=>{})
    else if (url=='/control.js') fs_readfile(res, 'asset/control.js', 'utf-8', 'text/JavaScript; charset=utf-8', ()=>{})
    else if (url=='/admin') fs_readfile(res, 'asset/admin.html', 'utf-8', 'text/html; charset=utf-8', ()=>{})
    
    else if (url=='/info'){
        fs.readdir('./slide',(err,file_list)=>{
            show_list = file_list;
            if(err) _404(res, url, "디렉토리가 비었음!");
            else{
                //console.log(typeof(file_list), file_list, file_list.sort(), file_list)
                res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'} );
                res .end(file_list.sort().toString());
            }
        });
    }
    else if(url=='/admin/add'){
        show_number_add(1)
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'} );
        res .end(show_number.toString());
    }
    else if(url=='/admin/minus'){
        show_number_add(-1)
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'} );
        res .end(show_number.toString());
    }
    else if(url=='/number'){
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'} );
        res .end(show_number.toString());
    }
    
    else if (url_arr[1]=='img'){
        
        var file_url = `./slide/${decodeURIComponent(url_arr[2])}`
        if (!ok(file_url)) _404(res,url, "금지된 문자가 포함된 주소임.")
        //console.log('files', file_url);
        fs_readfile(res, file_url, null, 'application', ()=>{})
    }
    else _404(res,url, 'Page Not Found, else;');
});

server.listen(port, ()=>{
    console.log(`Server is running at localhost:${port}`);
});