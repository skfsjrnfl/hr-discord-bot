const {stageInfo} = require("../components/stage_info.js");
const DB = require("../db_api.js");

//need to verify members are even!!
class Stage{
    constructor(guildId,host,mainVoiceChannel,subVoiceChannel,textChannel,members){
        this.guildId=guildId;
        this.host=host;
        this.mainVoiceChannel=mainVoiceChannel;
        this.subVoiceChannel=subVoiceChannel;
        this.textChannel=textChannel;

        this.members=members;
        this.teamA=[];
        this.teamB=[];
        this.teamAName=null;
        this.teamBName=null;
        this.teamAPower=null;
        this.teamBPower=null;
    }

    setTeamNames(){
        const teamSize=this.teamA.length;
        let names=[];
        for (let i=0;i<teamSize;i++){
            names.push(this.teamA[i].displayName);
        }
        this.teamAName=names.join(", ");

        names=[];
        for (let i=0;i<teamSize;i++){
            names.push(this.teamB[i].displayName);
        }
        this.teamBName=names.join(", ");
        return;
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
        this.setTeamNames();
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

    showStageInfo(){
        const info=stageInfo(this);
        this.textChannel.send(info);
        return;
    }

    moveTeamsEachChannel(){
        const size= this.teamA.length;
        for (let i=0;i<size;i++){
            this.teamA[i].voice.setChannel(this.mainVoiceChannel);
            this.teamB[i].voice.setChannel(this.subVoiceChannel);
        }
    }

    moveAllMainChannel(){
        const size= this.members.size;
        for (let i=0;i<size;i++){
            this.members[i].voice.setChannel(this.mainVoiceChannel);
        }
    }

    async resisterMembersToDB(){
        const size= this.members.size;
        for (let i=0;i<size;i++){
            let data =await DB.getUser(this.guildId, this.members.at(i).id);
            if (!data){
                await DB.insertUser(this.guildId, this.members.at(i).id, this.members.at(i).displayName);
            }
        }
        return;
    }

    async getTeamAPower(){
        const size= this.teamA.length;
        let totalPower=0;
        for (let i=0;i<size;i++){
            let data =await DB.getUser(this.guildId, this.teamA[i].id);
            totalPower+=data["POWER"];
        }
        return totalPower;
    }

    async getTeamBPower(){
        const size= this.teamB.length;
        let totalPower=0;
        for (let i=0;i<size;i++){
            let data =await DB.getUser(this.guildId, this.teamB[i].id);
            totalPower+=data["POWER"];
        }
        return totalPower;
    }
}
module.exports = Stage;