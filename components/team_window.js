const{
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

module.exports = {
    teamWindow(teamAName, teamBName, teamAPower, teamBPower) {
        const teamEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("팀 구성 결과🚀")
        .setURL("https://youtu.be/k6FmEwkD6SQ")
        .addFields(
          { name: "1️⃣팀", value: teamAName.join(", "), inline: true },
          { name: "LP 합계", value: `${teamAPower}`, inline: true },
          { name: "\u200b", value: "\u200b" },
          { name: "2️⃣팀", value: teamBName.join(", "), inline: true },
          { name: "LP 합계", value: `${teamBPower}`, inline: true }
        );

        let teamBtnRow = new ActionRowBuilder().setComponents(
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
        return { embeds: [teamEmbed], components: [teamBtnRow] };
    }
}