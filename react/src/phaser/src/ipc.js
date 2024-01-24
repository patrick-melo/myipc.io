import Phaser from "phaser";
import gameConfig from "./gameConfig";

export default class IPC extends Phaser.Physics.Arcade.Sprite {
    #ipcID;
    #attribute;
    isNPC;
    pNPC;

    constructor(scene, x, y, id, _callback, _keyState) {
        super(scene, x, y, id);
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.setScale(1);

        this.#ipcID = id;
        this.#attribute = {
            Strength: 0,
            StrengthAttributes: {
                Force: 0,
                Sustain: 0,
                Tolerance: 0
            },
            Dexterity: 0,
            DexterityAttributes: {
                Speed: 0,
                Precision: 0,
                Reaction: 0
            },
            Intelligence: 0,
            IntelligenceAttributes: {
                Memory: 0,
                Processing: 0,
                Reasoning: 0
            },
            Constitution: 0,
            ConstitutionAttributes: {
                Healing: 0,
                Fortitude: 0,
                Vitality: 0
            },
            Luck: 0,
            DNA: {
                Race: '',
                Subrace: '',
                Gender: '',
                SkinColor: '',
                HairColor: '',
                EyeColor: '',
                Handedness: ''
            },

        };
        this._callback = _callback;

        this.dir = 0;

        if(_keyState == null)
        {
            this.isNPC = true;
            this.pNPC = this;
            this.ChangeDirection();
        }
        else
        {
            this.keyState = _keyState;
            this.isNPC = false;
            this.pNPC = null;
        }
       
        this.ipcSpeed = 400;
        
        this.npcStart = false;

        this.deltaX = 0;
        this.deltaY = 0;

        
        this.getIpcRequest(this, scene);
    }

    
    ChangeDirection() {
        var direction = Math.floor(Math.random() * 4);
        while (this.dir == direction) 
        {
            direction = Math.floor(Math.random() * 4);
        }
        if (direction == 0) { //NORTH
            this.deltaX = 0;
            this.deltaY = this.ipcSpeed;
        }
        else if (direction == 1) { //south
            
            this.deltaX = 0;
            this.deltaY = -this.ipcSpeed;
        }
        else if (direction == 2) { //east
            this.setFlipX(false);
            this.deltaX = this.ipcSpeed;
            this.deltaY = 0;
        }
        else if (direction == 3) {
            this.setFlipX(true);
            this.deltaX = -this.ipcSpeed;
            this.deltaY = 0;
        }
        this.dir = direction;

    }

    getID() { return this.#ipcID };

    getStrength() { return this.#attribute.Strength; };
    getForce() { return this.#attribute.StrengthAttributes.Force; };
    getSustain() { return this.#attribute.StrengthAttributes.Sustain; };
    getTolerance() { return this.#attribute.StrengthAttributes.Tolerance; };

    getDexterity() { return this.#attribute.Dexterity; };
    getSpeed() { return this.#attribute.DexterityAttributes.Speed; };
    getPrecision() { return this.#attribute.DexterityAttributes.Precision; };
    getReaction() { return this.#attribute.DexterityAttributes.Reaction; };

    getIntelligence() { return this.#attribute.Intelligence; };
    getMemory() { return this.#attribute.IntelligenceAttributes.Memory; };
    getProcessing() { return this.#attribute.IntelligenceAttributes.Processing; };
    getReasoning() { return this.#attribute.IntelligenceAttributes.Reasoning; };

    getConstitution() { return this.#attribute.Constitution; };
    getHealing() { return this.#attribute.ConstitutionAttributes.Healing; };
    getFortitude() { return this.#attribute.ConstitutionAttributes.Fortitude; };
    getVitality() { return this.#attribute.ConstitutionAttributes.Vitality; };

    getLuck() { return this.#attribute.Luck; };

    getRace() { return this.#attribute.DNA.Race; };
    getSubrace() { return this.#attribute.DNA.Subrace; };
    getGender() { return this.#attribute.DNA.Gender; };
    getSkinColor() { return this.#attribute.DNA.SkinColor; };
    getHairColor() { return this.#attribute.DNA.HairColor; };
    getEyeColor() { return this.#attribute.DNA.EyeColor; };
    getHandedness() { return this.#attribute.DNA.Handedness; };

    

    getIpcRequest(ipc, scene) {

        const Http = new XMLHttpRequest();
        const url = gameConfig.public_root + "token_id/" + ipc.getID();
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                try {
                    const jsonObj = JSON.parse(Http.responseText);
                    //IPC attributes
                    ipc.#setAttributes(jsonObj);

                    scene.load.spritesheet(ipc.getID(), gameConfig.public_root + 'animSprites/' + ipc.getID()+'.png', { frameWidth: 320, frameHight: 320 });
                    scene.load.once('complete', () => {
                        ipc._callback(ipc);
                        if (ipc.getHandedness() == "Left") {
                            ipc.setFlipX(true)
                        }
                        else {
                            ipc.setFlipX(false)
                        }
                        ipc.setTexture(ipc.getID(), 0);
                        //check if IPC exists
                        if(!scene.anims.exists(ipc.getID()+"anim"))
                        {
                            scene.anims.create({
                                key: ipc.getID()+"anim",
                                frameRate: 10,
                                frames: scene.anims.generateFrameNumbers(ipc.getID(), { starts: 7, ends: 0 }),
                                repeat: -1
                            });
                        }
                        
                        ipc.playReverse(ipc.getID()+"anim");

                    });

                    scene.load.start();

                    

                }
                catch (err) {
                    console.log(err);
                    ipc.destroy();
                }

            }
        }
    }
    #setAttributes(jsonObj)
    {
        var tmp = jsonObj.responce;
        // for (var i in jsonObj.responce)
        // {
        //     tmp[jsonObj.responce[i]] = jsonObj.responce[i].value;
        // }

        this.#attribute.Strength = tmp['strength'];
        this.#attribute.StrengthAttributes.Force = tmp['force'];
        this.#attribute.StrengthAttributes.Sustain = tmp['sustain'];
        this.#attribute.StrengthAttributes.Tolerance = tmp['tolerance'];

        this.#attribute.Dexterity = tmp['dexterity'];
        this.#attribute.DexterityAttributes.Speed = tmp['speed'];
        this.#attribute.DexterityAttributes.Precision = tmp['precision'];
        this.#attribute.DexterityAttributes.Reaction = tmp['reaction'];

        this.#attribute.Intelligence = tmp['intelligence'];
        this.#attribute.IntelligenceAttributes.Memory = tmp['memory'];
        this.#attribute.IntelligenceAttributes.Processing = tmp['processing'];
        this.#attribute.IntelligenceAttributes.Reasoning = tmp['reasoning'];

        this.#attribute.Constitution = tmp['constittuion'];
        this.#attribute.ConstitutionAttributes.Healing = tmp['healing'];
        this.#attribute.ConstitutionAttributes.Fortitude = tmp['fortitude'];
        this.#attribute.ConstitutionAttributes.Vitality = tmp['vitality'];

        this.#attribute.DNA.Race = tmp['race'];
        this.#attribute.DNA.Subrace = tmp['subrace'];
        this.#attribute.DNA.Gender = tmp['gender'];
        this.#attribute.DNA.SkinColor = tmp['skin_color'];
        this.#attribute.DNA.HairColor = tmp['hair_color'];
        this.#attribute.DNA.EyeColor = tmp['eye_color'];
        this.#attribute.DNA.Handedness = tmp['handedness'];
        
    }

    update(){

        if(this.isNPC)
        {
            if (this.npcStart) 
            {
                this.setVelocity(this.deltaX, this.deltaY);
            }
            return;
        }
        
        if (!this.keyState.left.isUp) {
            this.setFlipX(true);
            this.setVelocity(-this.ipcSpeed, 0);

        }
        else if (!this.keyState.right.isUp) {
            this.setFlipX(false);
            this.setVelocity(this.ipcSpeed, 0);
        } 
        else if (!this.keyState.up.isUp) {

            this.setVelocity(0, -this.ipcSpeed);

        }
        else if (!this.keyState.down.isUp) {

            this.setVelocity(0, this.ipcSpeed);

        }
        else {
            this.setVelocity(0, 0);
        }
    }

    moveTo(x, y)
    {

    }

    // #setAttributes(jsonObj) {
    //     var tmp = [];

    //     for (var i in jsonObj.attributes) {
    //         tmp[jsonObj.attributes[i].trait_type] = jsonObj.attributes[i].value;
    //     }

    //     this.#attribute.Strength = tmp['Strength'];
    //     this.#attribute.StrengthAttributes.Force = tmp['Force'];
    //     this.#attribute.StrengthAttributes.Sustain = tmp['Sustain'];
    //     this.#attribute.StrengthAttributes.Tolerance = tmp['Tolerance'];

    //     this.#attribute.Dexterity = tmp['Dexterity'];
    //     this.#attribute.DexterityAttributes.Speed = tmp['Speed'];
    //     this.#attribute.DexterityAttributes.Precision = tmp['Precision'];
    //     this.#attribute.DexterityAttributes.Reaction = tmp['Reaction'];

    //     this.#attribute.Intelligence = tmp['Intelligence'];
    //     this.#attribute.IntelligenceAttributes.Memory = tmp['Memory'];
    //     this.#attribute.IntelligenceAttributes.Processing = tmp['Processing'];
    //     this.#attribute.IntelligenceAttributes.Reasoning = tmp['Reasoning'];

    //     this.#attribute.Constitution = tmp['Constitution'];
    //     this.#attribute.ConstitutionAttributes.Healing = tmp['Healing'];
    //     this.#attribute.ConstitutionAttributes.Fortitude = tmp['Fortitude'];
    //     this.#attribute.ConstitutionAttributes.Vitality = tmp['Vitality'];

    //     this.#attribute.DNA.Race = tmp['Race'];
    //     this.#attribute.DNA.Subrace = tmp['Subrace'];
    //     this.#attribute.DNA.Gender = tmp['Gender'];
    //     this.#attribute.DNA.SkinColor = tmp['Skin Color'];
    //     this.#attribute.DNA.HairColor = tmp['Hair Color'];
    //     this.#attribute.DNA.EyeColor = tmp['Eye Color'];
    //     this.#attribute.DNA.Handedness = tmp['Handedness'];

    //     this.#attribute.Luck = tmp['Luck'];
    // }
}
