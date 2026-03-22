document.addEventListener('DOMContentLoaded', () => {
    const mediaListBtn = document.querySelector('.side-medialist')
    const playListsBtn = document.querySelector('.side-playlists')

    const mediaList = document.querySelector('.rightsidewindow .medialist')
    const playLists = document.querySelector('.rightsidewindow .playlists')
    const closeButtons = document.querySelectorAll('.rightsidewindow .close-page-btn')

    if (!mediaListBtn || !playListsBtn || !mediaList || !playLists) {
        return
    }

    const hideAllPages = () => {
        mediaList.classList.add('hidden')
        playLists.classList.add('hidden')
    }

    const clearActiveButtons = () => {
        mediaListBtn.classList.remove('active')
        playListsBtn.classList.remove('active')
    }

    const showMediaList = () => {
        hideAllPages()
        clearActiveButtons()
        mediaList.classList.remove('hidden')
        mediaListBtn.classList.add('active')
    }

    const showPlayLists = () => {
        hideAllPages()
        clearActiveButtons()
        playLists.classList.remove('hidden')
        playListsBtn.classList.add('active')
    }

    const hideCurrentPage = () => {
        hideAllPages()
        clearActiveButtons()
    }

    mediaListBtn.addEventListener('click', showMediaList)
    playListsBtn.addEventListener('click', showPlayLists)
    closeButtons.forEach((button) => {
        button.addEventListener('click', hideCurrentPage)
    })

    hideCurrentPage()
})