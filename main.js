const http = require('http');
const fs = require('fs');
const port = 80;
const my_ip = require("./my_ip").my_ip();
const S_Socket_Server = require("./s_socket_server").S_Socket_Server;
const show = new S_Socket_Server('show', 0);
// 이름, 매소드, 표출여부, 주소
const video = new S_Socket_Server('media', ['',false,'']);
console.log('내 컴퓨터 주소:',my_ip)
var show_list=[]

show.show_number_add=(x)=>{
    console.log('show_number',show.value, x, show_list.length)
    if ((show.value+x)>= show_list.length) return;
    if ((show.value+x)<0) return;
    console.log('show_number',x, show.value, '->', show.value+x);
    video.change_value(['', false, video.value[2]],()=>{})
    show.add_value(x)
}

// 요약기능....
var book_list=[];
fs.readdir('./slide',(err,file_list)=>{show_list = file_list;})


const server = http.createServer(function(req,res){
    const url = req.url;
    const url_arr = req.url.split('/')
    const referer = req.headers.referer;
    if (url!='/show' && url!='/video')
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
        if ( name.includes('.html')) encode='utf-8';
        
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
    
    else if (url=='/main')fs_readfile(res, 'asset/index.html', 'utf-8', 'text/html; charset=utf-8', ()=>{})  
    else if (url=='/get.js') fs_readfile(res, 'asset/get.js', 'utf-8', 'text/JavaScript; charset=utf-8', ()=>{})
    else if (url=='/control.js') fs_readfile(res, 'asset/control.js', 'utf-8', 'text/JavaScript; charset=utf-8', ()=>{})
    else if (url=='/s_socket_client.js') fs_readfile(res, 'asset/s_socket_client.js', 'utf-8', 'text/JavaScript; charset=utf-8', ()=>{})
    else if (url=='/admin') fs_readfile(res, 'asset/admin.html', 'utf-8', 'text/html; charset=utf-8', ()=>{})
    
    else if (url=='/info'){
        fs.readdir('./slide',(err,file_list)=>{
            show_list = file_list;
            if(err) _404(res, url, "디렉토리가 비었음!");
            else{
                res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'} );
                res .end(file_list.sort().toString());
            }
        });
    }
    else if (url=='/media_info'){
        fs.readdir('./media',(err,file_list)=>{
            show_list = file_list;
            if(err) _404(res, url, "디렉토리가 비었음!");
            else{
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
    
    else if (url=='/show') show.add_res(res);
    else if (url=='/show/add'){
        show.add_res(res);
        show.show_number_add(1)
    }
    else if (url=='/show/minus'){
        show.add_res(res);
        show.show_number_add(-1)
    }
    else if (url=='/video') video.add_res(res);
    else if (url_arr[1]=='video' && ['play', 'pause', 'zero'].includes(url_arr[2])){
        video.add_res(res);
        video.change_value([url_arr[2], url_arr[2]=='play'?true:video.value[1], video.value[2]], ()=>{})
    }
    else if (url_arr[1]=='video' && url_arr[2]=='show'){
        video.add_res(res);
        video.change_value([video.value[0], !video.value[1], video.value[2]], ()=>{})
    }
    else if (url_arr[1]=='video' && url_arr[2]=='set'){
        // 초기화 하려면 localhost/video/set/ 으로 접속해햐 함...
        var video_name = decodeURIComponent(url_arr[3]);
        if (!ok(video_name)) _404(res,url, "금지된 문자가 포함된 음악 주소임."+url_arr[3])
        else{
            video.add_res(res);
            video.change_value([ video.value[0], video.value[1], video_name ], ()=>{});
        }
    }
    
    else if (url_arr[1]=='img'){
        var file_url = `./slide/${decodeURIComponent(url_arr[2])}`
        if (!ok(file_url)) _404(res,url, "금지된 문자가 포함된 주소임.")
        else fs_readfile(res, file_url, null, 'application', ()=>{})
    }
     else if (url_arr[1]=='media'){
        var file_url = `./media/${decodeURIComponent(url_arr[2])}`
        if (!ok(file_url)) _404(res,url, "금지된 문자가 포함된 주소임.")
        else fs_readfile(res, file_url, null, 'application', ()=>{})
    }
    else _404(res,url, 'Page Not Found, else;');
});

server.listen(port, ()=>{
    console.log(`Server is running at localhost:${port}`);
});