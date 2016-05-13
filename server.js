const ScriptServer = require('@nfactorial/playcanvas_server').ScriptServer;
const GameServer = require('@nfactorial/playcanvas_server').GameServer;

const scripts = new ScriptServer();
const game = new GameServer();

scripts.run(__dirname, '/development');
game.run();
