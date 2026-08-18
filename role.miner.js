const RoleTemplate = require('role.template');

/**
 * the miner sits on a node and drops it all into a container, underneath. This makes other screeps more effcient because
 * A) they don't need to mine the same node and get in the way
 * B) the miner gets the max out of the node each time, so we max energy throughput
 * c) Harvesters can focus on delivery, but with some backup incase miners die.?
 */

class RoleMiner extends RoleTemplate {
    constructor() {
        super('miner', 'NOT MINING?!'); //I think the miner will always be mining. it should always doharvest
        }

    /**
    * override the abstract
    *  @param {Creep} creep
    */
    doHarvest(creep)
    {
    /**
     * First find the source you are assigned to. I think this will always be the opposite of the one before..?
     * 
     * Second find the container that is nearest that source. It should be in mining distance
     * 
     * Third, sit on that container and start harvesting.
     */
        let source;
        //1
        if (creep.memory.node !== undefined)
        {
            source = Game.getObjectById(creep.memory.node);
        }
        else
        {
            console.log(creep.name + 'doesnt have node');
        }

        //2
        let closestContainer = source.pos.findClosestByRange(FIND_STRUCTURES,
            {filter: (structure) =>
                {
                 return (structure.structureType === STRUCTURE_CONTAINER);
                }
            });

        //3 move to container
        if(closestContainer)
        {
            if(creep.pos.isEqualTo(closestContainer.pos))
            {
                creep.harvest(source);
            }
            else
            {
                creep.moveTo(closestContainer, { visualizePathStyle: { stroke: '#fbfaf896' }});
            }
        }
    }
}

module.exports = new RoleMiner();
