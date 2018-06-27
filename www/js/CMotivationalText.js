var FLASH_COLORS = [
  "#00CA1B",
  "#EBD100",
  "#FF0013",
  "#00A1E0",
  "#8F1D21",
  "#48929B",
  "#006442",
  "#f1c40f",
  "#8e44ad",
  "#2c2c54"
];

var MOTIVATIONAL_TEXT_PULSE_TIME = 200;
var MOTIVATIONAL_TEXT_SPEED = 1300;



function CMotivationalText () {
  var _oTextContainer;
  var _shown=false;
  var ANIMATIONS = [
    createjs.Ease.cubicOut,
    createjs.Ease.cubicIn,
    createjs.Ease.cubicInOut,
    createjs.Ease.backIn,
    createjs.Ease.backInOut,
    createjs.Ease.backInOut,
    createjs.Ease.circIn,
    createjs.Ease.circOut,
    createjs.Ease.circInOut,
    createjs.Ease.bounceIn,
    createjs.Ease.bounceInOut,
    createjs.Ease.bounceOut,
    createjs.Ease.elasticIn,
    createjs.Ease.elasticOut,
    createjs.Ease.elasticInOut
  ];
  this.showing=function (  ) {
    return _shown;
  }
  this._GamesLab_init = function () {
    _oTextContainer = new createjs.Container ();
    s_oStage.addChild ( _oTextContainer );
  };

  this._GamesLab_initMovementTween = function ( start, center, finish ) {
    var oParent = this;
    _oTextContainer.x = start.x;
    _oTextContainer.y = start.y;

    var randStart = Math.floor ( Math.random () * ANIMATIONS.length );
    var startAnimation = ANIMATIONS[ randStart ];

    createjs.Tween.get ( _oTextContainer ).to ( center, MOTIVATIONAL_TEXT_SPEED * 0.5, startAnimation )
      .call ( function () {
        oParent._GamesLab_initPulseTween ( finish );
      } );
  };

  this._GamesLab_initPulseTween = function ( finish ) {
    var oParent = this;
    var iScaleVar = 1.2;

    createjs.Tween.get ( _oTextContainer )
      .to ( {
        scaleX: iScaleVar,
        scaleY: iScaleVar
      }, MOTIVATIONAL_TEXT_PULSE_TIME, createjs.Ease.cubicIn )
      .to ( {
        scaleX: 1,
        scaleY: 1
      }, MOTIVATIONAL_TEXT_PULSE_TIME, createjs.Ease.cubicIn )
      .to ( {
        scaleX: iScaleVar,
        scaleY: iScaleVar
      }, MOTIVATIONAL_TEXT_PULSE_TIME, createjs.Ease.cubicIn )
      .to ( {
        scaleX: 1,
        scaleY: 1
      }, MOTIVATIONAL_TEXT_PULSE_TIME, createjs.Ease.cubicIn )
      .call ( function () {
        oParent._GamesLab_initExitTween ( finish );
      } );
  };

  this._GamesLab_initExitTween = function ( finish ) {
    var oParent = this;
    var randFinish = Math.floor ( Math.random () * ANIMATIONS.length );
    var finishAnimation = ANIMATIONS[ randFinish ];

    createjs.Tween.get ( _oTextContainer )
      .to ( finish, MOTIVATIONAL_TEXT_SPEED, finishAnimation )
      .call ( function () {
        oParent.unload ();
      } );
  };

  this.unload = function () {
    _shown=false;
    createjs.Tween.removeTweens ( _oTextContainer );
    _oTextContainer.removeAllChildren ();
  };

  this._GamesLab_getFlashAnimation = function () {
    var left = { x: - 100, y: CANVAS_HEIGHT * 0.5, move: 'x' };
    var right = { x: CANVAS_WIDTH + 100, y: CANVAS_HEIGHT * 0.5, move: 'x' };
    var top = { x: CANVAS_WIDTH * 0.5, y: - 100, move: 'y' };
    var bottom = { x: CANVAS_WIDTH * 0.5, y: CANVAS_HEIGHT + 100, move: 'y' };

    var iRand = Math.floor ( Math.random () * 7 );
    var animation = {}

    if (iRand === 0)
      animation.start = top;
    else if (iRand === 1)
      animation.start = right;
    else if (iRand === 2)
      animation.start = bottom;
    else
      animation.start = left;

    iRand = Math.floor ( Math.random () * 7 );

    if (iRand === 0)
      animation.end = top;
    else if (iRand === 1)
      animation.end = right;
    else if (iRand === 2)
      animation.end = bottom;
    else
      animation.end = left;

    return animation;
  }

  this._GamesLab_showFlashMessage = function ( text, size, waitTime ) {
    _shown=true

    var animation = this._GamesLab_getFlashAnimation ();
    var oCurLevelCont;
    var iRand = Math.floor ( Math.random () * 7 );
    var oCurLevel = new createjs.Text ( text, "normal " + (size || 70) + "px " + PRIMARY_FONT, FLASH_COLORS[ iRand ] );
    oCurLevel.textAlign = "center";
    oCurLevel.textBaseline = "alphabetic";
    oCurLevel.x = 0;
    oCurLevel.y = 0;

    oCurLevelCont = new createjs.Text ( text, "normal " + (size || 70) + "px " + PRIMARY_FONT, "#000000" );
    oCurLevelCont.textAlign = "center";
    oCurLevelCont.textBaseline = "alphabetic";
    oCurLevelCont.x = 0;
    oCurLevelCont.y = 0;
    oCurLevelCont.outline = 5;

    _oTextContainer.addChild ( oCurLevelCont, oCurLevel );

    waitTime = waitTime || 500;
    var start = { x: animation.start.x, y: animation.start.y };
    var center = {};
    var finish = {};

    center[ animation.start.move ] = animation.start.move === 'x' ? CANVAS_WIDTH * 0.5 : CANVAS_HEIGHT * 0.5;
    finish[ animation.end.move ] = animation.end.move === 'x' ? animation.end.x : animation.end.y;

    this._GamesLab_initMovementTween ( start, center, finish );
  };


  this._GamesLab_init ();
};
