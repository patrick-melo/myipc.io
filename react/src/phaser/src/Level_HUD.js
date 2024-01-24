import Phaser from "phaser";
import gameConfig from "./gameConfig.js";

export default class Level_HUD extends Phaser.GameObjects.GameObject {
    constructor(scene, levelsData, width)
	{
        super(scene, "LevelHUD");

        this.scene = scene;
        this.levelData = levelsData;
        this.maxWidth = width;

        // var colors = {
        //     background : 0x81828C, // 0x9896d3,
        //     border :  0x373D4D, //0x3833a6,
        //     shadow: 0x000000
        // };

        var colors = {
            background : 0x799cbc, //0x385DBB, //0x81828C, // 0x9896d3,
            border :  0x3f3f3f, //0x373D4D, //0x3833a6,
            shadow: 0x000000,
            text: 0xffffff
        };



        //---------------------- New Level Implementation ----------------------
        var borderWidth = 6;

        this.border1 = this.scene.add.rectangle(0, 0, 148, 148, colors.border);
        this.border2 = this.scene.add.rectangle(0, 0, 148, 148, colors.border);
        this.baseRect = this.scene.add.rectangle(0, 0, 148, 148, colors.background);

        this.border_MiniMap1 = this.scene.add.rectangle(0, 0, 148, 148, colors.border);
        this.border_MiniMap2 = this.scene.add.rectangle(0, 0, 148, 148, colors.border);

        this.innerShadow_MiniMap = this.scene.add.rectangle(0, 0, 150, 150, colors.border).setAlpha(0.5);
        this.cornerShadow_MiniMap_topLeft = this.scene.add.rectangle(0, 0, borderWidth, borderWidth, colors.border).setAlpha(0.5);
        this.cornerShadow_MiniMap_bottomLeft = this.scene.add.rectangle(0, 0, borderWidth, borderWidth*2, colors.border).setAlpha(0.5);
        this.cornerShadow_MiniMap_topRight = this.scene.add.rectangle(0, 0, borderWidth, borderWidth, colors.border).setAlpha(0.5);
        this.cornerShadow_MiniMap_bottomRight = this.scene.add.rectangle(0, 0, borderWidth, borderWidth*2, colors.border).setAlpha(0.5);

        this.innerShadow = this.scene.add.rectangle(0, 0, 150, 150, colors.border).setAlpha(0.5);
        this.cornerShadow_topLeft = this.scene.add.rectangle(0, 0, borderWidth, borderWidth, colors.border).setAlpha(0.5);
        this.cornerShadow_bottomLeft = this.scene.add.rectangle(0, 0, borderWidth, borderWidth*2, colors.border).setAlpha(0.5);
        this.cornerShadow_topRight = this.scene.add.rectangle(0, 0, borderWidth, borderWidth, colors.border).setAlpha(0.5);
        this.cornerShadow_bottomRight = this.scene.add.rectangle(0, 0, borderWidth, borderWidth*2, colors.border).setAlpha(0.5);


        // tracker 
        this.currIndex = scene.getCurrentLevel();

        this.minimap = scene.add.image(0, 0, levelsData[this.currIndex]);


       var paddingPercentage = 1.3;

        
        this.border1.setSize((this.maxWidth * 0.95), (this.maxWidth * 0.95) * paddingPercentage);
        this.border1.setPosition(scene.cameras.main.width - (this.maxWidth * 0.5), scene.cameras.main.height - (this.maxWidth * 0.5 * paddingPercentage));
        this.border1.setOrigin( 0.5, 0.5);

        this.border2.setSize((this.maxWidth * 0.95), (this.maxWidth * 0.95) * paddingPercentage);
        this.border2.setPosition(scene.cameras.main.width - (this.maxWidth * 0.5), scene.cameras.main.height - (this.maxWidth * 0.5 * paddingPercentage));
        this.border2.setOrigin( 0.5, 0.5);


        this.baseRect.setSize(this.border1.width - (borderWidth * 2), this.border1.height - (borderWidth * 2));
        this.baseRect.copyPosition(this.border1);
        this.baseRect.setOrigin(0.5, 0.5);

        this.border1.height = this.baseRect.height;
        this.border1.y += borderWidth;
        this.border2.width = this.baseRect.width;
        this.border2.x += borderWidth;


        this.ratio = (this.baseRect.width - (4 * borderWidth)) / (this.minimap.width); //WIDTH RATIO


        this.minimap.setScale(this.ratio);
        this.minimap.copyPosition(this.border1);

       
        this.minimap.setOrigin(0.5, 0.5);

        this.border_MiniMap1.setSize((this.minimap.width * this.ratio) + (2*borderWidth), (this.minimap.height * this.ratio));
        this.border_MiniMap1.setOrigin(0.5, 0.5);

        this.border_MiniMap2.setSize((this.minimap.width * this.ratio), (this.minimap.height * this.ratio) + (2*borderWidth));
        this.border_MiniMap2.setOrigin(0.5, 0.5);


        this.innerShadow_MiniMap.setOrigin(0.5, 0.5);

        this.cornerShadow_MiniMap_topLeft.setOrigin(0.5, 0.5);
        this.cornerShadow_MiniMap_bottomLeft.setOrigin(0.5, 0.5);
        this.cornerShadow_MiniMap_topRight.setOrigin(0.5, 0.5);
        this.cornerShadow_MiniMap_bottomRight.setOrigin(0.5, 0.5);

        this.cornerShadow_topLeft.setOrigin(0.5, 0.5);
        this.cornerShadow_bottomLeft.setOrigin(0.5, 0.5);
        this.cornerShadow_topRight.setOrigin(0.5, 0.5);
        this.cornerShadow_bottomRight.setOrigin(0.5, 0.5);
        
        this.border_MiniMap1.x = this.minimap.x; 
        this.border_MiniMap2.x = this.minimap.x; 


        
        this.minimap.y = this.baseRect.y + (this.baseRect.height * 0.05);
        this.border_MiniMap1.y = this.minimap.y;
        this.border_MiniMap2.y = this.minimap.y;


        this.innerShadow_MiniMap.width = this.minimap.width * this.ratio;
        this.innerShadow_MiniMap.height = borderWidth;

        this.innerShadow.setSize(this.baseRect.width, borderWidth);
        this.innerShadow.setPosition(this.baseRect.x, (this.baseRect.y + (this.baseRect.height * 0.5) - (borderWidth * 0.5)));
        this.innerShadow.setOrigin( 0.5, 0.5);
        
        this.topText = scene.add.text( 0, 0, '',  { fontFamily: 'PressStart2P',  fill: colors.text, });
        this.topText.setOrigin(0.5, 0.5);
        this.topText.setFontSize(26);

        

        this.bottomText = scene.add.text(0, 0, '',
            {
                fontFamily: 'PressStart2P',
                align: "right",
                fontSize: '16px',
                fill: colors.text,
            });

        this.topText.setText("Floor " + this.currIndex);
        this.bottomText.setText("Level $" + this.getCurrentLevelName());

        this.topText.x = this.baseRect.x;

       

        this.topText.y = this.minimap.y - (this.minimap.height * this.ratio * 0.5) - (this.topText.height * 0.7) - borderWidth;
        var maxWidth_topText = this.baseRect.width - (borderWidth * 2);
        var maxHeight_topText = (this.baseRect.y - (this.baseRect.height * 0.5)) - (this.minimap.y - (this.minimap.height * this.ratio * 0.5)) - (borderWidth * 2);
        this.resizeText(this.topText, maxWidth_topText * 0.9, maxHeight_topText * 0.9);

        var maxWidth_bottomText = this.baseRect.width - (borderWidth * 2);
        var maxHeight_bottomText = (this.baseRect.y + (this.baseRect.height * 0.5)) - (this.minimap.y + (this.minimap.height * this.ratio * 0.5)) - (borderWidth * 2);
        this.resizeText(this.bottomText, maxWidth_bottomText * 0.8, maxHeight_bottomText * 0.8);
        this.bottomText.setPosition( this.baseRect.x,(this.minimap.y + (this.minimap.height * this.ratio * 0.5) + (this.bottomText.height * 0.7) + (borderWidth)));
        this.bottomText.setOrigin(0.5, 0.5);

        this.innerShadow_MiniMap.setPosition(this.minimap.x, (this.minimap.y + (this.minimap.height  * this.ratio * 0.5) ));// + (this.minimap.height  * this.ratio) +(borderWidth * 2)));
        this.innerShadow_MiniMap.setOrigin(0.5, 0.5);
        
        //top-left
        this.cornerShadow_MiniMap_topLeft.setPosition(
            (this.minimap.x - (this.minimap.width * this.ratio * 0.5) + (borderWidth * 0.5)),
            (this.minimap.y - (this.minimap.height * this.ratio * 0.5) + (borderWidth * 0.5)));
        this.cornerShadow_topLeft.setPosition(
            (this.baseRect.x - (this.baseRect.width * 0.5) + (borderWidth * 0.5)),
            (this.baseRect.y - (this.baseRect.height * 0.5) + (borderWidth * 0.5)));
        //bottom-left
        this.cornerShadow_MiniMap_bottomLeft.setPosition(
            (this.minimap.x - (this.minimap.width * this.ratio * 0.5) + (borderWidth * 0.5)),
            (this.minimap.y + (this.minimap.height * this.ratio * 0.5) - (borderWidth)));
        this.cornerShadow_bottomLeft.setPosition(
            (this.baseRect.x - (this.baseRect.width * 0.5) + (borderWidth * 0.5)),
            (this.baseRect.y + (this.baseRect.height * 0.5) - (borderWidth * 0.5)));
        //top-right
        this.cornerShadow_MiniMap_topRight.setPosition(
            (this.minimap.x + (this.minimap.width * this.ratio * 0.5) - (borderWidth * 0.5)),
            (this.minimap.y - (this.minimap.height * this.ratio * 0.5) + (borderWidth * 0.5)));
        this.cornerShadow_topRight.setPosition(
            (this.baseRect.x + (this.baseRect.width * 0.5) - (borderWidth * 0.5)),
            (this.baseRect.y - (this.baseRect.height * 0.5) + (borderWidth * 0.5)));
        //bottom-right
        this.cornerShadow_MiniMap_bottomRight.setPosition(
            (this.minimap.x + (this.minimap.width * this.ratio * 0.5) - (borderWidth * 0.5)),
            (this.minimap.y + (this.minimap.height * this.ratio * 0.5) - (borderWidth)));
        this.cornerShadow_bottomRight.setPosition(
            (this.baseRect.x + (this.baseRect.width * 0.5) - (borderWidth * 0.5)),
            (this.baseRect.y + (this.baseRect.height * 0.5) - (borderWidth)));



    }


    setScrollFactor(x, y) {
       
        this.minimap.setScrollFactor(x, y);
        this.baseRect.setScrollFactor(x, y);
        this.border_MiniMap1.setScrollFactor(x, y);
        this.border_MiniMap2.setScrollFactor(x, y);

        this.innerShadow_MiniMap.setScrollFactor(x, y);
        this.topText.setScrollFactor(x, y);
        this.bottomText.setScrollFactor(x, y);
        this.cornerShadow_MiniMap_topLeft.setScrollFactor(x, y);
        this.cornerShadow_MiniMap_bottomLeft.setScrollFactor(x, y);
        this.cornerShadow_MiniMap_topRight.setScrollFactor(x, y);
        this.cornerShadow_MiniMap_bottomRight.setScrollFactor(x, y);

        this.border1.setScrollFactor(x, y);
        this.border2.setScrollFactor(x, y);

        this.innerShadow.setScrollFactor(x, y);
        this.cornerShadow_topLeft.setScrollFactor(x, y);
        this.cornerShadow_bottomLeft.setScrollFactor(x, y);
        this.cornerShadow_topRight.setScrollFactor(x, y);
        this.cornerShadow_bottomRight.setScrollFactor(x, y);

        


    }

    setDepth(zIndex) {
        

        this.border1.setDepth(zIndex); 
        this.border2.setDepth(zIndex); 

        
        zIndex++;

        this.baseRect.setDepth(zIndex); 
        this.border_MiniMap1.setDepth(zIndex); 
        this.border_MiniMap2.setDepth(zIndex); 

        zIndex++;

        this.minimap.setDepth(zIndex);
        this.topText.setDepth(zIndex);
        this.bottomText.setDepth(zIndex);
        this.innerShadow.setDepth(zIndex);

        zIndex++;

        this.cornerShadow_MiniMap_topLeft.setDepth(zIndex);
        this.cornerShadow_MiniMap_bottomLeft.setDepth(zIndex);
        this.cornerShadow_MiniMap_topRight.setDepth(zIndex);
        this.cornerShadow_MiniMap_bottomRight.setDepth(zIndex);

        this.cornerShadow_topLeft.setDepth(zIndex);
        this.cornerShadow_bottomLeft.setDepth(zIndex);
        this.cornerShadow_topRight.setDepth(zIndex);
        this.cornerShadow_bottomRight.setDepth(zIndex);

        zIndex++;

        this.innerShadow_MiniMap.setDepth(zIndex);
        
    }


    getIndex() {
        return this.scene.getCurrentLevel();
    }

    getCurrentLevelName() {
        return this.levelData[this.getIndex()];
    }

    hideLevel() {
        this.minimap.visible = false;
        this.topText.visible = false;
        this.bottomText.visible = false;
        this.baseRect.visible = false;
        this.border_MiniMap1.visible = false;
        this.border_MiniMap2.visible = false;

        this.innerShadow_MiniMap.visible = false;
        this.border1.visible = false;
    }

    showLevel() {
        this.minimap.visible = false;
        this.topText.visible = true;
        this.bottomText.visible = true;
        this.topText.setText("Floor " + this.getIndex());
        this.bottomText.setText("Level $" + this.getCurrentLevelName());
        this.baseRect.visible = true;
        this.border_MiniMap1.visible = true;
        this.border_MiniMap2.visible = true;

        this.innerShadow_MiniMap.visible = true;
        this.border1.visible = true;
    }

    resizeText(textObject, maxWidth, maxHeight) {

        var widthRatio = maxWidth / textObject.width;
        var heightRatio = maxHeight / textObject.height;
        var finalRatio = (widthRatio > heightRatio) ? widthRatio : heightRatio;

        textObject.setDisplaySize(textObject.width * finalRatio, textObject.height * finalRatio);
    }

}
