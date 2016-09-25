'use strict'

const firebase = require('firebase/app')

module.exports = function createDatabaseChannel(name) {

  const database = firebase.database()
  const channel = database.ref(`channels/${name}`)

  const channelDefaults = {
    playhead: 0
  }

  channel.set(channelDefaults)

  function destroy() {
    channel.remove()
  }

  function addTrack(track) {
    channel.child(`playlist/${track.id}`).set(track)
  }

  return {
    name,
    destroy,
    addTrack
  }
}
