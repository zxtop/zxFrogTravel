import {Application,Container,Graphics,Sprite, Point} from 'pixi.js';
import { getAnimation, getSound, load, createSprite,  getTexture} from '../loader';
import {TweenLite,TimeLine,TweenMax, TimelineMax, Power1} from 'gsap';
import {AnswerInfo,Loading,Question} from 'xes-answer';
import { Store} from 'vuex';
import {RenderPageByIndex} from 'xes-tem-render';

// import STEMTITLE from 'xes-subtitle';
// import GAME from "xes-game";


class Actuator{

    constructor(){

        this.pixiStage = null;
        this.currentTarget = null;
        this.sprite_hy = new Container(); //荷叶数组存储
        this.styleText = null;            //荷叶数字默认样式
        this.styleText_q = null;          //荷叶？样式
        this.styleText_m = null;          //蚊子数字默认样式
        this.frog = null;                 //青蛙

        this.resultPage = null            //结果页
        this.frogItem = [] //碰撞检测

        this.mainArr = [];
        this.num = 0;
        this.frogAnimate = new TimelineMax();

        this.temContainer = new Container();
        this.photoArr = [];
        this.photo = null;
        this.photo_bg = null;


        this.hy_Arr = [
            {
                "x": 161,
                "y": 670,
                "main_x": 160,
                "main_y": 570
            },
            {
                "x": 287,
                "y": 570,
                "main_x": 300,
                "main_y": 480
            },
            {
                "x": 516,
                "y": 628,
                "main_x": 516,
                "main_y": 530
            },
            {
                "x": 681,
                "y": 570,
                "main_x": 695,
                "main_y": 470
            },
            {
                "x": 911,
                "y": 626,
                "main_x": 920,
                "main_y": 520
            },
            {
                "x": 1080,
                "y": 572,
                "main_x": 1083,
                "main_y": 470
            },
            {
                "x": 1315,
                "y": 628,
                "main_x": 1325,
                "main_y": 530
            },
            {
                "x": 1461,
                "y": 560,
                "main_x": 1467,
                "main_y": 462
            },
            {
                "x": 1682,
                "y": 628,
                "main_x": 1690,
                "main_y": 525
            }
        ]
    }

    exec(){
        this.styleText = {
            fontFamily: 'Arial',
            fontSize: '46px',
            fontWeight: 'bold',
            fill: '#F7EDCA',
        }
        this.styleText_q = {
            fontFamily: 'Arial',
            fontSize: '46px',
            fontWeight: 'bold',
            fill: '#ff9a00',
            stroke: '#F7EDCA',
            strokeThickness: 5
        }

        this.styleText_m = {
            fontFamily: 'Arial',
            fontSize: '46px',
            fontWeight: 'bold',
            fill: '#017b28',
        }

        this.init(store.state.pageNumber);
        let _that = this;
        stage.on('pointermove',function(ev){_that.moveTarget.bind(_that)(ev,_that.currentTarget)});
        stage.on('pointerup',function(ev){_that.leaveMoveTarget.bind(_that)(ev,_that.currentTarget)});

    }


    init(pageNum){

        console.log("开始初始化第"+pageNum+"页内容");
        this.pixiStage = stage.getChildByName('GAME').getChildByName('GAME'+pageNum);
        RenderPageByIndex(pageNum);

        console.log(this.pixiStage);

        this.num = 0;
        this.mainArr = [];
        // this.sprite_hy.removeChildren();
        this.pixiStage.removeChild(this.photo_bg);
        this.pixiStage.removeChild(this.photo);
        this.photo = null;
        this.photo_bg = null;

   

        this.photoArr = question.photo;
        if(pageNum == 0){

            if(this.photoArr.length>1){
                store.state.randNum = this.randomNum(0,this.photoArr.length-1);
            }else{
                store.state.randNum = 0;
            }
            
        }else{

            if(this.photoArr.length>1){
                
                let a = this.randomNum(0,this.photoArr.length-1);
                if(a == store.state.randNum){
                    console.log(store.state.randNum);
                    if(store.state.randNum == this.photoArr.length-1){
                        store.state.randNum --;
                    }
                    if(store.state.randNum == 0){
                        store.state.randNum ++
                    }
                }else{
                    store.state.randNum = a;
    
                }
            }else{
                store.state.randNum = 0;
            }

        }
       
        console.log(store.state.randNum);
        this.photo = new PIXI.Sprite.fromImage(res[this.photoArr[store.state.randNum]].url);
        this.photo.alpha = 0;
        this.photo.anchor.set(0.5,0.5);
        this.photo.width = this.photo.width/2;
        this.photo.height = this.photo.height/2;
        this.photo.x = (1920 - this.photo.width)/2+this.photo.width/2;
        this.photo.y = (1080 - this.photo.height)/2+this.photo.height/2;

        this.photo_bg = new PIXI.Sprite.fromImage(res['image_result'].url);
        
        let _that = this;

        question.sources[pageNum].option.map((item,index)=>{ //初始化荷叶
            if(item.image.main_x == ''||item.image.main_y==''){
                _that.hy_Arr.map((hy_item,hy_index)=>{
                    if(hy_index == index){
                        _that.mainArr.push({
                            main_x:hy_item.main_x, //青蛙要跳的位置
                            main_y:hy_item.main_y,
                            text_num:item.image.text_num,
                            right_key:item.image.right_key,
                            choice:item.image.choice
                        });
                    }
                });
               
            }else{

                _that.mainArr.push({
                    main_x:item.image.main_x, //青蛙要跳的位置
                    main_y:item.image.main_y,
                    text_num:item.image.text_num,
                    right_key:item.image.right_key,
                    choice:item.image.choice
                });
            }
            _that.sprite_hy = _that.pixiStage.getChildByName("componentContainer");
        });

        this.frog = getAnimation('animation_qingwa'); //初始化青蛙
        this.frog.state.setAnimation(1,'wait_qingwa',true);
        this.frog.pivot.set(-this.frog.width/2,-this.frog.height/2);
        this.frog.x = 20;
        this.frog.y = 510;
        this.pixiStage.addChild(this.frog);
        if(this.mainArr[this.num].text_num == "?"){
            this.pasueJump(this.mainArr[this.num].main_x,this.mainArr[this.num].main_y,this.num)
        }else{
            this.jump(this.mainArr[this.num].main_x,this.mainArr[this.num].main_y);
        }
    }

    
    jump(main_x,main_y){   //青蛙跳跃
        let self = this;
       
        this.frog.state.setAnimation(1,'jump',false);
    
        if(main_x && main_y){
            self.frogAnimate.to(
                this.frog,
                0.3,
                {
                    x:main_x,
                    y:main_y,
                    ease:Power0.easeNone,
                    onComplete:function(){
                       
                        self.frog.state.setAnimation(1,'wait_qingwa',false);
                        setTimeout(()=>{

                            self.num ++;
    
                            if(self.num == self.mainArr.length){
                                
                                self.frog.state.setAnimation(1,'jump',false);
                                self.frogAnimate.to( //上岸
                                    self.frog,
                                    0.3,
                                    {
                                        x:1808,
                                        y:415,
                                        ease:Power0.easeNone,
                                        onComplete:function(){
                                            console.log('上岸');
                                            self.frog.alpha = 0;
                                            
    
                                                
                                                if(store.state.pageNumber<question.sources.length-1){
                                                    let answer = new AnswerInfo();
                                                    answer.init({
                                                        type : 0,
                                                        useranswer: '',
                                                        answer: '',
                                                        id: store.state.pageNumber,
                                                        rightnum: 1,
                                                        wrongnum: 0
                                                    })     
                                                    store.dispatch('pushToPostArr',answer);
                                                    // 停止上一题的题干音频
                                                    
                                                    self.pixiStage.children[2].stemAudioStr?self.pixiStage.children[2].stemAudioStr.pause():"";
                                                    self.pixiStage.children[2].stemSoundAn?self.pixiStage.children[2].stemSoundAn.timeScale = 0:"";

                                                    

                                                    store.state.pageNumber++;

                                                  
                                                    self.init(store.state.pageNumber);
                                                    
                                                }else{
                                                    //提交答案

                                                    res['audio_photo'].sound.play();
                                                    self.pixiStage.addChild(self.photo_bg);
                                                    self.pixiStage.addChild(self.photo);
                                                    self.pixiStage.setChildIndex(self.photo,self.pixiStage.children.length-1)
                                                    
                                                    let photoAnimate = new TimelineMax();
                                                    photoAnimate.to(
                                                        self.photo,
                                                        0.9,
                                                        {
                                                            alpha:1,
                                                            width:self.photo.width*2,
                                                            height:self.photo.height*2,
                                                            ease:Power0.easeNone,
                                                            
                                                        }
                                                    )
                                            setTimeout(()=>{ //2s后跳转下一题
                                                    let answer = new AnswerInfo();
                                                    answer.init({
                                                        type: 0,
                                                        useranswer: '',
                                                        answer: '',
                                                        id: store.state.pageNumber,
                                                        rightnum: 1,
                                                        wrongnum: 0
                                                    })
                                                    store.dispatch('pushToPostArr', answer);
                                                    store.dispatch('postAnswer');    
                                            },2000)

                                                }
                                            
                                            
    
    
                                        }
                                    }
                                )
                            }else{
    
                                if(self.mainArr[self.num].text_num == "?"){
            
                                    self.pasueJump(self.mainArr[self.num].main_x,self.mainArr[self.num].main_y,self.num)
            
                                }else{
    
                                    self.jump(self.mainArr[self.num].main_x,self.mainArr[self.num].main_y);
                                }
                            }
                        },400)

                    }
                }
            )
        }else{
            
        }
    }

    pasueJump(main_x,main_y,num){ //青蛙暂停
        let self = this;
        this.frog.state.setAnimation(1,'jump',false);
        self.frogAnimate.to(
            this.frog,
            0.3,
            {
                x:main_x,
                y:main_y,
                ease:Power0.easeNone,
                onComplete:function(){
                    self.frog.state.setAnimation(1,'wait_qingwa',true);
                    self.flyMosquito(num);//蚊子渐入
                }
            }
        )
    }

    flyMosquito(num){ //蚊子飞入
        let temArr = [];
        let _that = this;
        this.mainArr[num].choice.map((element,index) => {
            
            if(num == 8){
                console.log("8888888")
                let mosquito = getAnimation('animation_wenzi'); //每个蚊子的属性
                mosquito.state.setAnimation(1,'wait_wenzi',true);     // 飞行的蚊子
                mosquito.ids = index;
                mosquito.interactive = true;
                mosquito.buttonMode = true;
                mosquito.dragging = false;
                mosquito.startX = null;
                mosquito.startY = null;
                mosquito.upX = null;
                mosquito.upY = null;
                mosquito.downPosition = null;
                mosquito.newPosition = null;
                mosquito.status = false; //是否触碰到
                mosquito.move = false; //是否可以拖拽
                mosquito.complete = true;//是否完成
                mosquito.randomAnimate = new TimelineMax();
    
                let bg_text_sprite = new PIXI.Sprite.fromImage('image_text_bg'); //文字背景
                let textSprite = new PIXI.Text(element.key_num,this.styleText_m); //文字
                textSprite.x = (bg_text_sprite.width-textSprite.width)/2;
                textSprite.y = 10;
                
                bg_text_sprite.x = 30; //文字背景
                bg_text_sprite.y = 50;
    
                bg_text_sprite.addChild(textSprite);
                mosquito.textValue = element.key_num;
                mosquito.right_key = _that.mainArr[num].right_key;
                mosquito.addChild(bg_text_sprite);
                mosquito.pivot.set(-mosquito.width/2,-mosquito.height/2)

                mosquito.startPosX = (_that.frog.x-300) + index*160;//记录蚊子初开始的位置
                mosquito.startPosY = _that.frog.y - 220;

                mosquito.randPosY = _that.frog.y - 210 + (index*15); //记录蚊子的随机位置
                mosquito.times = 1 + index*0.5;

                temArr.push(mosquito);
                _that.temContainer.addChild(mosquito);
                _that.pixiStage.addChild(_that.temContainer);

                let mosquitoAnimate = new TimelineMax(); //蚊子进入的方式
                mosquitoAnimate.fromTo(
                    mosquito,
                    1.5,
                    {
                        x:(_that.frog.x-300) + index*160,
                        y:(_that.frog.y-_that.frog.height),
                        alpha:0
                    },
                    {
                        x:(_that.frog.x-300) + index*160,
                        y:_that.frog.y - 220,
                        alpha:1,
                        ease:Power0.easeNone,
                        onComplete:function(){
                            _that.randomMosquito(mosquito,temArr);//蚊子随机上下飞动
                            
                        }
                    }
                )
            }else{
                let mosquito = getAnimation('animation_wenzi'); //每个蚊子的属性
                mosquito.state.setAnimation(1,'wait_wenzi',true);     // 飞行的蚊子
                mosquito.ids = index;
                mosquito.interactive = true;
                mosquito.buttonMode = true;
                mosquito.dragging = false;
                mosquito.startX = null;
                mosquito.startY = null;
                mosquito.upX = null;
                mosquito.upY = null;
                mosquito.downPosition = null;
                mosquito.newPosition = null;
                mosquito.status = false; //是否触碰到
                mosquito.move = false; //是否可以拖拽
                mosquito.complete = true;//是否完成

                mosquito.randomAnimate = new TimelineMax();
    
                let bg_text_sprite = new PIXI.Sprite.fromImage('image_text_bg'); //文字背景
                let textSprite = new PIXI.Text(element.key_num,this.styleText_m); //文字
                textSprite.x = (bg_text_sprite.width-textSprite.width)/2;

                textSprite.y = 5;
                
                bg_text_sprite.x = 30; //文字背景
                bg_text_sprite.y = 50;
    
                bg_text_sprite.addChild(textSprite);
                mosquito.textValue = element.key_num;
                mosquito.right_key = _that.mainArr[num].right_key;
                mosquito.addChild(bg_text_sprite);
                mosquito.pivot.set(-mosquito.width/2,-mosquito.height/2)
                mosquito.startPosX = (_that.frog.x-130) + index*160;//记录蚊子初开始的位置
                mosquito.startPosY = _that.frog.y - 220;
    
                mosquito.randPosY = _that.frog.y - 210 + (index*15); //记录蚊子的随机位置
                mosquito.times = 1 + index*0.5;

                temArr.push(mosquito);
                _that.temContainer.addChild(mosquito);
                _that.pixiStage.addChild(_that.temContainer);
    
                let mosquitoAnimate = new TimelineMax(); //蚊子进入的方式
                mosquitoAnimate.fromTo(
                    mosquito,
                    1.5,
                    {
                        x:(_that.frog.x-130) + index*160,
                        y:(_that.frog.y-_that.frog.height),
                        alpha:0
                    },
                    {
                        x:(_that.frog.x-130) + index*160,
                        y:_that.frog.y - 220,
                        alpha:1,
                        ease:Power0.easeNone,
                        onComplete:function(){
                            _that.randomMosquito(mosquito,temArr); //蚊子随机上下飞动
                            
                        }
                    }
                )
            }

            
        });
    }

    randomMosquito(item,temArr){ 
        let _that = this;
        // let a = this.randomNum(_that.frog.y - 250,_that.frog.y - 170);
        console.log(item.ids)
        item.randomAnimate.to(
            item,
            item.times,
            {
                y:item.randPosY,
                repeat:-1,
                yoyo:true,
                ease:Power0.easeNone,
            }
        );
        item.on('pointerdown',function(ev){_that.getCurrentTarget.bind(_that)(ev,temArr)})
    };

    getCurrentTarget(ev,temArr){
        if(this.currentTarget == null){
            this.currentTarget = ev.target;
            let self = this;
            console.log(temArr);
            for(var i=0;i<temArr.length;i++){
                if(self.currentTarget.ids == i){
                    temArr[i].move = true;
                }else{
                    temArr[i].move = false;
                }
            }
    
            if(!this.currentTarget.dragging && this.currentTarget.complete){
              
                this.currentTarget.randomAnimate.pause(); 
                // res['audio_result'].sound.play();     //拖拽蚊子变挣扎状态，且有音效
                this.currentTarget.startX = this.currentTarget.x;
                this.currentTarget.startY = this.currentTarget.y;
                this.currentTarget.downPosition = ev.data.getLocalPosition(this.currentTarget.parent);
    
                this.currentTarget.disX = this.currentTarget.downPosition.x - this.currentTarget.startX;
                this.currentTarget.disY = this.currentTarget.downPosition.y - this.currentTarget.startY;
                this.currentTarget.dragging = true;
                
            }

        }
    }
    moveTarget(ev,item){
        let _that = this;
        if(item && item.dragging && item.move){
            console.log("拖拽");
            item.complete = false;
            item.data = ev.data;
            item.newPosition = item.data.getLocalPosition(item.parent);
            item.x = item.newPosition.x-item.disX;
            item.y = item.newPosition.y-item.disY;
            
            _that.hitFrog(item);//碰撞检测
        }
    }

    leaveMoveTarget(ev,item){
        let self = this;
        if(item && item.dragging){
            item.dragging = false;
            item.complete = false;

            if(item.status){ //若是碰到了
                if(item.right_key == item.textValue){
                    console.log("正确选项");

                    res['audio_eat'].sound.play();
                    self.temContainer.removeChild(item);

                    self.frog.state.setAnimation(1,'right',false);
                    item.move = false;
                    item.complete = true;
                    setTimeout(()=>{
                        
                        self.currentTarget = null;
                        self.temContainer.removeChildren(); //删除其他元素
                        self.num ++;
                        console.log(self.num)

                        if(self.num !== 9){
                            if(self.mainArr[self.num].text_num == "?"){
                                self.pasueJump(self.mainArr[self.num].main_x,self.mainArr[self.num].main_y,self.num)
                            }else{
                                self.jump(self.mainArr[self.num].main_x,self.mainArr[self.num].main_y);
                            } 
                        }else{

                            self.frog.state.setAnimation(1,'jump',false);
                            self.frogAnimate.to( //上岸
                                self.frog,
                                0.3,
                                {
                                    x:1808,
                                    y:415,
                                    ease:Power0.easeNone,
                                    onComplete:function(){
                                        console.log('上岸');
                                        self.frog.alpha = 0;
                                        
                                            if(store.state.pageNumber<question.sources.length-1){
                                                let answer = new AnswerInfo();
                                                answer.init({
                                                    type : 0,
                                                    useranswer: '',
                                                    answer: '',
                                                    id: store.state.pageNumber,
                                                    rightnum: 1,
                                                    wrongnum: 0
                                                })     
                                                store.dispatch('pushToPostArr',answer);
                                                // 停止上一题的题干音频

                                                self.pixiStage.children[2].stemAudioStr?self.pixiStage.children[2].stemAudioStr.pause():"";
                                                self.pixiStage.children[2].stemSoundAn?self.pixiStage.children[2].stemSoundAn.timeScale = 0:"";
                                               
                                                store.state.pageNumber++;
                                                self.init(store.state.pageNumber);
                                            }else{
                                                //提交答案
                                                res['audio_photo'].sound.play();
                                                self.pixiStage.addChild(self.photo_bg);
                                                self.pixiStage.addChild(self.photo);
                                                self.pixiStage.setChildIndex(self.photo,self.pixiStage.children.length-1)
        
                                                let photoAnimate = new TimelineMax();
                                                photoAnimate.to(
                                                    self.photo,
                                                    0.9,
                                                    {
                                                        alpha:1,
                                                        width:self.photo.width*2 ,
                                                        height:self.photo.height*2,
                                                        ease:Power0.easeNone
                                                        
                                                    }
                                                )
                                                setTimeout(()=>{ //2s后跳转下一题

                                                let answer = new AnswerInfo();
                                                answer.init({
                                                    type: 0,
                                                    useranswer: '',
                                                    answer: '',
                                                    id: store.state.pageNumber,
                                                    rightnum: 1,
                                                    wrongnum: 0
                                                })
                                                store.dispatch('pushToPostArr', answer);
                                                store.dispatch('postAnswer');    
                                        },2000)

                                            }
                                        

                                    }
                                }
                            )
                        }
                      
    
                    },1000)
                    console.log(self.sprite_hy)
                
                    self.sprite_hy.children[self.sprite_hy.children.length-1-self.num].children[0].children[0].text = item.right_key; //改变数字，继续往下跳
                    self.sprite_hy.children[self.sprite_hy.children.length-1-self.num].children[0].children[0].x = (self.sprite_hy.children[self.sprite_hy.children.length-1-self.num].children[0].width-self.sprite_hy.children[self.sprite_hy.children.length-1-self.num].children[0].children[0].width)/2;
                }else{
                    item.complete = true;

                    console.log("不是正确选项");
                    res['audio_error'].sound.play();
                    item.x = item.startPosX;
                    item.y = item.startPosY;
                    item.state.setAnimation(1,'wait_wenzi',true);
                    self.frog.state.setAnimation(1,'wait_qingwa',true);
                    item.randomAnimate.play();
                    self.currentTarget = null;
                }

            }else{
                item.complete = true;

                item.state.setAnimation(1,'wait_wenzi',true);

                item.x = item.startPosX;
                item.y = item.startPosY;
                item.randomAnimate.play();
                self.currentTarget = null;
            }
            
        }
    }

    hitFrog(item){
        
        if(item.x>20&&item.x<1900&&item.y>20&&item.y<1060){

            if(
                ((item.newPosition.x) + (item.width-item.disX)) < this.mainArr[this.num].main_x ||
                (item.newPosition.x - item.disX) > (parseFloat(this.frog.width) + parseFloat(this.mainArr[this.num].main_x)) ||
                ((item.newPosition.y) + (item.height-item.disY)) < this.mainArr[this.num].main_y ||
                (item.newPosition.y - item.disY) > (parseFloat(this.frog.height) + parseFloat(this.mainArr[this.num].main_y))
            ){

                console.log("no touch");
                
                item.status = false;
                this.frog.state.setAnimation(1,'wait_qingwa',true);

            }else{

                console.log("touch");
                item.status = true;
                item.state.setAnimation(1,'drag_wenzi1',true); //碰到青蛙蚊子变惊恐
                this.frog.state.setAnimation(1,'drag_qingwa',false) //青蛙流口水
            }

        }else{
            item.x = item.startPosX;
            item.y = item.startPosY;
            this.currentTarget = null;
        }
    }




   randomNum(lowerValue,upperValue){ //随机取值

        return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);

   }



}
export {Actuator}