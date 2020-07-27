function CLevelCompletePanel ( oSpriteBg ) {

  var _iTotalScore;
  var _oBg;
  var _oScoreTextBack;
  var _oScoreText;
  var _oScoreTextNumBack;
  var _oScoreTextNum;
  var _oParTextBack;
  var _oParText;
  var _oMsgText;
  var _oMsgTextBack;
  var _oGroup;
  var _oButNext;
  var _oButRestart;
  var _oParent;
  var _oFade;
  var _oAchievementStars;
  var _oRollingText;

  this._GamesLab_init = function ( oSpriteBg ) {

    playSound ( "win_level", 1, 0 );
    //cordova.fireDocumentEvent("show_banner");

      _oFade = new createjs.Shape ();
    _oFade.graphics.beginFill ( "black" ).drawRect ( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );
    _oFade.alpha = 0;
    _oFade.on ( "mousedown", function () {
    } );
    s_oStage.addChild ( _oFade );

    _oBg = createBitmap ( oSpriteBg );
    _oBg.regX = oSpriteBg.width / 2;
    _oBg.regY = oSpriteBg.height / 2;
    _oBg.x = CANVAS_WIDTH / 2;
    _oBg.y = CANVAS_HEIGHT / 2;

    _oMsgTextBack = new createjs.Text ( "", "50px " + PRIMARY_FONT, "#3e240b" );
    _oMsgTextBack.x = CANVAS_WIDTH / 2;
    _oMsgTextBack.y = (CANVAS_HEIGHT / 2) - 80;
    _oMsgTextBack.outline = 10;
    _oMsgTextBack.textAlign = "center";
    _oMsgTextBack.textBaseline = "alphabetic";

    _oMsgText = new createjs.Text ( "", "50px " + PRIMARY_FONT, "#ffd800" );
    _oMsgText.x = _oMsgTextBack.x;
    _oMsgText.y = _oMsgTextBack.y;
    _oMsgText.textAlign = "center";
    _oMsgText.textBaseline = "alphabetic";

    _oParTextBack = new createjs.Text ( "", "30px " + PRIMARY_FONT, "#3e240b" );
    _oParTextBack.x = CANVAS_WIDTH / 2;
    _oParTextBack.y = _oMsgTextBack.y + 100;
    _oParTextBack.outline = 10;
    _oParTextBack.textAlign = "center";
    _oParTextBack.textBaseline = "alphabetic";

    _oParText = new createjs.Text ( "", "30px " + PRIMARY_FONT, "#ffd800" );
    _oParText.x = CANVAS_WIDTH / 2;
    _oParText.y = _oParTextBack.y;
    _oParText.textAlign = "center";
    _oParText.textBaseline = "alphabetic";

    _oScoreTextBack = new createjs.Text ( "", "30px " + PRIMARY_FONT, "#3e240b" );
    _oScoreTextBack.x = CANVAS_WIDTH / 2 - 140;
    _oScoreTextBack.y = _oMsgTextBack.y + 160;
    _oScoreTextBack.outline = 10;
    _oScoreTextBack.textAlign = "center";
    _oScoreTextBack.textBaseline = "alphabetic";

    _oScoreText = new createjs.Text ( "", "30px " + PRIMARY_FONT, "#ffd800" );
    _oScoreText.x = _oScoreTextBack.x;
    _oScoreText.y = _oScoreTextBack.y;
    _oScoreText.textAlign = "center";
    _oScoreText.textBaseline = "alphabetic";

    _oScoreTextNumBack = new createjs.Text ( "0", "30px " + PRIMARY_FONT, "#3e240b" );
    _oScoreTextNumBack.x = CANVAS_WIDTH / 2 + 140;
    _oScoreTextNumBack.y = _oScoreTextBack.y;
    _oScoreTextNumBack.outline = 10;
    _oScoreTextNumBack.textAlign = "center";
    _oScoreTextNumBack.textBaseline = "alphabetic";

    _oScoreTextNum = new createjs.Text ( "0", "30px " + PRIMARY_FONT, "#ffd800" );
    _oScoreTextNum.x = _oScoreTextNumBack.x;
    _oScoreTextNum.y = _oScoreText.y;
    _oScoreTextNum.textAlign = "center";
    _oScoreTextNum.textBaseline = "alphabetic";

    _oGroup = new createjs.Container ();
    _oGroup.alpha = 0;
    _oGroup.visible = false;
    _oGroup.addChild ( _oBg, _oScoreTextBack, _oScoreText, _oMsgTextBack, _oMsgText, _oParTextBack, _oParText, _oScoreTextNumBack, _oScoreTextNum );

    s_oStage.addChild ( _oGroup );

    _GamesLabs_showInterstitialAd();
  };

  this._unload = function () {
    createjs.Tween.get ( _oGroup ).to ( {
      alpha: 0
    }, 300 ).call ( function () {
      s_oStage.removeChild ( _oGroup );

      _oFade.off ( "mousedown", function () {
      } );
      s_oStage.removeChild ( _oFade );

      _oButRestart.unload ();
      _oButRestart = null;

      _oButNext.unload ();
      _oButNext = null;

    } );
 };

  this.show = function ( iShot, iTime, iLv ) {
    _oMsgTextBack.text = TEXT_COMPLETE;
    _oMsgText.text = TEXT_COMPLETE;

    var iScoreDifference = iShot - PAR[ iLv ];
    var szScoreType = this._scoreType ( iScoreDifference, iShot );
    _oParTextBack.text = szScoreType;
    _oParText.text = szScoreType;

    _oScoreTextBack.text = TEXT_SCORE + ": ";
    _oScoreText.text = TEXT_SCORE + ": ";

    var iScore = this._calculateScore ( iScoreDifference );

    _oGroup.visible = true;

    var oParent = this;
    createjs.Tween.get ( _oGroup ).to ( {
      alpha: 1
    }, 500 ).call ( function () {
      var oSpriteButRestart = s_oSpriteLibrary.getSprite ( "but_continue_big" );
      _oButNext = new CGfxButton ( CANVAS_WIDTH * 0.5 + 100, CANVAS_HEIGHT * 0.5 + 180, oSpriteButRestart, _oGroup );
      _oButNext.addEventListener ( ON_MOUSE_DOWN, oParent._onNext, this );

      var oSpriteButHome = s_oSpriteLibrary.getSprite ( "but_restart_big" );
      _oButRestart = new CGfxButton ( CANVAS_WIDTH * 0.5 - 100, CANVAS_HEIGHT * 0.5 + 180, oSpriteButHome, _oGroup );
      _oButRestart.addEventListener ( ON_MOUSE_DOWN, oParent._onRestart, this );

    } );

    createjs.Tween.get ( _oFade ).to ( {
      alpha: 0.7
    }, 500 );

    var oSprite = s_oSpriteLibrary.getSprite ( "star" );
    _oAchievementStars = new CAchievementStars ( oSprite, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 210, _oGroup, "star" );

    _oRollingText = new CRollingTextController ( _oScoreTextNum, _oScoreTextNumBack, iScore, 8000, EASE_CUBIC_OUT );
    _oRollingText.addEventListener ( ON_CONTROLLER_END, _oParent._onFinishRolling );
    _oRollingText.addEventListener ( ON_CONTROLLER_REMOVE, _oParent._onFinishRolling );
    _oRollingText.addRollingListener ( _oParent._onRollingText, _oParent, [ 0, PAR_POINTS - ADDED_POINTS, PAR_POINTS ] );

    this._sendScore ( iLv, iScore );

  };

  this._scoreType = function ( iScoreDifference, iShot ) {

    var szTypeText;
    switch (iScoreDifference) {

      case - 5: {
        szTypeText = TEXT_PHOENIX;
        break;
      }
      case - 4: {
        szTypeText = TEXT_CONDOR;
        break;
      }
      case - 3: {
        szTypeText = TEXT_ALBATROSS;
        break;
      }
      case - 2: {
        szTypeText = TEXT_EAGLE;
        break;
      }
      case - 1: {
        szTypeText = TEXT_BIRDIE;
        break;
      }
      case 0: {
        szTypeText = TEXT_PAR;
        break;
      }
      case 1: {
        szTypeText = TEXT_BOGEY;
        break;
      }
      case 2: {
        szTypeText = TEXT_DOUBLE_BOGEY;
        break;
      }
      default: {
        szTypeText = TEXT_BOGEY + " " + iScoreDifference;
        break;
      }
    }

    if (iShot === 1) {
      szTypeText = TEXT_HOLEINONE;
    }

    return szTypeText;
  };

  this._findMinimumScore = function () {
    var iMin = PAR_POINTS;
    var iIter = 0;
    while (iMin > 0) {
      iIter ++;
      iMin -= ADDED_POINTS;
    }
    iMin += ADDED_POINTS;

    return {
      score: iMin,
      iter: iIter
    };
  };

  this._calculateScore = function ( iScoreDifference ) {
    var iScore = PAR_POINTS - iScoreDifference * ADDED_POINTS;

    if (iScore <= 0) {
      var iMinScore = this._findMinimumScore ();

      var divisor = iScoreDifference - iMinScore.iter + 1;

      iScore = Math.floor ( iMinScore.score / divisor );
    }
    return iScore;
  };

  this._sendScore = function ( iLevel, iScore ) {
    var aScore = s_oLocalStorage.getLevelScore ( iLevel );

    if (aScore < iScore) {
      s_oLocalStorage.saveLevelScore ( iLevel, iScore );
    }

    _iTotalScore = s_oLocalStorage.getTotalScore ();
  };

  this._onNext = function () {

    createjs.Tween.get ( _oFade ).to ( {
      alpha: 1
    }, 300 );

    createjs.Tween.get ( _oGroup ).to ( {
      alpha: 0
    }, 300 ).wait ( 100 ).call ( function () {
      s_oStage.removeChild ( _oGroup );

      _oFade.off ( "mousedown", function () {
      } );
      s_oStage.removeChild ( _oFade );

      _oButRestart.unload ();
      _oButRestart = null;

      _oButNext.unload ();
      _oButNext = null;

      s_oGame._GamesLab_nextLevel ();
    } );
  };

  this._onRestart = function () {

    createjs.Tween.get ( _oFade ).to ( {
      alpha: 1
    }, 300 );

    createjs.Tween.get ( _oGroup ).to ( {
      alpha: 0
    }, 300 ).wait ( 100 ).call ( function () {
      s_oStage.removeChild ( _oGroup );

      _oFade.off ( "mousedown", function () {
      } );
      s_oStage.removeChild ( _oFade );

      _oButRestart.unload ();
      _oButRestart = null;

      _oButNext.unload ();
      _oButNext = null;

      s_oGame.restartLevel ();

    } );

  };

  this._onFinishRolling = function () {

  };

  this._onRollingRemoved = function () {

  };

  this._onRollingText = function ( iStep ) {

    _oAchievementStars._GamesLab_playManualMode ( iStep, STAR_EFFECT_SCALE );

  };

  _oParent = this;
  this._GamesLab_init ( oSpriteBg );

  return this;
}
