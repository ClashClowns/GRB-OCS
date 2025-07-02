const mineflayer = require('mineflayer');
const config = require('./config.json');
const { Vec3 } = require('vec3');

const botCount = config.botCount || 5; // Number of bots to run

for (let i = 1; i <= botCount; i++) {
  createBot(i);
}

function createBot(number) {
  let bot;
  let jumpInterval, chatInterval, rotateInterval;

  function startBot() {
    bot = mineflayer.createBot({
      host: config.serverHost,
      port: config.serverPort,
      username: `${config.botBaseName}${number}`,
      auth: 'offline',
      version: false,
      viewDistance: 'tiny'
    });

    bot.once('spawn', () => {
      console.log(`✅ Bot${number} joined the server.`);

      // Register and login
      bot.chat(`/register ${config.botPassword} ${config.botPassword}`);
      bot.chat(`/login ${config.botPassword}`);

      // 🔁 Anti-AFK jump every 40s
      let toggle = false;
      jumpInterval = setInterval(() => {
        if (!bot || !bot.entity) return;
        bot.setControlState('jump', toggle);
        toggle = !toggle;
      }, 40000);

      // 💬 Auto chat every 120s
      const messages = ["I'm Areeb I like boys", "Areeb loves Dihh"];
      let msgIndex = 0;
      chatInterval = setInterval(() => {
        if (!bot) return;
        bot.chat(messages[msgIndex]);
        msgIndex = (msgIndex + 1) % messages.length;
      }, 120000);

      // 🔁 Auto rotate every 1s
      let yaw = 0;
      rotateInterval = setInterval(() => {
        if (!bot || !bot.entity) return;
        yaw += 0.1;
        bot.look(yaw, 0, true);
      }, 1000);
    });

    bot.on('end', () => {
      console.log(`❌ Bot${number} was disconnected. Reconnecting in 60s...`);
      reconnectWithDelay();
    });

    bot.on('error', err => {
      console.log(`⚠️ Bot${number} error: ${err.message}`);
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
      console.log(`🔁 Bot${number} attempting to reconnect...`);
      startBot();
    }, 60000);
  }

  startBot();
}
