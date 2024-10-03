        const torrentId = 'https://webtorrent.io/torrents/sintel.torrent'

      const client = new WebTorrent()

      // HTML elements
      const $body = document.body
      const $progressBar = document.querySelector('#progressBar')
      const $numPeers = document.querySelector('#numPeers')
      const $downloaded = document.querySelector('#downloaded')
      const $total = document.querySelector('#total')
      const $remaining = document.querySelector('#remaining')
      const $uploadSpeed = document.querySelector('#uploadSpeed')
      const $downloadSpeed = document.querySelector('#downloadSpeed')

      // Download the torrent
      client.add(torrentId, function (torrent) {

        // Torrents can contain many files. Let's use the .mp4 file
        const file = torrent.files.find(function (file) {
          return file.name.endsWith('.mp4')
        })

        // Stream the file in the browser
        file.appendTo('#output')

        // Trigger statistics refresh
        torrent.on('done', onDone)
        setInterval(onProgress, 500)
        onProgress()

        // Statistics
        function onProgress () {
          // Peers
          $numPeers.innerHTML = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')

          // Progress
          const percent = Math.round(torrent.progress * 100 * 100) / 100
          $progressBar.style.width = percent + '%'
          $downloaded.innerHTML = prettyBytes(torrent.downloaded)
          $total.innerHTML = prettyBytes(torrent.length)

          // Remaining time
          let remaining
          if (torrent.done) {
            remaining = 'Done.'
          } else {
            remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
            remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'
          }
          $remaining.innerHTML = remaining

          // Speed rates
          $downloadSpeed.innerHTML = prettyBytes(torrent.downloadSpeed) + '/s'
          $uploadSpeed.innerHTML = prettyBytes(torrent.uploadSpeed) + '/s'
        }
        function onDone () {
          $body.className += ' is-seed'
          onProgress()
        }
      })

      // Human readable bytes util
      function prettyBytes(num) {
        const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        const neg = num < 0
        if (neg) num = -num
        if (num < 1) return (neg ? '-' : '') + num + ' B'
        const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
        const unit = units[exponent]
        num = Number((num / Math.pow(1000, exponent)).toFixed(2))
        return (neg ? '-' : '') + num + ' ' + unit
      }
    


function id_(id) {return ((document.getElementById(id)) ? document.getElementById(id) : false);}

function get_display_media_init()
{
 var button = id_('btn-test-getDisplayMedia'),
 video = document.querySelector('video');


 button.setAttribute('disabled', 'true');
 
 get_display_media_invoke(function(screen)
 {
  add_stream_stop_listener(screen, function() {location.reload();});
  
  video.srcObject = screen;

  if (typeof screen.getTracks == 'function' && screen.getTracks.length > 0 && typeof screen.getTracks()[0].getCapabilities == 'function')
  {
   var _capabilities = screen.getTracks()[0].getCapabilities();
   id_('capabilities').value = 'capabilities:\n\n' + JSON.stringify(_capabilities, null, '\t');
   id_('capabilities').style.display = '';

   var _settings = screen.getTracks()[0].getSettings();
   id_('settings').value = 'settings:\n\n' + JSON.stringify(_settings, null, '\t');
   id_('settings').style.display = '';
  }
 },


 function(e)
 {
  button.disabled = false;

  var error = {
   name: e.name || 'UnKnown',
   message: e.message || 'UnKnown',
   stack: e.stack || 'UnKnown'
  };

  if (error.name === 'PermissionDeniedError')
  {
   if (location.protocol !== 'https:')
   {
    error.message = 'Please use HTTPs.';
    error.stack   = 'HTTPs is required.';
   }
  }

  console.error(error.name);
  console.error(error.message);
  console.error(error.stack);

  alert('Unable to capture your screen.\n\n' + error.name + '\n\n' + error.message + '\n\n' + error.stack);
 });
}


function get_display_media_invoke(success, error)
{
 var video_constraints = {};

 if (id_('aspect_ratio').value !== 'default') {video_constraints.aspect_ratio = id_('aspect_ratio').value;}
 if (id_('frame_rate').value !== 'default') {video_constraints.frame_rate = id_('frame_rate').value;}
 if (id_('cursor').value !== 'default') {video_constraints.cursor = id_('cursor').value;}
 if (id_('display_surface').value !== 'default') {video_constraints.display_surface = id_('display_surface').value;}
 if (id_('logical_surface').value !== 'default') {video_constraints.logical_surface = true;}
 if (id_('resolutions').value !== 'default')
 {
  if (id_('resolutions').value === 'fit-screen')
  {
   video_constraints.width = screen.width;
   video_constraints.height = screen.height;
  }

  if (id_('resolutions').value === '4K')
  {
   video_constraints.width = 3840;
   video_constraints.height = 2160;
  }

  if (id_('resolutions').value === '1080p')
  {
   video_constraints.width = 1920;
   video_constraints.height = 1080;
  }

  if (id_('resolutions').value === '720p')
  {
   video_constraints.width = 1280;
   video_constraints.height = 720;
  }

  if (id_('resolutions').value === '480p')
  {
   video_constraints.width = 853;
   video_constraints.height = 480;
  }

  if (id_('resolutions').value === '360p')
  {
   video_constraints.width = 640;
   video_constraints.height = 360;
  }
 }

 if (!Object.keys(video_constraints).length) {video_constraints = true;}

 var display_media_stream_constraints = {video: video_constraints};

 if (navigator.mediaDevices.getDisplayMedia) {navigator.mediaDevices.getDisplayMedia(display_media_stream_constraints).then(success).catch(error);}
 else {navigator.getDisplayMedia(display_media_stream_constraints).then(success).catch(error);}
}


function add_stream_stop_listener(stream, callback)
{
 stream.addEventListener('ended', function() {callback(); callback = function() {};}, false);
 stream.addEventListener('inactive', function() {callback(); callback = function() {};}, false);
 stream.getTracks().forEach(function(track) {track.addEventListener('ended', function() {callback(); callback = function() {};}, false);
 track.addEventListener('inactive', function() {callback(); callback = function() {};}, false);});
}


window.onload = function(event)
{
 if (!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia)
 {
  var error = 'Your browser does NOT supports getDisplayMedia API.';
  document.querySelector('h1').textContent = error;
  document.querySelector('h1').style.color = '#f00';
 }
}

