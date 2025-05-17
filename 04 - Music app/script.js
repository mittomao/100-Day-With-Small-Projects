var data = {
    "songs": [
        {
            "song": "Ta là của nhau",
            "json": {
                "lyrics": [
                    {
                        "line": "<span class='loader loader-1'></span>",
                        "time": 100,
                    },
                    {
                        "line": "Khi gặp nhau phút đầu",
                        "time": 15000,
                        "gender": 0
                    },
                    {
                        "line": "Từ ánh mắt anh đã trao nụ cười",
                        "time": 17500,
                        "gender": 0
                    },
                    {
                        "line": "Khẽ ngại ngùng anh nói, mình cầm tay nhé",
                        "time": 21000,
                        "gender": 1
                    },
                    {
                        "line": "Đưa em qua những con đường tình yêu.",
                        "time": 25000,
                        "gender": 1
                    },
                    {
                        "line": "Em chẳng thể dối lòng",
                        "time": 29000,
                        "gender": 0
                    },
                    {
                        "line": "Rằng em đã yêu anh từ lúc nào",
                        "time": 31000,
                        "gender": 0
                    },
                    {
                        "line": "Nghe nhịp đập con tim, lòng mình thổn thức",
                        "time": 34000,
                        "gender": 1
                    },
                    {
                        "line": "Anh muốn ta là của nhau.",
                        "time": 36000,
                        "gender": 1
                    },
                    {
                        "line": "Từ đây em không còn khóc",
                        "time": 41000,
                        "gender": 0
                    },
                    {
                        "line": "Không còn nước mắt đêm về một mình đơn côi",
                        "time": 44000,
                        "gender": 0
                    },
                    {
                        "line": "Vì giờ bên em đã có anh sớt chia những buồn vui.",
                        "time": 48000,
                        "gender": 1
                    },
                    {
                        "line": "Lòng em luôn luôn nguyện ước",
                        "time": 54000,
                        "gender": 0
                    },
                    {
                        "line": "Cho dù năm tháng phai nhòa, tình ta vẫn sẽ",
                        "time": 56000,
                        "gender": 0
                    },
                    {
                        "line": "Vượt qua sóng gió cuộc đời mãi mãi ta là của nhau.",
                        "time": 61000,
                        "gender": 1
                    },
                    {
                        "line": "<span class='loader loader-1'></span>",
                        "time": 68000,
                    },
                    {
                        "line": "Mai này em xấu đi",
                        "time": 82000,
                        "gender": 0
                    },
                    {
                        "line": "Thì anh có còn yêu em như lúc đầu",
                        "time": 83500,
                        "gender": 0
                    },
                    {
                        "line": "Khẽ mỉm cười anh nói, em thật ngốc nghếch",
                        "time": 88000,
                        "gender": 1
                    },
                    {
                        "line": "Anh yêu em đến khi nhắm mắt xuôi tay.",
                        "time": 92000,
                        "gender": 1
                    },
                    {
                        "line": "Thôi thì em giấu cho riêng anh",
                        "time": 95000,
                        "gender": 0
                    },
                    {
                        "line": "Ngôi nhà trong trái tim em",
                        "time": 98000,
                        "gender": 0
                    },
                    {
                        "line": "Lúc giận hờn trách móc, lo sợ mất nhau",
                        "time": 100000,
                        "gender": 1
                    },
                    {
                        "line": "Xin hãy tựa vào vai nhau.",
                        "time": 104000,
                        "gender": 1
                    },
                    {
                        "line": "<span class='loader loader-1'></span>",
                        "time": 107000,
                        "gender": 0
                    },
                    {
                        "line": "Từ đây em không còn khóc",
                        "time": 108000,
                        "gender": 0
                    },
                    {
                        "line": "Không còn nước mắt đêm về một mình đơn côi",
                        "time": 111000,
                        "gender": 0
                    },
                    {
                        "line": "Vì giờ bên em đã có anh sớt chia những buồn vui.",
                        "time": 115000,
                        "gender": 1
                    },
                    {
                        "line": "Lòng em luôn luôn nguyện ước",
                        "time": 120000,
                        "gender": 0
                    },
                    {
                        "line": "Cho dù năm tháng phai nhòa, tình ta vẫn sẽ",
                        "time": 123000,
                        "gender": 0
                    },
                    {
                        "line": "Vượt qua sóng gió cuộc đời mãi mãi ta là của nhau.",
                        "time": 127000,
                        "gender": 1
                    },
                    {
                        "line": "💖💖💖💖💖",
                        "time": 132000,
                    }
                ]
            },
            "audio": "./assets/Ta-La-Cua-Nhau-Dong-Nhi-Ong-Cao-Thang.mp3"
        }
    ]
}
$(document).ready(function () {
    var index = 0;
    var mysong = data.songs[index];
    var time = 0;
    var totalTime = 0;
    var timeList = [];
    var play = 0;
    var counter = 0;
    var songRepeat = 0;
    var safeKill = 0;
    var previousTime;
    var audio = document.getElementById('audioFile');

    function centerize() {
        if (play == 0) return;
        if ($(".current").length == 0) return;
        var a = $(".current").height();
        var c = $("#lyrics").height();
        var d = $(".current").offset().top - $(".current").parent().offset().top;
        var e = d + (a / 2) - (c * 1 / 4);
        $("#lyrics").animate({
            scrollTop: e + "px"
        }, {
            easing: "swing",
            duration: 500
        });
    }

    function next() {
        var current = $('#lyrics .current');
        if (current.length == 0) {
            $('#lyrics-content h2:nth-child(1)').addClass("current");
            return;
        }
        current.removeClass('current');
        current.next().addClass('current');
    }

    function previous() {
        var current = $('#lyrics .current');
        if (current.length == 0) {
            return;
        }
        var first = $('#lyrics-content h2:nth-child(1)');
        current.removeClass('current');
        if (current === first) {
            return;
        }
        current.prev().addClass('current');
    }

    function processTime(a) {
        var b = parseInt(a / 60000);
        var c = parseInt((a % 60000) / 1000);
        if (c < 10) {
            c = "0" + c;
        }
        return b + ":" + c;
    }

    function reset() {
        time = 0;
        audio.currentTime = 0;
    }

    function playSong() {
        if (play == 0) {
            play = 1;
            audio.play();
            $('#player').addClass("paying");
            $('#menu button#play i').removeClass("fa-play");
            $('#menu button#play i').addClass("fa-pause");
        } else {
            play = 0;
            audio.pause();
            $('#player').removeClass("paying");
            $('#menu button#play i').removeClass("fa-pause");
            $('#menu button#play i').addClass("fa-play");
        }
    }

    function processing(data) {
        var html = "";
        timeList = [];
        for (var i = 0; i < data.lyrics.length; i++) {
            timeList.push(data.lyrics[i].time);
            var imgSrc = data.lyrics[i].gender == 1 ? 'man.png' : data.lyrics[i].gender == 0 ? 'girl.png' : '';
            html = html + `<h2 class="${data.lyrics[i].gender == 1 ? 'man' : data.lyrics[i].gender == 0 ? 'girl' : ''}"> <img src="./assets/${imgSrc}"/> <span>${ data.lyrics[i].line}</span> </h2>`;
        }
        $('#lyrics-content').html(html);
        $('#totalTime').html(processTime(totalTime));
        $('#currentTime').html(processTime(time));
        var percent = time / totalTime * 100;
        $('#progress').css("width", percent + "%");
    }

    function rewind5s() {
        if (time > 5000)
            time = time - 5000;
        else
            time = 0;
        audio.currentTime = parseInt(time / 1000);
    }

    function forward5s() {
        if ((time + 5000) < totalTime)
            time = time + 5000;
        else
            time = totalTime;
        audio.currentTime = parseInt(time / 1000);
    }

    $(document).bind('keydown', function (event) {
        switch (event.keyCode) {
            case 37:
                rewind5s();
                break;
            case 39:
                forward5s();
                break;
        }
    });

    $(document).bind('keypress', function (event) {
        //console.log(event.keyCode);
        switch (event.keyCode) {
            case 32:
                playSong();
                break;
            case 109:
                toggleMute();
                break;
        }
    });

    function updateTimer(data) {
        if (totalTime == 0 || isNaN(totalTime)) {
            totalTime = parseInt((audio.duration * 1000));
            processing(data);
        }
        //for the end of the song
        if (time >= totalTime) {
            if (play == 0) return;
            playSong();
            if (songRepeat == 1) {
                reset();
                playSong();
                return;
            } else {
                playSong();
            }
            return;
        }
        //update timer
        if (play == 1) {
            time = time + 1000;
        } else if (play == -1) {
            time = 0;
        }
        //upadate time on the progress bar
        if (audio.currentTime != previousTime) {
            previousTime = audio.currentTime;
            $('#currentTime').html(processTime(time));
            var percent = time / totalTime * 100;
            $('#progress').css("width", percent + "%");
        } else {
            time = parseInt(audio.currentTime * 1000);
            if (time > 100) time = time - 100;
            if (play == 1) {
                audio.pause();
                if (audio.readyState == 4) {
                    audio.play();
                }
            }
        }
        safeKill = 0;
        while (true) {
            safeKill += 1;
            if (safeKill >= 100) break;
            if (counter == 0) {
                if (time < timeList[counter]) {
                    previous();
                    break;
                }
            }
            if ((counter == timeList.length) && (time <= timeList[counter - 1])) {
                counter--;
                previous();
            }
            if (time >= timeList[counter]) {
                if (counter <= timeList.length) {
                    counter++;
                }
                next();
            } else if (time < timeList[counter - 1]) {
                counter--;
                previous();
            } else {
                if (play == 1 && !audio.paused && !audio.ended) centerize();
                break;
            }
        }
    }

    function loadSong() {
        $('#audioFile').attr('src', mysong.audio);
        processing(data.songs[0].json);
        totalTime = NaN;
        stopTimer = setInterval(function () {
            updateTimer(data.songs[0].json);
        }, 1000);
    }

    loadSong();

    $('#play').on('click', playSong);
});


// Carete Wave

function SineWaveGenerator(options) {
    $.extend(this, options || {});

    if (!this.el) {
        throw "No Canvas Selected";
    }
    this.ctx = this.el.getContext("2d");

    if (!this.waves.length) {
        throw "No waves specified";
    }

    // Internal
    this._resizeWidth();
    window.addEventListener("resize", this._resizeWidth.bind(this));
    // User
    this.resizeEvent();
    window.addEventListener("resize", this.resizeEvent.bind(this));

    if (typeof this.initialize === "function") {
        this.initialize.call(this);
    }
    // Start the magic
    this.loop();
}

// Defaults
SineWaveGenerator.prototype.speed = 10;
SineWaveGenerator.prototype.amplitude = 50;
SineWaveGenerator.prototype.wavelength = 50;
SineWaveGenerator.prototype.segmentLength = 10;

SineWaveGenerator.prototype.lineWidth = 2;
SineWaveGenerator.prototype.strokeStyle = "rgba(255, 255, 255, 0.2)";

SineWaveGenerator.prototype.resizeEvent = function () { };

// fill the screen
SineWaveGenerator.prototype._resizeWidth = function () {
    this.dpr = window.devicePixelRatio || 1;

    this.width = this.el.width = window.innerWidth * this.dpr;
    this.height = this.el.height = window.innerHeight * this.dpr;
    this.el.style.width = window.innerWidth + "px";
    this.el.style.height = window.innerHeight + "px";

    this.waveWidth = this.width * 0.95;
    this.waveLeft = this.width * 0.025;
};

SineWaveGenerator.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
};

SineWaveGenerator.prototype.time = 0;

SineWaveGenerator.prototype.update = function (time) {
    this.time = this.time - 0.007;
    if (typeof time === "undefined") {
        time = this.time;
    }

    var index = -1;
    var length = this.waves.length;

    while (++index < length) {
        var timeModifier = this.waves[index].timeModifier || 1;
        this.drawSine(time * timeModifier, this.waves[index]);
    }
    index = void 0;
    length = void 0;
};

// Constants
var PI2 = Math.PI * 2;
var HALFPI = Math.PI / 2;

SineWaveGenerator.prototype.ease = function (percent, amplitude) {
    return amplitude * (Math.sin(percent * PI2 - HALFPI) + 1) * 0.5;
};

SineWaveGenerator.prototype.drawSine = function (time, options) {
    options = options || {};
    amplitude = options.amplitude || this.amplitude;
    wavelength = options.wavelength || this.wavelength;
    lineWidth = options.lineWidth || this.lineWidth;
    strokeStyle = options.strokeStyle || this.strokeStyle;
    segmentLength = options.segmentLength || this.segmentLength;

    var x = time;
    var y = 0;
    var amp = this.amplitude;

    // Center the waves
    var yAxis = this.height / 2;

    // Styles
    this.ctx.lineWidth = lineWidth * this.dpr;
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.beginPath();

    // Starting Line
    this.ctx.moveTo(0, yAxis);
    this.ctx.lineTo(this.waveLeft, yAxis);

    for (var i = 0; i < this.waveWidth; i += segmentLength) {
        x = time * this.speed + (-yAxis + i) / wavelength;
        y = Math.sin(x);

        // Easing
        amp = this.ease(i / this.waveWidth, amplitude);

        this.ctx.lineTo(i + this.waveLeft, amp * y + yAxis);

        amp = void 0;
    }

    // Ending Line
    this.ctx.lineTo(this.width, yAxis);

    // Stroke it
    this.ctx.stroke();

    // Clean up
    options = void 0;
    amplitude = void 0;
    wavelength = void 0;
    lineWidth = void 0;
    strokeStyle = void 0;
    segmentLength = void 0;
    x = void 0;
    y = void 0;
};

SineWaveGenerator.prototype.loop = function () {
    this.clear();
    this.update();

    window.requestAnimationFrame(this.loop.bind(this));
};

new SineWaveGenerator({
    el: document.getElementById("waves"),

    speed: 8,

    waves: [
        {
            timeModifier: 1.7,
            lineWidth: 3,
            amplitude: 300,
            wavelength: 70,
            segmentLength: 10
            //       strokeStyle: 'rgba(255, 255, 255, 0.5)'
        },
        {
            timeModifier: 1.5,
            lineWidth: 2,
            amplitude: 175,
            wavelength: 100
            //       strokeStyle: 'rgba(255, 255, 255, 0.3)'
        },
        {
            timeModifier: 1.1,
            lineWidth: 2,
            amplitude: -160,
            wavelength: 100
            //       strokeStyle: 'rgba(255, 255, 255, 0.3)'
        },
        {
            timeModifier: 1.3,
            lineWidth: 1,
            amplitude: -125,
            wavelength: 150,
            segmentLength: 10
            //       strokeStyle: 'rgba(255, 255, 255, 0.2)'
        },
        {
            timeModifier: 1.7,
            lineWidth: 1,
            amplitude: 145,
            wavelength: 150,
            segmentLength: 10
            //       strokeStyle: 'rgba(255, 255, 255, 0.2)'
        },
        {
            timeModifier: 1.6,
            lineWidth: 0.5,
            amplitude: -60,
            wavelength: 200,
            segmentLength: 10
            //       strokeStyle: 'rgba(255, 255, 255, 0.1)'
        },
        {
            timeModifier: 2,
            lineWidth: 0.5,
            amplitude: 85,
            wavelength: 200,
            segmentLength: 10
            //       strokeStyle: 'rgba(255, 255, 255, 0.1)'
        }
    ],

    initialize: function () { },

    resizeEvent: function () {
        var gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0.3, "rgba(240, 107, 93, 100)");
        gradient.addColorStop(0.7, "rgba(119, 93, 168, 100)");

        var index = -1;
        var length = this.waves.length;
        while (++index < length) {
            this.waves[index].strokeStyle = gradient;
        }

        // Clean Up
        index = void 0;
        length = void 0;
        gradient = void 0;
    }
});
