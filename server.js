const ScriptServer = require('./lib/script_server');
const GameServer = require('./lib/game_server');

const scripts = new ScriptServer();
const game = new GameServer();

scripts.run(__dirname);
game.run();
