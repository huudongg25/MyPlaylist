const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const heading = $('header h2')
const thumb = $('.cd-thumb')
const audio = $('#audio')

const cd = $('.cd')

const playBtn = $('.btn-toggle-play')
const player = $('.player')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const progress = $('#progress')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const apps = {
    currentIndex: 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    songs:[
    {
        name:'Bước Qua Nhau',
        singer:'Vũ.',
        path:'./assets/music/song1.mp3',
        img:'./assets/img/vũ.jpg',
    },
    {
        name:'Có Em Bên Đời Bỗng Vui',
        singer:'Chillies',
        path: './assets/music/song2.mp3',
        img: './assets/img/chillies.jpg',
    },
    {
        name:'DNA',
        singer:'BTS',
        path: './assets/music/song3.mp3',
        img: './assets/img/BTS.jpg',
    },
    {
        name:'Double Take',
        singer:'dhruv',
        path: './assets/music/song4.mp3',
        img: './assets/img/dhruv.jpg',
    },
    {
        name:'Stay',
        singer:'The KID Laroi ft Justin Bieber',
        path: './assets/music/song5.mp3',
        img: './assets/img/justin-bieber.jpg',
    },
    {
        name:'Spring Day',
        singer:'BTS',
        path:'./assets/music/song6.m4a',
        img: './assets/img/BTS2.jpg',
    },
    {
        name:'MIC Drop',
        singer:'BTS',
        path:'./assets/music/song7.mp3',
        img: './assets/img/Bts3.png',
    },
    {
        name:'Dù Cho Mai Về Sau',
        singer:'buitruonglinh',
        path: './assets/music/song8.mp3',
        img: './assets/img/duchomaivesau.jpeg',
    },
    {
        name:'Đường Ta Chở Em Về',
        singer:'buitruonglinh',
        path: './assets/music/song9.mp3',
        img: './assets/img/buitruonglinh.jpg',
    },
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active':''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.img}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this,'currentSong',{
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents : function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        //Animation rotate CD
        const thumbAnimate = thumb.animate([
            { transform:'rotate(360deg)'}
        ],{
            duration: 10000, //10giây
            iterations: Infinity
        })
        thumbAnimate.pause()

        //xử lí phóng to/thu nhỏ CD        
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width = newCdWidth > 0? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        //Xử lí khi Play
            playBtn.onclick = function() {
                if(_this.isPlaying) {
                    audio.pause()
                } else {
                    audio.play()
                }
            }
        //Xử lí khi đang chạy || đang dừng bài hát
            audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                thumbAnimate.play()
            }
            audio.onpause = function() {
                _this.isPlaying = false
                player.classList.remove('playing')
                thumbAnimate.pause()
            }


        //thanh chạy bài hát
            audio.ontimeupdate = function() {
                if(audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                    progress.value = progressPercent
                }
            }
        //xử lí khi tua bài hát
            progress.onchange = function(e) {
                const seekTime = audio.duration /100 * e.target.value
                audio.currentTime = seekTime
            }
        //khi nextsong
            nextBtn.onclick = function() {
                if (_this.isRandom){
                    _this.randomSong()
                } else {
                    _this.nextSong()
                }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }
        //khi prevsong
            prevBtn.onclick = function() {
                if (_this.isRandom){
                    _this.randomSong()
                } else {
                    _this.prevSong()
                }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }
        //random song
            randomBtn.onclick = function() {
                _this.isRandom = !_this.isRandom
                randomBtn.classList.toggle('active',_this.isRandom)
            }
        //Xử lí next song khi song ended
            audio.onended = function() {
                if(_this.isRepeat) {
                    audio.play()
                } else {
                    nextBtn.click()
                }
            }
        //Xử lí phát lặp lại 1 bài
            repeatBtn.onclick = function(e) {
                _this.isRepeat = !_this.isRepeat
                repeatBtn.classList.toggle('active',_this.isRepeat)
            }
        //Click vào bài hát
            playlist.onclick = function(e) {
                const songNode = e.target.closest('.song:not(.active)')
                if( songNode || !e.target.closest('.option')) {
                        //xử lí khi click vào bài hát
                        if(songNode) {
                            _this.currentIndex = Number(songNode.dataset.index)
                            _this.loadCurrentSong()
                            _this.render()
                            audio.play()
                        }
                        // xử lí khi click vào nút option trong bài hát
                        if(!e.target.closest('.option')){

                        }
                }
            }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        thumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex <0) {
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },
    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'end',
            })
        },200)
    },
    start: function() {
        this.defineProperties()
        
        this.handleEvents()
        
        this.loadCurrentSong()
        
        this.render()
    }
}

apps.start()