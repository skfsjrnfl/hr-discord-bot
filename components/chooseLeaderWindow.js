const{
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
    chooseLeaderWindow(cnt, waitingRoom) {
        const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        const selectDraftTeamMenu = new StringSelectMenuBuilder()
        let contents;
        if (cnt==0){
            contents=`${waitingRoom.host}`;
            embed.setTitle(`Choose Team 1 Leader`);
            selectDraftTeamMenu.setCustomId('selectDraftTeamALeaderMenu');
        }else if (cnt==1){
            contents=`${waitingRoom.host}`;
            embed.setTitle(`Choose Team 2 Leader`);
            selectDraftTeamMenu.setCustomId('selectDraftTeamBLeaderMenu');
        }else if (cnt%2==0){
            contents=`${waitingRoom.teamA[0]} `;
            embed.setTitle(`Choose Team 1 Member`);
            selectDraftTeamMenu.setCustomId('selectDraftTeamAMemberMenu');
        }else{
            contents=`${waitingRoom.teamB[0]}`;
            embed.setTitle(`Choose Team 2 Member`);
            selectDraftTeamMenu.setCustomId('selectDraftTeamBMemberMenu');
        }

        selectDraftTeamMenu.addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel("test1")
                .setValue("test1value"),
        )
        let selectRow = new ActionRowBuilder()
            .setComponents(selectDraftTeamMenu);

        let btnRow = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId("stopBtn")
                .setLabel("Stop")
                .setStyle(ButtonStyle.Danger),
        );
        return {content:contents, embeds: [embed], components: [selectRow,btnRow]};
    }
}