
module.exports = function createChannel(name, database) {

  database.ref(`channels/${name}`).set({
    playhead: 0
  })

  function destroy() {
    database.ref(`channels/${name}`).remove()
  }

  function addTrack(track) {
    database.ref(`channels/${name}/playlist/${track.id}`).set(track)
  }

  return {
    name,
    destroy,
    addTrack
  }
}
