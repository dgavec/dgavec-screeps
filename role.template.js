class RoleTemplate {
    /**
     * @param {string} roleName - Name of the role (e.g., 'builder', 'upgrader')
     * @param {string} workText - Text the creep says when switching to work mode
     */
    constructor(roleName, workText = '🚧 work') {
        this.roleName = roleName;
        this.workText = workText;
        this.harvestText = '🔄 harvest';
    }

    /**
     * The main execution loop for the creep. 
     * @param {Creep} creep 
     */
    run(creep) {
        // 1. Working means, taking energy to target.
        if (creep.memory.working === undefined) {
            creep.memory.working = false; 
        }

        // 2. State toggling based on capacity
        // Switch to harvesting mode if out of energy
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.working = false;
            creep.say(this.harvestText);
        }
        // Switch to working mode if capacity is full
        if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
            creep.memory.working = true;
            creep.say(this.workText);
        }

        // 3. Execution routing
        if (creep.memory.working) {
            this.doWork(creep);
        } else {
            this.doHarvest(creep);
        }
    }

    /**
     * Abstract method for working logic. 
     * Child classes MUST override this to define their TARGET logic.
     * @param {Creep} creep 
     */
    doWork(creep) { //the default is to harvest for spawn, storage.
        let target;
        let targets = creep.room.find(FIND_STRUCTURES, 
                {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION ||  structure.structureType == STRUCTURE_SPAWN ) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}
                });
            if(targets.length > 0)
            {
                target = targets[0];
            }
            else
            {
                targets = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES,
                    {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}

                });
            }
            

            if(targets.length > 0)
            {
                target = targets[0];
            }
            else
            {
                target = creep.room.controller;
            }
            
            if(target && creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(target, { visualizePathStyle: {stroke: '#ffffff'}})
            }
    }

    /**
     * Standard harvesting logic (SOURCE).
     * Child classes can inherit this directly or override it if they need specialized logic (like Miners).
     * @param {Creep} creep 
     */
    doHarvest(creep) {
        let sources = creep.room.find(FIND_STRUCTURES, 
            {filter: (structure) => 
                {
                    return (structure.structureType === STRUCTURE_CONTAINER) &&
                    structure.store[RESOURCE_ENERGY] > 0;
                }
            }   
            );

        let source;

        // Prefer retrieving from a containers, then by creep.memory.node, then by all sources.
        //this will become creep.memory.node? the below is just for transition between miner and harvester?
        if (sources.length > 0)
        {
            source = sources[0];   
            //we need to add something to make this a random source? ^^
            
            if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#fbfaf896' }});
            }

        }
        else
        {
            if (creep.memory.node !== undefined)
            {
                source = Game.getObjectById(creep.memory.node);
            }
            else
            {
                // Fall back to finding the first available source in the room
                const sources = creep.room.find(FIND_SOURCES);
                source = sources[0];
            }
            //if (source && creep.harvest(source) === ERR_NOT_IN_RANGE)
            if (creep.harvest(source) === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#fbfaf896' }});
            }
        }
    }
}

module.exports = RoleTemplate;