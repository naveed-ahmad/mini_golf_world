function CLevelMenu() {

    var _bNumActive;

    var _iCurLevelActive;

    var _oLevelTextContainer;
    var _aLevels = new Array();
    var _aLevelScore;

    var _oModeNumOff;
    var _oModeNumOn;

    var _oBg;
    var _oButExit;
    var _oAudioToggle;

    var _oFade;

    var _pStartPosExit;
    var _pStartPosAudio;

    this._GamesLab_init = function() {
      _aLevelScore = s_oLocalStorage.getAllLevelsScore();
      _iCurLevelActive = s_oLocalStorage.getLastPlayedLevel();

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        _oBg.x = 0;
        _oBg.y = 0;
        s_oStage.addChild(_oBg);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        s_oStage.addChild(_oFade);

        _bNumActive = false;

        _oLevelTextContainer = new createjs.Container();
        _oLevelTextContainer.x = 0;
        _oLevelTextContainer.y = 0;

        var iY = 200;

        var oLevelTextStroke = new createjs.Text(TEXT_SELECT_A_LEVEL, " 46px " + PRIMARY_FONT, "#3e240b");
        oLevelTextStroke.x = CANVAS_WIDTH / 2;
        oLevelTextStroke.y = iY;
        oLevelTextStroke.outline = 10;
        oLevelTextStroke.textAlign = "center";
        oLevelTextStroke.textBaseline = "alphabetic";
        oLevelTextStroke.lineWidth = 1000;

        var oLevelText = new createjs.Text(TEXT_SELECT_A_LEVEL, " 46px " + PRIMARY_FONT, "#ffd800");
        oLevelText.x = CANVAS_WIDTH / 2;
        oLevelText.y = iY;
        oLevelText.textAlign = "center";
        oLevelText.textBaseline = "alphabetic";
        oLevelText.lineWidth = 1000;

        _oLevelTextContainer.addChild(oLevelTextStroke, oLevelText);
        s_oStage.addChild(_oLevelTextContainer);

        var oModePos = {
            x: CANVAS_WIDTH * 0.5 - 20,
            y: 425
        };

        var offset_x = -200;
        var offset_y = -100;

        var iTotalScore = s_oLocalStorage.getTotalScore();
      
        var oTotalScoreTextStroke = new createjs.Text(TEXT_TOTAL_SCORE + ": " + iTotalScore, " 40px " + PRIMARY_FONT, "#3e240b");
        oTotalScoreTextStroke.x = CANVAS_WIDTH / 2;
        oTotalScoreTextStroke.y = 800;
        oTotalScoreTextStroke.outline = 10;
        oTotalScoreTextStroke.textAlign = "center";
        oTotalScoreTextStroke.textBaseline = "alphabetic";
        oTotalScoreTextStroke.lineWidth = 1000;
        s_oStage.addChild(oTotalScoreTextStroke);

        var oTotalScoreText = new createjs.Text(TEXT_TOTAL_SCORE + ": " + iTotalScore, " 40px " + PRIMARY_FONT, "#ffd800");
        oTotalScoreText.x = CANVAS_WIDTH / 2;
        oTotalScoreText.y = oTotalScoreTextStroke.y
        oTotalScoreText.textAlign = "center";
        oTotalScoreText.textBaseline = "alphabetic";
        oTotalScoreText.lineWidth = 1000;
        s_oStage.addChild(oTotalScoreText);


        for (var i = 0; i < 18; i++, offset_x += 170) {
            if (offset_x > 700) {
                offset_x = -200;
                offset_y += 150;
            }

            if (i <= _iCurLevelActive) {
                _aLevels[i] = new CLevelBut((oModePos.x - 200) + offset_x, oModePos.y + offset_y, s_oSpriteLibrary.getSprite('but_level'), true, i + 1, s_oStage);
                _aLevels[i].addEventListenerWithParams(ON_MOUSE_UP, this._onClick, this, i);
                _aLevels[i].enable();
            } else {
                _aLevels[i] = new CLevelBut((oModePos.x - 200) + offset_x, oModePos.y + offset_y, s_oSpriteLibrary.getSprite('but_level'), false, i + 1, s_oStage);
                _aLevels[i].disable();
            }

            _aLevels[i].addLevelText(i + 1);
            _aLevels[i].disable();
            _aLevels[i].addStar(0);

            s_bFirstTime = true;
        }
        this._setLevelInfo();


        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {
            x: CANVAS_WIDTH - (oSprite.height / 2) - 10,
            y: (oSprite.height / 2) + 17
        };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {
                x: _pStartPosExit.x - oSprite.height - 10,
                y: _pStartPosExit.y
            };
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oFade);

        new createjs.Tween.get(_oFade).to({
            alpha: 0
        }, 1000);

        this._GamesLab_refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.unload = function() {
        for (var i = 0; i < NUM_HOLES; i++) {
            _aLevels[i].unload();
        }
        _oFade.off("mousedown");

        s_oLevelMenu = null;
        s_oStage.removeAllChildren();
    };

    this._GamesLab_refreshButtonPos = function(iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        }
        _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y + iNewY);
    };

    this._setLevelInfo = function() {

        if (_iCurLevelActive < NUM_HOLES) {
            _aLevels[_iCurLevelActive].enable();
            _aLevels[_iCurLevelActive].pulseAnimation();
        }

        for (var i = 0; i < _iCurLevelActive; i++) {
          if(_aLevels[i]){
            _aLevels[i].enable();

            if (_aLevelScore[i] > 0 && _aLevelScore[i] < PAR_POINTS - ADDED_POINTS) {
              _aLevels[i].addStar(1);
            } else if (_aLevelScore[i] >= PAR_POINTS - ADDED_POINTS && _aLevelScore[i] < PAR_POINTS) {
              _aLevels[i].addStar(2);
            } else {
              _aLevels[i].addStar(3);
            }

            _aLevels[i].addScore(_aLevelScore[i]);
          }

        }

    };

    this._onNumModeToggle = function(iData) {
        if (iData === NUM_ACTIVE) {
            _bNumActive = true;
            _oModeNumOff.setActive(false);
            _oModeNumOn.setActive(true);

        } else {
            _bNumActive = false;
            _oModeNumOff.setActive(true);
            _oModeNumOn.setActive(false);
        }
    };

    this._onAudioToggle = function() {
      setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onClick = function(i) {

        var level = i;
        _oFade.on("mousedown", function() {});
        createjs.Tween.get(_oFade, {
            override: true
        }).to({
            alpha: 1
        }, 500).call(function() {
            s_oLevelMenu.unload();
            s_oMain.loadSelectedLevel(level);
        });
    };

    this._onExit = function() {
        s_oLevelMenu.unload();
        s_oMain._GamesLab_gotoMenu();
    };


    s_oLevelMenu = this;
    this._GamesLab_init();

};

var s_oLevelMenu = null;
