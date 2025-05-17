const GAME_STATE_LOGIN = "GAME_STATE_LOGIN";
const GAME_STATE_PLAY = "GAME_STATE_PLAY";
const GAME_STATE_WIN = "GAME_STATE_WIN";
const GAME_STATE_LOSE = "GAME_STATE_LOSE";

function MobileGame($el, options) {
    const _self = this;
    _self.$el = $el;
    _self._handleCallApiSuccess = _handleCallApiSuccess.bind(_self);
    _self._handleCallApiFail = _handleCallApiFail.bind(_self);

    _self.playTimer = 90;
    _self.playTimerMax = 90;
    _self.playTimerStart = false;

    _self.playPictureZoom = 1;

    _self.state = {
        gameState: GAME_STATE_LOGIN,
        activeHitbox: 0,
        loginPage: 0
    };

    var stateBoxLogin = _self.$el[0].querySelector(".mbg-content-login");
    stateBoxLogin.querySelector(".mbg-btn-popup-bottom.check").addEventListener("click", _self.loginCheck.bind(_self));

    var stateBoxGame = _self.$el[0].querySelector(".mbg-content-game");
    stateBoxGame.querySelector(".mbg-btn-popup-bottom.check").addEventListener("click", function () {
        _self.state.activeHitbox = 1
        _self.setState(_self.state);
    });

    stateBoxGame.querySelector(".mbg-btn-popup-bottom.close").addEventListener("click", function () {
        _self.state.gameState = GAME_STATE_LOGIN
        _self.state.activeHitbox = 0
        _self.setState(_self.state);
    });

    stateBoxGame.querySelector(".mbg-btn-popup-bottom.fullscreen").addEventListener("click", function () {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    });

    stateBoxGame.querySelector(".mbg-btn-popup-bottom.zoom-out").addEventListener("click", function () {
        if (_self.playPictureZoom < 2.5) {
            _self.playPictureZoom += 0.25
        } else {
            _self.playPictureZoom = 1
        }

        stateBoxGame.querySelector(".mbg-picture").style.transform = "scale(" + _self.playPictureZoom + ")"
    });

    stateBoxGame.querySelector(".mbg-btn-popup-bottom.zoom-in").addEventListener("click", function () {
        console.log(_self.playPictureZoom);
        
        if (_self.playPictureZoom > 1.25) {
            _self.playPictureZoom -= 0.25
        } else {
            _self.playPictureZoom = 1
        }

        stateBoxGame.querySelector(".mbg-picture").style.transform = "scale(" + _self.playPictureZoom + ")"
    });

    var emailInput = _self.$el[0].querySelector(".mbg-btn-popup-content-email");
    emailInput.addEventListener("change", function () {
        document.querySelector(".mbg-btn-popup-content-email-holder").classList.remove("red")
        document.querySelector(".mbg-btn-popup-content-email-error").innerHTML = ""
    });

    var checkInput = _self.$el[0].querySelector(".mbg-btn-popup-content-checkbox");
    checkInput.addEventListener("change", function () {
        document.querySelector(".mbg-btn-popup-content-checkbox-container").classList.remove("red")
        document.querySelector(".mbg-btn-popup-content-checkbox-container-error").innerHTML = ""
    });

    var hitBoxes = Array.from(stateBoxGame.querySelectorAll(".mbg-picture-hitbox"));
    hitBoxes.forEach(function (item) {
        item.addEventListener("click", function (e) {
            if (_self.state.activeHitbox == e.target.getAttribute("hitboxNum")) {
                if (_self.state.activeHitbox < 3) {
                    _self.state.activeHitbox += 1;
                    _self.setState(_self.state);
                } else if (_self.state.gameState == GAME_STATE_PLAY) {
                    _self.state.activeHitbox += 1;
                    _self.setState(_self.state);

                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            _self._handleCallApi('win');
                            _self.state.gameState = GAME_STATE_WIN;
                            _self.state.activeHitbox = 1;
                            _self.setState(_self.state);
                        }, 1000)
                    })
                }
            }
        })
    })

    var stateBoxLose = _self.$el[0].querySelector(".mbg-content-lose");
    stateBoxLose.querySelector(".mbg-btn-popup-bottom.check").addEventListener("click", _self.alertGame);

    _self.render(_self.state);
}
function _handleCallApiSuccess() {
    console.log("Success")
}

function _handleCallApiFail() {
    console.log("Fail")
}

MobileGame.prototype.setState = function (state) {
    const _self = this;
    _self.state = state;
    _self.render(_self.state);
}

MobileGame.prototype.loginCheck = function () {
    const _self = this;
    if (_self.state.loginPage == 0) {
        var emailString = document.querySelector(".mbg-btn-popup-content-email").value
        var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var isEmail = String(emailString).search(filter) != -1;
        if (isEmail) {
            if (document.querySelector(".mbg-btn-popup-content-checkbox").checked) {
                _self.alertGame()
            } else {
                document.querySelector(".mbg-btn-popup-content-checkbox-container").classList.add("red")
                // document.querySelector(".mbg-btn-popup-content-checkbox-container-error").innerHTML = "Agree to the terms and conditions"

            }
        } else {
            document.querySelector(".mbg-btn-popup-content-email-holder").classList.add("red")
            document.querySelector(".mbg-btn-popup-content-email-error").innerHTML = "Email không đúng. Vui Lòng nhập lại."

        }
    } else if (_self.state.loginPage == 1) {
        _self.startGame()
    }
}

MobileGame.prototype.alertGame = function () {
    const _self = this;
    _self.state.gameState = GAME_STATE_LOGIN;
    _self.state.loginPage = 1;
    _self.setState(_self.state)
}

MobileGame.prototype.startGame = function () {
    const _self = this;
    _self.state.gameState = GAME_STATE_PLAY;
    _self.state.activeHitbox = 1;
    _self.playTimer = _self.playTimerMax
    _self.setState(_self.state)
}

MobileGame.prototype.runTimer = function () {
    const _self = this;
    _self.playTimer -= 1

    if (_self.state.gameState == GAME_STATE_PLAY) {
        if (_self.playTimer > 0) {
            var playBox = _self.$el[0].querySelector(".mbg-content-game");

            var minutes = Math.floor(_self.playTimer / 60);
            var seconds = _self.playTimer - minutes * 60;

            if (minutes < 10) { minutes = "0" + minutes };
            if (seconds < 10) { seconds = "0" + seconds };

            playBox.querySelector(".mbg-picture-timer").innerHTML = minutes + ":" + seconds

            setTimeout(() => { _self.runTimer() }, 1000)
        } else {
            _self._handleCallApi('lose');

            _self.state.gameState = GAME_STATE_LOSE;
            _self.state.activeHitbox = 1;
            _self.setState(_self.state);
        }
    }
}

MobileGame.prototype[GAME_STATE_LOGIN] = function () {
    const _self = this;
    _self.playTimerStart = true

    var activeBox = _self.$el[0].querySelector(".mbg-content-login");
    activeBox.classList.add("active")

    if (_self.state.loginPage == 0) {
        activeBox.querySelector('.mbg-btn-popup-content-email-holder').classList.remove("mbg-hidden");
        activeBox.querySelector('.mbg-btn-popup-content-checkbox-container').classList.remove("mbg-hidden");
        activeBox.querySelector('.mbg-btn-popup-title').classList.remove("find");
        activeBox.querySelector('.mbg-btn-popup-title').innerHTML = `Welcome`
        activeBox.querySelector('.mbg-btn-popup-content-caption').innerHTML = `Vui lòng nhập email của bạn để nhận được những phần quà hấp dẫn nhé!`

    } else if (_self.state.loginPage == 1) {
        activeBox.querySelector('.mbg-btn-popup-content-email-holder').classList.add("mbg-hidden");
        activeBox.querySelector('.mbg-btn-popup-content-checkbox-container').classList.add("mbg-hidden");
        activeBox.querySelector('.mbg-btn-popup-title').classList.add("find");
        activeBox.querySelector('.mbg-btn-popup-title').innerHTML = `Start Game`
        activeBox.querySelector('.mbg-btn-popup-content-caption').innerHTML = `Tìm kiếm <b style="white-space: nowrap">tất cả 3 vật phẩm </b> trong ảnh thật nhanh để nhận quà nào. .`
    }
}

MobileGame.prototype[GAME_STATE_PLAY] = function () {
    const _self = this;

    var activeBox = _self.$el[0].querySelector(".mbg-content-game");
    activeBox.classList.add("active");

    if (_self.state.activeHitbox == 0) {
        activeBox.querySelector(".mbg-picture-frame").classList.add("start")
        activeBox.querySelector(".mbg-picture-frame").classList.remove("play")
    } else {
        activeBox.querySelector(".mbg-picture-frame").classList.add("play")
        activeBox.querySelector(".mbg-picture-frame").classList.remove("start")

        var hitBoxes = Array.from(activeBox.querySelectorAll(".mbg-picture-hitbox"));
        hitBoxes.forEach(function (item) { item.classList.remove("active") })

        hitBoxes.forEach(function (item) {
            if (parseInt(item.getAttribute("hitboxNum")) < _self.state.activeHitbox) {
                item.classList.add("active")
            }
        })

        var objBoxes = Array.from(activeBox.querySelectorAll(".mbg-objective-item"));
        objBoxes.forEach(function (item) {
            item.classList.remove("active")
            item.classList.remove("check")
        })

        objBoxes.forEach(function (item) {
            if (item.getAttribute("hitboxNum") <= _self.state.activeHitbox) {
                item.classList.add("active")
            }

            if (item.getAttribute("hitboxNum") < _self.state.activeHitbox) {
                item.classList.add("check")
            }
        })

        if (_self.playTimerStart) {
            _self.runTimer()
            _self.playTimerStart = false;
        }
    }
}

MobileGame.prototype._handleCallApi = function (playResult) {
    const _self = this;
    //Call Api Here
    if (playResult == 'win') {
        _self._handleCallApiSuccess();
    } else {
        _self._handleCallApiFail();
    }
}

MobileGame.prototype[GAME_STATE_WIN] = function () {
    const _self = this;
    _self.playTimerStart = true;
    let activeBox = _self.$el[0].querySelector('.mbg-content-win');
    activeBox.classList.add('active');

    activeBox.querySelector('.mbg-btn-popup-title').innerHTML = `<img src="../images/popup-title-02.png" />`
};

MobileGame.prototype[GAME_STATE_LOSE] = function () {
    const _self = this;
    _self.playTimerStart = true;
    let activeBox = _self.$el[0].querySelector('.mbg-content-lose');
    activeBox.classList.add('active');

    activeBox.querySelector('.mbg-btn-popup-title').innerHTML = `Times up!`
};

MobileGame.prototype.render = function (state) {
    const _self = this;

    var contentBoxes = Array.from(_self.$el[0].querySelectorAll(".mbg-content"));
    contentBoxes.forEach(function (item) { item.classList.remove("active") });
    _self[state.gameState]()
};