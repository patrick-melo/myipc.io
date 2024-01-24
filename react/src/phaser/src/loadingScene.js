
import Phaser from "phaser";
import DungeonData from "DungeonData.js"
import loadAssets from "../assets/loadAssets";
import loadAnim from '../assets/sprites/load.png';

export default class loadingScene extends Phaser.Scene {
    constructor() {
        super('loadingScene');
    }

    //DATA FROM FORM SCENE
    init(data) {
        // this.ownIPCs = data.ownedIPCs;
        // this.levels = data.levelData;
        // this.dungeonAddress = data.dungeonAddress;
        // this.currentIndex = data.index;

       this.inputData = data;

       this.createObjects = [];

    }

    preload() {
        
        // this.load.json('loadAssets', '../assets/loadAssets.json');
        this.load.spritesheet('loadAnim', loadAnim,  { frameWidth: 78, frameHeight: 78, endFrame:3 });//450, 469, 76);
        
        const timestamp_start = Date.now();
        //console.log(this.nextScene + " loading...");

        // this.loadAssets = this.cache.json.get('loadAssets');
        this.nextScene = !this.inputData.hasOwnProperty("loadScene") ? "landingScene" : this.inputData["loadScene"];
        for(var x in loadAssets[this.nextScene])
        {
            //console.log(x);
            var asset = loadAssets[this.nextScene][x];
            switch(asset.type)
            {
                case 'image':
                    this.load.image(x, asset.path);
                    break;
                case 'spritesheet':
                    this.load.spritesheet(x, asset.path, asset.data);
                    break;
                case 'json':
                    this.load.json(x, asset.path);
                    break;
                case 'html':
                    this.load.html(x, asset.path);
                    break;
                case 'audio':
                    this.load.audio(x, asset.path);
                    break;
                case 'object':
                    this.createObjects.push(x);
                    break;
                case 'minimaps':
                    for (var i in this.inputData.levelData)
                    {
                        this.load.image(
                            this.inputData.levelData[i],
                            asset.path + this.inputData.levelData[i] + '.jpg');
                    }
                    break;
                case 'ipcSprites':
                    for(var i in this.inputData.ownedIPCs)
                    {
                        var ipc = this.inputData.ownedIPCs[i];
                        this.load.spritesheet(ipc, asset.path + ipc + '.png', asset.data);
                    }
                    break;
                default:
                    alert("Unknown type!");
                    break;
            }  
        }

        const timestamp_end = Date.now();

        console.log(this.nextScene + " : " + (timestamp_end-timestamp_start) + " ms");

    }
    create() {

        var background = new Phaser.Display.Color(40, 40, 40);
        this.cameras.main.setBackgroundColor(background);

        this.cameras.main.fadeIn(100, 0, 0, 0);

        this.centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.anims.create({
            key: 'playLoadAnim',
            frames: this.anims.generateFrameNumbers('loadAnim', { start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });

        this.loadAnim = this.add.sprite(this.centerX, this.centerY, 'loadAnim').play('playLoadAnim');
        
        for(var x in this.createObjects)
        {
            switch(this.createObjects[x])
            {
                case "dungeonData":
                    if(!this.inputData.hasOwnProperty("dungeonData"))
                    {
                        this.inputData["dungeonData"] = new DungeonData(this, this.inputData.levelData);
                    }
                    break;
                default:
                    alert("Unknown object!");
                    break;
            }
        }

        this.cameras.main.fadeOut(900, 0, 0, 0);
        
        var timedEvent = this.time.addEvent(
            { delay: 1000, callback: this.onEvent, callbackScope: this });

        
        // if (this.ifMapNotValid()) {
        //     return;
        // }

        // this.dungeonData = new DungeonData(this, this.levels);


       //add loading animation here
    }

    onEvent() {
        this.scene.start(this.nextScene, this.inputData);
    }

    ifMapNotValid() {
        var i = 0;
        while (i < 20) 
        {
            if (this.cache.json.get('mapData')[this.levels[i]] == null) 
            {
                console.log("Map not found : " + this.levels[i]);
                return true;
            }
            i++;
        }
        return false;
    }

}
