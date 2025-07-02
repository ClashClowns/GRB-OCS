const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const collectBlock = require('mineflayer-collectblock').plugin
const { Vec3 } = require('vec3')
const fs = require('fs')

const config = require('./config.json')
const tasks = require('./tasks')
const teams = require('./teams.json')

const botNames = teams.TeamChoco.concat(teams.TeamChameli)

botNames.forEach(name => createBot(name))

function createBot(botName) {
  const bot = mineflayer.createBot({
    host: config.serverHost,
    port: config.serverPort,
    username: botName,
    auth: 'offline',
    version: false,
    viewDistance: 'tiny'
  })

  bot.loadPlugin(pathfinder)
  bot.loadPlugin(collectBlock)

  bot.once('spawn', () => {
    console.log(`✅ ${botName} joined.`)
    bot.chat(`/register ${config.password} ${config.password}`)
    bot.chat(`/login ${config.password}`)

    setInterval(() => tasks.mineLogs(bot), 60000)
    setInterval(() => tasks.mineOres(bot), 120000)
    setInterval(() => tasks.craftTools(bot), 180000)
    setInterval(() => tasks.shareLoot(bot, botNames, teams), 90000)
  })

  bot.on('error', err => console.log(`⚠️ ${botName} error: ${err}`))
  bot.on('end', () => {
    console.log(`❌ ${botName} disconnected. Reconnecting...`)
    setTimeout(() => createBot(botName), 30000)
  })
}
