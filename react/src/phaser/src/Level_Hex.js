import Phaser from "phaser";

export default class Level_Hex extends Phaser.GameObjects.GameObject {
    constructor(scene, levelsData, width)
	{
        super(scene, "LevelHex");



        this.scene = scene;
        this.levelData = levelsData;
        this.maxWidth = width;


        var colors = {
            background : 0x799cbc, //0x385DBB, //0x81828C, // 0x9896d3,
            border :  0x3f3f3f, //0x373D4D, //0x3833a6,
            shadow: 0x000000,
            text : 0xffffff
        };


        //---------------------- New Level Implementation ----------------------
        var borderWidth = 6;

        this.borderRect1 = this.scene.add.rectangle(0, 0, 0, 0, colors.border);
        this.borderRect2 = this.scene.add.rectangle(0, 0, 0, 0, colors.border);

        this.shadowRect1 = this.scene.add.rectangle(0, 0, 0, 0, colors.shadow).setAlpha(0.5); //outerShadow
        this.shadowRect2 = this.scene.add.rectangle(0, 0, 0, 0, colors.shadow).setAlpha(0.5);

        this.baseRect = this.scene.add.rectangle(0, 0, 0, 0, colors.background);

        this.innerShadow = this.scene.add.rectangle(0, 0, 0, 0, colors.border).setAlpha(0.5); //innershadow
        
        this.cornerShadow1 = this.scene.add.rectangle(0, 0, borderWidth, borderWidth, colors.border).setAlpha(0.5);
        this.cornerShadow2 = this.scene.add.rectangle(0, 0, borderWidth, borderWidth*2, colors.border).setAlpha(0.5);
        this.cornerShadow3 = this.scene.add.rectangle(0, 0, borderWidth, borderWidth, colors.border).setAlpha(0.5);
        this.cornerShadow4 = this.scene.add.rectangle(0, 0, borderWidth, borderWidth*2, colors.border).setAlpha(0.5);


        // tracker
        this.currIndex = -1;

        //set size using ratio
        this.baseRect.height = scene.cameras.main.height * 0.075;

        this.borderRect1.width = this.maxWidth * 0.95;
        this.baseRect.width = this.borderRect1.width - (borderWidth*2);


        this.borderRect1.width = this.baseRect.width + (borderWidth*2);
        this.borderRect1.height = this.baseRect.height;
        this.borderRect2.width = this.baseRect.width;
        this.borderRect2.height = this.baseRect.height + (borderWidth*2);

        this.shadowRect1.width = this.borderRect1.width;
        this.shadowRect1.height = this.borderRect1.height;
        this.shadowRect2.width = this.borderRect2.width;
        this.shadowRect2.height = this.borderRect2.height;


        this.innerShadow.height = borderWidth;
        this.innerShadow.width = this.baseRect.width;



        this.baseRect.setOrigin(0.5, 0.5);

        this.borderRect1.setOrigin(0.5, 0.5);
        this.borderRect2.setOrigin(0.5, 0.5);

        this.shadowRect1.setOrigin(0.5, 0.5);
        this.shadowRect2.setOrigin(0.5, 0.5);

        this.innerShadow.setOrigin(0.5, 0.5);

        this.cornerShadow1.setOrigin(0.5, 0.5);
        this.cornerShadow2.setOrigin(0.5, 0.5);
        this.cornerShadow3.setOrigin(0.5, 0.5);
        this.cornerShadow4.setOrigin(0.5, 0.5);


        


        //set position
        this.baseRect.x = (this.maxWidth * 0.5);
        this.baseRect.y = scene.cameras.main.height - (this.baseRect.height);

        this.borderRect1.x = this.baseRect.x;
        this.borderRect1.y = this.baseRect.y;
        this.borderRect2.x = this.baseRect.x;
        this.borderRect2.y = this.baseRect.y;

        this.shadowRect1.x = this.baseRect.x;
        this.shadowRect1.y = this.baseRect.y + (borderWidth*0.5);
        this.shadowRect2.x = this.baseRect.x;
        this.shadowRect2.y = this.baseRect.y + (borderWidth*0.5);
        

        this.innerShadow.x = this.baseRect.x;
        this.innerShadow.y = this.baseRect.y + (this.baseRect.height * 0.5) - (borderWidth * 0.5);

        //top-left
        this.cornerShadow1.x = this.baseRect.x - (this.baseRect.width * 0.5) + (borderWidth * 0.5);
        this.cornerShadow1.y = this.baseRect.y - (this.baseRect.height * 0.5) + (borderWidth * 0.5);

        //bottom-left
        this.cornerShadow2.x = this.baseRect.x - (this.baseRect.width * 0.5) + (borderWidth * 0.5);
        this.cornerShadow2.y = this.baseRect.y + (this.baseRect.height * 0.5) - (borderWidth);

        //top-right
        this.cornerShadow3.x = this.baseRect.x + (this.baseRect.width * 0.5) - (borderWidth * 0.5);
        this.cornerShadow3.y = this.baseRect.y - (this.baseRect.height * 0.5) + (borderWidth * 0.5);

        //bottom-right
        this.cornerShadow4.x = this.baseRect.x + (this.baseRect.width * 0.5) - (borderWidth * 0.5);
        this.cornerShadow4.y = this.baseRect.y + (this.baseRect.height * 0.5) - (borderWidth);

        
        

        //create texts
        this.hexText = new Array(21);
        this.hexText[0] = scene.add.text(  0, this.baseRect.y, "0x",
            {
                fontFamily: 'PressStart2P',
                fill: colors.text,
            }
        );
        this.hexText[0].setOrigin(0.5, 0.5);

        for (var i = 0; i < 20; i++) {

            this.hexText[i+1] = scene.add.text(  0, this.baseRect.y, this.levelData[i],
                    {
                        fontFamily: 'PressStart2P',
                        fill: colors.text,
                    }
                );

            this.hexText[i+1].setOrigin(0.5, 0.5);
            //this.hexText[i].setFont('"Press Start 2P"');

            // ,
            //         {
            //             fill: "#ffffff",
            //             stroke: "#385DBB",
            //             backgroundColor: "#00237A", //385DBB
            //             strokeThickness: 3
            //         }
        }

        //find font size
        var widthPercentage = 0.95;
        var gapPercentage = 15/100;
        var numOfPairs = 21;
        var numOfGaps = numOfPairs;

        var totalWidth = this.baseRect.width * widthPercentage;
        var widthPerHex = totalWidth/numOfPairs;
        var widthPerText = widthPerHex/(1+gapPercentage);
        var widthPerCharacter = widthPerText/2;
        var currentWidthperChar = this.hexText[0].displayWidth/2;
        var ratio = widthPerText/this.hexText[0].displayWidth;


        //set positions
        var startX = this.baseRect.x - (this.baseRect.width * widthPercentage * 0.5) + (this.hexText[i].width * 0.5);//(this.baseRect.width * 0.45);
        for (var i in this.hexText) {
            this.hexText[i].x = startX;
            this.hexText[i].setDisplaySize(this.hexText[i].displayWidth*ratio, this.hexText[i].height*ratio);

            startX = this.hexText[i].x + this.hexText[i].displayWidth + (this.hexText[i].displayWidth * gapPercentage);
        }


        this.glowRect = scene.add.rectangle(0, 0,
            this.hexText[0].displayWidth * 1.2,
            this.baseRect.height * 0.75);

        this.glowRect.setStrokeStyle(borderWidth * 0.5, 0x385DBB);// 0xffffff);

        this.glowRect.setOrigin(0.5, 0.5);

        this.updateCurrLevel(this.scene.getCurrentLevel());

        
    }


    setScrollFactor(x, y) {
       
        this.baseRect.setScrollFactor(x, y);

        this.borderRect1.setScrollFactor(x, y);
        this.borderRect2.setScrollFactor(x, y);

        this.shadowRect1.setScrollFactor(x, y);
        this.shadowRect2.setScrollFactor(x, y);


        this.innerShadow.setScrollFactor(x, y);

        this.cornerShadow1.setScrollFactor(x, y);
        this.cornerShadow2.setScrollFactor(x, y);
        this.cornerShadow3.setScrollFactor(x, y);
        this.cornerShadow4.setScrollFactor(x, y);

        this.glowRect.setScrollFactor(x, y);
        for (var i in this.hexText)
        {
            this.hexText[i].setScrollFactor(x, y);
        }
       
    }

    setDepth(zIndex) {
        
        this.baseRect.setDepth(zIndex + 2);


        
        this.shadowRect1.setDepth(zIndex); 
        this.shadowRect2.setDepth(zIndex); 

        this.borderRect1.setDepth(zIndex + 1); 
        this.borderRect2.setDepth(zIndex + 1); 

        this.innerShadow.setDepth(zIndex + 3);
        this.cornerShadow1.setDepth(zIndex + 3);
        this.cornerShadow2.setDepth(zIndex + 3);
        this.cornerShadow3.setDepth(zIndex + 3);
        this.cornerShadow4.setDepth(zIndex + 3);


        this.glowRect.setDepth(zIndex + 5);
        for (var i in this.hexText)
        {
            this.hexText[i].setDepth(zIndex + 4);
        }
    }

    updateCurrLevel(currLevel) {
        currLevel++;
        
        this.currIndex = currLevel;

        this.glowRect.x = this.hexText[this.currIndex].x;
        this.glowRect.y = this.hexText[this.currIndex].y;

    }

}

