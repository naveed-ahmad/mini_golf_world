function CInterface(oParentContainer) {
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosRestart;
    var _pStartPosLaunch;
    var _pStartPosHoleNum;
    var _pStartPosPar;
    var _oButExit;
    var _oButRestart;
    var _oLaunchText;
    var _oParText;
    var _oHoleNumText;
    var _oHelpPanel;
    var _oAudioToggle;
    var _oPowerBar;
    var _oPowerBarDim;
    var _oMaskPowerBar;
    var _oButCenterBallView;
    var _oParTextStroke;
    var _oLaunchTextStroke;
    var _oHoleNumTextStroke;

    var _pStartPosCenterBallView;

    this._GamesLab_init = function(oParentContainer) {

        _pStartPosLaunch = {
            x: (CANVAS_WIDTH / 2),
            y: 72
        };
        _oLaunchTextStroke = new createjs.Text(TEXT_LAUNCH + ": 0", "40px " + PRIMARY_FONT, "#3e240b");
        _oLaunchTextStroke.x = _pStartPosLaunch.x;
        _oLaunchTextStroke.y = _pStartPosLaunch.y;
        _oLaunchTextStroke.outline = 8;
        _oLaunchTextStroke.textAlign = "center";
        _oLaunchTextStroke.textBaseline = "alphabetic";
        oParentContainer.addChild(_oLaunchTextStroke);

        _oLaunchText = new createjs.Text(TEXT_LAUNCH + ": 0", "40px " + PRIMARY_FONT, "#ffd800");
        _oLaunchText.x = _pStartPosLaunch.x;
        _oLaunchText.y = _pStartPosLaunch.y;
        _oLaunchText.textAlign = "center";
        _oLaunchText.textBaseline = "alphabetic";
        oParentContainer.addChild(_oLaunchText);


        _pStartPosPar = {
            x: 26,
            y: 72
        };
        _oParTextStroke = new createjs.Text(TEXT_PAR + ": 0", "40px " + PRIMARY_FONT, "#3e240b");
        _oParTextStroke.x = _pStartPosPar.x;
        _oParTextStroke.y = _pStartPosPar.y;
        _oParTextStroke.outline = 8;
        _oParTextStroke.textAlign = "left";
        _oParTextStroke.textBaseline = "alphabetic";
        oParentContainer.addChild(_oParTextStroke);

        _oParText = new createjs.Text(TEXT_PAR + ": 0", "40px " + PRIMARY_FONT, "#ffd800");
        _oParText.x = _pStartPosPar.x;
        _oParText.y = _pStartPosPar.y;
        _oParText.textAlign = "left";
        _oParText.textBaseline = "alphabetic";
        oParentContainer.addChild(_oParText);

        _pStartPosHoleNum = {
            x: CANVAS_WIDTH - 28,
            y: CANVAS_HEIGHT - 35
        };
        _oHoleNumTextStroke = new createjs.Text(TEXT_HOLE + ": 1", "40px " + PRIMARY_FONT, "#3e240b");
        _oHoleNumTextStroke.x = _pStartPosHoleNum.x;
        _oHoleNumTextStroke.y = _pStartPosHoleNum.y;
        _oHoleNumTextStroke.outline = 8;
        _oHoleNumTextStroke.textAlign = "right";
        _oHoleNumTextStroke.textBaseline = "alphabetic";
        oParentContainer.addChild(_oHoleNumTextStroke);

        _oHoleNumText = new createjs.Text(TEXT_HOLE + ": 1", "40px " + PRIMARY_FONT, "#ffd800");
        _oHoleNumText.x = _pStartPosHoleNum.x;
        _oHoleNumText.y = _pStartPosHoleNum.y;
        _oHoleNumText.textAlign = "right";
        _oHoleNumText.textBaseline = "alphabetic";
        oParentContainer.addChild(_oHoleNumText);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {
            x: CANVAS_WIDTH - (oSprite.height / 2) - 10,
            y: (oSprite.height / 2) + 17
        };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, oParentContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        var oSprite = s_oSpriteLibrary.getSprite('but_restart_small');
        _pStartPosRestart = {
            x: _pStartPosExit.x - oSprite.height - 10,
            y: _pStartPosExit.y
        };
        _oButRestart = new CGfxButton(_pStartPosRestart.x, _pStartPosRestart.y, oSprite, oParentContainer);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {
                x: _pStartPosRestart.x - oSprite.height - 10,
                y: _pStartPosExit.y
            };
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive, oParentContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }

        var oSprite = s_oSpriteLibrary.getSprite('but_center_view');
        _pStartPosCenterBallView = {
            x: (oSprite.height / 2) + 10,
            y: CANVAS_HEIGHT - (oSprite.height / 2) - 10
        };
        _oButCenterBallView = new CGfxButton(_pStartPosCenterBallView.x, _pStartPosCenterBallView.y, oSprite, oParentContainer);
        _oButCenterBallView.addEventListener(ON_MOUSE_UP, this._onCenterBall, this);
        _oButCenterBallView.setVisible(false);

        this._GamesLab_refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
  
    this._GamesLab_refreshButtonPos = function(iNewX, iNewY) {
        _oButExit.setPosition(_pStartPosExit.x - iNewX, iNewY + _pStartPosExit.y);
        _oButRestart.setPosition(_pStartPosRestart.x - iNewX, iNewY + _pStartPosRestart.y);
        _oButCenterBallView.setPosition(_pStartPosCenterBallView.x + iNewX, _pStartPosCenterBallView.y - iNewY);

            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y);

        _oLaunchText.y = _pStartPosLaunch.y + iNewY;
        _oLaunchTextStroke.y = _oLaunchText.y;

        _oHoleNumText.x = _pStartPosHoleNum.x - iNewX;
        _oHoleNumText.y = _pStartPosHoleNum.y - iNewY;
        _oHoleNumTextStroke.x = _oHoleNumText.x;
        _oHoleNumTextStroke.y = _oHoleNumText.y;

        _oParText.x = _pStartPosPar.x + iNewX;
        _oParText.y = _pStartPosPar.y + iNewY;
        _oParTextStroke.x = _oParText.x;
        _oParTextStroke.y = _oParText.y;
    };

    this.refreshPowerBar = function(fValue) {

        _oMaskPowerBar.graphics.clear();
        var iNewMaskWidth = Math.floor((fValue * _oPowerBarDim.width) / 100);
        _oMaskPowerBar.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(_oPowerBar.x, _oPowerBar.y, iNewMaskWidth, _oPowerBarDim.height);
    };

    this.unload = function() {
        _oButExit.unload();
        _oButExit = null;

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }

        s_oInterface = null;
    };

    this.refreshLaunch = function(iLaunch) {
        if(iLaunch > 2){
            prepareAdmobInterstitial(false);
        }

        _oLaunchText.text = TEXT_LAUNCH + ": " + iLaunch;
        _oLaunchTextStroke.text = TEXT_LAUNCH + ": " + iLaunch;
    };

    this.setParText = function(szValue) {
        _oParText.text = TEXT_PAR + ": " + szValue;
        _oParTextStroke.text = TEXT_PAR + ": " + szValue;
    };

    this.refreshHoleNum = function(iHole) {
        _oHoleNumText.text = TEXT_HOLE + ": " + iHole;
        _oHoleNumTextStroke.text = TEXT_HOLE + ": " + iHole;
    };

    this.setCenterBallViewVisible = function(bVal) {
        _oButCenterBallView.setVisible(bVal);
    };

    this.onExitFromHelp = function() {
        _oHelpPanel.unload();
    };

    this._onAudioToggle = function() {
      setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onExit = function() {
        new CAreYouSurePanel(s_oGame.onExit);
    };

    this._onRestart = function() {
        s_oGame.restartLevel();
    };

    this._onCenterBall = function() {
        _oButCenterBallView.setVisible(false);
        s_oGame.centerBallView();
    };

    s_oInterface = this;

    this._GamesLab_init(oParentContainer);

    return this;
}

var s_oInterface = null;
