module.exports = {
	name:"5vs5",
	async execute(message) {
		const reply = await message.reply("@everyone 롤 내전 하실 분~");
      	reply.react("🙋‍♂️");
      	reply.react("🙅‍♂️");
	},
};