function CBackground(iLevel, oElementContainer) {

    var _oBg;
    var _oParent;
    var _oSize;

    var _pBGMoveStartPoint;

    this._GamesLab_init = function(iLevel, oElementContainer) {


        _oBg = new createjs.Container();
        oElementContainer.addChild(_oBg);
        _oSize = {
            width: CANVAS_WIDTH * 3,
            height: CANVAS_HEIGHT * 3
        };

        var szTagLevel = iLevel + 1;


        var iStartX = 0;
        var iStartY = 0;
        for (var i = 0; i < 18; i++) {
            var oSprite = s_oSpriteLibrary.getSprite("level_" + szTagLevel + "_bg_" + i);
            var oBg = createBitmap(oSprite);


            iStartX += oSprite.width;
            if (i % 6 === 0) {
                iStartX = 0;
                if (i !== 0) {
                    iStartY += oSprite.height;
                }
            }

            oBg.x = iStartX;
            oBg.y = iStartY;

            _oBg.addChild(oBg);
        }

        _oBg.regX = 2400;
        _oBg.regY = 1452;


        if (CAUSTICS_POS[iLevel] !== null) {
            var oSprite = s_oSpriteLibrary.getSprite("caustics");
            var oFrameWidth = oSprite.width / 5;
            var oFrameHeight = oSprite.height / 2;
            var oData = {
                framerate: FPS / 3,
                images: [oSprite],
                // width, height & registration point of each sprite
                frames: {
                    width: oFrameWidth,
                    height: oFrameHeight,
                    regX: oFrameWidth / 2,
                    regY: oFrameHeight / 2
                },
                animations: {
                    idle: [0, 9]
                }
            };
            var oSpriteSheet = new createjs.SpriteSheet(oData);
            var oCaustics = createSprite(oSpriteSheet, "idle", oFrameWidth / 2, oFrameHeight / 2, oFrameWidth, oFrameHeight);
            oCaustics.x = CAUSTICS_POS[iLevel].x + 2400;
            oCaustics.y = CAUSTICS_POS[iLevel].y + 1452;

            oCaustics.scaleX = oCaustics.scaleY = CAUSTICS_POS[iLevel].scale;
            _oBg.addChild(oCaustics);
        }





        _oBg.on("mousedown", this._startPan);
        _oBg.on("pressmove", this._movePan);
        _oBg.on("pressup", this._endPan);
    };

    this.unload = function() {
        _oBg.off();

        oElementContainer.removeChild(_oBg);
    };

    this._startPan = function(event) {

        _pBGMoveStartPoint = {
            x: event.stageX,
            y: event.stageY
        };

        s_oInterface.setCenterBallViewVisible(true);
    };

    this._movePan = function(event) {

        var oPoint = {
            x: event.stageX,
            y: event.stageY
        };

        var vDiff = {
            x: (oPoint.x - _pBGMoveStartPoint.x) * 2,
            y: (oPoint.y - _pBGMoveStartPoint.y) * 2
        };

        _pBGMoveStartPoint = {
            x: oPoint.x,
            y: oPoint.y
        };

        s_oGame.setPanPoint(vDiff.x, vDiff.y);
    };


    this._endPan = function(event) {

    };

    this.setPos = function(iX, iY) {
        _oBg.x = iX;
        _oBg.y = iY;
    };

    this.getPos = function() {
        return {
            x: _oBg.x,
            y: _oBg.y
        };
    };

    this.getSize = function() {
        return _oSize;
    };

    _oParent = this;
    this._GamesLab_init(iLevel, oElementContainer);
}
