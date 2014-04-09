'use strict';

angular.module('akurraApp')
  .directive('searchResult', function () {
    return {
      // templateUrl: '../../views/partials/search-result-template.html',
      template: '<img class="artwork" ng-src="{{track | scArtwork:300}}" alt=""><div class="track-details"><span class="title">{{ track.title }}</span><br><span class="artist">{{ track.user.username }}</span><br><span class="duration">{{ track.duration | msToDuration }}</span><br><a class="add-to-playlist" href="#" ng-click="playlist.addTrack(track)">Add to Playlist</a><!-- <a href="#">Preview</a> --></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

      }
    };
  });