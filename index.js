const createChannel = require('./lib/create-channel')
require('whatwg-fetch')
const firebase = require('firebase/app')
require('firebase/database')

const config = require('./config.json')

firebase.initializeApp(config.firebase)

const database = firebase.database()
const channel = createChannel('banana', database)

fetch(`http://api.soundcloud.com/tracks/235287241?client_id=${config.soundcloud.client_id}`)
.then(res => res.json())
.then(channel.addTrack)
