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

    const rightMediaList = document.querySelector('.right-media-list');
    const rightPlaylistsList = document.querySelector('.right-playlists-list');
    const createPlaylistBtn = document.querySelector('.create-playlist-btn');
    const leftMediaPreview = document.querySelector('.left-media-preview');
    const leftPlaylistsPreview = document.querySelector('.left-playlists-preview');

    if (!fileInput || !rightMediaList || !rightPlaylistsList || !createPlaylistBtn || !playlists || !nowPlaying) {
        return;
    }

    let musics = [];
    let currentTrack = null;
    let currentIndex = -1;

    let songs = [];
    let userPlaylists = [];
    let songId = 1;
    let playlistId = 1;
    let openedPlaylistId = null;

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
        if (!currentTrack || !loopBtn) return;
        currentTrack.audio.loop = !currentTrack.audio.loop;
        loopBtn.style.background = currentTrack.audio.loop ? '#d0d0d0' : '';
    }

    function SetVolume(value) {
        if (currentTrack) currentTrack.audio.volume = value;
    }

    function closeMenus() {
        const menus = document.querySelectorAll('.context-menu');
        menus.forEach((menu) => {
            menu.classList.add('hidden');
            menu.style.top = '';
            menu.style.left = '';
        });
    }

    function openMenu(menu, btn) {
        menu.classList.remove('hidden');

        const btnRect = btn.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();

        let left = btnRect.right - menuRect.width;
        let top = btnRect.bottom + 4;

        if (left < 8) left = 8;
        if (left + menuRect.width > window.innerWidth - 8) {
            left = window.innerWidth - menuRect.width - 8;
        }
        if (top + menuRect.height > window.innerHeight - 8) {
            top = btnRect.top - menuRect.height - 4;
        }
        if (top < 8) top = 8;

        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
    }

    function renderLeftMedia() {
        if (!leftMediaPreview) return;
        leftMediaPreview.innerHTML = '';

        songs.forEach((song) => {
            const item = document.createElement('div');
            item.className = 'preview-item';
            item.textContent = song.name;
            leftMediaPreview.appendChild(item);
        });
    }

    function renderLeftPlaylists() {
        if (!leftPlaylistsPreview) return;
        leftPlaylistsPreview.innerHTML = '';

        userPlaylists.forEach((playlist) => {
            const item = document.createElement('div');
            item.className = 'preview-item';
            item.textContent = playlist.name;
            leftPlaylistsPreview.appendChild(item);
        });
    }

    function renderMedia() {
        rightMediaList.innerHTML = '';

        songs.forEach((song) => {
            const row = document.createElement('article');
            row.className = 'track-item';

            const title = document.createElement('p');
            title.className = 'item-title';
            if (song.favorite) title.classList.add('favorite');
            title.textContent = song.name;

            const controls = document.createElement('div');
            controls.className = 'item-controls';

            const menuBtn = document.createElement('button');
            menuBtn.type = 'button';
            menuBtn.className = 'three-dots-btn';
            menuBtn.textContent = '...';

            const menu = document.createElement('div');
            menu.className = 'context-menu hidden';

            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.textContent = 'Add to playlist';
            addBtn.addEventListener('click', () => {
                if (userPlaylists.length === 0) {
                    alert('Create playlist first');
                    return;
                }

                let message = 'Choose playlist number:\n';
                for (let i = 0; i < userPlaylists.length; i++) {
                    message += `${i + 1}. ${userPlaylists[i].name}\n`;
                }

                const value = prompt(message);
                const index = Number(value) - 1;
                if (Number.isNaN(index) || index < 0 || index >= userPlaylists.length) {
                    return;
                }

                const playlist = userPlaylists[index];
                if (!playlist.songIds.includes(song.id)) {
                    playlist.songIds.push(song.id);
                    renderPlaylists();
                    renderLeftPlaylists();
                }
                closeMenus();
            });

            const favBtn = document.createElement('button');
            favBtn.type = 'button';
            favBtn.textContent = song.favorite ? 'Remove favorite' : 'Favorite';
            favBtn.addEventListener('click', () => {
                song.favorite = !song.favorite;
                renderMedia();
                closeMenus();
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                songs = songs.filter((x) => x.id !== song.id);
                userPlaylists.forEach((playlist) => {
                    playlist.songIds = playlist.songIds.filter((id) => id !== song.id);
                });
                renderMedia();
                renderPlaylists();
                renderLeftMedia();
                renderLeftPlaylists();
                closeMenus();
            });

            menuBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                const wasOpen = !menu.classList.contains('hidden');
                closeMenus();
                if (!wasOpen) openMenu(menu, menuBtn);
            });

            menu.appendChild(addBtn);
            menu.appendChild(favBtn);
            menu.appendChild(deleteBtn);

            controls.appendChild(menuBtn);
            row.appendChild(title);
            row.appendChild(controls);
            row.appendChild(menu);
            rightMediaList.appendChild(row);
        });
    }

    function renderPlaylists() {
        rightPlaylistsList.innerHTML = '';

        userPlaylists.forEach((playlist) => {
            const row = document.createElement('article');
            row.className = 'playlist-item';

            const title = document.createElement('p');
            title.className = 'item-title';
            if (playlist.favorite) title.classList.add('favorite');
            title.textContent = `${playlist.name} (${playlist.songIds.length})`;

            const controls = document.createElement('div');
            controls.className = 'item-controls';

            const viewBtn = document.createElement('button');
            viewBtn.type = 'button';
            viewBtn.className = 'item-play-btn';
            viewBtn.textContent = 'View';
            viewBtn.addEventListener('click', () => {
                openedPlaylistId = openedPlaylistId === playlist.id ? null : playlist.id;
                renderPlaylists();
            });

            const menuBtn = document.createElement('button');
            menuBtn.type = 'button';
            menuBtn.className = 'three-dots-btn';
            menuBtn.textContent = '...';

            const menu = document.createElement('div');
            menu.className = 'context-menu hidden';

            const favBtn = document.createElement('button');
            favBtn.type = 'button';
            favBtn.textContent = playlist.favorite ? 'Remove favorite' : 'Favorite';
            favBtn.addEventListener('click', () => {
                playlist.favorite = !playlist.favorite;
                renderPlaylists();
                closeMenus();
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                userPlaylists = userPlaylists.filter((x) => x.id !== playlist.id);
                if (openedPlaylistId === playlist.id) openedPlaylistId = null;
                renderPlaylists();
                renderLeftPlaylists();
                closeMenus();
            });

            menuBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                const wasOpen = !menu.classList.contains('hidden');
                closeMenus();
                if (!wasOpen) openMenu(menu, menuBtn);
            });

            menu.appendChild(favBtn);
            menu.appendChild(deleteBtn);

            controls.appendChild(viewBtn);
            controls.appendChild(menuBtn);
            row.appendChild(title);
            row.appendChild(controls);
            row.appendChild(menu);

            if (openedPlaylistId === playlist.id) {
                const details = document.createElement('div');
                details.style.marginTop = '8px';
                details.style.fontSize = '12px';

                const names = playlist.songIds
                    .map((id) => songs.find((song) => song.id === id))
                    .filter(Boolean)
                    .map((song) => song.name);

                details.textContent = names.length ? names.join(', ') : 'Playlist is empty';
                row.appendChild(details);
            }

            rightPlaylistsList.appendChild(row);
        });
    }

    fileInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const sound = new M(file.name, url);
        musics.push(sound);
        add_sound(sound);
        playTrack(sound);

        songs.push({
            id: songId,
            name: file.name,
            favorite: false
        });
        songId += 1;

        renderMedia();
        renderLeftMedia();
    });

    createPlaylistBtn.addEventListener('click', () => {
        const name = prompt('Playlist name:');
        if (!name || !name.trim()) return;

        userPlaylists.push({
            id: playlistId,
            name: name.trim(),
            favorite: false,
            songIds: []
        });
        playlistId += 1;

        renderPlaylists();
        renderLeftPlaylists();
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.three-dots-btn') && !event.target.closest('.context-menu')) {
            closeMenus();
        }
    });

    rightMediaList.addEventListener('scroll', closeMenus);
    rightPlaylistsList.addEventListener('scroll', closeMenus);
    window.addEventListener('resize', closeMenus);

    renderMedia();
    renderPlaylists();
    renderLeftMedia();
    renderLeftPlaylists();

    playBtn.addEventListener('click', DoPlay);
    pauseBtn.addEventListener('click', DoPause);
    backwardBtn.addEventListener('click', GoBackward);
    forwardBtn.addEventListener('click', GoForward);
    shuffleBtn.addEventListener('click', DoShuffle);
    loopBtn.addEventListener('click', DoLoop);
    volumeSlider.addEventListener('input', (e) => SetVolume(e.target.value / 100));
});
