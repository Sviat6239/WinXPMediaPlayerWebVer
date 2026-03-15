document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const nowPlaying = document.getElementById('nowplaying');
    const playlists = document.querySelector('.playlists');


    const playBtn = document.querySelector('.play');
    const pauseBtn = document.querySelector('.pause');
    const backwardBtn = document.querySelector('.backward');
    const forwardBtn = document.querySelector('.forward');
    const shuffleBtn = document.querySelector('.shufle');
    const loopBtn = document.querySelector('.loop');
    const volumeSlider = document.querySelector('#volumeSlider');

    let musics = [];
    let currentTrack = null;
    let currentIndex = -1;

    class M {
        constructor(name, url) {
            this.name = name;
            this.url = url;
            this.audio = new Audio(this.url);
        }
    }

    function add_sound(sound) {
        const block = document.createElement('article');
        const heading = document.createElement('p');
        const btn_play = document.createElement('div');

        block.classList.add('block_music');
        btn_play.classList.add('btn_play');
        heading.textContent = sound.name;

        block.appendChild(heading);
        block.appendChild(btn_play);
        playlists.appendChild(block);

        btn_play.addEventListener('click', () => {
            playTrack(sound);
        });
    }

    function playTrack(track) {
        if (currentTrack && currentTrack !== track) {
            currentTrack.audio.pause();
            currentTrack.audio.currentTime = 0;
        }
        currentTrack = track;
        currentIndex = musics.indexOf(track);
        currentTrack.audio.play();
        nowPlaying.innerHTML = `Now playing: ${track.name}`;
    }

    fileInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const sound = new M(file.name, url);
        musics.push(sound);
        add_sound(sound);

        playTrack(sound);
    });


    function DoPause() {
        if (currentTrack) currentTrack.audio.pause();
    }

    function DoPlay() {
        if (currentTrack) currentTrack.audio.play();
    }

    function GoBackward() {
        if (musics.length === 0) return;
        currentIndex = currentIndex <= 0 ? musics.length - 1 : currentIndex - 1;
        playTrack(musics[currentIndex]);
    }

    function GoForward() {
        if (musics.length === 0) return;
        currentIndex = (currentIndex + 1) % musics.length;
        playTrack(musics[currentIndex]);
    }

    function DoShuffle() {
        if (musics.length === 0) return;
        const randomIndex = Math.floor(Math.random() * musics.length);
        playTrack(musics[randomIndex]);
    }

    function DoLoop() {
        if (!currentTrack) return;
        currentTrack.audio.loop = !currentTrack.audio.loop;
        loopBtn.style.background = currentTrack.audio.loop ? "#d0d0d0" : ""; 
    }

    function SetVolume(value) {
        if (currentTrack) currentTrack.audio.volume = value;
    }


    playBtn.addEventListener('click', DoPlay);
    pauseBtn.addEventListener('click', DoPause);
    backwardBtn.addEventListener('click', GoBackward);
    forwardBtn.addEventListener('click', GoForward);
    shuffleBtn.addEventListener('click', DoShuffle);
    loopBtn.addEventListener('click', DoLoop);
    volumeSlider.addEventListener('input', (e) => SetVolume(e.target.value / 100));
});
