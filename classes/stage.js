//need to verify members are even!!
class Stage{
    constructor(host,mainChannel,members){
        this.host=host;
        this.mainChannel=mainChannel;
        this.subChannel=null;
        this.members=members;
        this.teamA=[];
        this.teamB=[];
    }

    setSubChannel(subChannel){
        this.subChannel=subChannel;
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
}
module.exports = Stage;