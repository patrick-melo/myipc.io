import Phaser from "phaser";

export default class ErrorPopup extends Phaser.GameObjects.GameObject {
    constructor(config) {

        //check if config contains a scene
        if (!config.scene) {
            console.log('missing scene');
            return;
        }

        super(config.scene, "ErrorPopup");

        this.width = config.scene.cameras.main.width * 0.8;
        this.height = config.scene.cameras.main.height * 0.8;
        var centerX = config.scene.cameras.main.worldView.x + config.scene.cameras.main.width / 2;
        var centerY = config.scene.cameras.main.worldView.y + config.scene.cameras.main.height / 2;

        // Create popup background
        this.background = this.scene.add.rectangle(centerX, centerY, this.width, this.height, '0x800080').setAlpha(0.8);
        // Create close button
        this.closeButton = config.scene.add.text(centerX + (this.width * 0.5) - 24, centerY - (this.height * 0.5) + 24, 'X', { fontFamily: 'PressStart2P', fontSize: '40px', fill: '#fff' }).setOrigin(0.5).setInteractive();

        // Create popup Heading
        this.popupHeading = config.scene.add.text(centerX, centerY - (this.height * 0.5) + 42, 'ERROR !', { fontFamily: 'PressStart2P', fontSize: '42px', fill: '#fff' }).setOrigin(0.5);

        // Create popup Text 1
        this.popupText = config.scene.add.text(centerX, centerY + 42, config.errorText,
            { fontFamily: 'PressStart2P', fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.popupText.setWordWrapWidth(this.width * 0.95);

        this.popupText.setLineSpacing(10);


        // Set the desired maximum height
        const maxHeight = (this.height - 42) * 0.9;

        // Adjust font size based on the maximum height
        while (this.popupText.displayHeight > maxHeight) {
            this.popupText.setFontSize(parseInt(this.popupText.style.fontSize, 10) - 1);
        }

        this.popupHeading.y = centerY - (this.popupText.height) - this.popupHeading.height;
        this.closeButton.y = this.popupHeading.y;
        this.background.setDisplaySize(this.background.width, this.popupText.height);// + (2 * this.popupHeading.height));

        // Hide the popup initially
        this.setVisible(false);

        this.sound = config.scene.sound.add('btnClick');

        // Event listener for the close button to hide the popup
        this.closeButton.on('pointerdown', () => {
            this.sound.play();
            this.setVisible(false);
            // Navigate back in the history
            window.history.back();
            // Refresh the previous page
            window.location.replace(document.referrer);
        });

        this.visible = false;
        // Add the popup container to the config.scene
        config.scene.add.existing(this);
    }



    setVisible(visibility) {
        this.background.setVisible(visibility);
        this.popupHeading.setVisible(visibility);
        this.closeButton.setVisible(visibility);
        this.popupText.setVisible(visibility);
        this.visible = visibility;

        // this.background.setVisible(visibility);

    }

    setDepth(zIndex) {
        this.background.setDepth(zIndex);
        zIndex++;
        this.popupHeading.setDepth(zIndex);
        this.closeButton.setDepth(zIndex);
        this.popupText.setDepth(zIndex);
    }

    setText(newText)
    {
        this.popupText.setText(newText);

        // Set the desired maximum height
        const maxHeight = (this.height - 42) * 0.9;

        // Adjust font size based on the maximum height
        while (this.popupText.displayHeight > maxHeight) {
            this.popupText.setFontSize(parseInt(this.popupText.style.fontSize, 10) - 1);
        }

        this.popupHeading.y = this.popupText.y - (this.popupText.height * 0.5) - this.popupHeading.height;
        this.background.setDisplaySize(this.background.width, (this.popupText.height * 1.2) + (2 * this.popupHeading.height));
        this.closeButton.y = this.popupHeading.y - (this.closeButton.height * 0.5);

    }

}