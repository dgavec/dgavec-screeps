var spawner = {
    blocked: false,
    levels: [
        { 
            //300, up to 2 extensions
            level: 0,
            harvester: [WORK, CARRY, MOVE], harvestercount: 6,
            upgrader: [WORK, CARRY, MOVE], upgradercount: 1,
            builder: [WORK, CARRY, MOVE], buildercount: 5,
            repairer: [WORK, CARRY, MOVE], repairercount: 1,
        },
        {  
            //400, 2 to 5 extensions
            level: 1,           
            harvester: [WORK, WORK, CARRY, CARRY, MOVE, MOVE], harvestercount: 4,
            upgrader: [WORK, WORK, CARRY, CARRY, MOVE, MOVE], upgradercount: 1,
            builder: [WORK, WORK, CARRY, CARRY, MOVE, MOVE], buildercount: 3,
            repairer: [WORK, WORK, CARRY, CARRY, MOVE, MOVE], repairercount: 1,

        },
        {
            //550, 5 to 8extensions
            level: 2,
            miner: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], minercount: 2,             
            harvester: [WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], harvestercount: 3,
            upgrader: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], upgradercount: 3,
            builder: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], buildercount: 3,
            repairer: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], repairercount: 2,
        },
        {
            //800 energy, 10 extensions, 2 containers (by sources)
            level: 3,
            miner: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], minercount: 2,             
            harvester: [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], harvestercount: 3,
            upgrader: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], upgradercount: 2,
            builder: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], buildercount: 3,
            repairer: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], repairercount: 2,
        },
    ],
    
    tick: function() {
        if(this.blocked) {
            console.log("Spawner blocked")
            return
        }


        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

        level = this.getLevel()

        var energynode;
        const homeSpawn = Game.spawns['Spawn1'];
        const isSpawning = Game.spawns['Spawn1'].spawning !== null;
        let sourceList = homeSpawn.room.find(FIND_SOURCES);
        var newName;

        if(homeSpawn.memory.spawnCount === undefined) //if there's no memory for spawnCount, set it to 0.
        {
            homeSpawn.memory.spawnCount = 0;
        }
        if(isSpawning && !homeSpawn.memory.wasSpawning)
        {
            homeSpawn.memory.spawnCount += 1;
            console.log('new Creep spawned. Total is ' + homeSpawn.memory.spawnCount);

            //half the creeps assigned to each energy node

        }

        homeSpawn.memory.wasSpawning = isSpawning;
        
        
        if(Game.time % 11 === 0) //this is the regular game state update
            {
                console.log('########################')
                console.log('MIN' + miners.length + '    HAR '+ harvesters.length + '   UPG '+upgraders.length+'   BUI '+builders.length+'   REP '+repairers.length)
                console.log('Level is ' + level.level);
                console.log(homeSpawn.memory.spawnCount + ' all time creeps spawned');
            }


    if(isSpawning == false || (isSpawning == true && homeSpawn.memory.wasSpawning == true)) //if we are not already spawning something, then go through spawn conditions.
    {
        if(miners.length < level.minercount) {
            var creepToSpawn = level.miner
            var roleName = 'miner';

        }else if(harvesters.length < level.harvestercount) {
            var creepToSpawn = level.harvester
            var roleName = 'harvester';

        } else if(upgraders.length < level.upgradercount) {
            var creepToSpawn = level.upgrader
            var roleName = 'upgrader';

        } else if(builders.length < level.buildercount) {
            var creepToSpawn = level.builder
            var roleName = 'builder';
        
        } else if(repairers.length < level.repairercount) {
            var creepToSpawn = level.repairer
            var roleName = 'repairer';
        } else {
            return
        }

        if(homeSpawn.memory.spawnCount % 2 == 0)
            {energynode = sourceList[0];}
            else
            {energynode = sourceList[1];}
        //spawning
        newName =(roleName + homeSpawn.memory.spawnCount);
        homeSpawn.spawnCreep((creepToSpawn), newName, {memory: {role: roleName, node: energynode.id}})
    }
    },

    getLevel: function(){
        max = Game.spawns.Spawn1.room.energyCapacityAvailable;
        actual = Game.spawns.Spawn1.room.energyAvailable; 

        const count = Game.spawns.Spawn1.room.find(FIND_MY_CREEPS).length;
        const containerCount = Game.spawns.Spawn1.room.find(FIND_STRUCTURES,
            {filter: (structure) =>
                {
                 return (structure.structureType === STRUCTURE_CONTAINER);
                }
            }).length;
        
        if (max < (300 + 2*50) || (count === undefined ||  count < 6)) {
            return this.levels[0]

        } else if (max < (300 + 5*50)) {
            return this.levels[1]

        } else if (max < (300 + 7*50) && containerCount >= 2) {           
            return this.levels[2]

        } else if (max < (300 + 10*50) && containerCount >= 2) {           
            return this.levels[3]
            
        } else {
            //console.log("Update designs!")
            return this.levels[3]
        }
    }

};
module.exports = spawner;