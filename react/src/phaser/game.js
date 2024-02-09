import React, { useEffect } from 'react';
import Phaser from 'phaser';

import Container from '../com/Container';

import landingScene from './src/landingScene.js';
import dungeonScene from './src/dungeonScene.js';
import gameConfig from './src/gameConfig.js';

import pressStart2PFont from './assets/font/PressStart2P-Regular.ttf';

function loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
}


export default function Game(props) {

    gameConfig.currentAddress = props.dungeonAddrs;//.toUpperCase();
    
    loadFont("PressStart2P", pressStart2PFont);

    useEffect(() => {
        let game;
        const elemWidth = document.getElementById("game-container").offsetWidth;
        const elemHeight = document.getElementById("game-container").offsetHeight;
        const phaserConfig = {
            type: Phaser.AUTO,
            // width: 800,
            // height: 600,
            width: (elemWidth*0.8),
            height: (elemHeight*0.8),
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0, },
                    debug: false
                }
            },
            parent: 'phaser-game',
            render: { pixelArt: true, antialias: false, autoResize: false },
            scene: [landingScene, dungeonScene]//, formScene, ipcScene, dungeonScene]
        };

        game = new Phaser.Game(phaserConfig);
    }, []);


    return (
        <Container>
            <div className="game-container" id="game-container">
                <div id="phaser-game" />
            </div>
        </Container>
    );
}

