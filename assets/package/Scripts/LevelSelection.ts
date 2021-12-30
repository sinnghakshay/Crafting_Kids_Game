
import { _decorator, Component, Node, SpriteAtlas, Button, Sprite, EventTouch, Vec3, AudioClip, AudioSource } from 'cc';
import { ConstantCR } from './ConstantCR';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = LevelSelection
 * DateTime = Tue Dec 21 2021 09:49:17 GMT+0530 (India Standard Time)
 * Author = irshad
 * FileBasename = LevelSelection.ts
 * FileBasenameNoExtension = LevelSelection
 * URL = db://assets/Scripts/LevelSelection.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('LevelSelection')
export class LevelSelection extends Component {
    @property(SpriteAtlas)
    ButtonIcon: SpriteAtlas = null;
    @property(Node)
    PREVB: Node = null;
    @property(Node)
    NEXTB: Node = null;
    @property(Node)
    LevelsButton: Node = null;
    @property(AudioClip)
    GamePlayAudio: AudioClip = null;
    @property(AudioClip)
    WYLTP: AudioClip = null;
    AudioSourceObj: AudioSource = null;

    start() {

    }
    onEnable() {

        this.node.getComponent(AudioSource).play();
        ConstantCR.PlayMusic();
    }
    StopAudio() {
        if (this.node.getComponent(AudioSource).playing) {
            this.node.getComponent(AudioSource).stop()
        }
    }

    GenerateButtons() {
        if (ConstantCR.LevelSeletionPAgeStatus != null) {
            switch (ConstantCR.LevelSeletionPAgeStatus) {
                case 1:
                    this.UpdateButton(1, 9);
                    break;
                case 2:
                    this.UpdateButton(10, 18);
                    break;
                case 3:
                    this.UpdateButton(19, 27);
                    break;
                case 4:
                    this.UpdateButton(28, 36);
                    break;
                case 5:
                    this.UpdateButton(37, 45);
                    break;
            }
        }
    }
    UpdateButton(_Start: number, End: number) {
        this.LevelsButton.children.forEach((item, indx) => {
            item.getComponent(Sprite).spriteFrame = this.ButtonIcon.getSpriteFrame(_Start.toString());
            if (item.getComponent(Button)) {
                let CE = item.getComponent(Button).clickEvents[0];
                if (CE != null) {
                    CE.customEventData = _Start.toString();
                }
            }
            _Start++;
        })
    }
    NEXT(event: Button, customData: string) {
        if (ConstantCR.LevelSeletionPAgeStatus < 6)
            ConstantCR.LevelSeletionPAgeStatus++;
        if (ConstantCR.LevelSeletionPAgeStatus > 1) {
            this.PREVB.active = true;
        } if (ConstantCR.LevelSeletionPAgeStatus == 5) {
            this.NEXTB.active = false;
        }
        this.GenerateButtons();
    }
    PREV(event: Button, customData: string) {
        if (ConstantCR.LevelSeletionPAgeStatus > 0)
            ConstantCR.LevelSeletionPAgeStatus--;
        if (ConstantCR.LevelSeletionPAgeStatus < 2) {
            this.PREVB.active = false;
        }
        if (ConstantCR.LevelSeletionPAgeStatus < 5) {
            this.NEXTB.active = true;
        }
        this.GenerateButtons();
    }
    PlayGame(event: EventTouch, customData) {
        let _curNode = event.target as Node;
        _curNode.parent.active = false;
        this.node.active = true;
        this.playButtonAudio();
        this.GenerateButtons();
    }
    LevelButtonClick(event: EventTouch, customData: string) {
        console.log(customData)
    }

    BackClick(event: Button, customData: string) {
        this.ButtonClickAudio();
        this.node.active = false;
        this.node.parent.getChildByName("Home").active = true;
    }
    HomeClick(event: Button, customData: string) {
        this.ButtonClickAudio();
        this.node.active = false;
        this.node.parent.getChildByName("Home").active = true;
    }

    @property(AudioClip)
    ClickAudio: AudioClip = null;
    @property(AudioClip)
    PLayAudio: AudioClip = null;

    ButtonClickAudio() {
        if (this.ClickAudio)
            this.node.getComponent(AudioSource).playOneShot(this.ClickAudio)
    }
    playButtonAudio() {
        if (this.PLayAudio)
            this.node.getComponent(AudioSource).playOneShot(this.PLayAudio)
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
