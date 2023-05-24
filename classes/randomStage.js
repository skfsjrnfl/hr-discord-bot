const {RandomStageWindow} = require("../components/randomStageWindow.js");

//need to verify members are even!!
class RandomStage{
    constructor(waitingRoom){
        this.type="Random";
        this.teamList=[[],[]];
        this.waitingRoom=waitingRoom;
    }

    MakeTeamByStage(size){
        //teamList[0]=> team A
        //teamList[1]=> team B
        let idxArray=[];
        this.teamList=[[],[]];
        const teamSize=size/2;
        for (let i=0;i<size;i++){
            let idxWithRandomKey = [i,Math.floor(Math.random() * 1000)];
            idxArray.push(idxWithRandomKey);
        }
        idxArray.sort((a,b)=>{
            return a[1]>=b[1]?1:-1
        });
        for (let i=0;i<teamSize;i++){
            this.waitingRoom.teamList[0].push(idxArray[i][0]);
        }
        for (let i=teamSize;i<size;i++){
            this.waitingRoom.teamList[1].push(idxArray[i][0]);
        }
        return;
    }

    MakeStageWindow(teamAName, teamBName, teamAPower, teamBPower){
        return RandomStageWindow(teamAName, teamBName, teamAPower, teamBPower);
    }
}
module.exports = RandomStage;