// JavaScript source code
import mapData from "./map.json";

export default class DungeonData
{
    constructor(scene, dungeonData) {
        //Get level data from json
        this.levelData = mapData;

        this.levels = [];

        var i = 0;
        while (i < 20) {
            if (this.levelData[dungeonData[i]] == null) {
                console.log("Map not found : " + dungeonData[i]);
                //return;
            }
            else {
                this.levels[dungeonData[i]] = {};
                this.levels[dungeonData[i]] = this.createMap(dungeonData[i], false);
            }
            i++;
        }

    }

    createMap(mapID, imgMap) {

        var currentMap = this.levelData[mapID];

        var output = {};

        var map = [];
        var index = 0;

        //Find starting position for IPC
        var IPCy = Math.floor(currentMap[0] / 18);
        var IPCx = (currentMap[0] % 18) ;
        output.IPC_Pos = {x: IPCx, y: IPCy};

        //Find hole pos
       var cpy = [...currentMap];
       cpy = cpy.splice((cpy.length * 0.6), cpy.length);
       
        var randomIndex = Math.floor(Math.random() * cpy.length);
        var hy = Math.floor(cpy[randomIndex] / 18);
        var hx = cpy[randomIndex] % 18;
        output.hole_Pos = { x: hx, y: hy };

        output.tiledMapData = currentMap;
        return output;
    }

    GetMap(mapID) {
        return this.levels[mapID].tiledMapData;
    }

    GetIPCposition(mapID) {
        return this.levels[mapID].IPC_Pos;
    }

    GetHoleposition(mapID) {
        return this.levels[mapID].hole_Pos;
    }
}
