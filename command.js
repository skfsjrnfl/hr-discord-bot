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

let btnRow = new ActionRowBuilder().setComponents(
    new ButtonBuilder()
      .setCustomId("team1winBtn")
      .setLabel("1️⃣팀 승리")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("team2winBtn")
      .setLabel("2️⃣팀 승리")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("rerollBtn")
      .setLabel("🎲리롤🎲")
      .setStyle(ButtonStyle.Danger)
);

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

exports.makeTeam = async function(message) {
    let onlineUserArr = [];
    message.guild.members.fetch().then((fetchedMembers) => {
    fetchedMembers.forEach((k, v) => {
    let curMem = message.guild.members.cache.get(k.id);
    if (curMem.voice.channel) {
        onlineUserArr.push(k.user.username);
    }
    });
    if (onlineUserArr.length == 0) {
    ("현재 채널 접속 인원이 없습니다.");
    } else if (onlineUserArr.length % 2 === 1) {
    message.guild.channels.cache
        .get(message.channelId)
        .send("현재 채널 접속 인원이 홀수입니다. 짝수 인원으로 맞춰주세요.");
    } else {
    const teamCount = onlineUserArr.length / 2;
    const generateRandomKey = () => Math.floor(Math.random() * 1000);
    const userWithKey = onlineUserArr.map((user) => ({
        name: user,
        key: generateRandomKey(),
    }));
    const sortedUserWithKey = userWithKey.sort((a, b) => {
        return a.key >= b.key ? 1 : -1;
    });
    const team1 = sortedUserWithKey.splice(0, teamCount);
    const team2 = sortedUserWithKey.splice(-teamCount);

    team1Temp = [];
    team2Temp = [];
    team1.forEach((usr) => {
        team1Temp.push(usr.name);
    });
    team2.forEach((usr) => {
        team2Temp.push(usr.name);
    });
    const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("팀 구성 결과🚀")
        .setURL("https://discord.js.org/")
        .addFields(
        { name: "1️⃣팀", value: team1Temp.join(", ") },
        { name: "2️⃣팀", value: team2Temp.join(", ") }
        );
    message.channel.send({ embeds: [exampleEmbed], components: [btnRow] });
    }
});
}