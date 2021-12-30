
import { _decorator, Component, Node, AudioClip } from 'cc';
import { ConstantCR } from './ConstantCR';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Home
 * DateTime = Wed Dec 22 2021 17:07:17 GMT+0530 (India Standard Time)
 * Author = irshad
 * FileBasename = Home.ts
 * FileBasenameNoExtension = Home
 * URL = db://assets/Scripts/Home.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('Home')
export class Home extends Component {
    

    start () {
        // [3]
    }
    @property(AudioClip)
    GamePlayAudio: AudioClip = null;
    onEnable(){
        ConstantCR.BackGroundMusic(this.GamePlayAudio, true)
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
