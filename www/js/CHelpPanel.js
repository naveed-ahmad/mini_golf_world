function CHelpPanel(_oHelpContainer) {
    var _oText1;
    var _oText1Back;
    var _oGroup;
    var _oFade;
    var _oBall;
    var _oParent;

    this._init = function(_oHelpContainer) {

        var szText;

        if (s_bMobile) {
            szText = TEXT_HELP1_MOBILE;
        } else {
            szText = TEXT_HELP1_PC;
        }

        _oText1Back = new createjs.Text(szText, "24px " + PRIMARY_FONT, "#3e240b");
        _oText1Back.textAlign = "center";
        _oText1Back.lineWidth = 500;
        _oText1Back.textBaseline = "alphabetic";
        _oText1Back.outline = 8;
        _oText1Back.x = CANVAS_WIDTH * 0.5 - 200;
        _oText1Back.y = CANVAS_HEIGHT * 0.5 - 180;

        _oText1 = new createjs.Text(szText, "24px " + PRIMARY_FONT, "#ffd800");
        _oText1.textAlign = "center";
        _oText1.lineWidth = 500;
        _oText1.textBaseline = "alphabetic";
        _oText1.x = _oText1Back.x;
        _oText1.y = _oText1Back.y;

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.7;

        _oGroup = new createjs.Container();
        _oGroup.x = 0;
        _oGroup.y = 0;
        _oGroup.addChild(_oFade, _oText1Back, _oText1);
        _oHelpContainer.addChild(_oGroup);

        s_oGame.getBall().setVisible(false);

        var oSpriteBall = s_oSpriteLibrary.getSprite("ball");
        _oBall = new CBall(800, 484, oSpriteBall, _oGroup);
        _oBall.setHelpAnim();
        _oBall.setMoving(true);

    };

    this.unload = function() {
        _oHelpContainer.removeChild(_oGroup);
        _oGroup.off("mousedown");
    };

    this.stage1Help = function() {
        var oParent = this;
        _oGroup.on("mousedown", function() {
          oParent._onExitHelp();
        });
    };

    this.stage2Help = function(oDir) {

        _oText1Back.text = TEXT_HELP2;
        _oText1.text = TEXT_HELP2;
        _oText1Back.visible = false;
        _oText1.visible = false;
        _oGroup.off();

        s_oGame.getBall().setVisible(true);
        _oBall.unload();

        _oFade.alpha = 0;
        createjs.Tween.get(_oFade).to({
            alpha: 0.7
        }, 1000).call(function() {
            _oText1Back.visible = true;
            _oText1.visible = true;

            _oGroup.on("mousedown", function() {
                _oParent._onExitHelp2(oDir);
            });

            s_oGame.panHelpAnim();

        });
    };

    this._onExitHelp = function() {
        this.unload();

        s_oGame._onExitHelp();
    };

    this._onExitHelp2 = function(oDir) {
        this.unload();

        s_oGame.stopPanAnim();
        s_oGame._onExitHelp2(oDir);
    };

    _oParent = this;
    this._init(_oHelpContainer);

}
