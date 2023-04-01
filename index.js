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
} = require("discord.js");
const DB = require("./db_api.js");
const { token } = require("./config-dev.json"); //commit 시 수정

let team1Temp = [];
let team2Temp = [];
let checkDelay = false;

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

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on("error", (err) => {
  console.log(err.message);
});

async function registerUser(message) {
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

function makeTeam(message) {
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

client.on("messageCreate", async (message) => {
  if (message.author.username === "kwonSM") {
    message.react("💩");
  }
  if (message.content == "!5vs5") {
    message.reply("@everyone");
  }
  if (message.content == "!ping") {
    message.reply("pong");
  }
  if (message.content == "!dice") {
    message.channel.send("🎲주사위 굴리는 중...🎲");
    setTimeout(() => {
      message.reply(Math.floor(Math.random() * 100).toString());
    }, 1500);
  }
  if (message.content == "!help") {
    const explain = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("팀 구성 결과🚀")
      .setURL("https://discord.js.org/")
      .addFields(
        {
          name: "!team",
          value: "음성 채널에 접속해 있는 인원들로 팀구성\n 짝수 인원만 가능",
        },
        { name: "!dice", value: "1~99까지 나오는 주사위" },
        { name: "!5vs5", value: "5대5 소집령" }
      );
    message.reply({ embeds: [explain] });
  }
  if (message.content == "!team") {
    makeTeam(message);
    setTimeout(() => {
      checkDelay = true;
    }, 60000);
  }
  if (message.content == "!top3") {
    const top3Data = await DB.getTop3(true);
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Top 3👑")
      .addFields(
        {
          name: "1️⃣등",
          value: `${top3Data[0].name.title[0].text.content} ${top3Data[0].power.number} 롤투력`,
        },
        {
          name: "2️⃣등",
          value: `${top3Data[1].name.title[0].text.content} ${top3Data[1].power.number} 롤투력`,
        },
        {
          name: "3️⃣등",
          value: `${top3Data[2].name.title[0].text.content} ${top3Data[2].power.number} 롤투력`,
        }
      );
    message.reply({ embeds: [exampleEmbed] });
  }
  if (message.content == "!register") {
    await registerUser(message);
    message.reply("등록까지 1~2분 소요됩니다.");
  }
  if (message.content == "!showAll") {
    const userData = await DB.getAllUserData();
    let allData = [];
    userData.forEach((item) => {
      const percent =
        (item.properties.win.number /
          (item.properties.lose.number + item.properties.win.number)) *
        100;
      allData.push({
        name: `이름: ${item.properties.name.title[0].text.content}`,
        value: `승: ${item.properties.win.number} 
          패: ${item.properties.lose.number} 
          파워: ${item.properties.power.number} 
          승률: ${percent}`,
      });
    });
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("All user")
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
      makeTeam(interaction);
    } else if (
      interaction.component.data.custom_id === "team1winBtn" &&
      checkDelay
    ) {
      interaction.reply(
        `**${interaction.user.username}**님이 '1팀 승리 버튼'을 클릭했습니다.`
      );
      team1Temp.forEach(async (user) => {
        const userData1 = await DB.searchUser(user);
        await DB.updateValue(userData1, "win");
      });
      team2Temp.forEach(async (user) => {
        const userData2 = await DB.searchUser(user);
        await DB.updateValue(userData2, "lose");
      });
    } else if (
      interaction.component.data.custom_id === "team2winBtn" &&
      checkDelay
    ) {
      interaction.reply(
        `**${interaction.user.username}**님이 '2팀 승리 버튼'을 클릭했습니다.`
      );
      team1Temp.forEach(async (user) => {
        const userData1 = await DB.searchUser(user);
        await DB.updateValue(userData1, "lose");
      });
      team2Temp.forEach(async (user) => {
        const userData2 = await DB.searchUser(user);
        await DB.updateValue(userData2, "win");
      });
    }
    if (checkDelay) {
      await interaction.message.delete();
      checkDelay = false;
    } else {
      interaction.reply("1분 뒤에 동작 가능합니다.");
    }
  }
});


//Run Bot
client.login(token);
