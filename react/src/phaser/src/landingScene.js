
import Phaser from "phaser";
import logoAnim from "../assets/sprites/logo_4X19.png";
import logo from "../assets/sprites/logo.png";
import gameConfig from "./gameConfig.js";
import DungeonData from "./DungeonData.js";
import config from "../../config.js";
import mapData from "./map.json";
import ErrorPopup from "./ErrorPopup.js";
import btnClick from "../assets/Sounds/btnClick.wav";





export default class landingScene extends Phaser.Scene {
    constructor() {
        super('landingScene');
    }
    preload() {
        this.load.image("logo", logo);
        this.load.spritesheet("logoAnim", logoAnim, 
        {
            "frameWidth" : 450,
            "frameHeight" : 469,
            "endFrame" : 73
        });
        this.load.json("mapData", mapData);

        this.load.audio("btnClick", btnClick);

        

    }
    create() {

        this.animationComplete = false;
        this.callBackRecieved = false;

        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.centerY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        
        this.anims.create({
            key: 'playLogoAnim',
            frames: this.anims.generateFrameNumbers('logoAnim', { start: 0, end: 72}),
            frameRate: 35,
            repeat: 0
        });

        this.logoAnim = this.add.sprite(this.centerX, this.centerY, 'logoAnim').play('playLogoAnim');
        var logo = this.add.image(this.centerX, this.centerY, 'logo');

        var desiredHeight = (this.cameras.main.height * 0.25);
        var logoRatio = desiredHeight / logo.height;
        logo.setScale(logoRatio);

        desiredHeight  = (this.cameras.main.height * 0.5);
        var logoAnimRatio = desiredHeight / this.logoAnim.height;
        this.logoAnim.setScale(logoAnimRatio);

        this.logoAnim.y = this.centerY - (this.logoAnim.height * 0.25 * logoAnimRatio);
        logo.y = this.logoAnim.y + (this.logoAnim.height * 0.5 * logoAnimRatio) + (logo.height * 0.5 * logoRatio);

        

        var background = new Phaser.Display.Color(0, 44, 43);
        this.cameras.main.setBackgroundColor(background);

        var popupConfig = { 
            scene : this,
            test : 'blank'};
        this.errorPopup = new ErrorPopup(popupConfig);
        this.errorPopup.setDepth(20);
        this.errorPopup.setVisible(false);

        //START REQUEST TO ETHERIUM WALLET
        const req = new XMLHttpRequest();
        req.addEventListener("load", this.reqListener, this);
        req.open("GET", config.IPCDB_WEB3_PROVIDER + "/getNFTs?owner=" + gameConfig.currentAddress + "&contractAddresses[]=" +config.IPCDB_WEB3_CONTRACTADDR);
        gameConfig.currentScene = this;
        req.send();
    

        this.logoAnim.on(Phaser.Animations.Events.ANIMATION_COMPLETE,
            function () {
                this.logoAnim.anims.stop();
                this.animationComplete = true;
                this.updateSceneEnd(null);
        
                // this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                //     // var data = {
                //     //     "loadScene" : "form"
                //     // };
                //     // this.scene.start('dungeon', null);
                //     //this.scene.start('loading');
                //     //this.scene.start('testing', { i : 0});
                //     gameConfig.currentScene = this;
                // });
        }, this);

    }

    updateSceneEnd(params)
    {
        if(params != null)
        {
            this.params = params;
        }
        if(this.animationComplete && this.callBackRecieved)
        {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            //load next scene
            this.scene.start('dungeon', this.params);
        }
    }

    async reqListener() 
    {
        var result;
        var params;
        var ownedIPCs = [];
        //CHECK IF REPONSE IS JSON
        if(!isValidJSON(this.responseText))
        {
            gameConfig.currentScene.errorPopup.setText("Sorry, something went wrong. Please try again later.");
            gameConfig.currentScene.errorPopup.setVisible(true);
        }
        else
        {
            // PARSE JSON
            result = JSON.parse(this.responseText);
            
            // GET ALL IPCs
            for(var i = 0; i < result['ownedNfts'].length; i++)
            {
                // CHECK IF SMART CONTRACT MATCHES
                //if(result['ownedNfts'][i]['contract']['address'].localeCompare(gameConfig.contractAdress) == 0)
                {
                    // PARSING IPC ID FROM HEX
                    ownedIPCs.push(parseInt(result['ownedNfts'][i]['id']['tokenId'], 16));
                }
            }
            // CHECK IF IPCs EXIST IN WALLET
            if(ownedIPCs.length == 0)
            {
                gameConfig.currentScene.errorPopup.setText("This wallet address doesn't own any NFT Immortal Player Characters. Please make sure you have the correct wallet address or acquire NFTs to access Immortal Player Characters.");
                gameConfig.currentScene.errorPopup.setVisible(true);
            }
            else
            {
                params = {
                    dungeonAddress: gameConfig.currentAddress.toUpperCase(),
                    levels: gameConfig.currentAddress.toUpperCase().match(/.{1,2}/g),
                    ownedIPCs : ownedIPCs,
                    currentIndex: 0,
                    firstLoad: true
                };  
        
                //TO REMOVE 0x
                params.levels.shift();
                
                params["dungeonData"] = new DungeonData(this, params.levels);
                
                gameConfig.currentScene.callBackRecieved = true;
                gameConfig.currentScene.updateSceneEnd(params);
            }
        }
      }

    

}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

const isValidJSON = obj => {
    try {
      JSON.parse(obj);
      return true;
    } catch (e) {
      return false;
    }
  };