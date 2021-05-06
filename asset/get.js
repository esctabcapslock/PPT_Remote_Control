Slide={
    onload:()=>{
        Slide.img = document.getElementById('slide_show');
        Slide.video = document.getElementById('video_show');
        document.body.addEventListener('keydown',(e)=>{Slide.key(e)});
        document.body.addEventListener('click',(e)=>{Slide.click(e)});
        Slide.get_list();
        Slide.video_displayed=false;
        
        Slide.video_socket = new S_Socket_Client('video', '../video', (data) => {
                var tmp = (data.split(','))
                Slide.video_displayed = tmp[2]=='true';
                Slide.video_display();
                if(!Slide.video_displayed){
                    Slide.video.pause()
                    return;
                }
                
            
                if (Slide.video_attribute[3] != tmp[3]){
                    Slide.video.src = `media/${tmp[3]}`;
                    Slide.video_displayed = false;
                    Slide.video_display();
                    console.log('비디오 변화', Slide.number, '->', tmp)
                }
                console.log('재생', Slide.video_attribute, tmp)
                if(tmp[3]) Slide.video_show(Slide.video_attribute[1] , tmp[1]);
                Slide.video_attribute = tmp;
                
            })
    },
    interval:()=>{
        Slide.a = setInterval(()=>{
            fetch('./number').then((data)=>{
            return data.text()
        }).then((data)=>{
            
            var tmp = Number(data)
            if(tmp!=Slide.number) {
                console.log('변화',Slide.number, '->',tmp)
                
            }
            Slide.show();
            Slide.number = tmp;
        })
        },100)
    },
    get_list:()=>{
        fetch('./info').then((data)=>{
            return data.text()
        }).then((data)=>{
            Slide.list = data.split(',');
            Slide.number=0;
            Slide.show();
            Slide.socket = new S_Socket_Client('show', '../show', (data) => {
                var tmp = Number(data.split(',')[1])
                if (tmp != Slide.number) {
                     console.log('변화', Slide.number, '->', tmp)
                }
                Slide.number = tmp;
                Slide.show();
                
            })
        })
    },
    list:[],
    number:0,
    number_add:(x)=>{
        if ((Slide.number+x)> Slide.list.length) return;
        if ((Slide.number+x)<0) return;
        console.log('number_add',x, Slide.number, '->', Slide.number+x);
        Slide.number+=x;
    },
    show:()=>{
        //if (!Slide.list.length) return;
        //if (Slide.number>= Slide.list.length) return;
        Slide.img.src = `./img/${Slide.list[Slide.number]}`;
    },
    key:(e)=>{
        console.log(e.key);
        if ([' ', 'ArrowRight', 'Enter'].includes(e.key)){
            //Slide.number_add(1)
            Slide.add();
            //Slide.show();
        }
        else if(['ArrowLeft'].includes(e.key)){
            //Slide.number_add(-1);
            Slide.minus();
            //Slide.show();
        }
    },
    click:(e)=>{
        //Slide.number_add(1)
        Slide.add();
        //Slide.show();
    },add:()=>{
        fetch('./show/add');
    },
    minus:()=>{
        fetch('./show/minus');
    },
    video_attribute:['','',false, ''], // 이름, 매소드, 표출여부, 주소
    video_displayed:false,
    video_show:(pre, x)=>{
        // 일단 영상 주소는 설정되어 있음
        var paused = Slide.video.paused
        console.log('Slide.video_displayed', x)
        if (x=='play' && paused) {
            if (Slide.video.currentTime==Slide.video.duration) Slide.video.currentTime = 0;
            Slide.video.play();
        }
        if (x=='pause' && !paused) Slide.video.pause();
        if (x=='zero' && pre!='zero') Slide.video.currentTime = 0;
    },
    video_display:()=>{
        Slide.video.style.display =  Slide.video_displayed ? 'block' : 'none';
        Slide.video_displayed!=Slide.video_displayed
    }
}