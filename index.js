const firebase = require('firebase/app')
require('firebase/database');

const config = require('./config.json')
const track = require('./sc-track.json')

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

channel.create('peach')
