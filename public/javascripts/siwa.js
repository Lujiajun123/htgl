// 弹窗插件(对象)
// 属性： 标题、内容、宽、高、能否拖拽、是否有遮罩层
// 方法：
//      init() 生成弹窗，以及弹窗内的其他元素
//      show() 出现弹窗
function Popover(opts){
    var defaults = {
        title : "弹窗标题",
        content : "内容",
        // width : 500,
        // height : 300,
        draggable : true,
        overlay : 0.3,
        titleColor : "#000",
        overlaybgc1 : "#fff",
        overlaybgc2 : "#000"
    }
    var obj = Object.assign({},defaults,opts);
    this.init(obj);
    this.show();
}
Popover.prototype = {
    constructor : Popover,
    init : function(obj){
        this.popover = document.createElement("div");
        this.popover.classList.add("popover");
        // this.popover.style.width = obj.width + "px";
        // if(typeof obj.height=="number"){
        //     this.popover.style.height = obj.height + "px";
        // }

        this.title = document.createElement("h3");
        this.title.classList.add("title");
        this.title.innerHTML = obj.title;
        this.title.style.background = obj.titleColor;
        
        

        this.popover.appendChild(this.title);

        this.content = document.createElement("p");
        this.content.classList.add("content");
        this.content.innerHTML = obj.content;
        this.popover.appendChild(this.content);

        this.closeBtn = document.createElement("span");
        this.closeBtn.classList.add("btn-close");
        this.closeBtn.innerHTML = "&times;";
        this.popover.appendChild(this.closeBtn);

        this.closeBtn.onclick = ()=> {
            this.delete();
        }

        if(typeof obj.overlay == "number"){
            this.overlay = document.createElement("div");
            this.overlay.classList.add("overlay");
            this.overlay.style.opacity = obj.overlay;
            this.overlay.style.background = "linear-gradient("+obj.overlaybgc1+","+obj.overlaybgc2+")";
            document.body.appendChild(this.overlay);
        }
        document.body.appendChild(this.popover);
        if(obj.draggable){
            this.drag();
        }
    },
    hide : function(){
        this.popover.display = "none";
        if(this.overlay){
            this.overlay.display = "none";
        }
    },
    delete : function(){
        document.body.removeChild(this.popover);
        if(this.overlay){
            document.body.removeChild(this.overlay);
        }
    },
    show : function(){
        this.popover.style.display = "block";
        if(this.overlay){
            this.overlay.style.display = "block";
        }
    },
    drag : function(){
        var popover = this.popover;
        console.log(popover);
        
        var title = popover.children[0];
        console.log(title);
        
        this.title.onmousedown = function(e){
            var x = e.pageX - popover.offsetLeft;
            var y = e.pageY - popover.offsetTop;
            document.onmousemove = function(ev){
                popover.style.left = ev.pageX -x + 'px';
                popover.style.top = ev.pageY -y + 'px';
                ev.preventDefault();
            }
        }
        this.title.onmouseup = function(evt){
            document.onmousemove = null;
        }
    }
}

function Confirm(opts){
    var defaults = {
        title : "弹窗标题",
        content : "内容",
        // width : 400,
        // height : 200,
        draggable : true,
        overlay : 0.3,
        titleColor : "#000",
        overlaybgc1 : "#fff",
        overlaybgc2 : "#000",
        confirm : function(){},
        cancel : function(){}
    }
    var obj = Object.assign({},defaults,opts);
    Popover.call(this,obj);
    this.init2(obj);
}
Confirm.prototype = object(Popover.prototype);
Confirm.prototype.init2 = function(obj){
    this.footer = document.createElement("div");
    this.footer.classList.add("footer");

    this.confirmBtn = document.createElement("button");
    this.confirmBtn.innerHTML = "确定";
    this.footer.appendChild(this.confirmBtn);

    this.cancelBtn = document.createElement("button");
    this.cancelBtn.innerHTML = "取消";
    this.footer.appendChild(this.cancelBtn);
         
    this.popover.appendChild(this.footer);
    this.confirmBtn.onclick = ()=>{
        this.delete();
        obj.confirm();
    }
    this.cancelBtn.onclick = ()=>{
        this.delete();
        obj.cancel();
    }
}
function Sick(opts){
    var defaults = {
        title : "弹窗标题",
        content : "内容",
        // width : 200,
        // height : 200,
        draggable : true,
        overlay : 0.3,
        titleColor : "#000",
        overlaybgc1 : "#fff",
        overlaybgc2 : "#000",
        confirm : function(){},
        cancel : function(){}
    }
    var obj = Object.assign({},defaults,opts);
    Confirm.call(this,obj);
}
Sick.prototype = object(Confirm.prototype);
Sick.prototype.follow = function(){
    this.popover.style.left = -125+"px";
    this.popover.style.top = -220+"px";
    document.onmousemove = (evt)=>{
        this.popover.style.left = evt.pageX-160+"px";
        this.popover.style.top = evt.pageY-250+"px";
    }
}

function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}