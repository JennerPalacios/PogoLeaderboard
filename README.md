# PogoLeaderboard
A fairly simple Module to store and generate a Pokemon leaderboard, can be plugged in with just about any discord.js based bot.


Leaderboard usage

Required installs: 
npm install fs
npm install write-json-file

To generate the Discord player message requires the Emojis module as well - Join and then add your bot to this server for emoji access https://discord.gg/zqVCfPy
const Leaderboard=require('./Leaderboard.js');
const Emojis=require('/Emojis.js');

const emojis = new Emojis.DiscordEmojis();
const leaderboard = new Leaderboard.Leaderboard('insert path/file name here');


functions:

Leaderboard.Load(filename) - Only needed if you don't pass a filename during constructor
Leaderboard.Get(key) - best to use discordID but any unique key will ultimately do - returns a Player() object.
Leaderboard.Set(key,Player) - Adds or updates a player in the database
Leaderboard.Top(value, stat) - will provide a list of the top X(value) players for the provided stat
Leaderboard.Snapshot(filename) - Save a copy of the current leaderboard to a new filename location(make sure the file path/folder exist I didn't handle the error that happens if it doesn't yet)
Leaderboard.Compare(leaderboard) - Compare the current leaderboard to an older set of data to generate a progress/change.  Useful for generating monthly, weekly, daily or however frequently reports you want.
Leaderboard.Help() - returns instructions based on how I implemented user input that said you could implement user input differently and this wouldn't be all that useful
Leaderboard.Save() - force a save to file of the data, shouldn't ever need to be called manually
Leaderboard.GetLeadersDiscrd(count, imageURL) - returns an array of embed messages for the top count of each stat across the entire leaderboard.  I pass guild.iconURL for the image, it's optional but adds a thumbnail to the embed.


Player.Update(args) - Expects an array of arguments in stat/value pairs i.e. args[0] will be a stat name, args[1] will be the value, args[2] will be a second stat, args[3] the value. 
Player.Compare(player) - Subtracts the passed player from the calling player and returns a result, positive numbers indicate the calling player is ahead and negative numbers would indicate how far behind they are.
Player.GetDiscordEmbed(emojis) - this is where the Emojis class comes in, generates a Discord embed to show a given player's stat.


This module is designed so that you can parse/get user input however you like and plug this in to just about any discord.js based bot with minimal effort.

I run an ontime script to save the leaderboard at the beginning of each month so that I can then run Leaderboard.Compare() the following month to generate comparison data.
