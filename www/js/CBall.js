function CBall(iXPos, iYPos, oSprite, oElementContainer) {
    var _bIsMoving;

    var _iMouseDistance;
    var _iShotPower;
    var _iMousePowerDistanceRange;
    var _iNumBlink;
    var _iSpriteHeight;
    var _iOffsetArrowOnTerrain;

    var _oParent;
    var _oBall;
    var _oBallSprite;
    var _oLine;
    var _oDirection;
    var _oClickArea;
    var _oArrow;
    var _oMaskArrow;
    var _oMaskBall;
    var _oCircleMaskBall;
    var _oBallWater;
    var _oPressIndicator;
    var _oHelpCursor;

    var _v2DScreenReferenceVector;


    this._init = function(iXPos, iYPos, oSprite, oElementContainer) {
        _bIsMoving = false;

        _iNumBlink = 3;
        _iShotPower = 0;
        _iMousePowerDistanceRange = MAX_MOUSE_DISTANCE_POWER_ACTIVATED - MIN_MOUSE_DISTANCE_POWER_ACTIVATED;
        _iSpriteHeight = oSprite.height;

        _iOffsetArrowOnTerrain = 10;

        //Manually calculated 2D vector (normalized) that move ball long 3D X Axes
        _v2DScreenReferenceVector = new CVector2(-0.845, 0.534);

        _oBall = new createjs.Container();
        _oBall.x = iXPos;
        _oBall.y = iYPos;
        oElementContainer.addChild(_oBall);

        var oPressSprite = s_oSpriteLibrary.getSprite("press_indicator");
        _oPressIndicator = createBitmap(oPressSprite);
        _oPressIndicator.regX = oPressSprite.width * 0.5;
        _oPressIndicator.regY = oPressSprite.height * 0.5;
        _oPressIndicator.scaleX = 0;
        _oPressIndicator.scaleY = 0;
        _oBall.addChild(_oPressIndicator);

        _oLine = new createjs.Shape();
        _oBall.addChild(_oLine);

        _oArrow = new createjs.Container();
        _oArrow.visible = false;
        _oArrow.y = _iOffsetArrowOnTerrain;
        _oBall.addChild(_oArrow);

        var oWaterBallSprite = s_oSpriteLibrary.getSprite("ball_water");
        _oBallWater = createBitmap(oWaterBallSprite);
        _oBallWater.regX = oWaterBallSprite.width * 0.54;
        _oBallWater.regY = oWaterBallSprite.height * 0.5;
        _oBall.addChild(_oBallWater);

        _oBallSprite = createBitmap(oSprite);
        _oBallSprite.regX = oSprite.width * 0.5;
        _oBallSprite.regY = oSprite.height * 0.5;
        _oBall.addChild(_oBallSprite);

        _oMaskBall = new createjs.Shape();
        _oMaskBall.graphics.beginFill("rgba(255,255,255,0.01)").r(0, 0, oSprite.width, oSprite.height);
        _oMaskBall.x = -oSprite.width / 2;
        _oMaskBall.y = -oSprite.height / 2;
        _oMaskBall.scaleY = 1;
        _oBall.addChild(_oMaskArrow);

        _oCircleMaskBall = new createjs.Shape();
        _oCircleMaskBall.graphics.beginFill("rgba(255,0,0,0.01)").drawCircle(0, 0, oSprite.width / 2);
        _oBall.addChild(_oCircleMaskBall);

        _oBallSprite.mask = _oMaskBall;

        _oClickArea = new createjs.Shape();
        _oClickArea.graphics.beginFill("rgba(255,0,0,0.01)").drawCircle(0, 0, 100);
        _oBall.addChild(_oClickArea);

        _oBall.on("mousedown", this._onClickPoint);
        _oBall.on("pressmove", this._onDragPoint);
        _oBall.on("pressup", this._onReleaseForce);

        var iStartRot = 147;

        var oSprite = s_oSpriteLibrary.getSprite("arrow");
        var oArrowBG = createBitmap(oSprite);
        oArrowBG.regY = oSprite.height / 2;
        oArrowBG.rotation = iStartRot;
        _oArrow.addChild(oArrowBG);

        _oMaskArrow = new createjs.Shape();
        _oMaskArrow.graphics.beginFill("rgba(255,255,255,0.01)").r(0, -oSprite.height / 2, oSprite.width, oSprite.height);
        _oMaskArrow.scaleX = 0;
        _oMaskArrow.rotation = iStartRot;
        _oArrow.addChild(_oMaskArrow);

        var oSprite = s_oSpriteLibrary.getSprite("arrow_fill");
        var oArrowFill = createBitmap(oSprite);
        oArrowFill.regY = oSprite.height / 2;
        oArrowFill.mask = _oMaskArrow;
        oArrowFill.rotation = iStartRot;
        _oArrow.addChild(oArrowFill);

        var oSprite = s_oSpriteLibrary.getSprite("arrow_frame");
        var oArrowFrame = createBitmap(oSprite);
        oArrowFrame.regY = oSprite.height / 2;
        oArrowFrame.rotation = iStartRot;
        _oArrow.addChild(oArrowFrame);

        this.pressIndicatorAnim();
    };

    this._onClickPoint = function(evt) {

    };

    this._onDragPoint = function(evt) {

        if (_bIsMoving) {
            return;
        }
        _oArrow.visible = true;

        var v3DBallPosition = {
            x: s_oGame.get3DBall().position.x,
            y: s_oGame.get3DBall().position.y,
            z: s_oGame.get3DBall().position.z
        };

        var v2DScreenDirectionVect = new CVector2(evt.localX, evt.localY);

        var iAngle = Math.degrees(angleBetweenVectors(_v2DScreenReferenceVector, v2DScreenDirectionVect));
        //From 150 to 124 ANGLE CORRECTION, BECAUSE MAPPING 2D ROTATION FROM 3D. USED TO ALIGN MOUSE DRAG TO VISUAL LINE TRAJECTOR
        var iAngleCorrection;
        if ((iAngle > 0 && iAngle <= 66)) {
            iAngleCorrection = -(iAngle) * 13 / 33 + 150;
        } else if (iAngle < 0 && iAngle >= -114) {
            iAngleCorrection = iAngle * 13 / 56 + 150;
        } else if (iAngle > 66) {
            iAngleCorrection = Math.abs(iAngle) * 13 / 57 + 2070 / 19;
        } else {
            iAngleCorrection = -(iAngle) * 13 / 34 + 1380 / 17;
        }
        var oCorrectedPos = rotateVector2D(Math.radians(iAngleCorrection), v2DScreenDirectionVect);


        var v3DLineEndPosition = {
            x: v3DBallPosition.x + oCorrectedPos.x,
            y: v3DBallPosition.y - oCorrectedPos.y,
            z: v3DBallPosition.z
        };

        var o2DLinePos = convert3dPosTo2dScreen(v3DLineEndPosition, s_oGame.getCamera());

        _oDirection = {
            lineX: o2DLinePos.x,
            lineY: o2DLinePos.y,
            ballX: oCorrectedPos.x,
            ballY: oCorrectedPos.y
        };


        _iMouseDistance = Math.sqrt(evt.localX * evt.localX + evt.localY * evt.localY);

        var iMinDistance;
        if (s_bMobile) {
            iMinDistance = MIN_MOUSE_DISTANCE_POWER_ACTIVATED_MOBILE;
        } else {
            iMinDistance = MIN_MOUSE_DISTANCE_POWER_ACTIVATED;
        }

        _iShotPower = (_iMouseDistance - iMinDistance) / _iMousePowerDistanceRange * MAX_SHOT_POWER;

        _oParent._drawLine(evt.localX, evt.localY);
        _oParent._drawArrow();

    };

    this._onReleaseForce = function(evt) {

        if (_bIsMoving) {
            return;
        }

        _oArrow.visible = false;

        _oLine.graphics.clear();
        if (_iShotPower <= 0) {
            return;
        } else if (_iShotPower > MAX_SHOT_POWER) {
            _iShotPower = MAX_SHOT_POWER;
        }

        var vPowerVector = new CVector2(_oDirection.ballX, _oDirection.ballY);
        vPowerVector.normalize();

        vPowerVector.scalarProduct(_iShotPower);

        s_oGame.launchBall({
            x: vPowerVector.getX(),
            y: -vPowerVector.getY()
        });

        _oParent.setMoving(true);
        _oParent.pressIndicatorStop();

        _iShotPower = 0;

        playSound("hit_ball", 1, 0);

    };

    this._drawLine = function(iX, iY) {
        _oLine.graphics.clear();
        _oLine.graphics.setStrokeDash([14, 14], 2);
        _oLine.graphics.setStrokeStyle(5);
        _oLine.graphics.beginStroke("rgba(61,34,11,1)");

        _oLine.graphics.moveTo(0, _iOffsetArrowOnTerrain);

        _oLine.graphics.lineTo(iX, iY);
    };

    this._drawArrow = function() {
        var vArrowDirection = new CVector2(_oDirection.lineX - _oBall.x, _oDirection.lineY - _oBall.y);
        var iArrowAngle = Math.degrees(angleBetweenVectors(_v2DScreenReferenceVector, vArrowDirection));
        _oArrow.rotation = iArrowAngle;

        var iMin = 0.17; //Based on X alpha portion of arrow

        _oMaskArrow.scaleX = (_iShotPower / MAX_SHOT_POWER) * (1 - iMin) + iMin;
    };


    this.unload = function() {
        _oBall.removeAllEventListeners();
        oElementContainer.removeChild(_oBall);

        _oBall.off("mousedown");
        _oBall.off("mousemove");
        _oBall.off("mouseup");

    };

    this.removeHelpAnim = function() {
        new createjs.Tween.removeTweens(_oHelpCursor);
        new createjs.Tween.removeTweens(_oMaskArrow);
    };

    this.setHelpAnim = function() {
        var oSprite = s_oSpriteLibrary.getSprite("help_touch");
        _oHelpCursor = createBitmap(oSprite);
        _oHelpCursor.regX = oSprite.width * 0.33;
        _oHelpCursor.regY = oSprite.height * 0.1;
        _oBall.addChild(_oHelpCursor);

        this._helpCursorAnim(1000);
        this._helpArrowAnim(1000);
    };

    this._helpCursorAnim = function(iTime) {

        createjs.Tween.get(_oHelpCursor).to({
            x: -200,
            y: 120
        }, iTime, createjs.Ease.cubicInOut).call(function() {
            createjs.Tween.get(_oHelpCursor).to({
                x: 0,
                y: 0
            }, iTime, createjs.Ease.cubicInOut).call(function() {
                _oParent._helpCursorAnim(iTime);
            });
        });
    };

    this._helpArrowAnim = function(iTime) {
        _oArrow.visible = true;
        _oArrow.rotation = 180;

        createjs.Tween.get(_oMaskArrow).to({
            scaleX: 1
        }, iTime, createjs.Ease.cubicInOut).call(function() {
            createjs.Tween.get(_oMaskArrow).to({
                scaleX: 0
            }, iTime, createjs.Ease.cubicInOut).call(function() {
                _oParent._helpArrowAnim(iTime);
            });
        });
    };

    this.blink = function() {
        createjs.Tween.get(_oBall).to({
            alpha: 0
        }, 100 - _iNumBlink * 15).to({
            alpha: 1
        }, 300 - _iNumBlink * 45).wait(100 - _iNumBlink * 20).call(function() {
            _iNumBlink--;
            if (_iNumBlink > 0) {
                _oParent.blink();
            } else {
                _iNumBlink = 3;
            }
        });
    };

    this.pressIndicatorAnim = function() {

        _oPressIndicator.scaleX = _oPressIndicator.scaleY = 0;
        _oPressIndicator.alpha = 1;

        new createjs.Tween.get(_oPressIndicator).to({
            scaleX: 1,
            scaleY: 1
        }, 1500, createjs.Ease.cubicOut).call(function() {
            _oParent.pressIndicatorAnim();
        });
        new createjs.Tween.get(_oPressIndicator).to({
            alpha: 0
        }, 1500, createjs.Ease.cubicOut)
    };

    this.pressIndicatorStop = function() {
        _oPressIndicator.scaleX = _oPressIndicator.scaleY = 0;
        new createjs.Tween.removeTweens(_oPressIndicator);
    };

    this.setMoving = function(bVal) {
        _bIsMoving = bVal;
    };

    this.resetMask = function() {
        _oBallWater.visible = false;

        _oBallSprite.mask = _oMaskBall;
        _oMaskBall.scaleY = 1;
    };

    this.setWaterMask = function(iValue) {
        _oBallWater.visible = true;
        _oBallWater.alpha = iValue;

        _oBallSprite.mask = _oCircleMaskBall;
        _oCircleMaskBall.y = _iSpriteHeight * iValue - _iSpriteHeight;
    };

    this.setHoleMask = function(iValue) {
        _oBallWater.visible = false;

        _oBallSprite.mask = _oCircleMaskBall;
        _oCircleMaskBall.y = _iSpriteHeight * iValue - _iSpriteHeight;
    };

    this.setVisible = function(bVisible) {
        _oBall.visible = bVisible;
    };

    this.setPosition = function(iXPos, iYPos) {
        _oBall.x = iXPos;
        _oBall.y = iYPos;
    };

    this.setAlpha = function(iValue) {
        _oBall.alpha = iValue;
    };

    this.setAngle = function(iAngle) {
        _oBall.rotation = iAngle;
    };

    this.getX = function() {
        return _oBall.x;
    };

    this.getY = function() {
        return _oBall.y;
    };

    this.scale = function(fValue) {
        _oBall.scaleX = fValue;
        _oBall.scaleY = fValue;
    };

    this.getScale = function() {
        return _oBall.scaleX;
    };

    this.childIndex = function(iValue) {
        oElementContainer.setChildIndex(_oBall, iValue);
    };

    this._init(iXPos, iYPos, oSprite, oElementContainer);

    _oParent = this;
    return this;
}