Control={
    onload:()=>{
        Control.page_num = document.getElementById('page_num');
        Control.img = document.getElementById('slide_show');
        
        Control.bt_add = document.getElementById('bt_add');
        Control.bt_minus = document.getElementById('bt_minus');
        
        Control.bt_play = document.getElementById('bt_play');
        Control.bt_show = document.getElementById('bt_show');
        Control.bt_pause = document.getElementById('bt_pause');
        Control.bt_zero = document.getElementById('bt_zero');
        Control.video_list_span = document.getElementById('video_list');
        Control.video_num = document.getElementById('video_num');
        
        Control.bt_add.addEventListener('click',Control.add);
        Control.bt_minus.addEventListener('click',Control.minus);
        
        Control.bt_show.addEventListener('click',Control.ctrl_show);
        Control.bt_play.addEventListener('click',Control.play);
        Control.bt_pause.addEventListener('click',Control.pause);
        Control.bt_zero.addEventListener('click',Control.zero);
        
        document.body.addEventListener('keydown',(e)=>{Control.key(e)});
        Control.number=0;
        Control.interval()
    },
    list:[],
    number:0,
    add:()=>{
        fetch('./show/add');
    },
    minus:()=>{
        fetch('./show/minus');
    },
    show:()=>{
        //console.log('img',Control.img.src)
        Control.page_num.innerHTML=Control.number.toString();
        Control.img.src = `./img/${Control.list[Control.number]}`;
         console.log('img',Control.img.src)
    },
    interval:()=>{
        fetch('./info').then((data)=>{
            return data.text()
        }).then((data)=>{
            Control.list = data.split(',');
            Control.show();
            Control.socket = new S_Socket_Client('show', '../show', (data) => {
                Control.number = Number(data.split(',')[1])
                Control.show();
            })
        })
        
        fetch('./media_info').then((data)=>{
            return data.text()
        }).then((data)=>{
            Control.video_list = data.split(',');
            Control.video_list_span.innerHTML=`<li onclick="Control.set('')">초기화</li>`
            Control.video_list.forEach((v)=>{
                console.log('info',v);
                Control.video_list_span.innerHTML+=`<li onclick="Control.set('${v}')">${v}</li>`
                })
            Control.show();
            Control.video_socket = new S_Socket_Client('video', '../video', (data) => {
                Control.video_attribute = data.split(',')
                Control.video_show();
            })
        })
        
    },
    key:(e)=>{
        console.log(e.key);
        if ([' ', 'ArrowRight', 'Enter'].includes(e.key)){
            Control.add();
        }
        else if(['ArrowLeft'].includes(e.key)){
            Control.minus();
        }
    },
    video_list:[],
    video_attribute:['','',false,''],
    play:(e)=>{
        fetch('./video/play')
    },ctrl_show:(e)=>{
        fetch('./video/show')
    },pause:(e)=>{
        fetch('./video/pause')
    },zero:(e)=>{
        fetch('./video/zero') = data.split(',');
             Control.video_show()
    },set:(x)=>{
        fetch('./video/set/'+x)
    },
    video_show:()=>{
        Control.video_num.innerHTML = Control.video_attribute.toString()
    }
    
}