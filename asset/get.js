Slide={
    onload:()=>{
        Slide.img = document.getElementById('slide_show');
        document.body.addEventListener('keydown',(e)=>{Slide.key(e)});
        document.body.addEventListener('click',(e)=>{Slide.click(e)});
        Slide.get_list();
 
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
            Slide.interval()
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
        fetch('./admin/add');
    },
    minus:()=>{
        fetch('./admin/minus');
    },
}