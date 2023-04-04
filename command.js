const {
    Client,
    Events,
    GatewayIntentBits,
    GuildMemberManager,
    GuildMember,
    Guild,
    Partials,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");


var exports = module.exports = {};

exports.rollDice= function(){
    return Math.floor(Math.random() * 100);
}

exports.registerUser = async function(message) {
    let onlineUserArr = [];
    message.guild.members.fetch().then((fetchedMembers) => {
      fetchedMembers.forEach((k, v) => {
        let curMem = message.guild.members.cache.get(k.id);
        if (curMem.voice.channel) {
          onlineUserArr.push(k.user.username);
        }
      });
      onlineUserArr.forEach(async (item) => {
        await DB.addToDatabase(item);
      });
    });
}

exports.makeTeam =async function(message) {
  var channel = await  message.guild.channels.fetch(message.member.voice.channel.id);
  if (channel.members.size % 2 === 1){
    message.reply("현재 채널 접속 인원이 홀수입니다. 짝수 인원으로 맞춰주세요!");
    return null;
  }
  else{
    let waiting=[];
    channel.members.forEach((k,v)=>{
      let nick_id = [k.displayName,k.id,Math.floor(Math.random() * 1000)];
      waiting.push(nick_id);
    });
    waiting.sort((a,b)=>{
      return a[2]>=b[2] ? 1: -1;
    });
    const half = channel.members.size/2;
    let a_name=[];
    let b_name=[];
    let a_id=[];
    let b_id=[];
    for (let i=0; i<half; i++){
      a_name.push(waiting[i][0]);
      a_id.push(waiting[i][1]);
      b_name.push(waiting[i+half][0]);
      b_id.push(waiting[i+half][1]);
    }
    // const exampleEmbed = new EmbedBuilder()
    //     .setColor(0x0099ff)
    //     .setTitle("팀 구성 결과🚀")
    //     .setURL("https://discord.js.org/")
    //     .addFields(
    //       { name: "1️⃣팀", value: a_name.join(", ") },
    //       { name: "2️⃣팀", value: b_name.join(", ") }
    //     );
    // setTimeout(() => {
    //   checkDelay = true;
    // }, 60000);
    // message.channel.send({ embeds: [exampleEmbed], components: [btnRow] });
    return [a_name,b_name,a_id,b_id];
  }
}