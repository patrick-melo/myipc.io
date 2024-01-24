import Phaser from "phaser";

export default class IntroPopup extends Phaser.GameObjects.GameObject {
    constructor(config) {

        //check if config contains a scene
        if (!config.scene) {
            console.log('missing scene');
            return;
        }

        super(config.scene, "IntroPopup");

        var width = config.scene.cameras.main.width * 0.8;
        var height = config.scene.cameras.main.height * 0.8;
        var centerX = config.scene.cameras.main.worldView.x + config.scene.cameras.main.width / 2;
        var centerY = config.scene.cameras.main.worldView.y + config.scene.cameras.main.height / 2;

        // Create popup background
        this.background = this.scene.add.rectangle(centerX, centerY, width, height, '0x000000').setAlpha(0.8);
        // Create close button
        this.closeButton = config.scene.add.text(centerX + (width * 0.5) - 24, centerY - (height * 0.5) + 24, 'X', { fontFamily: 'PressStart2P', fontSize: '40px', fill: '#fff' }).setOrigin(0.5).setInteractive();

        // Create popup Heading
        this.popupHeading = config.scene.add.text(centerX, centerY - (height * 0.5) + 42, 'WELCOME!', { fontFamily: 'PressStart2P', fontSize: '42px', fill: '#fff' }).setOrigin(0.5);

        // Create popup Text 1
        this.popupT1 = config.scene.add.text(centerX, centerY + 42,
            '-> Dive into the pixelated magic as your wallet address transforms into a maze of dungeons across 20 thrilling levels!'
            + '\n\n'
            + '-> Embark on a quest to discover the hidden hole in each dungeon, descending deeper into the retro adventure.'
            + '\n\n'
            + '-> Guide your Immortal Player Characters through the vibrant pixel corridors using arrow keys.'
            + '\n\n'
            + '-> Switch effortlessly between players with the classic tab key mechanic.',
            { fontFamily: 'PressStart2P', fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.popupT1.setWordWrapWidth(width * 0.95);


        // Set the desired maximum height
        const maxHeight = (height - 42) * 0.9;

        // Adjust font size based on the maximum height
        while (this.popupT1.displayHeight > maxHeight) {
            this.popupT1.setFontSize(parseInt(this.popupT1.style.fontSize, 10) - 1);
        }

        // Hide the popup initially
        this.setVisible(false);

        this.sound = config.scene.sound.add('btnClick');
  

        // Event listener for the close button to hide the popup
        this.closeButton.on('pointerdown', () => {
            this.sound.play();
            this.setVisible(false);
        });

        this.visible = false;
        // Add the popup container to the config.scene
        config.scene.add.existing(this);
    }


    setVisible(visibility) {
        this.background.setVisible(visibility);
        this.popupHeading.setVisible(visibility);
        this.closeButton.setVisible(visibility);
        this.popupT1.setVisible(visibility);
        this.visible = visibility;

        // this.background.setVisible(visibility);

    }

    setDepth(zIndex) {
        this.background.setDepth(zIndex);
        zIndex++;
        this.popupHeading.setDepth(zIndex);
        this.closeButton.setDepth(zIndex);
        this.popupT1.setDepth(zIndex);
    }

}