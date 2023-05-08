module.exports = {
	name:"stopBtn",
	async execute(interaction) {
		const client=interaction.client;
        const stage=client.stages.get(interaction.guildId);
        if (stage.host.user.id!=interaction.member.user.id){
            interaction.reply("오직 호스트만 상호작용이 가능합니다!");
            return;
        }
        client.stages.delete(interaction.guildId);
        interaction.reply("내전이 중단되었습니다");
        interaction.message.delete();
        
		return;
	},
};