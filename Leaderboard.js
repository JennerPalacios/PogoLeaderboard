const writeJsonFile = require('write-json-file');
const fs = require("fs");


var valorIcon = "https://raw.githubusercontent.com/novskey/novabot/dev/static/icons/valor.png";
var mysticIcon = "https://raw.githubusercontent.com/novskey/novabot/dev/static/icons/mystic.png";
var instinctIcon = "https://raw.githubusercontent.com/novskey/novabot/dev/static/icons/instinct.png";
var harmonyIcon = "https://raw.githubusercontent.com/novskey/novabot/dev/static/icons/uncontested.png";
var serverIcon = "https://cdn.discordapp.com/icons/270619328678723614/a91da2dd7b1eb5ddad84b0839b91fed3.jpg";


var playerInputDictionary;
var playerStatCategories = [];

let _leaderboardData = new WeakMap();



class Leaderboard
{
    constructor(filename, name)
    {
        var data = new Map();
        _leaderboardData.set(this,data);

        this.Load(filename);
        LoadPlayerInputMap();

        this.name=name;
        

        this.Top = GetLeaderboardTop;

        this.Snapshot = SaveSnapshot;

        this.Compare = LeaderboardCompare;

        this.GetLeadersDiscord = GenerateDiscordLeaderboard;
    }

    Get(key)
    {
        let data = _leaderboardData.get(this);
        let player = data.get(key);

        if(!player) { player = new Player(key); data.set(key,player)}
        return player;
    }

    Set(key,value)
    {
        let data = _leaderboardData.get(this);
        data.set(key,value);
        _leaderboardData.set(this,data);
        this.Save();
        return;
    }

    Load(filename)
    {
        let data = new Map();
        let saveData = LoadJSONMap(filename);
        this._filename = filename; 

        if(saveData)
        {
            saveData.forEach(function(savedPlayer)
            {
                let player = new Player();

                player.id = savedPlayer.id; 
                player.name = savedPlayer.name;
                player.team = savedPlayer.team;
                player.xp = savedPlayer.xp;
                player.xpPerDay = savedPlayer.xpPerDay;
                player.startDate = savedPlayer.startDate;
                player.lastUpdated = savedPlayer.lastUpdated;
                player.maxedMon = savedPlayer.maxedMon;
                player._100s = savedPlayer._100s;
                player.unique100s = savedPlayer.unique100s;
                player._3000 = savedPlayer._3000;        
                player.kanto = savedPlayer.kanto;
                player.johto = savedPlayer.johto;
                player.hoenn = savedPlayer.hoenn;
                player.jogger = savedPlayer.jogger;
                player.collector = savedPlayer.collector;
                player.scientist = savedPlayer.scientist;
                player.breeder = savedPlayer.breeder;
                player.backpacker = savedPlayer.backpacker;
                player.battleGirl = savedPlayer.battleGirl;
                player.battleLegend = savedPlayer.battleLegend;
                player.champion = savedPlayer.champion;
                player.youngster = savedPlayer.youngster;
                player.berryMaster = savedPlayer.berryMaster;
                player.gymLeader = savedPlayer.gymLeader;
                player.fisherman = savedPlayer.fisherman;
                player.aceTrainer = savedPlayer.aceTrainer;
                player.pikachuFan = savedPlayer.pikachuFan;
                player.unown = savedPlayer.unown;
                player.pokemonRanger = savedPlayer.pokemonRanger;
                player.shiny = savedPlayer.shiny;
                player.normal = savedPlayer.normal;
                player.fighting = savedPlayer.fighting;
                player.flying = savedPlayer.flying;
                player.poison = savedPlayer.poison;            
                player.ground = savedPlayer.ground;
                player.rock = savedPlayer.rock;
                player.bug = savedPlayer.bug;
                player.ghost = savedPlayer.ghost;
                player.steel = savedPlayer.steel;
                player.fire = savedPlayer.fire;
                player.water = savedPlayer.water;
                player.grass = savedPlayer.grass;
                player.electric = savedPlayer.electric;
                player.psychic = savedPlayer.psychic;
                player.ice = savedPlayer.ice;
                player.dragon = savedPlayer.dragon;
                player.dark = savedPlayer.dark;
                player.fairy = savedPlayer.fairy;        
                player.goldGym = savedPlayer.goldGym;
                player.silverGym = savedPlayer.silverGym;
                player.bronzeGym = savedPlayer.bronzeGym;
                player.noBadge = savedPlayer.noBadge;
                player.totalGyms = savedPlayer.totalGyms;      
                player.trainerImage = savedPlayer.trainerImage;

                data.set(player.id,player);
            });
        }

        _leaderboardData.set(this, data);   

        return;
    }

    Save()
    {
        let data = _leaderboardData.get(this);

        SaveJSONMap(this._filename,data);
        return;
    }

    Help()
    {
        return "```Usage:\n"
                        +"!leaderboard - Display your own player card\n"
                        +"!leaderboard @mention - Display the mentioned person's player card\n"
                        +"!leaderboard update stat value - You can use stat and value in any quantity of pairs, i.e. you can update more than one per command input\n"
                        +"!leaderboard top # stat - Generate a list of the top # of a given stat, can be any number between 1 and 100\n"
                        +"!leaderboard compare @mention - Generate a comparison between you and another player, positive numbers indicate you have a higher value on a particular stat, negative is how far they are ahead of you\n```";
    }

}

function SaveSnapshot(filename)
{
    let leaderboardSnapshot = new Leaderboard(filename);
    
    let data = _leaderboardData.get(this);  

    _leaderboardData.set(leaderboardSnapshot,data);

    leaderboardSnapshot.Save();

    return;
}


function LeaderboardCompare(leaderboard)
{
    // This would work but no point in doing it
    if(this===leaderboard) { console.log("You are attempting to compare the same leaderboard to itself"); return; }

    let newerData = _leaderboardData.get(this);
    let olderData = _leaderboardData.get(leaderboard);

    let comparison = new Map();
    let comparisonLeaderboard = new Leaderboard();

    newerData.forEach(function(player) {
        let oldPlayer = olderData.get(player.id);
        if(oldPlayer)
        {
            let difference = SubtractPlayers(player,oldPlayer);
            difference.id = player.id;    
            difference.name = player.name;     
            difference.team = player.team;
            difference.trainerImage = player.trainerImage; 
            difference.startDate = player.startDate;
            difference.lastUpdated = player.lastUpdated;

            let daysPlayed =  (player.lastUpdated - oldPlayer.lastUpdated) / 86400000;
            let xpPerDay = difference.xp / daysPlayed;
            xpPerDay = PrecisionRound(xpPerDay,2);
            difference.xpPerDay = xpPerDay;

            comparison.set(difference.id,difference);
        }        

    });

    _leaderboardData.set(comparisonLeaderboard,comparison);   

    return comparisonLeaderboard;
}

function GenerateDiscordLeaderboard(count, image)
{    

    // GOLD
    let color = 0xD4AF37;

    let returnEmbeds = [];

    let currentEmbed = "";

    for(var i = 0; i < playerStatCategories.length; i++)
    {
        let currentStat = playerStatCategories[i].toLowerCase();

        let newString = '***'+playerStatCategories[i]+':***\n';

        let currentStatTop = this.Top(count,currentStat);

        newString += currentStatTop;
        newString +='\n';

        let tempString = currentEmbed + newString;

        if(tempString.length > 2048)
        {
            let embedMSG={
                'color': color,
                'title': this.name,
                'thumbnail': {'url': image},        
                'description':  currentEmbed
                    
            };

            returnEmbeds.push({embed: embedMSG});

            currentEmbed = newString;
        }
        else
        {
            currentEmbed += newString;
        }
    }

    let embedMSG={
            'color': color,
            'title': this.name,
            'thumbnail': {'url': image},        
            'description':  currentEmbed
                
        };

    returnEmbeds.push({embed: embedMSG});
    

    

    return returnEmbeds;
}


function GetLeaderboardTop(count, stat)
{
    if(!stat) { return "```Please enter a stat for me to check```"; }
    if(!count) { return "```I need a count to run a total on```"; }
    let originalCount = count;
    let originalInput = stat;    
    stat = stat.toLowerCase();
    stat = playerInputDictionary.get(stat);     
    if(!stat) { return "```I could not find a player stat category with the name: "+originalInput+"```"; }
    if(!ShouldBeANumber(stat)) { return "```I cannot generate a leaderboard for that stat: "+stat+"```"; }
    if(count > 100 || count < 1) { return "```Please enter a value between 1 and 100 for a top leaderboard```"; }

    let statLeaderboard = [];
    let currentPlayer = {};

    let data = _leaderboardData.get(this);

    data.forEach(function(player)
    {
        currentPlayer = { name:"", total:0 };
        statLeaderboard.push(currentPlayer);

    });

    count = statLeaderboard.length;
    

    data.forEach(function(player) {
        currentPlayer = { name:player.name, total:player[stat] };

        // Players who never set their data are ignored
        if(currentPlayer.name != "Please Set your Trainer Name")
        {
            for(var i = count-1; i >= 0; i--)
            {            
                if(currentPlayer.total > statLeaderboard[i].total)
                {
                    if(i===count-1)
                    {
                        statLeaderboard[i] = currentPlayer;                    
                    }
                    else
                    {
                        statLeaderboard[i+1] = statLeaderboard[i];
                        statLeaderboard[i] = currentPlayer;
                    }
                }
            }
        }
    });

    // TRIM EMPTY SPOTS OFF THE BOTTOM OF THE LEADERBOARD
    var i = statLeaderboard.length-1;

    while(statLeaderboard[i].name==="")
    {
        statLeaderboard.pop();
        i--;
    }

    count = statLeaderboard.length;
    
    let returnString = "";

    let currentPlace = 1;
    let totalPlaced = 0;
    let placedSinceLastBreak = 0;
    let medalPlace = 1;
    for(var i = 0; i < count; i++)
    {
        
        if(medalPlace===1) {returnString += ":first_place:"}
        if(medalPlace===2) {returnString += ":second_place:"}
        if(medalPlace===3) {returnString += ":third_place:"}
        if(currentPlace>3) {returnString+="       "}


        returnString += " "+currentPlace+") **"+statLeaderboard[i].name+":** "+statLeaderboard[i].total;
        
        

        totalPlaced++;
        placedSinceLastBreak++;
        
        if(i != count-1)
        {
            if(statLeaderboard[i].total > statLeaderboard[i+1].total) { currentPlace += placedSinceLastBreak; medalPlace += placedSinceLastBreak; placedSinceLastBreak = 0 } 
        }

        if(currentPlace > originalCount) { break; }

        returnString += "\n";

    }
    return returnString;
}


function UpdatePlayer(args)
{

    let updatedStats = "```Errors:\n";
    let errorCount = 0;    
 

    if(args.length < 2)
    {
        updatedStats += "I could not read what you wanted me to update: "+args+"```";
    }
    else
    {
        for(var i = 0; i < args.length; i=i+2)
        {
            let returnString = ParseUpdateArguments(args[i], args[i+1], this);
            if(returnString!="")
            {
                updatedStats += returnString;
                updatedStats +="\n";
                errorCount++;
            }
        }
        if(errorCount===0) {updatedStats += "None"}
        updatedStats += "```";
    }

    this.totalGyms = this.goldGym+this.silverGym+this.bronzeGym+this.noBadge;
    
    this.lastUpdated = new Date().getTime();

    let daysPlayed =  (this.lastUpdated - this.startDate) / 86400000;
    let xpPerDay = this.xp / daysPlayed;
    xpPerDay = PrecisionRound(xpPerDay,2);
    this.xpPerDay = xpPerDay;    

    return updatedStats;
}

function SubtractPlayers(player1, player2)
{
    var result = new Player();

    result.xp = player1.xp - player2.xp;
    result.xpPerDay = player1.xpPerDay - player2.xpPerDay;
    result.maxedMon = player1.maxedMon - player2.maxedMon;
    result._3000 = player1._3000 - player2._3000;
    result._100s = player1._100s - player2._100s;
    result.unique100s = player1.unique100s - player2.unique100s;
    result.kanto = player1.kanto - player2.kanto;
    result.johto = player1.johto - player2.johto;
    result.hoenn = player1.hoenn - player2.hoenn;
    result.jogger = player1.jogger - player2.jogger;
    result.collector = player1.collector - player2.collector;
    result.scientist = player1.scientist - player2.scientist;
    result.breeder = player1.breeder - player2.breeder;
    result.backpacker = player1.backpacker - player2.backpacker;
    result.battleGirl = player1.battleGirl - player2.battleGirl;
    result.youngster = player1.youngster - player2.youngster;
    result.berryMaster = player1.berryMaster - player2.berryMaster;
    result.gymLeader = player1.gymLeader - player2.gymLeader;
    result.fisherman = player1.fisherman - player2.fisherman;
    result.aceTrainer = player1.aceTrainer - player2.aceTrainer;
    result.pikachuFan = player1.pikachuFan - player2.pikachuFan;
    result.champion = player1.champion - player2.champion;
    result.battleLegend = player1.battleLegend - player2.battleLegend;
    result.pokemonRanger = player1.pokemonRanger - player2.pokemonRanger;
    result.unown = player1.unown - player2.unown;
    result.normal = player1.normal - player2.normal;
    result.fighting = player1.fighting - player2.fighting;
    result.flying = player1.flying - player2.flying;
    result.poison = player1.poison - player2.poison;
    result.ground = player1.ground - player2.ground;
    result.rock = player1.rock - player2.rock;
    result.bug = player1.bug - player2.bug;
    result.ghost = player1.ghost - player2.ghost;
    result.steel = player1.steel - player2.steel;
    result.fire = player1.fire - player2.fire;
    result.water = player1.water - player2.water;
    result.grass = player1.grass - player2.grass;
    result.electric = player1.electric - player2.electric;
    result.psychic = player1.psychic - player2.psychic;
    result.ice = player1.ice - player2.ice;
    result.dragon = player1.dragon - player2.dragon;
    result.dark = player1.dark - player2.dark;
    result.fairy = player1.fairy - player2.fairy;
    result.goldGym = player1.goldGym - player2.goldGym;
    result.silverGym = player1.silverGym - player2.silverGym;
    result.bronzeGym = player1.bronzeGym - player2.bronzeGym;
    result.noBadge = player1.noBadge - player2.noBadge;
    result.totalGyms = player1.totalGyms - player2.totalGyms;

    result.xpPerDay = PrecisionRound(result.xpPerDay,2);
    result.jogger = PrecisionRound(result.jogger,2);

    return result;
}

function ComparePlayer(player)
{
    let result = SubtractPlayers(this,player);
    result.name = "Comparison of "+this.name+" & "+player.name;
    result.team = (this.xp > player.xp) ? this.team : player.team;    

    return result;
}


//Requires access to Discord emojis as specified in the embed message below Emojis.js will load them via the Emojis class
// https://discord.gg/zqVCfPy is a server with all the emojis on it that you can add your bot to
function GenerateDiscordMessage(emojis)
{
    

    var color;
    var thumbnailIcon;

    switch(this.team)
    {
        case "harmony":
        color=0x9e9e9e;
        thumbnailIcon=harmonyIcon;
        break;
        case "valor":
        color=0xff0000;
        thumbnailIcon=valorIcon;
        break;
        case "instinct":
        color=0xffff00;
        thumbnailIcon=instinctIcon;
        break;
        case "mystic":
        color=0x0000ff;
        thumbnailIcon=mysticIcon;
        break;
        default:
        color = 0x000000;  
        thumbnailIcon=harmonyIcon;      
    }    
    

    let embedMSG={
        'color': color,
        'title': this.name,
        'thumbnail': {'url': thumbnailIcon},
        'image': {'url': this.trainerImage},
        'description': '**XP**: '+this.xp+' '+'         **XP/Day**: '+this.xpPerDay+'\n**Maxed**: '+this.maxedMon+' '
            +'               **3000+ CP**: '+this._3000+'\n'+'**Total 100%**: '+this._100s+'       **Unique 100%**: '+this.unique100s
            +'\n**Kanto/Johto/Hoenn**: '+this.kanto+'/'+this.johto+'/'+this.hoenn+'\n**Jogger**: '+this.jogger+' '+"        **Collector**: "+this.collector
            +'\n**Scientist**: '+this.scientist+'        **Breeder**: '+this.breeder+'\n**Backpacker**: '+this.backpacker
            +'   **Battle Girl**: '+this.battleGirl+'\n**Youngster**: '+this.youngster+'        **Berry Master**: '+this.berryMaster
            +'\n**Gym Leader**: '+this.gymLeader+'  **Fisherman**: '+this.fisherman+'\n**Ace Trainer**: '+this.aceTrainer
            +'       **Pikachu Fan**: '+this.pikachuFan+'\n**Champion**: '+this.champion+'           **Battle Legend**: '+this.battleLegend
            +'\n**Ranger** :'+this.pokemonRanger+'               **Unown**: '+this.unown+'\n'+'**Unique Shinies:** '+this.shiny+'\n\n'
            +emojis.normal+":"+this.normal+" "+emojis.fighting+":"+this.fighting+" "
            +emojis.flying+":"+this.flying+" "+emojis.poison+":"+this.poison+"\n"+emojis.ground+":"+this.ground+" "+emojis.rock+":"+this.rock+" "
            +emojis.bug+":"+this.bug+" "+emojis.ghost+":"+this.ghost+"\n"+emojis.steel+":"+this.steel+" "+emojis.fire+":"+this.fire+" "
            +emojis.water+":"+this.water+" "+emojis.grass+":"+this.grass+"\n"+emojis.electric+":"+this.electric+" "+emojis.psychic+":"+this.psychic+" "
            +emojis.ice+":"+this.ice+" "+emojis.dragon+":"+this.dragon+"\n"+emojis.dark+":"+this.dark+" "+emojis.fairy+":"+this.fairy
            +"\n\n"+emojis.gold+":"+this.goldGym+" "+emojis.silver+":"+this.silverGym+" "+emojis.bronze+":"+this.bronzeGym+" "+emojis.uncontested+":"+this.noBadge+" "
            +"\nTotal Gyms: "+this.totalGyms
            
    };
    

    return {embed: embedMSG};
}

function LoadJSONMap(filePath)
{
	var returnData;

	if(fs.existsSync(filePath))
	{			
		returnData = fs.readFileSync(filePath);
		returnData = new Map(JSON.parse(returnData));
		return returnData;
	}
	else
	{
		return null;
	}
}


function SaveJSONMap(filePath, data)
{
	return fs.writeFileSync(filePath,JSON.stringify([...data]));
}


function ParseUpdateArguments(item, value, player)
{
    let originalInput = item;
    item = item.toLowerCase();
    item = playerInputDictionary.get(item); 
    if(!item) { item = originalInput; }  
    let returnString = "";

    if(item==="xpPerDay" || item==="totalGyms") { return "That value is calculated automatically and cannot be updated manually" }

    if(ShouldBeANumber(item))
    {
        if(!isNaN(value))
        {
           
            player[item] = Number(value);
            
        }
        else
        {
            returnString = "In order to update "+item+" I need a numerical value you submitted: "+value;
        }
    }
    else
    {
        var dateArray;
        switch(item)
        {
            case "name":
            player.name = value;            
            break;
            case "trainername":
            player.name = value;
            break;
            case "team":
            value = value.toLowerCase();
            if(value != "valor" || value != "mystic" || value != "instinct" || value != "harmony")
            {    
                player.team = value;
            }
            else
            {
                returnString = "I could not update your team name to: "+value+". Please specify Valor, Instinc, Mystic or Harmony";
            }
            break;
            case "startdate":
            dateArray = value.split("/");
            if(dateArray.length != 3)
            {
                returnString = "I could not update your start date, proper format is MM/DD/YYYY";
            }
            else
            {
                if(dateArray[2].length == 2)
                {
                    dateArray[2] = "20"+dateArray[2];
                }

                player.startDate = new Date(dateArray[2],dateArray[0]-1,dateArray[1]).getTime();
            }            
            break;
            case "start":
            dateArray = value.split("/");
            if(dateArray.length != 3)
            {
                returnString = "I could not update your start date, proper format is MM/DD/YYYY";
            }
            else
            {
                if(dateArray[2].length == 2)
                {
                    dateArray[2] = "20"+dateArray[2];
                }

                player.startDate = new Date(dateArray[2],dateArray[0]-1,dateArray[1]).getTime();
            }            
            break;
            case "trainerimage":
            if(value.match(/http/gi))
            {
                player.trainerImage = value;
            }
            else
            {
                returnString = "Your trainerimage must be a valid URL linking directly to an image file";
            }
            break;
            default:
            returnString = "I am not sure what to do with this argument: "+item+" and a value of: "+value;
        }

    }

    return returnString;
}

function ShouldBeANumber(item)
{
    switch(item)
    {
        case "xp":
        return true;
        break;     
        case "xpPerDay":
        return true;
        break;  
        case "maxedMon":
        return true;
        break;
        case "_100s":
        return true;
        break;
        case "unique100s":
        return true;
        break;
        case "_3000":
        return true;
        break;
        case "kanto":
        return true;
        break;
        case "johto":
        return true;
        break;
        case "hoenn":
        return true;
        break;
        case "jogger":
        return true;
        break;
        case "collector":
        return true;
        break;
        case "scientist":
        return true;
        break;
        case "breeder":
        return true;
        break;
        case "backpacker":
        return true;
        break;
        case "battleGirl":
        return true;
        break;
        case "youngster":
        return true;
        break;
        case "berryMaster":
        return true;
        break;
        case "gymLeader":
        return true;
        break;
        case "fisherman":
        return true;
        break;
        case "aceTrainer":
        return true;
        break;
        case "pikachuFan":
        return true;
        break;
        case "unown":
        return true;
        break;
        case "champion":
        return true;
        break;
        case "battleLegend":
        return true;
        break;
        case "pokemonRanger":
        return true;
        break;
        case "shiny":
        return true;
        break;
        case "normal":
        return true;
        break;
        case "fighting":
        return true;
        break;
        case "flying":
        return true;
        break;
        case "poison":
        return true;
        break;
        case "ground":
        return true;
        break;
        case "rock":
        return true;
        break;
        case "bug":
        return true;
        break;
        case "ghost":
        return true;
        break;
        case "steel":
        return true;
        break;
        case "fire":
        return true;
        break;
        case "water":
        return true;
        break;
        case "grass":
        return true;
        break;
        case "electric":
        return true;
        break;
        case "psychic":
        return true;
        break;
        case "ice":
        return true;
        break;
        case "dragon":
        return true;
        break;
        case "dark":
        return true;
        break;
        case "fairy":
        return true;
        break;
        case "goldGym":
        return true;
        break;
        case "silverGym":
        return true;
        break;
        case "bronzeGym":
        return true;
        break;
        case "noBadge":
        return true;
        break;
        case "totalGyms":
        return true;
        break;
        default:
        return false;

    }
}


class Player
{
    constructor(userID)
    {
        var pogoReleaseDate = new Date('July 7, 2016').getTime();
        var currentDate = new Date().getTime();

        this.id = userID; 
        this.name = "Please Set your Trainer Name";
        this.team = "harmony";
        this.xp = 1;
        this.xpPerDay = 0;
        this.startDate = pogoReleaseDate;
        this.lastUpdated = currentDate;
        this.maxedMon = 0;
        this._100s = 0;
        this.unique100s = 0;
        this._3000 = 0;        
        this.kanto = 0;
        this.johto = 0;
        this.hoenn = 0;
        this.jogger = 0;
        this.collector = 0;
        this.scientist = 0;
        this.breeder = 0;
        this.backpacker = 0;
        this.battleGirl = 0;
        this.battleLegend = 0;
        this.champion = 0;
        this.youngster = 0;
        this.berryMaster = 0;
        this.gymLeader = 0;
        this.fisherman = 0;
        this.aceTrainer = 0;
        this.pikachuFan = 0;
        this.unown = 0;
        this.pokemonRanger = 0;
        this.shiny = 0;
        this.normal = 0;
        this.fighting = 0;
        this.flying = 0;
        this.poison = 0;
        this.ground = 0;
        this.rock = 0;
        this.bug = 0;
        this.ghost = 0;
        this.steel = 0;
        this.fire = 0;
        this.water = 0;
        this.grass = 0;
        this.electric = 0;
        this.psychic = 0;
        this.ice = 0;
        this.dragon = 0;
        this.dark = 0;
        this.fairy = 0;        
        this.goldGym = 0;
        this.silverGym = 0;
        this.bronzeGym = 0;
        this.noBadge = 0;
        this.totalGyms = 0;      
        this.trainerImage = "";


        // FUNCTIONS
        this.Update = UpdatePlayer;
        this.GetDiscordEmbed = GenerateDiscordMessage;
        this.Compare = ComparePlayer;
        
    }
}

function PrecisionRound(number, precision) 
{
	var factor = Math.pow(10, precision);
	return Math.round(number * factor) / factor;
}

function LoadPlayerInputMap()
{
    if(!playerInputDictionary) { playerInputDictionary = new Map(); }
    playerInputDictionary.set("xp","xp");
    playerInputDictionary.set("exp","xp");
    playerInputDictionary.set("experience","xp");    
    playerInputDictionary.set("totalxp","xp");  
    playerInputDictionary.set("xpperday","xpPerDay");  
    playerInputDictionary.set("max","maxedMon");
    playerInputDictionary.set("maxed","maxedMon");
    playerInputDictionary.set("maxedmon","maxedMon");
    playerInputDictionary.set("100","_100s");
    playerInputDictionary.set("100s","_100s");
    playerInputDictionary.set("100%","_100s");
    playerInputDictionary.set("unique","unique100s");
    playerInputDictionary.set("unique100","unique100s");
    playerInputDictionary.set("unique100s","unique100s");
    playerInputDictionary.set("unique100%","unique100s");
    playerInputDictionary.set("3000","_3000");
    playerInputDictionary.set("3000s","_3000");
    playerInputDictionary.set("3000+","_3000");
    playerInputDictionary.set("3000cp","_3000");
    playerInputDictionary.set("3000+cp","_3000");
    playerInputDictionary.set("kanto","kanto");
    playerInputDictionary.set("johto","johto");
    playerInputDictionary.set("hoenn","hoenn");
    playerInputDictionary.set("jog","jogger");
    playerInputDictionary.set("jogger","jogger");
    playerInputDictionary.set("distance","jogger");
    playerInputDictionary.set("collector","collector");
    playerInputDictionary.set("collect","collector");
    playerInputDictionary.set("col","collector");
    playerInputDictionary.set("catch","collector");
    playerInputDictionary.set("scientist","scientist");
    playerInputDictionary.set("science","scientist");
    playerInputDictionary.set("evolve","scientist");
    playerInputDictionary.set("breeder","breeder");
    playerInputDictionary.set("breed","breeder");
    playerInputDictionary.set("hatch","breeder");
    playerInputDictionary.set("backpacker","backpacker");
    playerInputDictionary.set("backpack","backpacker");
    playerInputDictionary.set("stops","backpacker");
    playerInputDictionary.set("battlegirl","battleGirl");
    playerInputDictionary.set("battle","battleGirl");
    playerInputDictionary.set("youngster","youngster");
    playerInputDictionary.set("rattata","youngster");
    playerInputDictionary.set("rat","youngster");
    playerInputDictionary.set("berrymaster","berryMaster");
    playerInputDictionary.set("berry","berryMaster");
    playerInputDictionary.set("gymleader","gymLeader");        
    playerInputDictionary.set("defend","gymLeader");
    playerInputDictionary.set("fisherman","fisherman");
    playerInputDictionary.set("fish","fisherman");
    playerInputDictionary.set("karp","fisherman");
    playerInputDictionary.set("magikarp","fisherman");
    playerInputDictionary.set("acetrainer","aceTrainer");
    playerInputDictionary.set("trainer","aceTrainer");
    playerInputDictionary.set("pikachu","pikachuFan");
    playerInputDictionary.set("pikachufan","pikachuFan");
    playerInputDictionary.set("unown","unown");
    playerInputDictionary.set("champion","champion");
    playerInputDictionary.set("raids","champion");
    playerInputDictionary.set("battlelegend","battleLegend");
    playerInputDictionary.set("legendary","battleLegend");
    playerInputDictionary.set("legendaryRaid","battleLegend");
    playerInputDictionary.set("pokemonranger","pokemonRanger");
    playerInputDictionary.set("ranger","pokemonRanger");
    playerInputDictionary.set("research","pokemonRanger");
    playerInputDictionary.set("shiny","shiny");
    playerInputDictionary.set("shinies","shiny");
    playerInputDictionary.set("schoolkid","normal");
    playerInputDictionary.set("normal","normal");    
    playerInputDictionary.set("blackbelt","fighting");
    playerInputDictionary.set("fighting","fighting");
    playerInputDictionary.set("birdkeeper","flying");
    playerInputDictionary.set("flying","flying");
    playerInputDictionary.set("punkgirl","poison");
    playerInputDictionary.set("poison","poison");
    playerInputDictionary.set("ruinmaniac","ground");
    playerInputDictionary.set("ground","ground");
    playerInputDictionary.set("hiker","rock");
    playerInputDictionary.set("rock","rock");
    playerInputDictionary.set("bugcatcher","bug");
    playerInputDictionary.set("bug","bug");
    playerInputDictionary.set("hexmaniac","ghost");
    playerInputDictionary.set("ghost","ghost");
    playerInputDictionary.set("depotagent","steel");
    playerInputDictionary.set("steel","steel");
    playerInputDictionary.set("kindler","fire");
    playerInputDictionary.set("fire","fire");
    playerInputDictionary.set("swimmer","water");
    playerInputDictionary.set("water","water");
    playerInputDictionary.set("gardener","grass");
    playerInputDictionary.set("grass","grass");
    playerInputDictionary.set("rocker","electric");
    playerInputDictionary.set("electric","electric");
    playerInputDictionary.set("psychic","psychic");
    playerInputDictionary.set("skier","ice");
    playerInputDictionary.set("ice","ice");
    playerInputDictionary.set("dragontamer","dragon");
    playerInputDictionary.set("dragon","dragon");
    playerInputDictionary.set("delinquent","dark");
    playerInputDictionary.set("dark","dark");
    playerInputDictionary.set("fairytalegirl","fairy");
    playerInputDictionary.set("fairytale","fairy");
    playerInputDictionary.set("fairy","fairy");
    playerInputDictionary.set("goldgym","goldGym");
    playerInputDictionary.set("goldgyms","goldGym");
    playerInputDictionary.set("goldbadge","goldGym");
    playerInputDictionary.set("gold","goldGym");    
    playerInputDictionary.set("silver","silverGym");
    playerInputDictionary.set("silvergym","silverGym");
    playerInputDictionary.set("silvergyms","silverGym");
    playerInputDictionary.set("silverbadge","silverGym");
    playerInputDictionary.set("bronze","bronzeGym");             
    playerInputDictionary.set("bronzegym","bronzeGym"); 
    playerInputDictionary.set("bronzegyms","bronzeGym");             
    playerInputDictionary.set("bronzebadge","bronzeGym");                           
    playerInputDictionary.set("gym","noBadge");             
    playerInputDictionary.set("nobadge","noBadge");             
    playerInputDictionary.set("totalgyms","totalGyms");      
   
    playerStatCategories = [
        "XP",
        "XPPerDay",
        "Max",
        "3000+",
        "100%",
        "Unique100%",
        "Kanto",
        "Johto",
        "Hoenn",
        "Jogger",
        "Collector",
        "Scientist",
        "Breeder",
        "Backpacker",
        "BattleGirl",
        "Youngster",
        "BerryMaster",
        "GymLeader",
        "Fisherman",
        "AceTrainer",
        "PikachuFan",
        "Champion",
        "Legendary",
        "Ranger",
        "Unown",
        "Shiny",
        "Normal",
        "Fighting",
        "Flying",
        "Poison",
        "Ground",
        "Rock",
        "Bug",
        "Ghost",
        "Steel",
        "Electric",
        "Psychic",
        "Ice",
        "Dragon",
        "Dark",
        "Fairy",
        "Gold",
        "Silver",
        "Bronze",
        "TotalGyms"
    ]
}


module.exports = {    
    Player,        
    Leaderboard

}