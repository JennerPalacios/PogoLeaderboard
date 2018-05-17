
class DiscordEmojis
{
	constructor()
	{		
        this.Load = LoadEmojis;
	}	
}

function LoadEmojis(bot)
{

    console.log("If you need access to these server emojis join this server and add your bot: https://discord.gg/zqVCfPy");
    let guildArray = bot.guilds;

    guildArray = Array.from(guildArray);

    for(var i = 0; i < guildArray.length; i++)
    {
        let guild = bot.guilds.find("id",guildArray[i][0]);
        if(guild.available)
        {
            if(!this.bug)
            {
                this.bug = guild.emojis.find("name","bugtype");
                if(this.bug) { this.bug = this.bug.toString() }
            }
            
            if(!this.dark)
            {
                this.dark = guild.emojis.find("name","dark");
                if(this.dark) { this.dark = this.dark.toString() }
            }

            if(!this.dragon)
            {
                this.dragon = guild.emojis.find("name","dragontype");
                if(this.dragon) { this.dragon = this.dragon.toString() }
            }

            if(!this.electric)
            {
                this.electric = guild.emojis.find("name","electric");
                if(this.electric) { this.electric = this.electric.toString() }
            }
            if(!this.ground)
            {
                this.ground = guild.emojis.find("name","ground");
                if(this.ground) { this.ground = this.ground.toString() }
            }
            if(!this.fire)
            {
                this.fire = guild.emojis.find("name","firetype");
                if(this.fire) { this.fire = this.fire.toString() }
            }
            if(!this.water)
            {
                this.water = guild.emojis.find("name","water");
                if(this.water) { this.water = this.water.toString() }
            }
            
            if(!this.rock)
            {
                this.rock = guild.emojis.find("name", "rock");
                if(this.rock) { this.rock = this.rock.toString() }
            }
            
            if(!this.fairy)
            {
                this.fairy = guild.emojis.find("name","fairy");
                if(this.fairy) { this.fairy = this.fairy.toString() }
            }
            
            if(!this.flying)
            {
                this.flying = guild.emojis.find("name","flying");
                if(this.flying) { this.flying = this.flying.toString() }
            }

            if(!this.fighting)
            {
                this.fighting = guild.emojis.find("name","fighting");
                if(this.fighting) { this.fighting = this.fighting.toString() }
            }

            if(!this.normal)
            {
                this.normal = guild.emojis.find("name","normal");
                if(this.normal) { this.normal = this.normal.toString() }
            }

            if(!this.ice)
            {
                this.ice = guild.emojis.find("name","ice");
                if(this.ice) { this.ice = this.ice.toString() }
            }

            if(!this.grass)
            {
                this.grass = guild.emojis.find("name","grass");
                if(this.grass) { this.grass = this.grass.toString() }
            }

            if(!this.steel)
            {
                this.steel = guild.emojis.find("name","steel");
                if(this.steel) { this.steel = this.steel.toString() }
            }

            if(!this.poison)
            {
                this.poison = guild.emojis.find("name","poison");
                if(this.poison) { this.poison = this.poison.toString() }
            }

            if(!this.ghost)
            {
                this.ghost = guild.emojis.find("name","ghosttype");
                if(this.ghost) { this.ghost = this.ghost.toString() }
            }

            if(!this.psychic)
            {
                this.psychic = guild.emojis.find("name","psychic");
                if(this.psychic) { this.psychic = this.psychic.toString() }
            }
            if(!this.gold)
            {
                this.gold = guild.emojis.find("name","gold");
                if(this.gold) { this.gold = this.gold.toString() }
            }
            if(!this.silver)
            {
                this.silver = guild.emojis.find("name","silver");
                if(this.silver) { this.silver = this.silver.toString() }
            }
            if(!this.bronze)
            {
                this.bronze = guild.emojis.find("name","bronze");
                if(this.bronze) { this.bronze = this.bronze.toString() }
            }
            if(!this.valor)
            {
                this.valor = guild.emojis.find("name","valor");
                if(this.valor) { this.valor = this.valor.toString() }
            }
            if(!this.instinct)
            {
                this.instinct = guild.emojis.find("name","instinct");
                if(this.instinct) { this.instinct = this.instinct.toString() }
            }
            if(!this.mystic)
            {
                this.mystic = guild.emojis.find("name","mystic");
                if(this.mystic) { this.mystic = this.mystic.toString() }
            }
            if(!this.uncontested)
            {
                this.uncontested = guild.emojis.find("name","uncontested");
                if(this.uncontested) { this.uncontested = this.uncontested.toString() }
            }
        }
    }   
    
}

module.exports = {
	DiscordEmojis
}