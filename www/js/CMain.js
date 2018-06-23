function CMain ( oData ) {
  var _bUpdate;
  var _iCurResource = 0;
  var RESOURCE_TO_LOAD = 0;
  var _iState = STATE_LOADING;
  var _oData;

  var _aLevelLoaded;

  var _oPreloader;
  var _oMenu;
  var _oHelp;
  var _oLevelMenu;
  var _oGame;
  var _oLoadingScreen;

  this.initContainer = function () {
    var canvas = document.getElementById ( "canvas" );
    s_oStage = new createjs.Stage ( canvas );
    createjs.Touch.enable ( s_oStage );
    s_oStage.preventSelection = false;

    s_bMobile = true;
    if (s_bMobile === false) {
      s_oStage.enableMouseOver ( 20 );
    }

    s_iPrevTime = new Date ().getTime ();

    createjs.Ticker.addEventListener ( "tick", this._update );
    createjs.Ticker.setFPS ( FPS );

    if (navigator.userAgent.match ( /Windows Phone/i )) {
      DISABLE_SOUND_MOBILE = true;
    }

    _aLevelLoaded = new Array ();

    s_oSpriteLibrary = new CSpriteLibrary ();

    s_oTweenController = new CTweenController ();

    //ADD PRELOADER
    _oPreloader = new CPreloader ();

    s_oLocalStorage = new CLocalStorage ();
    s_bAudioActive = s_oLocalStorage.getItem ( 'mute' ) != 'true';

    _bUpdate = true;
  };

  this._GamesLab_soundLoaded = function () {
    _iCurResource ++;
    var iPerc = Math.floor ( _iCurResource / RESOURCE_TO_LOAD * 100 );
    _oPreloader.refreshLoader ( iPerc );

    if(_iCurResource >= RESOURCE_TO_LOAD){
      s_oMain._GamesLab_onRemovePreloader();
    }
  };

  this._initSounds = function () {
    var aSoundsInfo = new Array ();

    aSoundsInfo.push ( {
      filename: 'soundtrack',
      loop: true,
      volume: 0.5,
      ingamename: 'soundtrack'
    } );

    aSoundsInfo.push ( {
      filename: 'ambience',
      loop: false,
      volume: 1,
      ingamename: 'ambience'
    } );

    aSoundsInfo.push ( {
      filename: 'win_level',
      loop: false,
      volume: 1,
      ingamename: 'win_level'
    } );

    aSoundsInfo.push ( {
      filename: 'click',
      loop: false,
      volume: 1,
      ingamename: 'click'
    } );

    aSoundsInfo.push ( {
      filename: 'star',
      loop: false,
      volume: 1,
      ingamename: 'star'
    } );

    aSoundsInfo.push ( {
      filename: 'water',
      loop: false,
      volume: 1,
      ingamename: 'water'
    } );

    aSoundsInfo.push ( {
      filename: 'sand',
      loop: false,
      volume: 1,
      ingamename: 'sand'
    } );

    aSoundsInfo.push ( {
      filename: 'hole',
      loop: false,
      volume: 1,
      ingamename: 'hole'
    } );
    aSoundsInfo.push ( {
      filename: 'hit_ball',
      loop: false,
      volume: 1,
      ingamename: 'hit_ball'
    } );

    RESOURCE_TO_LOAD += aSoundsInfo.length;

    s_aSounds = new Array ();
    for (var i = 0; i < aSoundsInfo.length; i ++) {
      s_aSounds[ aSoundsInfo[ i ].ingamename ] = new Howl ( {
        src: [ './sounds/' + aSoundsInfo[ i ].filename + '.mp3', './sounds/' + aSoundsInfo[ i ].filename + '.ogg' ],
        autoplay: false,
        preload: true,
        loop: aSoundsInfo[ i ].loop,
        volume: aSoundsInfo[ i ].volume,
        onload: s_oMain._GamesLab_soundLoaded
      } );
    }
  };

  this._loadImages = function () {
    s_oSpriteLibrary.init ( this._onImagesLoaded, this._onAllImagesLoaded, this );

    s_oSpriteLibrary.addSprite ( "preloader_anim", "./sprites/preloader_anim.png" );
    s_oSpriteLibrary.addSprite ( "but_play", "./sprites/but_play.png" );
    s_oSpriteLibrary.addSprite ( "but_continue", "./sprites/but_continue.png" );
    s_oSpriteLibrary.addSprite ( "but_continue_big", "./sprites/but_continue_big.png" );
    s_oSpriteLibrary.addSprite ( "but_info", "./sprites/but_info.png" );
    s_oSpriteLibrary.addSprite ( "ctl_logo", "./sprites/ctl_logo.png" );
    s_oSpriteLibrary.addSprite ( "but_yes", "./sprites/but_yes.png" );
    s_oSpriteLibrary.addSprite ( "but_not", "./sprites/but_not.png" );
    s_oSpriteLibrary.addSprite ( "but_exit", "./sprites/but_exit.png" );
    s_oSpriteLibrary.addSprite ( "but_restart_small", "./sprites/but_restart_small.png" );
    s_oSpriteLibrary.addSprite ( "but_restart_big", "./sprites/but_restart_big.png" );
    s_oSpriteLibrary.addSprite ( "help_touch", "./sprites/help_touch.png" );
    s_oSpriteLibrary.addSprite ( "star", "./sprites/star.png" );
    s_oSpriteLibrary.addSprite ( "bg_menu", "./sprites/bg_menu.jpg" );
    s_oSpriteLibrary.addSprite ( "msg_box", "./sprites/msg_box.png" );
    s_oSpriteLibrary.addSprite ( "audio_icon", "./sprites/audio_icon.png" );
    s_oSpriteLibrary.addSprite ( "but_home", "./sprites/but_home.png" );
    s_oSpriteLibrary.addSprite ( "ball", "./sprites/ball.png" );
    s_oSpriteLibrary.addSprite ( "but_level", "./sprites/but_level.png" );
    s_oSpriteLibrary.addSprite ( "flag", "./sprites/flag.png" );
    s_oSpriteLibrary.addSprite ( "ball_shadow", "./sprites/ball_shadow.png" );
    s_oSpriteLibrary.addSprite ( "caustics", "./sprites/caustics.png" );
    s_oSpriteLibrary.addSprite ( "but_center_view", "./sprites/but_center_view.png" );
    s_oSpriteLibrary.addSprite ( "ball_water", "./sprites/ball_water.png" );
    s_oSpriteLibrary.addSprite ( "press_indicator", "./sprites/press_indicator.png" );
    s_oSpriteLibrary.addSprite ( "menu_text_minigolf", "./sprites/menu_text_minigolf.png" );
    s_oSpriteLibrary.addSprite ( "menu_text_world", "./sprites/menu_text_world.png" );


    s_oSpriteLibrary.addSprite ( "arrow", "./sprites/arrow.png" );
    s_oSpriteLibrary.addSprite ( "arrow_fill", "./sprites/arrow_fill.png" );
    s_oSpriteLibrary.addSprite ( "arrow_frame", "./sprites/arrow_frame.png" );


    RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites ();
    s_oSpriteLibrary.loadSprites ();
  };

  this._onImagesLoaded = function () {
    _iCurResource ++;
    var iPerc = Math.floor ( _iCurResource / RESOURCE_TO_LOAD * 100 );
    _oPreloader.refreshLoader ( iPerc );

    if(_iCurResource >= RESOURCE_TO_LOAD){
      s_oMain._GamesLab_onRemovePreloader();
    }
  };


  this._GamesLab_onRemovePreloader = function () {
    _oPreloader.unload ();

    if (! s_bAudioActive) {
      Howler.mute ( true );
    }
    playSound ( 'soundtrack', 1, true );

    this._GamesLab_gotoMenu ();
  };
  
  this._onAllImagesLoaded = function () {

  };

  this.onAllPreloaderImagesLoaded = function () {
    this._loadImages ();
  };


  this.loadSelectedLevel = function ( iLevel ) {

    s_iCurLevel = iLevel;
    _iCurResource = 0;
    RESOURCE_TO_LOAD = 0;

    if (_aLevelLoaded[ iLevel ]) {
      this.gotoGame ( s_iCurLevel );
      return;
    }

    _oLoadingScreen = new CLoadingScreen ( s_oStage );

    s_oSpriteLibrary.init ( this._onLevelLoaded, this._onAllImagesLoaded, this );

    var szSpriteLevel = iLevel + 1;
    var szTag;
    for (var i = 1; i <= 18; i ++) {
      szTag = i - 1;
      if (i < 10) {
        var szPadding = "0" + i + "";
        s_oSpriteLibrary.addSprite ( "level_" + szSpriteLevel + "_bg_" + szTag, "./sprites/bg_levels/level_" + szSpriteLevel + "/bg_piece_" + szPadding + ".jpg" );
      } else {
        s_oSpriteLibrary.addSprite ( "level_" + szSpriteLevel + "_bg_" + szTag, "./sprites/bg_levels/level_" + szSpriteLevel + "/bg_piece_" + i + ".jpg" );
      }
    }

    RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites ();

    s_oSpriteLibrary.loadSprites ();

  };

  this._onLevelLoaded = function () {
    _iCurResource ++;
    if (_iCurResource === RESOURCE_TO_LOAD) {
      _aLevelLoaded[ s_iCurLevel ] = true;
      _oLoadingScreen.unload ();
      this.gotoGame ( s_iCurLevel );

      var iNextLevelToLoad = s_iCurLevel + 1;
      this.loadInBackgroundLevel ( iNextLevelToLoad );
    }
  };

  this.loadInBackgroundLevel = function ( iLevel ) {
    s_iBackgroundLevel = iLevel;
    _iCurResource = 0;
    RESOURCE_TO_LOAD = 0;

    if (_aLevelLoaded[ iLevel ]) {
      return;
    }

    s_oSpriteLibrary.init ( this._onBackgroundLevelLoaded, this._onAllImagesLoaded, this );

    var szSpriteLevel = iLevel + 1;
    var szTag;
    for (var i = 1; i <= 18; i ++) {
      szTag = i - 1;
      if (i < 10) {
        var szPadding = "0" + i + "";
        s_oSpriteLibrary.addSprite ( "level_" + szSpriteLevel + "_bg_" + szTag, "./sprites/bg_levels/level_" + szSpriteLevel + "/bg_piece_" + szPadding + ".jpg" );
      } else {
        s_oSpriteLibrary.addSprite ( "level_" + szSpriteLevel + "_bg_" + szTag, "./sprites/bg_levels/level_" + szSpriteLevel + "/bg_piece_" + i + ".jpg" );
      }
    }

    RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites ();

    s_oSpriteLibrary.loadSprites ();
  };

  this._onBackgroundLevelLoaded = function () {
    _iCurResource ++;
    if (_iCurResource === RESOURCE_TO_LOAD) {
      _aLevelLoaded[ s_iBackgroundLevel ] = true;

      var bAllLevelsLoaded = true;
      for (var i = 0; i < NUM_HOLES; i ++) {
        if (! _aLevelLoaded[ i ]) {
          bAllLevelsLoaded = false;
        }
      }

      if (bAllLevelsLoaded) {
        return;
      }

      var iNextLevelToLoad = s_iBackgroundLevel + 1;
      if (iNextLevelToLoad < NUM_HOLES) {
        this.loadInBackgroundLevel ( iNextLevelToLoad );
      } else {
        this.loadInBackgroundLevel ( 1 );
      }
    }
  };

  this.preloaderReady = function () {
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      this._initSounds ();
      s_oSoundTrack = createjs.Sound.play ( "soundtrack", {
        loop: - 1
      } );
    }

    this._loadImages ();
    _bUpdate = true;
  };

  this._GamesLab_gotoMenu = function () {
    _oMenu = new CMenu ();
    _iState = STATE_MENU;
  };

  this.gotoGame = function ( iLevel ) {
    _oGame = new CGame ( _oData, iLevel );

    _iState = STATE_GAME;
  };

  this.gotoLevelMenu = function () {
    _oLevelMenu = new CLevelMenu ();
    _iState = STATE_MENU;
  };

  this.gotoHelp = function () {
    _oHelp = new CHelp ();
    _iState = STATE_HELP;
  };

  this._GamesLab_stopUpdate = function () {
    _bUpdate = false;
    createjs.Ticker.paused = true;
    Howler.mute ( true );

  };

  this._GamesLab_startUpdate = function () {
    s_iPrevTime = new Date ().getTime ();
    _bUpdate = true;
    createjs.Ticker.paused = false;
    if (s_bAudioActive) {
      Howler.mute ( false );
    }
  };

  this._update = function ( event ) {
    if (_bUpdate === false) {
      return;
    }
    var iCurTime = new Date ().getTime ();
    s_iTimeElaps = iCurTime - s_iPrevTime;
    s_iCntTime += s_iTimeElaps;
    s_iCntFps ++;
    s_iPrevTime = iCurTime;

    if (s_iCntTime >= 1000) {
      s_iCurFps = s_iCntFps;
      s_iCntTime -= 1000;
      s_iCntFps = 0;
    }

    if (_iState === STATE_GAME) {
      _oGame.update ();
    }

    s_oStage.update ( event );

  };

  s_oMain = this;

  PAR_POINTS = oData.par_points;
  ADDED_POINTS = oData.added_points;

  _oData = oData;

  this.initContainer ();
}

var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_oPhysicsController;
var s_iCanvasResizeHeight;
var s_iCanvasResizeWidth;
var s_iCanvasOffsetHeight;
var s_iCanvasOffsetWidth;
var s_iCurLevel;
var s_iBackgroundLevel;

var s_aSounds;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack;
var s_oTweenController;
var s_oLocalStorage;
