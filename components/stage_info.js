const{
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    stageInfo(stage) {
        const infoEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("스테이지 정보🚀")
        .addFields(
          { name: "호스트", value: stage.host.displayName},
          { name: "멤버", value: stage.getMembersName().join(", ")},
          { name: "텍스트 채널", value: stage.textChannel.name},
          { name: "음성 채널 1", value: stage.mainVoiceChannel.name},
          { name: "음성 채널 2", value: stage.subVoiceChannel.name}
        );
        return { embeds: [infoEmbed],};
    }
}