function CGame ( oData, iLevel ) {
  var _bStartGame;
  var _iScore;
  var _oInterface;
  var _oBg;
  var _oFg;
  var _iLevel;
  var _oEndPanel = null;
  var _oSideLeft;
  var _oSideRight;
  var _oBallSprite;
  var _oClickPoint;
  var _bDrag = false;
  var _bBallInHole;
  var _bClickBall = false;
  var _iShotCount;
  var _oLevelCompletePanel;
  var _oBallVelocity;
  var _bBall3DIsMoving;
  var _fTimeLaunch;
  var _oArrowDir;
  var _oReleasePoint;
  var _bBallInWater;
  var _bGoDownWater = false;
  var _oContainer;
  var _fTime;
  var _oSummaryPanel;
  var _oDistanceOffset;
  var _fTimeNormal;
  var _oScene;
  var _oBall2dPos;
  var _bBallInSand = false;
  var _oParent;

  var STATE_INIT = 0;
  var STATE_PLAY = 1;

  var _iGameState;
  var _oOrthographicCamera = null;

  var _bScenarioLoaded;
  var _bBallOnTerrain;
  var _bBallOutFromScreen;
  var _bBallSleep;

  var _iLastTerrainBallHeight;
  var _iStartDepth;
  var _iBallInWaterTimeout;
  var _iBallInHoleTimeout;
  var _pLastLaunchBallPos;

  var _oBallShadow;

  var _pBGPanPoint;

  var _oElementContainer;
  var _oInterfaceContainer;
  var _oHelpContainer;
  var _oFadeContainer;
  var _oFade;
  var _oBorderLimit;

  var _oHelpCursor;
  var _fLerp;

  this._GamesLab_init = function ( iLevel ) {
    _bBallInHole = false;
    _bBallOnTerrain = true;
    _bBallOutFromScreen = false;
    _bBallSleep = true;

    _bScenarioLoaded = false;
    _bStartGame = false;
    _iScore = 0;
    _iStartDepth = 0;
    _iLastTerrainBallHeight = 0;
    _iBallInWaterTimeout = 0;
    _iBallInHoleTimeout = 0;
    _iLevel = iLevel;

    _fLerp = 1;

    _pBGPanPoint = {
      x: 0,
      y: 0
    };

    // init cannon.js
    _oBall2dPos = {
      x: 0,
      y: 0,
      z: 0
    };

    _oScene = new CScenario ( _iLevel + 1 );

    cordova.fireDocumentEvent ( "start_level", { lvl: _iLevel } );

    camera = createOrthoGraphicCamera ();
    _oOrthographicCamera = camera;

    resizeCanvas3D ();

    if (_iLevel === 0) {
      fadeSound ( 'soundtrack', 1, 0.4, 2000 );
    } else {
      fadeSound ( 'soundtrack', 1, 0, 2000 );
    }
    playSound ( "ambience", 1, - 1 );

    _oReleasePoint = {
      x: 0,
      y: 0
    };

    _bBallInWater = false;

    _fTimeLaunch = 0;
    _fTime = 0;
    _fTimeNormal = 0;

    _iShotCount = 0;

    _oDistanceOffset = {
      x: 0,
      y: 0
    };

    _oElementContainer = new createjs.Container ();
    s_oStage.addChild ( _oElementContainer );

    _oInterfaceContainer = new createjs.Container ();
    s_oStage.addChild ( _oInterfaceContainer );

    _oHelpContainer = new createjs.Container ();
    s_oStage.addChild ( _oHelpContainer );

    _oFadeContainer = new createjs.Container ();
    s_oStage.addChild ( _oFadeContainer );

    _oBg = new CBackground ( _iLevel, _oElementContainer );

    _oFade = new createjs.Shape ();
    _oFade.graphics.beginFill ( "black" ).drawRect ( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

    _oFadeContainer.addChild ( _oFade );
    flashMessage = new CMotivationalText ();
  };

  this.getCamera = function () {
    return _oOrthographicCamera;
  };

  this.get3DBall = function () {
    return _oScene.ballBody ();
  };

  this.scenarioLoaded = function () {
    _bScenarioLoaded = true;
    _iGameState = STATE_INIT;
    _bStartGame = true;
  };

  this.setBallSleep = function ( bVal ) {
    _bBallSleep = bVal;

    if (bVal) {
      _oScene.ballBody ().sleep ();
    } else {
      _oScene.ballBody ().wakeUp ();
    }
  };

  this._GamesLab_init2DBall = function () {

    var oSprite = s_oSpriteLibrary.getSprite ( "ball_shadow" );
    _oBallShadow = createBitmap ( oSprite );
    _oBallShadow.regX = 12;
    _oBallShadow.regY = - 5;
    _oBallShadow.x = _oBall2dPos.x;
    _oBallShadow.y = _oBall2dPos.y;
    _oElementContainer.addChild ( _oBallShadow );

    var oSpriteBall = s_oSpriteLibrary.getSprite ( "ball" );
    _oBallSprite = new CBall ( _oBall2dPos.x, _oBall2dPos.y, oSpriteBall, _oElementContainer );
    _oBall2dPos = convert3dPosTo2dScreen ( _oScene.ballBody ().position, _oOrthographicCamera );

    this.setBallSleep ( true );


    ////////////////////////3D CONTROLS, UNCOMMENTS TO DEBUG/////////////////////////////
    /*
     window.addEventListener("mousemove", this.onDragPoint, false);
     window.addEventListener("mousedown", this.onClickPoint, false);
     window.addEventListener("mouseup", this.onCalculateForce, false);
     */

    /*
    var oParent = this;
    $('html').on("mousedown touchstart", function (e) {
        oParent.onClickPoint({clientX: e.clientX, clientY: e.clientY, evt:e});
        // oParent.onClickPoint( { clientX: e.pageX, clientY: e.pageY } );

        // $("#debug").text("mousedown");

        // e.preventDefault();
    });
    $('html').on("mouseup touchend", function (e) {
        oParent.onCalculateForce({clientX: e.pageX, clientY: e.pageY});
        // e.preventDefault();

        //$("#debug").text("mouseup");
    });
    $('html').on("mousemove touchmove", function (e) {
        oParent.onDragPoint({clientX: e.pageX, clientY: e.pageY});
        e.preventDefault();

        //$("#debug").text("touchmove");
    });

    //$('body').append("<p id='debug' style='color: #f00; position: fixed; bottom: 5px; font-weight: bold; left: 5px;'>testola</p>");
    */
    /////////////////////////////////////////////////////////////////////////
  };

  this._GamesLab_initFlags = function () {
    _oFg = new createjs.Container ();
    _oElementContainer.addChild ( _oFg );

    var oSprite = s_oSpriteLibrary.getSprite ( "flag" );
    for (var i = 0; i < FLAGS_POS[ _iLevel ].length; i ++) {
      var oFlag = createBitmap ( oSprite );
      oFlag.regY = oSprite.height;
      oFlag.x = FLAGS_POS[ _iLevel ][ i ].x;
      oFlag.y = FLAGS_POS[ _iLevel ][ i ].y;
      _oFg.addChild ( oFlag );
    }

  };

  this.getLevel = function () {
    return _iLevel;
  };

  this.resetDragForce = function () {
    if (_bDrag === true)
      _oReleasePoint = {
        x: _oClickPoint.x,
        y: _oClickPoint.y
      };
    _oInterface.refreshPowerBar ( 0 );
    _bDrag = false;
  };

  this.onCalculateForce = function () {
    if (! SHOW_3D_RENDER) {
      return;
    }
    _oInterface.refreshPowerBar ( 0 );

    _oDistanceOffset.x = 0;
    _oDistanceOffset.y = 0;

    if (_bDrag === false || _bBall3DIsMoving === true || _oReleasePoint.x === _oBall2dPos.x && _oReleasePoint.y === _oBall2dPos.y) {
      s_oGame.resetDragForce ();
      return;
    }

    var vHitDir = new CVector2 ( _oBall2dPos.x - _oReleasePoint.x,
      _oBall2dPos.y - _oReleasePoint.y );

    _bDrag = false;

    vHitDir.scalarProduct ( FORCE_MULTIPLIER );
    var fForceLength = vHitDir.length ();


    if (fForceLength > HIT_BALL_MIN_FORCE) {

      if (fForceLength > HIT_BALL_MAX_FORCE) {
        vHitDir.normalize ();
        vHitDir.scalarProduct ( HIT_BALL_MAX_FORCE );
      }

      vHitDir.set ( vHitDir.getX (), - vHitDir.getY () );
      vHitDir.rotate ( Math.radians ( 45 ) );


      s_oGame.launchBall ( {
        x: vHitDir.getX (),
        y: vHitDir.getY ()
      } );

      _iShotCount ++;
      _oInterface.refreshLaunch ( _iShotCount );

    }

    _oReleasePoint.x = 0;
    _oReleasePoint.y = 0;

    s_oGame.clickBall ( false );

  };

  this.onDragPoint = function ( e ) {
    if (_bBall3DIsMoving || ! _bClickBall || ! _oClickPoint) {
      return;
    }

    var oPoint = {
      x: _oBall2dPos.x,
      y: _oBall2dPos.y
    };

    _oReleasePoint = {
      x: (e.clientX),
      y: (e.clientY)
    };


    var distanceX;
    var distanceY;


    distanceX = (oPoint.x - _oReleasePoint.x) / RATIO_ARROW_DISTANCE;
    distanceY = (oPoint.y - _oReleasePoint.y) / RATIO_ARROW_DISTANCE;

    if (distanceX > ARROW_DISTANCE) {
      distanceX = ARROW_DISTANCE;
    } else if (distanceX < - ARROW_DISTANCE) {
      distanceX = - ARROW_DISTANCE;
    }

    if (distanceY > ARROW_DISTANCE) {
      distanceY = ARROW_DISTANCE;
    } else if (distanceY < - ARROW_DISTANCE) {
      distanceY = - ARROW_DISTANCE;
    }

    _oDistanceOffset.x = distanceX;
    _oDistanceOffset.y = distanceY;

    var iX = _oArrowDir.x * distanceX;
    var iY = _oArrowDir.y * distanceY;

    if (distanceY < 0) {
      iY = - iY;
    }

    if (distanceX < 0) {
      iX = - iX;
    }

    _bDrag = true;
  };

  this.onClickPoint = function ( e ) {

    var fDist = distance ( e.clientX, e.clientY,
      _oBall2dPos.x, _oBall2dPos.y );

    if (fDist < 50) {

      _oClickPoint = {
        x: _oBallSprite.getX (),
        y: _oBallSprite.getY ()
      };
      s_oGame.clickBall ( true );
    }
  };

  this.unload = function () {
    _bStartGame = false;

    if (_oSideRight) {
      _oSideRight.unload ();
      _oSideRight = null;
    }

    if (_oSideLeft) {
      _oSideLeft.unload ();
      _oSideLeft = null;
    }
    s_oStage.removeAllChildren ();
     flashMessage=null;

      _oInterface.unload ();

    _oBallSprite.unload ();

    if (_oEndPanel !== null) {
      _oEndPanel.unload ();
    }

    //$('html').off();

  };

  this._GamesLab_nextLevel = function () {
    _iLevel ++;
    var oSpriteMsgBox = s_oSpriteLibrary.getSprite ( "msg_box" );
    if (_iLevel >= NUM_HOLES) {
      _oEndPanel = new CEndPanel ( oSpriteMsgBox, _iShotCount );
      _oEndPanel.show ( _iShotCount, Math.floor ( _fTime ), _iLevel );
      return;
    }

    this.unload ();
    s_oMain.loadSelectedLevel ( _iLevel );

  };

  this.angleArrow = function () {
    if (SHOW_3D_RENDER) {
      var oDif = {
        x: _oBall2dPos.x - _oReleasePoint.x,
        y: _oBall2dPos.y - _oReleasePoint.y
      };
    } else {
      var oDif = {
        x: _oBallSprite.getX () - s_oStage.mouseX,
        y: _oBallSprite.getY () - s_oStage.mouseY
      };
    }
    var iAngle = Math.atan2 ( oDif.y, oDif.x );

    _oArrowDir = {
      x: Math.cos ( iAngle ),
      y: Math.sin ( iAngle )
    };

    var iAngleSprite = Math.atan2 ( oDif.y + _oDistanceOffset.y, oDif.x + _oDistanceOffset.x );
    iAngle = iAngleSprite * (180 / Math.PI) + OFFSET_ANGLE_ARROW;

  };

  this.clickBall = function ( bVal ) {
    _bClickBall = bVal;
  };

  this.launchBall = function ( oDir ) {

    if (_iLevel === 0 && _iShotCount === 0 && !s_oLocalStorage.helpShow(2)) {
      _oBallSprite.setMoving ( true );
      var oHelpPanel = new CHelpPanel ( _oHelpContainer );
      oHelpPanel.stage2Help ( oDir );
      s_oLocalStorage.setHelpShown(2);

      return;
    }

    this.setBallSleep ( false );

    _bBall3DIsMoving = true;

    var oBall = _oScene.ballBody ();

    _pLastLaunchBallPos = {
      x: oBall.position.x,
      y: oBall.position.y,
      z: oBall.position.z
    };

    _oScene.addImpulse ( oBall, oDir );

    _iShotCount ++;
    _oInterface.refreshLaunch ( _iShotCount );

  };

  this.onExit = function () {
    _oParent.unload ();

    _oParent.unloadLevel ();

    setVolume ( 'soundtrack', 1 );
    s_oMain._GamesLab_gotoMenu ();
  };

  this._onExitHelp = function () {
    _oBallSprite.setVisible ( true );
    _oBallSprite.setMoving ( false );
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      new createjs.Tween.get ( s_oSoundTrack ).to ( {
        volume: 0
      }, 1000 );
    }
  };

  this._onExitHelp2 = function ( oDir ) {
    this.setBallSleep ( false );

    _bBall3DIsMoving = true;

    var oBall = _oScene.ballBody ();

    _pLastLaunchBallPos = {
      x: oBall.position.x,
      y: oBall.position.y,
      z: oBall.position.z
    };

    _oScene.addImpulse ( oBall, oDir );

    _iShotCount ++;
    _oInterface.refreshLaunch ( _iShotCount );
  };

  this.moveBall = function () {
    var oInfo = _oBall2dPos;
    _oBallSprite.setPosition ( oInfo.x, oInfo.y );
  };

  this.levelComplete = function () {
    _bStartGame = false;

    cordova.fireDocumentEvent ( "end_level", { lvl: _iLevel } );

    var oSpriteMsgBox = s_oSpriteLibrary.getSprite ( "msg_box" );
    _oLevelCompletePanel = new CLevelCompletePanel ( oSpriteMsgBox );
    _oLevelCompletePanel.show ( _iShotCount, Math.floor ( _fTime ), _iLevel );

  };

  this.unloadLevel = function () {
    _bBall3DIsMoving = false;
  };

  this.restartLevel = function () {
    cordova.fireDocumentEvent ( "show_interlevel_ad" );
    cordova.fireDocumentEvent ( "restart_level", { lvl: _iLevel } );
    this.unload ();
    this._GamesLab_init ( _iLevel );
  };

  this.detectBallVelocityForLaunch = function () {
    if (_bBall3DIsMoving === true && _bGoDownWater === false) {
      if (_oBallVelocity.x < MIN_VELOCITY_FOR_LAUNCH && _oBallVelocity.x > - MIN_VELOCITY_FOR_LAUNCH &&
        _oBallVelocity.y < MIN_VELOCITY_FOR_LAUNCH && _oBallVelocity.y > - MIN_VELOCITY_FOR_LAUNCH &&
        _oBallVelocity.z < MIN_VELOCITY_FOR_LAUNCH && _oBallVelocity.z > - MIN_VELOCITY_FOR_LAUNCH) {
        if (_fTimeLaunch < 0) {
          _bBall3DIsMoving = false;

          _oBallSprite.setMoving ( false );
          if (! _bBallInWater) {
            _oBallSprite.pressIndicatorAnim ();
          }
          _oScene.setElementVelocity ( _oScene.ballBody (), {
            x: 0,
            y: 0,
            z: 0
          } );
          _oScene.ballBody ().angularVelocity.setZero ();


          if (! _bBallInWater) {
            this.setBallSleep ( true );
          }

        } else {
          _fTimeLaunch -= 1 / createjs.Ticker.framerate;
        }
      } else {
        _fTimeLaunch = TIME_FOR_LAUNCH;
      }
    } else {
      if (_oBallVelocity.x > MIN_VELOCITY_FOR_LAUNCH || _oBallVelocity.x < - MIN_VELOCITY_FOR_LAUNCH) {
        _bBall3DIsMoving = true;
        _fTimeLaunch = TIME_FOR_LAUNCH;
      }
    }
  };

  this.getBall = function () {
    return _oBallSprite;
  };

  this.getBallVelocity = function () {
    return _oBallVelocity;
  };

  this.getBallPhysics = function () {
    return _oBallPhysics;
  };

  this.getBallInSand = function () {
    return _bBallInSand;
  };

  this.ballCollideWithTerrain = function ( bVal ) {
    _iLastTerrainBallHeight = _oScene.ballBody ().position.z;

    if (! _bBallOnTerrain && bVal) {
      _bBallOnTerrain = true;
      new createjs.Tween.get ( _oBallShadow, {
        override: true
      } ).to ( {
        alpha: 1
      }, 100 );
    }
    if (_bBallOnTerrain && ! bVal) {
      _bBallOnTerrain = false;
      if (! _bBallSleep) {
        new createjs.Tween.get ( _oBallShadow, {
          override: true
        } ).to ( {
          alpha: 0
        }, 100 );
      }
    }

  };

  this.ballCollideWithSand = function ( bVal ) {
    if (bVal && ! _bBallInSand) {
      playSound ( "sand", 1, 0 );
      _oScene.setElementLinearDamping ( _oScene.ballBody (), BALL_LINEAR_DAMPING_SAND );
    } else if (! bVal && _bBallInSand) {
      _oScene.setElementLinearDamping ( _oScene.ballBody (), BALL_LINEAR_DAMPING );
    }
    _bBallInSand = bVal;
  };

  this.ballCollideWithWater = function ( bVal ) {
    if (! _bBallInWater) {
      _iStartDepth = _oScene.ballBody ().position.z;
    }

    _bBallInWater = bVal;

    if (bVal) {
      _oScene.setElementLinearDamping ( _oScene.ballBody (), BALL_LINEAR_DAMPING_WATER );
      _oScene.setGravity ( - 49.81 );

      var iDepth = _iStartDepth - _oScene.ballBody ().position.z;
      _oBallSprite.setWaterMask ( - (iDepth / RESTART_WATER_DEPTH_VALUE) + 1 );

      if (iDepth > RESTART_WATER_DEPTH_VALUE) {
        _oScene.setGravity ( 0 );
        _oScene.setElementVelocity ( _oScene.ballBody (), {
          x: 0,
          y: 0,
          z: 0
        } );
        _oScene.ballBody ().force.setZero ();
        _oScene.ballBody ().torque.setZero ();
        _oScene.ballBody ().angularVelocity.setZero ();

        _iBallInWaterTimeout += 1;

        if (_iBallInWaterTimeout > 60) {
          this.repeatLastLaunch ();
        } else if (_iBallInWaterTimeout === 1) {
          playSound ( "water", 1, 0 );
        }

      }
    } else {
      _oScene.setElementLinearDamping ( _oScene.ballBody (), BALL_LINEAR_DAMPING );
      _oScene.setGravity ( - 98.1 );

      _oBallSprite.setWaterMask ( 1 );
      _iStartDepth = 0;
    }
  };


  this.ballCollideWithHole = function ( bVal ) {
    if (! _bBallInHole) {
      _iStartDepth = _oScene.ballBody ().position.z;
    }
    _bBallInHole = bVal;

    var iDepth = _iStartDepth - _oScene.ballBody ().position.z;
    if (bVal) {

      _oBallShadow.visible = false;
      _oBallSprite.setHoleMask ( - (iDepth / (HOLE_DEPTH_VALUE + 5)) + 1 );

      if (iDepth > HOLE_DEPTH_VALUE) {

        _oScene.setGravity ( 0 );
        _oScene.setElementVelocity ( _oScene.ballBody (), {
          x: 0,
          y: 0,
          z: 0
        } );

        playSound ( "hole", 1, 0 );

        this.levelComplete ();

      }
      ;
    } else {
      _oBallShadow.visible = true;
      if (iDepth > 3.5) {

        playSound ( "hole", 1, 0 );

        _oScene.setGravity ( 0 );
        _oScene.setElementVelocity ( _oScene.ballBody (), {
          x: 0,
          y: 0,
          z: 0
        } );

        this.levelComplete ();
      }
      ;
    }
  };

  this._checkBallOutOfBorder = function () {

    if (_oScene.ballBody ().position.z <= - 50 && ! _bBallOutFromScreen) {
      _bBallOutFromScreen = true;

      var oFade = new createjs.Shape ();
      oFade.graphics.beginFill ( "rgba(0,0,0,1)" ).r ( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );
      oFade.alpha = 0;
      s_oStage.addChild ( oFade );

      new createjs.Tween.get ( oFade ).to ( {
        alpha: 1
      }, 500 ).call ( function () {
        new createjs.Tween.get ( oFade ).to ( {
          alpha: 0
        }, 500 ).call ( function () {
          s_oStage.removeChild ( oFade );
        } );
        _oParent.repeatLastLaunch ();
      } );
    }
  };

  this.repeatLastLaunch = function () {

    _bBallOutFromScreen = false;
    _oBallSprite.blink ();
    _oBallSprite.resetMask ();
    _iBallInWaterTimeout = 0;
    _oBallSprite.pressIndicatorAnim ();

    this.centerBallView ();
    _oInterface.setCenterBallViewVisible ( false );

    _oScene.ballBody ().force.setZero ();
    _oScene.ballBody ().torque.setZero ();
    _oScene.ballBody ().angularVelocity.setZero ();
    _oScene.setElementVelocity ( _oScene.ballBody (), {
      x: 0,
      y: 0,
      z: 0
    } );
    _oScene.ballBody ().position.set ( _pLastLaunchBallPos.x, _pLastLaunchBallPos.y, _pLastLaunchBallPos.z + 15 );
    this._updateBall2DPosition ();
  };

  this._updateInit = function () {
    _oScene.update ();

    if (_oScene.ballBody ()) {
      this._GamesLab_init2DBall ();
    } else {
      return;
    }

    this._GamesLab_initFlags ();

    _oInterface = new CInterface ( _oInterfaceContainer );
    _oInterface.refreshHoleNum ( _iLevel + 1 );
    _oInterface.setParText ( PAR[ _iLevel ] );


    var oNewPos = new THREE.Vector3 ( START_CAMERA_POSITION.x + _oScene.ballBody ().position.x,
      START_CAMERA_POSITION.y + _oScene.ballBody ().position.y,
      START_CAMERA_POSITION.z + _oScene.ballBody ().position.z );

    _oOrthographicCamera.position.set ( oNewPos.x, oNewPos.y, oNewPos.z );

    _iGameState = STATE_PLAY;

    var oStartCameraPos2D = convert3dPosTo2dScreen ( {
      x: START_CAMERA_POSITION.x,
      y: START_CAMERA_POSITION.y,
      z: START_CAMERA_POSITION.z
    }, _oOrthographicCamera );
    var oCurCameraPos2D = convert3dPosTo2dScreen ( _oOrthographicCamera.position, _oOrthographicCamera );

    var oBGShift = {
      x: oStartCameraPos2D.x - oCurCameraPos2D.x,
      y: oStartCameraPos2D.y - oCurCameraPos2D.y
    };

    _oBg.setPos ( CANVAS_WIDTH / 2 + oBGShift.x, CANVAS_HEIGHT / 2 + oBGShift.y );

    _oFg.x = _oBg.getPos ().x;
    _oFg.y = _oBg.getPos ().y;

    _oOrthographicCamera.updateProjectionMatrix ();
    _oOrthographicCamera.updateMatrixWorld ();


    _oBorderLimit = {
      left: _oBg.getSize ().width / 2 - CANVAS_WIDTH / 2 - oBGShift.x,
      right: - (_oBg.getSize ().width / 2 - CANVAS_WIDTH / 2) - oBGShift.x,
      top: _oBg.getSize ().height / 2 - CANVAS_HEIGHT / 2 - oBGShift.y,
      bot: - (_oBg.getSize ().height / 2 - CANVAS_HEIGHT / 2) - oBGShift.y
    };

    createjs.Tween.get ( _oFade ).wait ( 800 ).to ( {
      alpha: 0
    }, 1300 ).call ( function () {
      _fLerp = 0.05;
      _oFade.visible = false;
    } );

    if (_iLevel === 0 && !s_oLocalStorage.helpShow(1)) {
      var oHelpPanel = new CHelpPanel ( _oHelpContainer );
      oHelpPanel.stage1Help ();
      s_oLocalStorage.setHelpShown(1);
    }
    setTimeout ( function () {
      flashMessage._GamesLab_showFlashMessage ( "LEVEL " + (parseInt ( _iLevel ) + 1) );
    },1000)
  };


  this._updatePlay = function () {
    if (_bStartGame) {
      _oScene.update ();

      this._updateBall2DPosition ();

      this.moveBall ();
      this.angleArrow ();

      _oBallVelocity = _oScene.getBodyVelocity ( _oScene.ballBody () );

      this.detectBallVelocityForLaunch ();

      this._checkBallOutOfBorder ();
    }
  };

  this.update = function () {
    switch (_iGameState) {
      case STATE_INIT: {
        this._updateInit ();
      }
        break;
      case STATE_PLAY: {
        this._updatePlay ();
      }
        break;
    }
  };

  this.setPanPoint = function ( iX, iY ) {

    var iNewX = - _oBall2dPos.x + CANVAS_WIDTH / 2 + _pBGPanPoint.x + iX;
    var fDistX = (iNewX - _oElementContainer.x);

    if (_oElementContainer.x + fDistX < _oBorderLimit.left && _oElementContainer.x + fDistX > _oBorderLimit.right) {
      _pBGPanPoint.x += iX;
    }

    var iNewY = - _oBall2dPos.y + CANVAS_HEIGHT / 2 + _pBGPanPoint.y + iY;
    var fDistY = (iNewY - _oElementContainer.y);

    if (_oElementContainer.y + fDistY < _oBorderLimit.top && _oElementContainer.y + fDistY > _oBorderLimit.bot) {
      _pBGPanPoint.y += iY;
    }

  };

  this.centerBallView = function () {
    _pBGPanPoint.x = 0;
    _pBGPanPoint.y = 0;
  };

  this._updateBall2DPosition = function () {

    _oBall2dPos = convert3dPosTo2dScreen ( _oScene.ballBody ().position, _oOrthographicCamera );

    var oShadowPos = {
      x: _oScene.ballBody ().position.x,
      y: _oScene.ballBody ().position.y,
      z: _iLastTerrainBallHeight
    };
    var oBallShadowPos = convert3dPosTo2dScreen ( oShadowPos, _oOrthographicCamera );

    _oBallShadow.x = oBallShadowPos.x;
    _oBallShadow.y = oBallShadowPos.y;


    var iNewX = - _oBall2dPos.x + CANVAS_WIDTH / 2 + _pBGPanPoint.x;
    var fDistX = (iNewX - _oElementContainer.x) * _fLerp;
    _oElementContainer.x += fDistX;
    if (_oElementContainer.x > _oBorderLimit.left) { // && _oElementContainer.x + fDistX > _oBorderLimit.right){
      _oElementContainer.x = _oBorderLimit.left;
    } else if (_oElementContainer.x < _oBorderLimit.right) {
      _oElementContainer.x = _oBorderLimit.right;
    }

    var iNewY = - _oBall2dPos.y + CANVAS_HEIGHT / 2 + _pBGPanPoint.y;
    var fDistY = (iNewY - _oElementContainer.y) * _fLerp;
    _oElementContainer.y += fDistY;
    if (_oElementContainer.y > _oBorderLimit.top) { // && _oElementContainer.x + fDistX > _oBorderLimit.right){
      _oElementContainer.y = _oBorderLimit.top;
    } else if (_oElementContainer.y < _oBorderLimit.bot) {
      _oElementContainer.y = _oBorderLimit.bot;
    }
  };

  this.panHelpAnim = function () {
    new createjs.Tween.get ( _pBGPanPoint, {
      loop: true
    } ).to ( {
      x: - 500
    }, 700 ).to ( {
      x: 0
    }, 700 ).to ( {
      y: - 500
    }, 700 ).to ( {
      y: 0
    }, 700 );

    var oSprite = s_oSpriteLibrary.getSprite ( "help_touch" );
    _oHelpCursor = createBitmap ( oSprite );
    _oHelpCursor.x = 300;
    _oHelpCursor.y = 600;
    s_oStage.addChild ( _oHelpCursor );

    new createjs.Tween.get ( _oHelpCursor, {
      loop: true
    } ).to ( {
      x: 100
    }, 700 ).to ( {
      x: 300
    }, 700 ).to ( {
      y: 400
    }, 700 ).to ( {
      y: 600
    }, 700 );

  };

  this.stopPanAnim = function () {
    _pBGPanPoint.x = 0;
    _pBGPanPoint.y = 0;
    new createjs.Tween.removeTweens ( _pBGPanPoint );

    s_oStage.removeChild ( _oHelpCursor );
    new createjs.Tween.removeTweens ( _oHelpCursor );
  };

  s_oGame = this;


  MAX_SHOT_POWER = oData.max_shot_power;
  if (MAX_SHOT_POWER > 160) {
    MAX_SHOT_POWER = 160;
  }

  PAR = oData.stage_par;

  _oParent = this;
  this._GamesLab_init ( iLevel );
}

var s_oGame;
