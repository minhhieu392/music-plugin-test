const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: {},

    songs: [{
        name: "My Heart Will Go On",
        singer: "Titanic",
        path: './music/mhwgo.mp3',
        image: "./img/mhwgo.jpg"
    }, {
        name: "Nàng Thơ",
        singer: "Hoàng Dũng",
        path: "./music/nangtho.mp3",
        image: "./img/nangtho.jpg"
    }, {
        name: "Past Lives",
        singer: "Fall In Lux",
        path: "./music/past.mp3",
        image: "./img/pastlives.jpg"
    }, {
        name: "Victory",
        singer: "Two Steps From Hell",
        path: "./music/tsph.mp3",
        image: "./img/tsfh.jpg"
    }, {
        name: "Wake Me Up",
        singer: "Avicll",
        path: "./music/wakemeup1.mp3",
        image: "./img/wakemeup.jpg"
    }, {
        name: "Way Back Home",
        singer: "Shaun",
        path: "./music/way.mp3",
        image: "./img/waybackhome.jpg"
    }, {
        name: "Unstoppable",
        singer: "Sia",
        path: "./music/unstoppable.mp3",
        image: "./img/unstoppable.jpg"
    }, {
        name: "Umbrella",
        singer: "Fall in lux",
        path: "./music/umbrella.mp3",
        image: "./img/umbrella.jpg"
    }, {
        name: "The One That Got Away",
        singer: "Katy Perry",
        path: "./music/theonethatgotaway.mp3",
        image: "./img/theonethatgotaway.jpg"
    }, {
        name: "Dancing With Your Ghost",
        singer: "Sasha Sloan",
        path: "./music/dancingwithyourghost.mp3",
        image: "./img/dancing.jpg"
    }],
    setConfig: function(key, value) {
        this.config[key] = value;
        // (2/2) Uncomment the line below to use localStorage
        // localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? "active" : "" }" data-index="${index}">
                                <div class="thumb" style="background-image: url('${song.image}')"></div>
                                    <div class="body">
                                        <h3 class="title">${song.name}</h3>
                                        <p class="author">${song.singer}</p>
                                    </div>
                                    <div class="option">
                                        <i class="fas fa-ellipsis-h"></i>
                                    </div>
                            </div>`;
        });
        playlist.innerHTML = htmls.join("");
    },
    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        const cdThumbAnimate = cdThumb.animate([{
            transform: "rotate(360deg)"
        }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        // Handles CD enlargement / reduction
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Xử lý khi click play
        // Handle when click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // Khi song được play
        // When the song is played
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };


        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };


        progress.onchange = function(e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };


        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };


        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
        };


        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };


        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };


        playlist.onclick = function(e) {
            const songNode = e.target.closest(".song:not(.active)");

            if (songNode || e.target.closest(".option")) {

                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }


                if (e.target.closest(".option")) {}
            }
        };
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }, 300);
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        // Gán cấu hình từ config vào ứng dụng
        // Assign configuration from config to application
        this.loadConfig();


        this.defineProperties();


        this.handleEvents();


        this.loadCurrentSong();

        // Render playlist
        this.render();


        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    }
};
app.start();