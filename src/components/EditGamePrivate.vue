<template>
    <div>
        <div class="game-title">
            <i :class="tabShowStatus[index].child.option1?'el-icon-arrow-down':'el-icon-arrow-right'"
               @click="tabShow(index,'option1')" ref="option1Title"></i>
            <span @click="tabShow(index,'option1')">
            数列配置项
        </span>
        </div>
        <div class="game-inner" v-show="tabShowStatus[index].child.option1">

            <div class="game-cont" v-for="(item_cont,key) in gameCont">
                <div class="game-title">
                    <i :class="item_cont ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
                        @click="tabShow_child(key)" ref="gameCont"
                        :data-off = "true"
                    ></i>
                    <span @click="tabShow_child(key)">
                        {{"荷叶"+(key+1)}}
                    </span>
                </div>


                <div class="gameHy" ref="gameHy">
                    <div style="clear:both;width:100%;height:20px"></div>
                    <el-radio-group v-model="item_cont.image.text_num" @change="setElementStatus(index,'option'+key,'text',item_cont,$event)">

                        <el-radio :label="' '" >空</el-radio>

                        <div style="clear:both;width:100%;height:10px"></div>
                        
                        <el-radio :label="(((item_cont.image.text_num !== ' ')&&(item_cont.image.text_num!=='?')) ? item_cont.image.text_num : '')">显示</el-radio>

                        <el-input v-if="item_cont.image.text_num !== '?'" style="width:50%;margin-left:10px" 
                                    placeholder = "请输入内容" 
                                    v-model="item_cont.image.text_num"
                                    @input="setElementStatus(index,'option'+key,'text1',item_cont,$event)"
                                    size="mini">
                        </el-input>

                        <el-input v-else style="width:50%;margin-left:10px" 
                                    placeholder = "请输入内容" 
                                    size="mini">
                        </el-input>

                        <div style="clear:both;width:100%;height:10px"></div>
                        <el-radio :label="'?'">未知</el-radio>

                    </el-radio-group>

                    <div class="edit-select" style="width: 100%">
                        <span style="width: 100px">正确选项 :</span>
                        <el-select v-model="item_cont.image.right_key" placeholder="请选择" size="mini" style="width: 60%">
                            <el-option
                                v-for="(items,index) in item_cont.image.choice"
                                    :key="(items.key_name == '' ) ? (items.key_name = '选项'+(index+1)) : items.key_name"
                                    :label="(items.key_name == '' ) ? (items.key_name = '选项'+(index+1)) : items.key_name"
                                    :value="(items.key_num == '' ) ? (items.key_num = index) : items.key_num">
                            </el-option>
                        </el-select>
                    </div>


                    <div style="width:100%;float:left;">

                        <el-input style="width:50%;" placeholder="请输入内容" v-model="item_cont.image.choice[0].key_num" size="mini">
                            <template slot="prepend">
                                选项1
                            </template>
                        </el-input>

                        <el-input style="width:50%;" placeholder="请输入内容" v-model="item_cont.image.choice[1].key_num" size="mini">
                            <template slot="prepend">
                                选项2
                            </template>
                        </el-input>

                        <el-input style="width:50%;" placeholder="请输入内容" v-model="item_cont.image.choice[2].key_num" size="mini">
                            <template slot="prepend">
                                选项3
                            </template>
                        </el-input>

                    </div>


                    <div style="clear:both;width:100%;height:20px"></div>


                </div>

            </div>

        </div>
    </div>
</template>
<script>
    import {CopyAndRender,DeleteEleByName,UploadAndRenderEle,RenderElementByIndex} from 'xes-tem-render'
    export default {
        name: "EditGamePrivate",
        data() {
            return {
                lockImg:this.resourceData['image_lock_off'],
                checkbox:false,
                radio:1,
                switchStatus:false,
                audio_name:'',
                image:{
                    "show": true,
                    "x": 0,
                    "y": 0,
                    "lock":false,
                    "width":0,
                    "height":0,
                    "name": "",
                    "ratio":0
                },
                sprite:{
                    "show": false,
                    "x": "500",
                    "y": "0",
                    "name": "",
                    "scale": "1",
                    "loop": false
                },
                animate:{
                    "show": false,
                    "x": "100",
                    "y": "100",
                    "name": "",
                    "scale": "3",
                    "loop": true
                },
                gameCont:null,
                 radioNum:'2',
                choice:[
                {
                    "key_name": "选项1",
                    "key_num": ""
                }, {
                    "key_name": "选项2",
                    "key_num": ""
                }, {
                    "key_name": "选项3",
                    "key_num": ""
                }
                ],
            }
        },
        props: [
            "allData",
            "gameData",
            "resourceData",
            "item",
            "index",
            "tabShowStatus"
        ],
        created(){
          this.gameCont = this.item.option;
       
        },
        mounted() {
        },
        methods: {
            setElementStatus(index,name,type,obj,e){
                let box =stage.getChildByName('GAME').getChildByName('GAME'+index).getChildByName('componentContainer');
                if(box&&box.getChildByName(name)){
                    switch (type) {
                        case 'left':
                            if(parseFloat(e)<0||parseFloat(e)>1920){
                                this.$message({
                                type: 'error',
                                message: '输入数值超出范围，应为0-1920'
                                });
                                break
                            }
                            box.getChildByName(name).x = e==''?0:parseFloat(e);
                            break;
                        case 'top':
                            if(parseFloat(e)<0||parseFloat(e)>1920){
                                this.$message({
                                type: 'error',
                                message: '输入数值超出范围，应为0-1920'
                                });
                                break
                            }
                            box.getChildByName(name).y = e==''?0:parseFloat(e);
                            break;
                        case 'width':
                            box.getChildByName(name).width = e==''?0:parseFloat(e);
                            obj.image.radio?box.getChildByName(name).height = (parseFloat(e)/obj.image.radio).toFixed(2):"";
                            obj.image.radio?obj.image.height = (parseFloat(e)/obj.image.radio).toFixed(2):"";
                            break;
                        case 'height':
                            box.getChildByName(name).height = e==''?0:parseFloat(e);
                            obj.image.radio?box.getChildByName(name).width = (parseFloat(e)*obj.image.radio).toFixed(2):"";
                            obj.image.radio?obj.image.width = (parseFloat(e)*obj.image.radio).toFixed(2):"";
                            break;
                        case 'scale':
                            let value = e==''?0:parseFloat(e);
                            box.getChildByName(name).scale.set(value);
                            break;
                        case 'text':
                            let text = e == ''?'':e;
                            box.getChildByName(name).children[0].children[0].text = text;
                            box.getChildByName(name).children[0].children[0].style.fill = '#ff9a00';
                            box.getChildByName(name).children[0].children[0].style.fontSize = '46px';
                            box.getChildByName(name).children[0].children[0].style.strokeThickness = 5;
                            box.getChildByName(name).children[0].children[0].style.stroke = '#F7EDCA';

                            // console.log(box.getChildByName(name));
                            break;
                        case 'text1':
                            let text1 = e == ''?'':e;
                            box.getChildByName(name).children[0].children[0].text = text1;
                            // console.log(box.getChildByName(name).children[0].children[0])
                            box.getChildByName(name).children[0].children[0].style.fill = '#F7EDCA';
                            box.getChildByName(name).children[0].children[0].style.fontSize = '46px';
                            box.getChildByName(name).children[0].children[0].style.strokeThickness = 0;
                            break;
                        default:
                            break;
                    }
                }
            },
            addOrDelete(index,item,e){
                console.log(index,item,e);
            },
             tabShow_child(index){
                
                let title = this.$refs.gameCont[index];
                let fish_item = this.$refs.gameHy[index];

                if(title.getAttribute("data-off") == "true"){
                    title.className = 'el-icon-arrow-right';
                    fish_item.style.display = 'none';
                    title.setAttribute("data-off","false");
                }else{
                    title.className = 'el-icon-arrow-down';
                    fish_item.style.display = 'block';
                    title.setAttribute("data-off","true")
                   
                }
            },
            setImageLock(){
                this.image.lock = !this.image.lock;
                if(!this.image.height||!this.image.width){
                    this.$message({
                        message: 'X或Y为0或为空 无法计算比例',
                        type: 'warning'
                    });
                    return;
                }
                if(this.image.lock){
                    this.image.ratio = this.image.width/this.image.height;
                }
            },
            setAttr(name,attr){
                if(this.image.ratio>0&&(attr === 'width'||attr === 'height')&&this.image.lock){
                    if(attr === 'width'){
                        console.log(this.image.width,this.image.ratio);
                        this.image.height = this.image.width/this.image.ratio;
                    }else if(attr === 'height'){
                        this.image.width = this.image.height*this.image.ratio;
                    }
                }
            },
            tabShow(index, name) {
                let title = this.$refs[name + 'Title'];
                let nameTab = this.tabShowStatus[index].child[name];
                if (nameTab) {
                    this.tabShowStatus[index].child[name] = false;
                    title.className = 'el-icon-arrow-right'
                } else {
                    Object.keys(this.tabShowStatus[index].child).forEach((item, index1) => {
                        this.tabShowStatus[index].child[item] = false
                    })
                    this.tabShowStatus[index].child[name] = true;
                    title.className = 'el-icon-arrow-down'
                }
            },
            verifyAnimationFiles(filesArr) {
                let arr = Object.values(filesArr).map((item, index) => item.name);
                let extArr = [];
                let nameArr = arr.map((item)=>{
                    extArr.push(item.split('.')[1]);
                    return item.split('.')[0]
                });
                let extArrString = extArr.sort((a,b)=>a.length-b.length).toString();
                let extTestArrString = ["png", "json", "atlas"].toString();
                let testName = nameArr[0];
                let nameStatus = nameArr.every((item,index)=>{
                    return testName === item
                });
                let extStatus = extArrString === extTestArrString;
                return nameStatus&&extStatus;
            },
            verifySpriteFiles(filesArr) {
                let arr = Object.values(filesArr).map((item, index) => item.name);
                let extArr = [];
                let nameArr = arr.map((item)=>{
                    extArr.push(item.split('.')[1]);
                    return item.split('.')[0]
                });
                let extArrString = extArr.sort((a,b)=>a.length-b.length).toString();
                let extTestArrString = ["png", "json"].toString();
                let testName = nameArr[0];
                let nameStatus = nameArr.every((item,index)=>{
                    return testName === item
                });
                let extStatus = extArrString === extTestArrString;
                return nameStatus&&extStatus;
            },
            uploadImage(name, e) {
                let ext = e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1];
                let extArr = ['jpg', 'png'];
                if (extArr.indexOf(ext) === -1) {
                    this.$message({
                        message: '上传类型不符',
                        type: 'error'
                    });
                    return;
                }
                if (e.target.files.length === 0) {
                    this.$message({
                        message: '上传文件个数不符合',
                        type: 'warning',
                    });
                    return;
                }
                this.$http.post('/uploadingImage',
                    {
                        image: e.target.files[0]
                    },
                    {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                ).then((res) => {
                    this.image.name = res.resourceName;
                    this.image.width = res.width;
                    this.image.height = res.height;
                    this.updateResourceData();
                    e.target.value = '';
                })
            },
            uploadAnimation(name, e) {
                if (e.target.files.length === 0 || e.target.files.length !== 3){
                    this.$message({
                        message: '上传文件个数不符合',
                        type: 'warning',
                    });
                    return;
                }
                if(!this.verifyAnimationFiles(e.target.files)){
                    this.$message({
                        message: '上传文件不符合',
                        type: 'warning',
                    });
                    return;
                }
                let object = {};
                let type = 'Animate';
                let files = Object.values(e.target.files);
                files.forEach((item, index) => {
                    object['animation' + (index + 1)] = item;
                });
                this.$http.post('/uploadingAnimation', object, {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                ).then((res) => {
                    this.animate.name = res.resourceName;
                    e.target.value = '';
                })
            },
            uploadSprite(name, e) {
                if (e.target.files.length === 0 || e.target.files.length !== 2) {
                    this.$message({
                        message: '上传文件个数不符合',
                        type: 'warning',
                    });
                    return;
                }
                if(!this.verifySpriteFiles(e.target.files)){
                    this.$message({
                        message: '上传文件不符合',
                        type: 'warning',
                    });
                    return;
                }
                let object = {};
                let files = Object.values(e.target.files);
                files.forEach((item, index) => {
                    object['sprite' + (index + 1)] = item;
                });
                console.log(object);
                this.$http.post('/uploadingSprite', object, {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                ).then((res) => {
                    this.sprite.name = res.resourceName;
                    e.target.value = '';
                })
            },
            uploadAudio(name,e) {
                let ext = e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1];
                let extArr = ['mp3', 'wav'];
                if (extArr.indexOf(ext) === -1) {
                    this.$message({
                        message: '上传类型不符',
                        type: 'error'
                    });
                    return;
                }
                if (e.target.files.length === 0) {
                    this.$message({
                        message: '上传文件个数不符合',
                        type: 'warning',
                    });
                    return;
                }
                this.$http.post('/uploadingAudio',
                    {audio: e.target.files[0]}, {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }
                ).then((res) => {
                    this.audio_name = res.resourceName;
                    e.target.value = '';
                })
            },
            updateResourceData() {
                this.$emit('updateResourceData')
            },
        }
    }
</script>
<style scoped lang="scss">
 .option-item {
        border-top:1px solid #ccc;
        overflow: hidden;
        width: 100%;
        margin-top: 15px;
        float: left;
        &:nth-of-type(1){
            border: none;
        }
    }
    .game-icon {
        height: 40px;
        line-height: 40px;
        color: #fff;
        float: left;
        width: 100%;
    }
    .audio-title{
        margin-top: 15px;
        margin-bottom: 0;
        float: left;
        padding: 0 5px;
    }
    .option-animate{
        color: #eee;
        border-bottom: 1px solid #ccc;
        margin-bottom: 15px;
        padding-bottom: 10px;
        overflow: hidden;
        .option-animate-radio{
            >label{
                margin: 5px 0;
            }
        }
        .option-animate-title{
            margin-bottom: 15px;
            margin-top: 10px;
            border-left: 4px solid #eee;
            padding-left: 10px;
            height: 16px;
            line-height: 16px;
        }
        .option-animate-radio{
            margin: 5px 0;
            >label{
                width: 50%;
            }
        }
    }
    .option-audio{
        color: #eee;
        .option-audio-title{
            margin-bottom: 10px;
            margin-top: 10px;
            border-left: 4px solid #eee;
            padding-left: 10px;
            height: 16px;
            line-height: 16px;
        }
        .option-audio-inner{
            padding-left: 15px;
        }
    }
</style>