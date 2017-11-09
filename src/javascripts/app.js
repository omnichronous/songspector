// jshint esversion:6

const $ = require('jquery');
global.jQuery = $;
global.$ = $;

const lastfm = require('./modules/lastfm.js');
const mm = require('metalminer');
const YouTube = require('youtube-node');
const youTube = new YouTube();

youTube.setKey('AIzaSyCJTdg_tYcNOQCW8aALLoIWd8AxxbqHH6Y');

//==========================

let username;

// Load user info
let getRecentTracks = (username) => {
  lastfm.request('user.getRecentTracks', {
    user: username,
    limit: 5,
    handlers: {
      success(data) {
        let tracks = data.recenttracks.track;
        clearTrackRows();
        tracks.forEach(function(track) {
          addTrackRow(track);
        });
      },
      error(error) { throw error; }
    }
  });
};

$('#searchButton').click((e) => {
  username = $('input[name=\'username\']').val();
  getRecentTracks(username);
});

const addTrackRow = (track) => {
  let row = $('#trackList .template')
    .clone()
    .removeClass('template')
    .addClass('item')
    .attr({
      'data-artist': track.artist['#text'],
      'data-album': track.album['#text'],
      'data-title': track.name
    });
  let trackLine = row.find('.header');
  let timestamp = row.find('.description');
  trackLine.text(`${track.artist[ '#text' ]} - ${track.name}`);
  timestamp.text(track.date['#text']);
  $(row).appendTo('#trackList').show();

  // Event listener
  row.find('a').click((e) => {
    let parent = $(e.target.closest('.item'));
    let trackInfo = {
      title: parent.data('title'),
      artist: parent.data('artist'),
      album: parent.data('album')
    };
    getLyrics(trackInfo);
    getVideos(trackInfo);
  });
};

const clearTrackRows = () => {
  $('#trackList .item').hide().remove();
};

const getLyrics = (trackInfo) => {
  mm.getLyrics(trackInfo, function(err, data) {
    $('#lyrics').html(err || data);

  });
};

const getVideos = (trackInfo) => {
  youTube.search(`${trackInfo.artist} ${trackInfo.title}`, 2,
    function(error, result) {
      if (error) {
        throw error;
      } else {
        result.items.forEach(function(video, i) {
          if (i > 0) {
            $(`<div class="ui section divider"></div>`)
            .appendTo('#videos');
          }
          $(`<h2>${video.snippet.title}</h2>`)
          .appendTo('#videos');
          $(`
            <div class="ui embed"
            data-source="youtube"
            data-id="${video.id.videoId}"
            data-placeholder="${video.snippet.thumbnails.high.url}">
            </div>
          `)
          .appendTo('#videos')
          .embed();
        });
      }
    });
};

//=======================

$(document)
  .ready(function() {

    // Fix main menu to page on <passing>update</passing>
    $('.main.menu').visibility({
      type: 'fixed'
    });
    $('.overlay').visibility({
      type: 'fixed',
      offset: 80
    });

    // Lazy load images
    $('.image').visibility({
      type: 'image',
      transition: 'vertical flip in',
      duration: 500
    });

    // Show dropdown on hover
    $('.main.menu  .ui.dropdown').dropdown({
      on: 'hover'
    });
  });
