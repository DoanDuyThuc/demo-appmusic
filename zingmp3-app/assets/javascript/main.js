
const songs = 'http://localhost:3000/musics'

//get elemet
const cd = document.querySelector('.cd')
const cdBtn = document.querySelector('.cd-btn')
const cdImg = document.querySelector('.cd figure .cd-img_songs')
const artists = document.querySelector('.artists a')
const songsMedia = document.querySelector('.songs_media')
const audio = document.querySelector('#audio')
const controls = document.querySelector('.controls')
const play  = document.querySelector('.btn-play') 
const actionsBtn = document.querySelector('.actions-btn')
const actionsBtnSpan = document.querySelector('.actions span')
const footerImg = document.querySelector('.fooder-first_img img')
const btnForward = document.querySelector('.btn-forward')
const btnBackward = document.querySelector('.btn-backward')
const progress = document.querySelector('.progress')
const volume = document.querySelector('.volume')
const btnRandom = document.querySelector('.btn-random')
const btnRepeat = document.querySelector('.btn-repeat')
const listSongs = document.querySelector('.list-songs')
const opTion = document.querySelector('.options')

const timer = document.querySelector('.timer')
const timerRun = document.querySelector('.timer span')
 
//đặt biến
let currentIndex = 0;
let isplaying = false;
let istimeupdate = true;
let isRandom = false;
let isRepeat = false;

// chọc vào api
function loadViews(callback) {
    fetch(songs)
        .then(function (response) {
            return response.json()
        })
        .then(callback)
}

// render api
function renderView(Songs) {
    const musics = Songs.map(function (index , number) {
        return `
        <div class="list-songs" data-index = "${number}" >
        <div class="list-songs_left">
            <i class="fas fa-music"></i>
            <div class="media-img">
                <img src="${index.image}" alt="">
            </div>
            <div class="songs_infor">
                <span>${index.name}</span>
                <h3>
                    <a href="">${index.singer}</a>
                </h3>
            </div>
        </div>

        <div class="list-songs_center">
            <span>05:45</span>
        </div>

        <div class="list-songs_right">
            <i class=" btn micphone fas fa-microphone-alt"></i>
            <i class=" btn like-heart far fa-heart"></i>
            <i class=" btn menu-choose fas fa-ellipsis-h"></i>
            </div>
        </div>
    `
    })

    songsMedia.innerHTML = musics.join('');
}

// get ra logo
function getElementFirst(songs) {
    const footersongs =document.querySelector('.footer-songs_name span')
    const footername = document.querySelector('.footer-songs_name a')
    var currentsong = songs[currentIndex]
    cdImg.src = currentsong.image
    artists.innerHTML = currentsong.name
    footerImg.src = currentsong.image
    footersongs.innerHTML = currentsong.singer
    footername.innerHTML = currentsong.name
    audio.src = currentsong.path
}


function handleEvent(songs) {
    
    //hàm next song
    function nextsongs() {
        currentIndex++
        if(currentIndex >= songs.length){
            currentIndex = 0
        }    
        getElementFirst(songs)   
    }

    // hàm back songs
    function prewsongs() {
        currentIndex--
        if(currentIndex < 0){
            currentIndex = songs.length - 1
        }    
        getElementFirst(songs)   
    }

    //click nextsong
    btnForward.onclick = function () {
        if(isRandom){
            randomSongs()
        }else {
            nextsongs()
            audio.play()
        }
        songsActive()
        scrollViews()

    }

    //click backsong

    btnBackward.onclick = function () {
        if(isRandom){
            randomSongs()
        }else{
            prewsongs()
            audio.play()
        }
        songsActive()
        scrollViews()
    }



    let hold = [cdImg,play,cdBtn,actionsBtn]

    //play nhạc
    hold.forEach(function (index) {
        index.onclick = function () {
            if(isplaying){
                audio.pause()
                rotateCd.pause()
                rotatefooter.pause()
                
            }else {
                audio.play()
                rotateCd.play()
                rotatefooter.play()
                
            }
        }
    })
    
    audio.onplay = function () {
        isplaying = true
        cdBtn.classList.add('playing')
        controls.classList.add('playing')
        actionsBtn.classList.add('playing')
        actionsBtnSpan.textContent = 'TẠM DỪNG'
    }
    
    audio.onpause = function () {
        isplaying = false
        cdBtn.classList.remove('playing')
        controls.classList.remove('playing')
        actionsBtn.classList.remove('playing')
        actionsBtnSpan.textContent ='TIẾP TỤC PHÁT'
    }

    // quay đĩa
    const rotateCd = cdImg.animate([
        {transform: 'rotate(0deg)'},
        {transform: 'rotate(360deg)'}
    ], {
        duration: 8000,
        iterations: Infinity
    })

    // quay đĩa
    const rotatefooter = footerImg.animate([
        {transform: 'rotate(0deg)'},
        {transform: 'rotate(360deg)'}
    ], {
        duration: 8000,
        iterations: Infinity
    })

    rotatefooter.pause()
    rotateCd.pause()

    // thanh input progress chạy theo nhạc'
    audio.ontimeupdate = function () {
        if(audio.duration){
            const newTime = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = newTime
        }

        let minutes = Math.floor(audio.currentTime / 60);
        let seconds = Math.floor(audio.currentTime - minutes * 60)
        let minuteValue;
        let secondValue;

        if(minutes < 10){
            minuteValue = '0' + minutes
        }else{
            minuteValue = minutes
        }

        if(seconds < 10){
            secondValue = '0' + seconds
        }else{
            secondValue = seconds
        }

        timerRun.innerHTML = minuteValue + ":" + secondValue
    }

    //tua video
    progress.onmousedown = function () {
        istimeupdate = false
        audio.pause()
        progress.oninput = function () {
            const newProgress = audio.duration / 100 * progress.value
            audio.currentTime = newProgress
        }
    }
    progress.onmouseup = function () {
        istimeupdate = true
        audio.play()
    }
    //progress chạy đến cuối tự chuyển bài
    audio.onended = function () {
        if(isRepeat){
            audio.play()
        }else {
            btnForward.click();
        }
        songsActive()
    }

    //điểu chỉnh volume
    volume.oninput = function () {
        audio.volume = volume.value / 100
    }
    // random bài hát
    btnRandom.onclick = function () {
        isRandom = !isRandom
        btnRandom.classList.toggle('active', isRandom)
    }

    function randomSongs() {
        do {
            var checkRandom = Math.floor(Math.random() * songs.length)
        }while(checkRandom === currentIndex)
            currentIndex = checkRandom
            getElementFirst(songs)
            audio.play()
    }

    // lặp lại bài hát
    btnRepeat.onclick = function () {
        isRepeat = !isRepeat
        btnRepeat.classList.toggle('active', isRepeat)
    }

    // add active vào listsongs
    function songsActive() {
        const songlistActive = document.querySelectorAll('.list-songs')
        
        songlistActive.forEach(function (index,number) {
            if(number === currentIndex){
                index.classList.add('active')
            }else{
                index.classList.remove('active')
            }
        })
    }
    songsActive()

    // click vào bài nào chạy bài đó
    songsMedia.onclick = function (e) {
        const holdactive = e.target.closest('.list-songs:not(.active)')
        if(holdactive || e.target.closest('.list-songs_right .menu-choose') ){
            if(holdactive){
                currentIndex = Number(holdactive.getAttribute('data-index'))
                songsActive()
                getElementFirst(songs)
                audio.play()
                rotateCd.play()
                rotatefooter.play()
            }
            if(e.target.closest('.list-songs_right .menu-choose')){
                
            }
        }
    }

    //views chạy theo màn hình
    function scrollViews() {
        setTimeout(function(){
            document.querySelector('.list-songs.active').scrollIntoView({
                behavior: "smooth" , 
                block: "nearest",
            });  
        },100)  
    }

}

function star() {
    loadViews(function(songs) {
        renderView(songs)
        getElementFirst(songs)
        handleEvent(songs)  
    })

}

star();