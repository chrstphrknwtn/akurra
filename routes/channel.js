'use strict'

const html = require('bel')
const createDatabaseChannel = require('../lib/create-database-channel')

module.exports = function channel(params) {

  const channelName = params.pathname.substr(1)
  const databaseChannel = createDatabaseChannel(channelName)

  return html`<h1>${channelName}</h1>`
}
