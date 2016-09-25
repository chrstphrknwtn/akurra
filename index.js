require('whatwg-fetch')
const firebase = require('firebase/app')
require('firebase/database')

const config = require('./config.json')

firebase.initializeApp(config.firebase)

const database = firebase.database()

const channel = {
  create: (channelName) => {
    database.ref(`channels/${channelName}`).set({
      playhead: 0
    })
  },
  delete: (channelName) => {
    database.ref(`channels/${channelName}`).remove()
  },
  addTrack: (channelName, track) => {
    database.ref(`channels/${channelName}/playlist/${track.id}`).set(track)
  }
}

fetch(`http://api.soundcloud.com/tracks/235287251?client_id=${config.soundcloud.client_id}`)
.then(res => res.json())
.then(track => {
  channel.addTrack('banana', track)
})
