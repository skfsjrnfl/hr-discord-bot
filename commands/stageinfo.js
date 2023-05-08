module.exports = {
	name:"stageinfo",
	async execute(message) {
		const client = message.client;
        const stage = client.stages.get(message.guildId);
        if (!stage){
            message.reply("현재 생성된 스테이지가 없습니다!");
        }else{
            stage.showStageInfo();
        }
	},
};