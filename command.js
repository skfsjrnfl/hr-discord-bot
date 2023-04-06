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
var exports = (module.exports = {});

exports.rollDice = function () {
  return Math.floor(Math.random() * 100);
};

exports.registerUser = async function (message) {
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
};

exports.makeTeam = async function (message) {
  var channel = await message.guild.channels.fetch(
    message.member.voice.channel.id
  );
  if (channel.members.size % 2 === 1) {
    return null;
  } else {
    let waiting = [];
    channel.members.forEach((k, v) => {
      let nick_id = [k.displayName, k.id, Math.floor(Math.random() * 1000)];
      waiting.push(nick_id);
    });
    waiting.sort((a, b) => {
      return a[2] >= b[2] ? 1 : -1;
    });
    const half = channel.members.size / 2;
    let a_name = [];
    let b_name = [];
    let a_id = [];
    let b_id = [];
    for (let i = 0; i < half; i++) {
      a_name.push(waiting[i][0]);
      a_id.push(waiting[i][1]);
      b_name.push(waiting[i + half][0]);
      b_id.push(waiting[i + half][1]);
    }
    return [a_name, b_name, a_id, b_id];
  }
};
