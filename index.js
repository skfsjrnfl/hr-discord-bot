//Requirements
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
  AttachmentBuilder,
} = require("discord.js");
const DB = require("./db_api.js");
const COMMAND = require("./command.js");
const { token } = require("./config-dev.json"); //commit 시 수정

let checkDelay = false;
let teamAName = [];
let teamBName = [];
let teamAID = [];
let teamBID = [];
let teamAPower;
let teamBPower;
let waitingCh;
let subCh;
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
    .setStyle(ButtonStyle.Danger),
  new ButtonBuilder()
    .setCustomId("startBtn")
    .setLabel("🏃‍♂️시작🏃‍♂️")
    .setStyle(ButtonStyle.Success)
);

let btnRowStart = new ActionRowBuilder().setComponents(
  new ButtonBuilder()
    .setCustomId("team1winBtn")
    .setLabel("1️⃣팀 승리")
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId("team2winBtn")
    .setLabel("2️⃣팀 승리")
    .setStyle(ButtonStyle.Primary),
);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Channel],
});

TeamWindow = function (channel) {
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("팀 구성 결과🚀")
    .setURL("https://youtu.be/k6FmEwkD6SQ")
    .addFields(
      { name: "1️⃣팀", value: teamAName.join(", "),inline:true},
      { name: "LP 합계", value: `${teamAPower}`, inline:true},
      { name: '\u200b', value: '\u200b'},
      { name: "2️⃣팀", value: teamBName.join(", "), inline:true},
      { name: "LP 합계", value: `${teamBPower}`,inline:true},
    );
  setTimeout(() => {
    checkDelay = true;
  }, 60000);
  channel.send({ embeds: [exampleEmbed], components: [btnRow] });
};

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("messageCreate", async (message) => {
  if (message.author.username === "kwonSM") {
    message.react("💩");
  }
  switch (message.content) {
    case "!5vs5":
      reply=await message.reply("@everyone 내전 하실 분~");
      reply.react("🙋‍♂️");
      reply.react("🙅‍♂️");
      break;
    case "!ping":
      message.reply("pong");
      break;
    case "!dice":
      message.reply(
        `🎲${
          message.author.username
        }님의 주사위: ${COMMAND.rollDice().toString()}🎲`
      );
      break;
    case "!team":
      if (message.member.voice.channel == null) {
        message.reply("음성 채널에 입장한 뒤 호출해주세요!");
        break;
      }
      waitingCh = message.member.voice.channel;
      teamdata = await COMMAND.makeTeam(message);
      if (teamdata != null) {
        [teamAName, teamBName, teamAID, teamBID] = teamdata;
        teamAPower=await DB.calculTeamValue(teamAID, teamAName);
        //console.log(`result:${teamAPower}`);
        teamBPower=await DB.calculTeamValue(teamBID, teamBName);
        //console.log(`result:${teamBPower}`);
        TeamWindow(message.channel);
      } else {
        message.channel.send(
          "현재 채널 접속 인원이 홀수입니다. 짝수 인원으로 맞춰주세요!"
        );
      }
      break;
    case "!help":
      const iconImage = new AttachmentBuilder("./assets/icon.png");
      const helpEmbed = new EmbedBuilder()
      .setImage("https://images.app.goo.gl/CPgEwFff2o6DdLa87")
      .setColor("#10B4D1")
      .setTitle("👋안녕하세요! 🤖HR Office bot 입니다.")
      .setDescription(
        "저는 음성채널의 사람들을 무작위 팀으로 나누어 주는 봇입니다. 또한, DB에 저장된 데이터를 기반으로 개개인의 승률, 롤투력 등.. 다양한 정보를 제공합니다.\n\n\
        🎉 아래 명령어들을 사용해 보세요."
      )
      .addFields({
        name: "!help",
        value: "명령어 목록을 불러옵니다.",
      })
      .addFields({
        name: "!5vs5",
        value: "채널에 속해있는 모두에게 푸시 알림을 보냅니다.",
      })
      .addFields({
        name: "!dice",
        value: "1~99 범위를 갖는 주사위를 굴립니다.",
      })
      .addFields({
        name: "!team",
        value:
          "현재 접속해 있는 음성채널의 인원들로 팀을 구성합니다.\n\
        이때, 1팀 승리 / 2팀 승리 버튼을 통해 승패를 기록하기 위해서는 !register 명령어를 먼저 입력해야 합니다.",
      })
      .addFields({
        name: "!top3",
        value: "롤투력 상위 3인을 표시합니다.",
      })
      .addFields({
        name: "!dice",
        value: "1~99 범위를 갖는 주사위를 굴립니다.",
      })
      .addFields({
        name: "!register",
        value:
          "음성 채널에 접속해있는 인원을 DB에 등록합니다.(약 1~2분 정도 소요)",
      })
      .addFields({
        name: "!showAll",
        value: "DB에 저장된 모든 인원을 표시합니다.",
      })
      .addFields({
        name: "!show {name}",
        value: "name에 해당하는 인원을 표시합니다. (개발 중)",
      })
      .setFooter({ text: "🖥️Developed by. Junghyeon Jung, skfsjrnfl" });
      message.channel.send({ embeds: [helpEmbed], files: [iconImage] });
      break;
    case "!test":
      DB.insertNewUser(message.author);
      break;
  }
  if (message.content == "!top3") {
    const top3Data = await DB.getTop3(true);
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Top 3👑")
      .addFields(
        {
          name: "🥇 1️⃣등",
          value: `${top3Data[0]["NAME"]} ${top3Data[0]["POWER"]} 롤투력`,
        },
        {
          name: "🥈 2️⃣등 🫘",
          value: `${top3Data[1]["NAME"]} ${top3Data[1]["POWER"]} 롤투력`,
        },
        {
          name: "🥉 3️⃣등",
          value: `${top3Data[2]["NAME"]} ${top3Data[2]["POWER"]} 롤투력`,
        }
      );
    message.reply({ embeds: [exampleEmbed] });
  }
  if (message.content == "!register") {
    await COMMAND.registerUser(message);
    message.reply("등록까지 1~2분 소요됩니다.");
  }
  if (message.content == "!showAll") {
    const allData = await DB.getAllUserData();
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("User name / Win - Lose / Winning Percentage / LoL Power")
      .addFields(allData);
    message.reply({ embeds: [exampleEmbed] });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.component.data.custom_id === "rerollBtn") {
      interaction.reply(
        `**${interaction.user.username}**님이 '리롤 버튼'을 클릭했습니다.`
      );
      if (interaction.member.voice.channel !== waitingCh) {
        interaction.channel.send("내전 대기자만 누를 수 있습니다!");
      } else {
        teamdata = await COMMAND.makeTeam(interaction);
        if (teamdata != null) {
          await interaction.message.delete();
          [teamAName, teamBName, teamAID, teamBID] = teamdata;
          await TeamWindow(interaction.channel);
        } else {
          interaction.channel.send(
            "현재 채널 접속 인원이 홀수입니다. 짝수 인원으로 맞춰주세요!"
          );
        }
      }
    } else if (interaction.component.data.custom_id === "startBtn") {
       if (interaction.member.voice.channel !== waitingCh){
         interaction.reply("내전 대기자만 누를 수 있습니다!");
       }else{
        channellist=COMMAND.findEmptyChannel(interaction);
        if (channellist.size<1){
          interaction.reply("빈 음성 채널이 필요해요!");
        }else{
          subCh=channellist[0];
          COMMAND.moveTeam(waitingCh,teamAID,subCh);
          await interaction.channel.send({ files:[{attachment: "./assets/opening.gif"}]});
          interaction.reply("내전을 시작~ 하겠습니다~~🥊");
        }
      }
    } else if (interaction.component.data.custom_id === "team1winBtn") {
      interaction.reply(
        `**${interaction.user.username}**님이 '1팀 승리 버튼'을 클릭했습니다.`
      );
      COMMAND.moveTeam(subCh,teamAID,waitingCh);
      COMMAND.checkWin(teamAID,teamBID);
    } else if (interaction.component.data.custom_id === "team2winBtn") {
      interaction.reply(
        `**${interaction.user.username}**님이 '2팀 승리 버튼'을 클릭했습니다.`
      );
      COMMAND.moveTeam(waitingCh,teamBID,subChh);
      COMMAND.checkWin(teamBID,teamAID);
    }

    // if (checkDelay) {
    //   await interaction.message.delete();
    //   checkDelay = false;
    // } else {
    //   interaction.channel.send(`${interaction.user.username}야 그만눌러라...`);
    // }
  }
});

//Run Bot
client.login(token);
