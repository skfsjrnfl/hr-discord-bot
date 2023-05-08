const {stageInfo} = require("../components/stage_info.js");

//need to verify members are even!!
class Stage{
    constructor(guildId,host,mainVoiceChannel,textChannel,members){
        this.guildId=guildId;
        this.host=host;
        this.mainVoiceChannel=mainVoiceChannel;
        this.textChannel=textChannel;
        this.subVoiceChannel=null;
        this.members=members;
        this.teamA=[];
        this.teamB=[];
    }

    setSubChannel(subVoiceChannel){
        this.subVoiceChannel=subVoiceChannel;
    }

    makeTeamRandom(){
        const allSize=this.members.size;
        const teamSize=allSize/2;
        let idxArray=[];
        this.teamA=[];
        this.teamB=[];
        for (let i=0;i<allSize;i++){
            let idxWithRandomKey = [i,Math.floor(Math.random() * 1000)];
            idxArray.push(idxWithRandomKey);
        }
        idxArray.sort((a,b)=>{
            return a[1]>=b[1]?1:-1
        });
        for (let i=0;i<teamSize;i++){
            this.teamA.push(this.members.at(idxArray[i][0]));
        }
        for (let i=teamSize;i<allSize;i++){
            this.teamB.push(this.members.at(idxArray[i][0]));
        }
        return;
    }

    getMembersName(){
        const size=this.members.size;
        let names=[];
        for (let i=0;i<size;i++){
            names.push(this.members.at(i).displayName);
        }
        return names;
    }

    getTeamAName(){
        const teamSize=this.teamA.length;
        let names=[];
        for (let i=0;i<teamSize;i++){
            names.push(this.teamA[i].displayName);
        }
        return names;
    }

    getTeamBName(){
        const teamSize=this.teamB.length;
        let names=[];
        for (let i=0;i<teamSize;i++){
            names.push(this.teamB[i].displayName);
        }
        return names;
    }

    showStageInfo(){
        const info=stageInfo(this);
        this.textChannel.send(info);
        return;
    }
}
module.exports = Stage;