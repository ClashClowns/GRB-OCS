const { goals } = require('mineflayer-pathfinder')
const { Vec3 } = require('vec3')

async function mineLogs(bot) {
  const block = bot.findBlock({
    matching: block => bot.mcData.blocks[block.type].name.includes('log'),
    maxDistance: 32
  })
  if (block) {
    try {
      await bot.collectBlock.collect(block)
      console.log(`${bot.username} chopped a log.`)
    } catch (e) {
      console.log(`${bot.username} failed to chop log.`)
    }
  }
}

async function mineOres(bot) {
  const block = bot.findBlock({
    matching: block => bot.mcData.blocks[block.type].name.includes('ore'),
    maxDistance: 32
  })
  if (block) {
    try {
      await bot.collectBlock.collect(block)
      console.log(`${bot.username} mined an ore.`)
    } catch (e) {
      console.log(`${bot.username} failed to mine ore.`)
    }
  }
}

async function craftTools(bot) {
  const craftingTable = bot.findBlock({
    matching: block => bot.mcData.blocks[block.type].name.includes('crafting_table'),
    maxDistance: 16
  })
  if (!craftingTable) return

  const iron = bot.inventory.items().find(i => i.name.includes('iron_ingot'))
  const sticks = bot.inventory.items().find(i => i.name.includes('stick'))

  if (iron && sticks) {
    try {
      await bot.craft(bot.mcData.recipesByName.iron_pickaxe[0], 1, craftingTable)
      console.log(`${bot.username} crafted an iron pickaxe.`)
    } catch (e) {
      console.log(`${bot.username} failed to craft.`)
    }
  }
}

function shareLoot(bot, botNames, teams) {
  const teammates = getTeammates(bot.username, botNames, teams)
  const nearest = bot.nearestEntity(e => e.type === 'player' && teammates.includes(e.username))
  if (!nearest) return

  const iron = bot.inventory.items().find(i => i.name.includes('iron_ingot'))
  if (iron) {
    bot.lookAt(nearest.position.offset(0, 1, 0))
    bot.toss(iron.type, null, 1)
    console.log(`${bot.username} tossed iron to ${nearest.username}`)
  }
}

function getTeammates(name, allBots, teams) {
  for (const team in teams) {
    if (teams[team].includes(name)) {
      return teams[team].filter(n => n !== name)
    }
  }
  return []
}

module.exports = { mineLogs, mineOres, craftTools, shareLoot }
