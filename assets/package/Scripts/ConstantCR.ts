
import { _decorator, Component, Node, AudioSource, AudioClip, assert } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ConstantCR
 * DateTime = Sat Dec 18 2021 15:25:45 GMT+0530 (India Standard Time)
 * Author = irshad
 * FileBasename = ConstantCR.ts
 * FileBasenameNoExtension = ConstantCR
 * URL = db://assets/Scripts/ConstantCR.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('ConstantCR')
export class ConstantCR extends Component {
    public static GamePlayData: Array<object> = null;
    public static MatchingImgData: Array<object> = null;
    public static ReferImgData: Array<object> = null;
    public static LevelSeletionPAgeStatus: number = 1;
    public static Num_Of_Shapes: number;
    public static CurrentLevel: number;

    public static AudioPlayObj: AudioSource = new AudioSource();
    static BackGroundMusic(Audio: AudioClip, loop: boolean) {
        assert(AudioClip, "AudioClipNot Found");
        if (loop) {
            this.AudioPlayObj.loop = loop;
            this.AudioPlayObj.clip = Audio;
            this.AudioPlayObj.volume = 0.5;
            this.AudioPlayObj.play();
        }

    }
    static StopAudio() {
        this.AudioPlayObj.pause();
    }
    static PlayMusic() {
        if (this.AudioPlayObj.playing == false)
            this.AudioPlayObj.play();
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
