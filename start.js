const ms = require('ms');
const { prefix } = require('../config.json');


module.exports = {
	name: 'start',
        aliases: ['gstart','giveaway-start'],
	description: 'Starts a giveaway',
	execute(client, message, args) {
    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send(':boom: You need to have the \`MANAGE_MESSAGES\` permissions to start giveaways.');
    }

    let giveawayChannel = message.mentions.channels.first();
    if(!giveawayChannel){
        return message.channel.send(':boom: Uh oh, I couldn\'t find that channel! Try again!');
    }

    let giveawayDuration = args[1];
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send(':boom: Hm. you haven\'t provided a duration. Can you try again?');
    }
    
    if(ms(giveawayDuration) > 1296000000){
        return message.channel.send(':boom: You can\'t start a giveaway longer than \`15 days\`! ');
    }

    let giveawayNumberWinners = args[2];
    if(isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)){
        return message.channel.send(':boom: Uh... you haven\'t provided the amount of winners.');
    }

    let giveawayPrize = args.slice(3).join(' ');
    if(!giveawayPrize){
        return message.channel.send(':boom: Oh, it seems like you didn\'t give me a valid prize!');
    }

  client.giveawaysManager.start(giveawayChannel, {
    time: ms(giveawayDuration),
    prize: giveawayPrize,
    winnerCount: giveawayNumberWinners,
    hostedBy: client.config.hostedBy ? message.author : null,
    messages: {
      giveaway:
        (client.config.everyoneMention ? "@everyone\n\n" : "") +
        ":tada: **GIVEAWAY** :tada:",
      giveawayEnded:
        (client.config.everyoneMention ? "@everyone\n\n" : "") +
        ":tada: **GIVEAWAY ENDED** :tada:",
      timeRemaining: "Time remaining: **{duration}**!",
      inviteToParticipate: "React with ⚔️ to participate!",
      winMessage: "> Giveaway ended. Winners: {winners}, Prize: {prize}. ",
      embedFooter: "Giveaways",
      noWinner: "Not enough entrants to determine a winner!",
      hostedBy: "Hosted by: {user}",
      winners: "winner(s)",
      endedAt: "Ended at",
      units: {
        seconds: "seconds",
        minutes: "minutes",
        hours: "hours",
        days: "days",
        pluralS: false
      }
    }
  });

  message.channel.send(`:tada: Done! The giveaway for the \`${giveawayPrize}\` is starting in ${giveawayChannel}!`);
}
}
