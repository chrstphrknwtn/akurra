'use strict';

angular.module('jamboreeApp')
  .controller('MainCtrl', function ($scope, $timeout, debounce, $http, keys) {

    // var isPlaying = false;
    // var currentTrack; // Object: ID property of track object
    // $scope.isMuted = false;
    // $scope.tracks = [];

    // // Init soundmanager before soundcloud
    // soundManager.setup({
    //   url: '/bower_components/bower-soundmanager/swf',
    //   flashVersion: 9
    // });

    // SC.initialize(keys);

    // $scope.loadedProgress = {value:'0%'};
    // $scope.playedProgress = {value:'0%'};

    // Takes a track object as returned by Soundcloud API
    // function addTrack(newTrack) {
    //   var isDuplicateTrack = _.find($scope.tracks, function(track) {
    //     return track.id === newTrack.id;
    //   });
    //   if (isDuplicateTrack) {
    //     return;
    //   }
    //   if (!isPlaying) {
    //     playTrack(newTrack);
    //   }
    //   $scope.$apply(function () {
    //     $scope.tracks.push(newTrack);
    //   });
    // }

    // Takes an ID of the track object as returned by Soundcloud API
    // function removeTrack(trackID) {
    //   soundManager.destroySound(trackID);
    //   $scope.$apply(function () {
    //     $scope.tracks = _.reject($scope.tracks, { 'id': trackID });
    //   });
    // }

    // Takes a track object as return by Soundcloud API
    // function playTrack(track) {
    //   console.log(track);
    //   soundManager.createSound({
    //     id: track.id,
    //     url: track.stream_url + '?client_id=' + keys.client_id, // jshint ignore:line
    //     autoLoad: true,
    //     autoPlay: true,
    //     whileloading: function() {
    //       var that = this;
    //       $timeout(function() {
    //         $scope.loadedProgress = {value: ((that.bytesLoaded / that.bytesTotal) * 100 + '%')};
    //       });
    //     },
    //     onload: function() {
    //     },
    //     onplay: function() {
    //       isPlaying = true;
    //       currentTrack = track.id;
    //       $scope.isMuted = false;
    //     },
    //     whileplaying: function() {
    //       var that = this;
    //       $timeout(function() {
    //         $scope.elapsed = {value: that.position};
    //         $scope.playedProgress = {value: ((that.position / that.duration) * 100 + '%')};
    //       });
    //     },
    //     onfinish: function() {
    //       isPlaying = false;
    //       removeTrack(track.id);
    //       playNextTrack();
    //     },
    //     volume: 100
    //   });
    // }

    // Play first track in the playlist array
    function playNextTrack() {
      playTrack($scope.tracks[0]);
    }

    // Convenience for submiting urls instead of using search
    $scope.onSubmitTrackURL = function (URL) {
      var trackURL = URL || $scope.soundcloudUrl;
      SC.get('/resolve', {url: trackURL}, function(track){
        if (track.errors) {
          // Show some errors in the UI
          return;
        } else {
          addTrack(track);
        }
      });
    };


    // ---------------------------------------------------------------
    // Generic Sound methods

    // $scope.stopMusic = function () {
    //   soundManager.stopAll();
    // };
    //
    // $scope.muteTrack = function (trackID) {
    //   soundManager.toggleMute(trackID || currentTrack);
    //   $scope.isMuted = !$scope.isMuted;
    // };


    // ---------------------------------------------------------------
    // Search Soundcloud

    var searchResults = [];
    $scope.searchResults = searchResults;

    $scope.isSearching = {value:false};

    function querySoundcloudAPI(query) {
      if(query === '')
      {
        $scope.$apply(function() {
          $scope.searchResults.length = 0;
        });
      } else {
        $scope.isSearching.value = true;
        SC.get('/tracks', { q: query, limit: 37 }, function(tracks) {
          $scope.$apply(function() {
            $scope.isSearching.value = false;
            $scope.searchResults = _.reject(tracks, { 'streamable': false });
          });
          console.log($scope.searchResults);
        });
      }
    }
    $scope.onSearch = debounce(querySoundcloudAPI, 250, false);

    $scope.playSearchResult = function(index) {
      $timeout(function() {
        addTrack($scope.searchResults[index]);
      });
    };


  });
ja