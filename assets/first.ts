
import { _decorator, Component, Node, assetManager, director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = first
 * DateTime = Tue Dec 28 2021 17:01:45 GMT+0530 (India Standard Time)
 * Author = prajwal_ramappa
 * FileBasename = first.ts
 * FileBasenameNoExtension = first
 * URL = db://assets/first.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('first')
export class first extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    onLoad () {
        assetManager.loadBundle("https://games-nlearn.s3.ap-south-1.amazonaws.com/package",(err,bundle)=>{
            if(err)
            {
                console.log("error");
                return;
            }
            console.log("bundle loaded successfully");

        })
    }
    click()
    {
        director.loadScene("MainScene");
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
