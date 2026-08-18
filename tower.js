var tower = 
{
//tower is currently a repair bot.
/** @param {Game} game **/
    tick: function() {
        tower = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
                    filter: { structureType: STRUCTURE_TOWER }
                })
        _.forEach(tower, function(tower){

            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        });

	}
};

module.exports = tower;