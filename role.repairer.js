const RoleTemplate = require('role.template');
const RoleUpgrader = require('role.upgrader');

//the repairer fixes things that are decaying, including walls.

class RoleRepairer extends RoleTemplate {
    constructor() {
        super('repairer', '📲 repair')
    }

    /**
     * Ovverides the abstract doWork method from RoleTemplate
     *  @param {Creep} creep
     */
    doWork(creep) {
// 1. CHECK CURRENT TARGET
        if (creep.memory.repairTargetId) {
            let target = Game.getObjectById(creep.memory.repairTargetId);
            
            // Wipe memory if destroyed or repaired above a super low standard. This is esp useful for ramparts.
            if (!target || (target.hits == target.hitsMax || (target.hits > target.hitsMax/100 && target.hits > 10000))) {
                delete creep.memory.repairTargetId;
            }
        }

        // 2. FIND NEW TARGET
        if (!creep.memory.repairTargetId) {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < (object.hitsMax/2) && object.hits < 100000
            });

            if (targets.length > 0) {
                targets.sort((a,b) => a.hits - b.hits);
                creep.memory.repairTargetId = targets[0].id; 
            } else {
                let closestTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });

                if (closestTarget) {
                    creep.memory.repairTargetId = closestTarget.id;
                }
            }
        }

        // 3. EXECUTE OR FALLBACK
        if (creep.memory.repairTargetId) {
            let target = Game.getObjectById(creep.memory.repairTargetId);
            
            if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#00ff00' } });
            }
        } else {
            // If the memory is still empty here, there is nothing to repair in the room.
            RoleUpgrader.run(creep);
        }
    }

}

module.exports = new RoleRepairer();
