document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput')
    const nowPlaying = document.getElementById('nowplaying')

    fileInput.addEventListener('change', function () {
        const file = this.files[0]
        nowPlaying.innerHTML = `Now playing: ${file.name}`
    })
})