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
    

