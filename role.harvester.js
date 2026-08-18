const RoleTemplate = require('role.template');

//the harvester is, in the early game, used to collect from sources and deliver to structures, spawns, extensions
//after the miner is introduced, the harvester will prioritise pulling from containers, to deliver energy
//where it's needed. If it cannot store energy, it will deliver to upgrader.

class RoleHarvester extends RoleTemplate {
    constructor() {
        // Pass the role name and the 'say' text to the parent class
        super('harvester', '🚚 delivering!');
        }

    /**
     * Overrides the abstract doWork method from RoleTemplate
     * @param {Creep} creep 
     */
    doHarvest(creep)
    {
        let source;

        if (creep.memory.node !== undefined)
        {
            source = Game.getObjectById(creep.memory.node);

            let closestContainer = source.pos.findClosestByRange(FIND_STRUCTURES,
                {filter: (structure) =>
                {
                    return (structure.structureType === STRUCTURE_CONTAINER);
                }
            });

            if(closestContainer)
            {
                (creep.withdraw(closestContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(closestContainer, { visualizePathStyle: { stroke: '#fbfaf896' }});
                }
            }
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


// Export an instance of the class so main.js can call roleUpgrader.run(creep)
module.exports = new RoleHarvester();