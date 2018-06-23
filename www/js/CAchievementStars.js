var STAR_EFFECT_ALPHA = 0;
var STAR_EFFECT_SCALE = 1;

function CAchievementStars(oSprite, iX, iY, oParentContainer, szSound) {

    var iNumStar;

    var _aUnlitStar;
    var _aLitStar;

    var _oStarContainer;
    var _oParent;


    this._init = function(oSprite, iX, iY, oParentContainer, szSound) {

        iNumStar = 3;

        _oStarContainer = new createjs.Container();
        _oStarContainer.x = iX;
        _oStarContainer.y = iY;
        oParentContainer.addChild(_oStarContainer);

        var iWidth = oSprite.width / 2;
        var iHeight = oSprite.height;
        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {
                width: iWidth,
                height: iHeight,
                regX: iWidth / 2,
                regY: iHeight / 2
            },
            animations: {
                lit: [0],
                unlit: [1]
            }
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);

        var iXOffset = 0;

        _aUnlitStar = new Array();
        for (var i = 0; i < iNumStar; i++) {
            _aUnlitStar[i] = createSprite(oSpriteSheet, "unlit", 0, 0, 0, 0);
            _aUnlitStar[i].x = -((iNumStar - 1) * (iWidth + iXOffset)) / 2 + i * (iWidth + iXOffset);
            _oStarContainer.addChild(_aUnlitStar[i]);
        }

        _aLitStar = new Array();
        for (var i = 0; i < iNumStar; i++) {
            _aLitStar[i] = createSprite(oSpriteSheet, "lit", 0, 0, 0, 0);
            _aLitStar[i].x = -((iNumStar - 1) * (iWidth + iXOffset)) / 2 + i * (iWidth + iXOffset);
            _aLitStar[i].scaleX = _aLitStar[i].scaleY = 0;
            _aLitStar[i].alpha = 0;
            _oStarContainer.addChild(_aLitStar[i]);
        }

        var iYOffset = 10;

        _aLitStar[1].y = -iYOffset;
        _aLitStar[0].y = iYOffset;
        _aLitStar[2].y = iYOffset;

        _aUnlitStar[1].y = -iYOffset;
        _aUnlitStar[0].y = iYOffset;
        _aUnlitStar[2].y = iYOffset;
    };

    this.unload = function() {
        for (var i = 0; i < iNumStar; i++) {
            new createjs.Tween.removeTweens(_aLitStar[i]);
        }
        oParentContainer.removeChild(_oStarContainer);
    };

    this.getContainer = function() {
        return _oStarContainer;
    };

    this.startLitStar = function(iNumStar) {
        for (var i = 0; i < iNumStar; i++) {
            _aLitStar[i].scaleX = _aLitStar[i].scaleY = 1;
            _aLitStar[i].alpha = 1;
        }
    };

    this.playSequentialMode = function(iNumToLit, iAnimationTime, szEffect) {

        var iDelay = iAnimationTime / (iNumToLit - 1);

        switch (szEffect) {

            case STAR_EFFECT_SCALE:
                {
                    for (var i = 0; i < iNumStar; i++) {
                        _aLitStar[i].alpha = 1;
                    }

                    for (var i = 0; i < iNumToLit; i++) {
                        new createjs.Tween.get(_aLitStar[i]).wait(i * iDelay).call(function() {
                            _oParent._playSound();
                        }).to({
                            scaleX: 1,
                            scaleY: 1
                        }, 1500, createjs.Ease.elasticOut);
                    }

                    break;
                }
            case STAR_EFFECT_ALPHA:
                {
                    for (var i = 0; i < iNumStar; i++) {
                        _aLitStar[i].scaleX = _aLitStar[i].scaleY = 1;
                    }

                    for (var i = 0; i < iNumToLit; i++) {
                        new createjs.Tween.get(_aLitStar[i]).wait(i * iDelay).call(function() {
                            _oParent._playSound();
                        }).to({
                            alpha: 1
                        }, 750);
                    }
                    break;
                }
        }

    };

    this.playManualMode = function(iIndex, szEffect) {

        switch (szEffect) {

            case STAR_EFFECT_SCALE:
                {
                    _aLitStar[iIndex].alpha = 1;
                    new createjs.Tween.get(_aLitStar[iIndex]).to({
                        scaleX: 1,
                        scaleY: 1
                    }, 1500, createjs.Ease.elasticOut);
                    break;
                }
            case STAR_EFFECT_ALPHA:
                {
                    _aLitStar[iIndex].scaleX = _aLitStar[iIndex].scaleY = 1;
                    new createjs.Tween.get(_aLitStar[iIndex]).to({
                        alpha: 1
                    }, 750);
                    break;
                }
        }

        this._playSound();

    };

    this._playSound = function() {
        playSound(szSound, 1, 0);
    };

    _oParent = this;
    this._init(oSprite, iX, iY, oParentContainer, szSound);


}