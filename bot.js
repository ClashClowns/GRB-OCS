const mineflayer = require('mineflayer');
const config = require('./config.json');

const { Vec3 } = require('vec3');

const botNames = ["Benaam", "Gumshuda", "Badnaseeb", "Awara", "GalliBalli"];

botNames.forEach((name, index) => {
  setTimeout(() => {
    createBot(name);
  }, index * 5000); // 5s delay between bots
});

function createBot(name) {
  let bot;
  let jumpInterval, chatInterval, rotateInterval;

  function startBot() {
    bot = mineflayer.createBot({
      host: config.serverHost,
      port: config.serverPort,
      username: name,
      auth: 'offline',
      version: false,
      viewDistance: 'tiny'
    });

    bot.once('spawn', () => {
      console.log(`✅ ${name} joined the server.`);

      bot.chat(`/register ${config.botPassword} ${config.botPassword}`);
      bot.chat(`/login ${config.botPassword}`);

      let toggle = false;
      jumpInterval = setInterval(() => {
        if (!bot || !bot.entity) return;
        bot.setControlState('jump', toggle);
        toggle = !toggle;
      }, 40000);

      const messages = [`Hi from ${name}`, `${name} is online`];
      let msgIndex = 0;
      chatInterval = setInterval(() => {
        if (!bot) return;
        bot.chat(messages[msgIndex]);
        msgIndex = (msgIndex + 1) % messages.length;
      }, 120000);

      let yaw = 0;
      rotateInterval = setInterval(() => {
        if (!bot || !bot.entity) return;
        yaw += 0.1;
        bot.look(yaw, 0, true);
      }, 1000);
    });

    bot.on('end', () => {
      console.log(`❌ ${name} was disconnected. Reconnecting in 60s...`);
      reconnectWithDelay();
    });

    bot.on('error', err => {
      console.log(`⚠️ ${name} error: ${err.message}`);
      reconnectWithDelay();
    });
  }

  function reconnectWithDelay() {
    if (bot) {
      try { bot.quit(); } catch (_) {}
      bot = null;
    }

    clearInterval(jumpInterval);
    clearInterval(chatInterval);
    clearInterval(rotateInterval);

    setTimeout(() => {
      console.log(`🔁 ${name} attempting to reconnect...`);
      startBot();
    }, 60000);
  }

  startBot();
}
