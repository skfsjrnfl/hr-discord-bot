const {helloWindow} = require("../components/helloWindow.js");

class WaitingRoom{
    constructor(guildId,host,mainVoiceChannel,subVoiceChannel,textChannel,members){
        this.guildId=guildId;
        this.host=host;
        this.mainVoiceChannel=mainVoiceChannel;
        this.subVoiceChannel=subVoiceChannel;
        this.textChannel=textChannel;
        this.players=members;
    }

    CheckHostByID(targetId){
        return this.host.user.id==targetId ? 1 : 0;
    }

    GetPlayerNames(){
        let name=[];
        const size=this.players.size;
        if (size==0){
            return "No one";
        }else{
            for (let i=0;i<size;i++){
                name.push(this.players.at(i).displayName);
            }
            return name.join(",");
        }
    }
    
    AddPlayer(targetId){
        const target = this.mainVoiceChannel.members.get(targetId);
        this.players.set(targetId,target);
        return;
    }

    RemovePlayer(targetId){
        this.players.delete(targetId);
        return;    
    }

    SendHelloWindow(){
        this.textChannel.send(helloWindow(this));
        return;
    }
}

module.exports = WaitingRoom;