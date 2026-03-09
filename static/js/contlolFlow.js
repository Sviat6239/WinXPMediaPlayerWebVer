export function GoBackward() {

}

export function DoPause() {
    if (currentTrack) {
        currentTrack.audio.pause()
    }
}

export function DoPlay() {
    if (currentTrack) {
        currentTrack.audio.play()
    }
}

export function GoForward() {

}

export function DoShufle() {

}

export function DoLoop() {
    if (!currentTrack) return

    currentTrack.audio.loop = !currentTrack.audio.loop
}

document.addEventListener('DOMContentLoaded', () => {
    const backwardBtn = document.querySelector('.backward_btn');
    const pauseBtn = document.querySelector('.pause_btn');
    const playBtn = document.querySelector('.play_btn');
    const forwardBtn = document.querySelector('.forward_btn');
    const shuflBtn = document.querySelector('.sufl_btn');
    const loopBtn = document.querySelector('.loop_btn');
    const volumeSlider = document.querySelector('#volumeSlider');
})
