document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput')
    const nowPlaying = document.getElementById('nowplaying')
    const playlists = document.querySelector('.playlists')
    musics = []
    class M {
        constructor(name, url) {
            this.name = name
            this.url = url
            this.audio = new Audio(this.url)
        }
    }


    function add_sound(sound) {
        const block = document.createElement('article')
        const heading = document.createElement('p')
        const btn_play = document.createElement('div')
        block.classList.add('block_music')
        btn_play.classList.add('btn_play')
        heading.textContent = sound.name
        block.appendChild(heading)
        block.appendChild(btn_play)
        playlists.appendChild(block)
        btn_play.addEventListener('click', () => {
            sound.audio.play()
            nowPlaying.innerHTML = `Now playing: ${sound.name}`
        })

    }
    fileInput.addEventListener('change', function () {
        const file = this.files[0]
        nowPlaying.innerHTML = `Now playing: ${file.name}`
        const url = URL.createObjectURL(file)
        const sound = new M(file.name, url)
        musics.push(sound)
        add_sound(sound)
    })
})