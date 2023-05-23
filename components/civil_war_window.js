const{
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

module.exports = {
    async civilWarWindow(stage) {
        const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("내전을 시작~ 하겠습니다~~🥊")
        .addFields(
            { name: "1️⃣팀", value: stage.getTeamAName().join(", "), inline: true },
            { name: "LP 합계", value: `${teamAPower}`, inline: true },
            { name: "\u200b", value: "\u200b" },
            { name: "2️⃣팀", value: stage.getTeamBName().join(", "), inline: true },
            { name: "LP 합계", value: `${teamBPower}`, inline: true }
        );
        let btnRow = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId("teamAWinBtn")
              .setLabel("1️⃣팀 승리")
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId("teamBWinBtn")
              .setLabel("2️⃣팀 승리")
              .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
              .setCustomId("stopBtn")
              .setLabel("🛑중단🛑")
              .setStyle(ButtonStyle.Secondary)
        );
        return { embeds: [embed], components: [btnRow], files: [{ attachment: "./assets/opening.gif" }] };
    }
}