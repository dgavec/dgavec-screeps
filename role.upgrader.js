const RoleTemplate = require('role.template');

//the upgrader is a mandatory role who collects energy and deploys to the upgrader.

class RoleUpgrader extends RoleTemplate {
    constructor() {
        // Pass the role name and the 'say' text to the parent class
        super('upgrader', '⚡ upgrade');
    }

    /**
     * Overrides the abstract doWork method from RoleTemplate
     * @param {Creep} creep 
     */
    doWork(creep) {
        // Target logic specific to the upgrader[cite: 2]
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ff7de1' } });
        }
    }
}

// Export an instance of the class so main.js can call roleUpgrader.run(creep)
module.exports = new RoleUpgrader();