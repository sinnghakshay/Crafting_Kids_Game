
import { _decorator, Component, Node, JsonAsset, SpriteFrame, Sprite, SpriteAtlas, rect, Vec3, EventTouch, Vec2, Rect, UITransform, UIOpacity, Prefab, instantiate, director, Director, Game, tween, Tween, Button, AudioClip, math, AudioSource } from 'cc';
import { ConstantCR } from './ConstantCR';
import { ParsingData } from './ParsingData';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameManager
 * DateTime = Sat Dec 18 2021 15:30:44 GMT+0530 (India Standard Time)
 * Author = irshad
 * FileBasename = GameManager.ts
 * FileBasenameNoExtension = GameManager
 * URL = db://assets/Scripts/GameManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('GameManager')
export class GameManager extends Component {
    public static _instance: GameManager = null;
    @property(SpriteFrame)
    BackGround: SpriteFrame[] = [];
    @property(SpriteAtlas)
    LevelSpriteAtles: SpriteAtlas[] = [];
    @property(Node)
    RefremceImgNode: Node = null;
    @property(Node)
    DottedImgNode: Node = null;
    @property(Node)
    GamePlayImgCont: Node = null;
    @property(Node)
    MatchingImgCont: Node = null;
    MatchedShapeS: number = 0;
    @property(Node)
    parsingData: Node = null;
    @property(Prefab)
    HintHand: Prefab = null;
    firstPlay: boolean = true;

    AudioSourceObj: AudioSource = null;

    start() {

    }
    LoadGame() {
        if (this.AudioSourceObj == null) {
            this.AudioSourceObj = new AudioSource();
        }
        ConstantCR.StopAudio();
        if (ConstantCR.ReferImgData) {
            this.setGamePlayScreen(ConstantCR.ReferImgData);
        }
        if (ConstantCR.GamePlayData && ConstantCR.MatchingImgData) {
            if (this.firstPlay) {
                this.HintAudioPlay();
                this.ShowHint();
                this.firstPlay = false;
            }
            this.SortingGamePlayData(ConstantCR.GamePlayData);
            this.GenerateGamePlayImg(ConstantCR.GamePlayData, this.GamePlayImgCont);
            this.GenerateGamePlayImg(ConstantCR.MatchingImgData, this.MatchingImgCont);
            this.SetOpacityMatchingNode(this.MatchingImgCont);

        }
    }
    SortingGamePlayData(GamePlayData) {
        for (var i = 0; i < GamePlayData.length; i++) {
            for (var j = i; j < GamePlayData.length; j++) {
                if (GamePlayData[i]["Order"] > GamePlayData[j]["Order"]) {
                    let Temp = GamePlayData[i];
                    GamePlayData[i] = GamePlayData[j];
                    GamePlayData[j] = Temp;
                    Temp = null;
                }
            }
        }
    }
    HintHAnd_: Node = null;
    ShowHint() {
        this.HintHAnd_ = instantiate(this.HintHand);
        this.node.addChild(this.HintHAnd_);
        let Ary: Array<Vec3> = [];
        let ActionAry: Tween<Node>[] = [];
        for (var i = 0; i < ConstantCR.GamePlayData.length; i++) {
            let InitPos: Vec3 = ConstantCR.GamePlayData[i]["XY_pos"];
            Ary.push(InitPos);
            let FinalPos: Vec3 = ConstantCR.MatchingImgData[i]["XY_pos"];
            Ary.push(FinalPos);
        }

        if (Ary.length > 0) {
            for (var j = 0; j < Ary.length; j++) {
                let Action = tween(this.HintHAnd_).to(1, { position: Ary[j] }).delay(0.5);
                ActionAry.push(Action);
            }
        }

        if (ActionAry.length > 0) {
            tween(this.HintHAnd_).sequence(...ActionAry)
                .delay(0.2)
                .call(() => {
                    if (this.HintHAnd_) {
                        this.destroyHintNode(this.HintHAnd_)
                    }
                    Ary = [];
                    ActionAry = [];
                })
                .start();
        }

    }
    destroyHintNode(HintHand: Node) {
        if (HintHand.name != '') {
            HintHand.destroy();
            HintHand = null;
        }
    }
    SetOpacityMatchingNode(MatchingP_node: Node) {
        MatchingP_node.children.forEach((item, indx) => {
            // item.addComponent(UIOpacity);
            // item.getComponent(UIOpacity).opacity = 100;
            // // item.getComponent(UITransform).enabled = false;
            item.active = false;
        })
    }

    setGamePlayScreen(RefImgData: Array<object>) {
        this.setBackGround(RefImgData[1]["ImgName"]);
        this.GenerateRefrenceImg(RefImgData[0]["ImgName"], this.RefremceImgNode, RefImgData[0]["XY_pos"]);
        this.GenerateRefrenceImg(RefImgData[3]["ImgName"], this.DottedImgNode, RefImgData[3]["XY_pos"]);

    }

    setBackGround(ImgName: string) {
        let BgImdx: number = parseInt(ImgName.split(".")[0].charAt(ImgName.split(".")[0].length - 1))
        if (BgImdx != null) {
            this.node.getComponent(Sprite).spriteFrame = this.BackGround[BgImdx - 1];
        }
    }

    GenerateRefrenceImg(ImgName: string, RecNode: Node, posData: Vec3) {
        for (var i = 0; i < this.LevelSpriteAtles.length; i++) {
            if (this.LevelSpriteAtles[i].getSpriteFrame(ImgName)) {
                let img: SpriteFrame = this.LevelSpriteAtles[i].getSpriteFrame(ImgName);
                RecNode.getComponent(Sprite).spriteFrame = img;
                RecNode.setPosition(posData);
            }
        }
    }

    GenerateGamePlayImg(ImgData: Array<object>, ParentNode: Node) {
        for (var i = 0; i < ImgData.length; i++) {
            let GenNode = this.generateNode(ImgData[i]["ImgName"], ParentNode);
            if (GenNode) {
                this.AddSprite_Pos(GenNode, ImgData[i]);
            }
        }
    }

    AddSprite_Pos(genNode: Node, imgdata: object) {
        for (var i = 0; i < this.LevelSpriteAtles.length; i++) {
            if (this.LevelSpriteAtles[i].getSpriteFrame(genNode.name)) {
                let img: SpriteFrame = this.LevelSpriteAtles[i].getSpriteFrame(genNode.name);
                genNode.getComponent(Sprite).spriteFrame = img;
                genNode.setPosition(imgdata["XY_pos"]);
                genNode.attr({ TagType: imgdata["TagType"] });
            }
        }
    }

    generateNode(NodeName: string, ParentNode: Node): Node {
        let _node = new Node(NodeName);
        _node.layer = ParentNode.layer;
        _node.addComponent(Sprite);
        ParentNode.addChild(_node);
        /* adding clickEvents */
        if (ParentNode == this.GamePlayImgCont) {
            this.TouchEvents(_node);
        }

        return _node;
    }

    TouchEvents(_node: Node) {
        _node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        _node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        _node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    SelectedNodePos: Vec3;
    onTouchStart(event: EventTouch) {
        /* setting starting pos of node */
        let _Location: Vec2 = event.getUILocation();
        let SelectedNode: Node = event.target as Node;
        this.SelectedNodePos = SelectedNode.getPosition();
        SelectedNode.setPosition(_Location.x - 640, _Location.y - 360, 0);
        this.MatchingImgCont.getChildByName(SelectedNode.name).setSiblingIndex(this.MatchingImgCont.children.length);
        this.destroyHintNode(this.HintHAnd_);
    }

    onTouchMove(event: EventTouch) {
        /* setting Moving pos of node */
        let _Location: Vec2 = event.getUILocation();
        let SelectedNode: Node = event.target as Node;
        SelectedNode.setPosition(_Location.x - 640, _Location.y - 360, 0);
        let Intracted: object = this.checkNodePlaced(SelectedNode);

    }

    onTouchEnd(event: EventTouch) {
        let SelectedNode: Node = event.target as Node;
        let Intracted: Node = this.checkNodePlaced(SelectedNode);

        if (Intracted) {
            this.CheckTagType(Intracted, SelectedNode);
        } else {
            this.SetDefaultLocation(SelectedNode);
        }
        //this.MatchingImgCont.getChildByName(SelectedNode.name).active = false;
    }

    checkNodePlaced(SelectedNode: Node): Node {
        let CurNode_Rect: Rect = SelectedNode.getComponent(UITransform).getBoundingBox();
        let IntercetNode: Node = null;
        for (var i = 0; i < this.MatchingImgCont.children.length; i++) {
            let _rect: Rect = this.MatchingImgCont.children[i].getComponent(UITransform).getBoundingBox();
            if (CurNode_Rect.intersects(_rect)) {
                IntercetNode = this.MatchingImgCont.children[i];
            }
        }
        return IntercetNode;
    }

    CheckTagType(Intracted: Node, SelectedNode: Node) {

        if (Intracted != null) {
            if (parseInt(Intracted["TagType"]) == parseInt(SelectedNode["TagType"]) + 30) {
                if (Intracted.hasOwnProperty("Matched")) {
                    this.SetDefaultLocation(SelectedNode);
                } else {
                    let _Matched = { Matched: true };
                    Intracted.attr(_Matched);
                    SelectedNode.setPosition(Intracted.getPosition());
                    this.removeTouchEvents(SelectedNode);
                    this.MatchedShapeS++;
                    this.SetttleParticle(SelectedNode);
                    if (this.SetAudio) {
                        this.AudioSourceObj.playOneShot(this.SetAudio, 1);
                    }
                    this.RightAudioPlay();
                    this.checkAllPicMatched();
                }
            } else {
                this.SetDefaultLocation(SelectedNode);
            }
        } else {
            this.SetDefaultLocation(SelectedNode);
        }
    }

    SetDefaultLocation(SelectedNode: Node) {
        this.WrongAudioPlay();
        tween(SelectedNode).to(0.8, { position: this.SelectedNodePos })
            .start();
    }

    @property(Node)
    LevelCompleteSprite: Node = null;
    checkAllPicMatched() {

        if (this.MatchedShapeS == ConstantCR.Num_Of_Shapes) {
            this.OrignalReferImgShow()
        }
    }
    @property(Prefab)
    ExplosionParticle: Prefab = null;
    @property(Node)
    ParticlNode: Node = null;
    OrignalReferImgShow() {
        this.GamePlayImgCont.active = false;
        let ImgName: string = (ConstantCR.ReferImgData[2]["ImgName"]).toString().split(".")[0];
        for (var i = 0; i < this.LevelSpriteAtles.length; i++) {
            if (this.LevelSpriteAtles[i].getSpriteFrame(ImgName)) {
                let img: SpriteFrame = this.LevelSpriteAtles[i].getSpriteFrame(ImgName);
                this.DottedImgNode.getComponent(Sprite).spriteFrame = img;
                break;
            }
        }
        if (ImgName) {
            let ExpPar = instantiate(this.ExplosionParticle);
            this.ParticlNode.setPosition(this.DottedImgNode.getPosition());
            this.ParticlNode.addChild(ExpPar);
        }
        tween(this.DottedImgNode).to(1.5, { scale: new Vec3(1.2, 1.2, 1.2) })
            .call(() => {
                this.LevelChangeBAckGround()
            })
            .start();
    }
    LevelChangeBAckGround() {
        this.LevelCompleteSprite.active = true;
        tween(this.LevelCompleteSprite.getComponent(UIOpacity)).to(2, { opacity: 255 })
            .call(() => {
                this.LevelCompleted();
            })
            .start();
    }

    removeTouchEvents(_node: Node) {
        _node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        _node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        _node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    @property(Prefab)
    SettleParticle: Prefab = null;
    SetttleParticle(SettleNode: Node) {
        let Particle_ = instantiate(this.SettleParticle);
        SettleNode.addChild(Particle_);
    }

    LevelCompleted() {
        this.ResetValues();
        let Event: EventTouch;
        this.node.children[0]
        this.parsingData.getComponent(ParsingData).LevelSelection(Event, (++ConstantCR.CurrentLevel).toString());
    }
    ResetValues() {
        this.GamePlayImgCont.active = true;
        this.DottedImgNode.setScale(1, 1, 1);
        this.MatchedShapeS = 0;
        ConstantCR.GamePlayData = [];
        ConstantCR.MatchingImgData = [];
        ConstantCR.ReferImgData = [];
        ConstantCR.Num_Of_Shapes = 0;
        this.GamePlayImgCont.destroyAllChildren();
        this.GamePlayImgCont.removeAllChildren();
        this.MatchingImgCont.destroyAllChildren();
        this.MatchingImgCont.removeAllChildren();
        this.LevelCompleteSprite.active = false;
    }

    @property(Node)
    LevelselectionNode: Node = null;
    Back(event: Button, customData: string) {
        this.ResetValues();
        this.destroyHintNode(this.HintHAnd_);
        this.LevelselectionNode.active = true;
        this.node.active = false;
    }

    Home(event: Button, customData: string) {
        this.ResetValues();
        this.destroyHintNode(this.HintHAnd_);
        this.LevelselectionNode.active = true;
        this.node.active = false;
    }

    @property(AudioClip)
    WrongAudio: AudioClip[] = [];

    @property(AudioClip)
    RightAudio: AudioClip[] = [];

    @property(AudioClip)
    HintAudio: AudioClip[] = [];

    @property(AudioClip)
    SetAudio: AudioClip = null;

    WrongAudioPlay() {
        console.log(this.AudioSourceObj, 'wrong')
        let Random = Math.floor(Math.random() * this.WrongAudio.length);
        if (this.AudioSourceObj)
            this.AudioSourceObj.playOneShot(this.WrongAudio[Random]);
    }
    RightAudioPlay() {
        console.log(this.AudioSourceObj, 'Rhint')
        let Random = Math.floor(Math.random() * this.WrongAudio.length);
        if (this.AudioSourceObj)
            this.AudioSourceObj.playOneShot(this.RightAudio[Random]);
    }
    HintAudioPlay() {
        console.log(this.AudioSourceObj, 'hint')
        let Random = Math.floor(Math.random() * this.WrongAudio.length);
        if (this.AudioSourceObj)
            this.AudioSourceObj.playOneShot(this.HintAudio[Random]);
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
