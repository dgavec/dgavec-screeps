### Screeps World is an open source MMO strategy sandbox for programmers.
* You control your colony by writing JavaScript code that operates 24/7 in the huge, persistent online open world.
* You can find out more about the game here https://store.steampowered.com/app/464350

### This code
* dgavec wrote this code for personal use, but, feel free to tweak it and fork for your own uses.

## General overview
* Main.js runs every tick to tell other scripts what to do and how to behave.

* Spawner.js is the logic for one room's spawner. Creating new bots is defined by a level system. Depending on maximum energy capacity, different qualities and types of bots will spawn.
* This helps the colony grow at a reasonable pace, whilst protecting against hardcoding creep values.

* Tower makes the tower shoot hostiles in the room.

# Roles
* Template is the main class. Other roles extend template. This holds two main functions. doWork and doHarvest. doHarvest is how the creep gets energy. doWork is how the creep expends energy. All roles inherit this.
* Harvester is the primary role. At early levels this harvests energy from nodes and delivers to extensions, spawns, etc. At later levels, this just delivers.
* Miner's are spawned from level two, once two containers are down. They sit onto of containers and mine sources most efficiently. They don't store or move otherwise.
* Upgraders take energy from containers (or sources) and deliver it the room controller. Always. Have at least one of these.
* Builders complete construction projects. If there's nothing to do, they inherit...
* Repairers, which...uhhh...repair structures that are damaged or decayed.

* I have some loose ideas for next steps on the todo.md but this is still a work in progress!
