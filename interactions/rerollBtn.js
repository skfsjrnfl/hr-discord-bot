const {teamWindow} = require("../components/team_window.js");
module.exports = {
	name:"rerollBtn",
	async execute(interaction) {
		const client=interaction.client;
        const stage=client.stages.get(interaction.guildId);
        if (stage.host.user.id!=interaction.member.user.id){
            interaction.reply("오직 호스트만 상호작용이 가능합니다!");
            return;
        }
		stage.makeTeamRandom();
        const teamAName = stage.getTeamAName();
        const teamBName = stage.getTeamBName();
        interaction.reply(teamWindow(teamAName,teamBName,"구현 예정","구현 예정"));
        interaction.message.delete();
		return;
	},
};