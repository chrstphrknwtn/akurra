'use strict'

const config = require('./config.json')
const firebase = require('firebase/app')
const router = require('uri-router')
const channel = require('./routes/channel')
const home = require('./routes/home')

require('firebase/database')
require('whatwg-fetch')

firebase.initializeApp(config.firebase)

// fetch(`http://api.soundcloud.com/tracks/235287241?client_id=${config.soundcloud.client_id}`)
// .then(res => res.json())
// .then(channel.addTrack)


// add a root element to attach route changes to (only for budo)
document.body.innerHTML = document.body.innerHTML + `
  <div class="js-rootEl"></div>
`

router({
  watch: 'pathname',
  outlet: document.querySelector('.js-rootEl'),
  routes: [
    ['/', home],
    ['.*', channel]
  ]
})

