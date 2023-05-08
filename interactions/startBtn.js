module.exports = {
	name:"startBtn",
	async execute(interaction) {
		const client=interaction.client;
        const stage=client.stages.get(interaction.guildId);
		if (stage.host.user.id!=interaction.member.user.id){
            interaction.reply("오직 호스트만 상호작용이 가능합니다!");
            return;
        }
		stage.moveTeamsEachChannel();
		await interaction.channel.send({
            files: [{ attachment: "./assets/opening.gif" }],
        });
        interaction.reply("내전을 시작~ 하겠습니다~~🥊");
		return;
	},
};