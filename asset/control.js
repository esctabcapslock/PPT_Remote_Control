Control={
    onload:()=>{
        Control.page_num = document.getElementById('page_num');
        
        Control.bt_add = document.getElementById('bt_add');
        Control.bt_minus = document.getElementById('bt_minus');
        Control.bt_add.addEventListener('click',Control.add);
        Control.bt_minus.addEventListener('click',Control.minus);
        document.body.addEventListener('keydown',(e)=>{Control.key(e)});
        Control.number=0;
        Control.interval()
    },
    number:0,
    add:()=>{
        fetch('./admin/add').then((data)=>{
            return data.text()
        }).then((data)=>{
            Control.number = Number(data)
            Control.show();
        })
    },
    minus:()=>{
        fetch('./admin/minus').then((data)=>{
            return data.text()
        }).then((data)=>{
            Control.number = Number(data)
            Control.show();
        })
    },
    show:()=>{
        Control.page_num.innerHTML=Control.number.toString();
    },
    interval:()=>{
        Control.a = setInterval(()=>{
            fetch('./number').then((data)=>{
            return data.text()
        }).then((data)=>{
            
            Control.number = Number(data);
            Control.show()
        })
        },100)
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
}