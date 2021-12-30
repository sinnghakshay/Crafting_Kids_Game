
import { _decorator, Component, Node, UITransform, JsonAsset, EventTouch, js, Vec3, AudioClip, AudioSource } from 'cc';
import { ConstantCR } from './ConstantCR';
import { GameManager } from './GameManager';
import { LevelSelection } from './LevelSelection';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ParsingData
 * DateTime = Thu Dec 16 2021 15:25:40 GMT+0530 (India Standard Time)
 * Author = irshad
 * FileBasename = ParsingData.ts
 * FileBasenameNoExtension = ParsingData
 * URL = db://assets/Scripts/ParsingData.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('ParsingData')
export class ParsingData extends Component {

    @property(JsonAsset)
    LevelJson: JsonAsset[] = [];
    public GamePlayData: Array<object> = [];
    public MatchingImgData: Array<object> = [];
    public RefrenceImg: Array<object> = [];
    @property(Node)
    GameManager_: Node = null;
    @property(Node)
    Levelmenu: Node = null;
    AudioObj: AudioSource = null;
    start() {
        if (this.AudioObj == null) {
            this.AudioObj = new AudioSource();
        }
    }

    LevelSelection(event: EventTouch, customData: string) {
        this.Levelmenu.getComponent(LevelSelection).StopAudio();
        let selectedLevelIndx: number = parseInt(customData);
        if (selectedLevelIndx > this.LevelJson.length) {
            selectedLevelIndx = 1;
        }
        ConstantCR.CurrentLevel = selectedLevelIndx;
        let JsonObj = this.LevelJson[selectedLevelIndx - 1].json["LevelData"]["params"];
        console.log("PARSING DATA JSON OBJ< LEVEL JSON",JsonObj, this.LevelJson[selectedLevelIndx - 1])
        if (JsonObj) {
            this.Levelmenu.active = false;
            this.GameManager_.active = true;
            this.FetchJsonData(JsonObj);
            if (ConstantCR.ReferImgData && ConstantCR.MatchingImgData && ConstantCR.GamePlayData) {
                this.GameManager_.getComponent(GameManager).LoadGame();
            }
        } else {
            console.log("problem in data fetching");
        }
    }
    FetchJsonData(JsonObj: Array<object>) {

        let WidthConst: number = 1.25;
        let HeightConst: number = 0.9375;
        let XanchorConst: number = 640;
        let YanchorConst: number = 360;
        for (var i = 0; i < JsonObj.length; i++) {
            if (JsonObj[i].hasOwnProperty("_tagtype")) {
                if (parseInt(JsonObj[i]["_tagtype"]) >= 1 && parseInt(JsonObj[i]["_tagtype"]) < 30) {
                    let posX: number = (parseInt(JsonObj[i]["_posx"]) * WidthConst) - XanchorConst;
                    let posY: number = (parseInt(JsonObj[i]["_posy"]) * HeightConst) - YanchorConst;
                    let ImgName: string = JsonObj[i]["_filename"];
                    let Order: number = parseInt(JsonObj[i]["_order"]);
                    let TagType: number = parseInt(JsonObj[i]["_tagtype"]);
                    let XY_pos: Vec3 = new Vec3(posX, posY, 0);
                    let GameData = {
                        XY_pos: XY_pos,
                        ImgName: ImgName,
                        Order: Order,
                        TagType: TagType,
                    }
                    this.GamePlayData.push(GameData);
                    GameData = null;
                }
                if (parseInt(JsonObj[i]["_tagtype"]) >= 31) {
                    let posX: number = ((parseInt(JsonObj[i]["_posx"])) + 200) - 640; //* WidthConst) - XanchorConst;
                    let posY: number = ((parseInt(JsonObj[i]["_posy"])) - 24) - 360;  //* HeightConst) - YanchorConst;
                    let ImgName: string = JsonObj[i]["_filename"];
                    let Order: number = parseInt(JsonObj[i]["_order"]);
                    let TagType: number = parseInt(JsonObj[i]["_tagtype"]);
                    let XY_pos: Vec3 = new Vec3(posX, posY, 0);
                    let ImgMatchDataData = {
                        XY_pos: XY_pos,
                        ImgName: ImgName,
                        Order: Order,
                        TagType: TagType,
                    }
                    this.MatchingImgData.push(ImgMatchDataData);
                    ImgMatchDataData = null;
                }
                if (parseInt(JsonObj[i]["_tagtype"]) <= 0) {
                    let posX: number = (parseInt(JsonObj[i]["_posx"]) * WidthConst) - XanchorConst;
                    let posY: number = (parseInt(JsonObj[i]["_posy"]) * HeightConst) - YanchorConst;
                    let ImgName: string = JsonObj[i]["_filename"];
                    let Order: number = parseInt(JsonObj[i]["_order"]);
                    let TagType: number = parseInt(JsonObj[i]["_tagtype"]);
                    let XY_pos: Vec3 = new Vec3(posX, posY, 0);
                    let Refrening = {
                        XY_pos: XY_pos,
                        ImgName: ImgName,
                        Order: Order,
                        TagType: TagType,
                    }
                    this.RefrenceImg.push(Refrening);
                }
            }

        }

        WidthConst = null;
        HeightConst = null;




        if (this.MatchingImgData && this.RefrenceImg && this.GamePlayData) {
            ConstantCR.GamePlayData = this.GamePlayData;
            ConstantCR.Num_Of_Shapes = this.GamePlayData.length;
            ConstantCR.MatchingImgData = this.MatchingImgData;
            ConstantCR.ReferImgData = this.RefrenceImg;
            this.GamePlayData = [];
            this.MatchingImgData = [];
            this.RefrenceImg = [];
        }

        console.log(ConstantCR.GamePlayData, ConstantCR.MatchingImgData, ConstantCR.ReferImgData)
    }

    @property(AudioClip)
    SelectAudio: AudioClip = null;
    SelectAudioPLay() {
        if (this.SelectAudio) {
            this.AudioObj.playOneShot(this.SelectAudio, 1);
        }
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
