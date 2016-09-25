'use strict'

const html = require('bel')
const firebase = require('firebase')

module.exports = function home(params) {

  firebase.database().ref('channels')
    .on('value', snapshot => {
      const channelList = document.querySelector('.channelList')

      Object.keys(snapshot.val()).forEach(channel => {
        channelList.appendChild(html`
          <li><a href="/${channel}">${channel}</a></li>
        `);
      });

    })


  return html`
    <div>
      <h2>Channels</h2>
      <ul class="channelList"></ul>
    </div>
  `
}
