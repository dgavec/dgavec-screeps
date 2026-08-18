const RoleTemplate = require('role.template');
const RoleRepairer = require('role.repairer');

//the builder builds new construction sites. If there is nothing else to do he will repair.

class RoleBuilder extends RoleTemplate {
    constructor() {
        super('builder', '🛠 building!')
    }

    /**
     * Overrides the abstract doWork method from RoleTemplate
     *  @param {Creep} creep
     */
    doWork(creep) {
        let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

        if(target && creep.build(target) === ERR_NOT_IN_RANGE)
        {
            creep.moveTo(target, { visualizePathStyle: {stroke: '#deae12'}})
        }
        else if(!target)
        {
            RoleRepairer.run(creep);
        }
    }
}

module.exports = new RoleBuilder();