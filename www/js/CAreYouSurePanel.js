function CAreYouSurePanel(oFunction) {

    var _oButYes;
    var _oButNo;
    var _oFade;
    var _oTitleStroke;
    var _oTitle;
    var _oPanelContainer;
    var _oParent;

    var _pStartPanelPos;

    this._init = function(oFunction) {
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oFade.on("mousedown", function() {});
        s_oStage.addChild(_oFade);

        new createjs.Tween.get(_oFade).to({
            alpha: 0.7
        }, 500);

        _oPanelContainer = new createjs.Container();
        s_oStage.addChild(_oPanelContainer);

        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);
        oPanel.regX = oSprite.width / 2;
        oPanel.regY = oSprite.height / 2;
        _oPanelContainer.addChild(oPanel);

        _oPanelContainer.x = CANVAS_WIDTH / 2;
        _oPanelContainer.y = CANVAS_HEIGHT / 2;
        _oPanelContainer.alpha = 0;
        _pStartPanelPos = {
            x: _oPanelContainer.x,
            y: _oPanelContainer.y
        };
        new createjs.Tween.get(_oPanelContainer).to({
            alpha: 1
        }, 500);

        _oTitleStroke = new createjs.Text(TEXT_ARE_SURE, " 30px " + PRIMARY_FONT, "#3e240b");
        _oTitleStroke.y = -oSprite.height / 2 + 200;
        _oTitleStroke.textAlign = "center";
        _oTitleStroke.textBaseline = "middle";
        _oTitleStroke.lineWidth = 700;
        _oTitleStroke.outline = 8;
        _oPanelContainer.addChild(_oTitleStroke);

        _oTitle = new createjs.Text(TEXT_ARE_SURE, " 30px " + PRIMARY_FONT, "#ffd800");
        _oTitle.y = _oTitleStroke.y;
        _oTitle.textAlign = "center";
        _oTitle.textBaseline = "middle";
        _oTitle.lineWidth = _oTitleStroke.lineWidth;
        _oPanelContainer.addChild(_oTitle);

        _oButYes = new CGfxButton(110, 180, s_oSpriteLibrary.getSprite('but_yes'), _oPanelContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);

        _oButNo = new CGfxButton(-110, 180, s_oSpriteLibrary.getSprite('but_not'), _oPanelContainer);
        _oButNo.addEventListener(ON_MOUSE_UP, this._onButNo, this);
        _oButNo.pulseAnimation();
    };

    this._onButYes = function() {
        _oButNo.setClickable(false);
        _oButYes.setClickable(false);

        new createjs.Tween.get(_oFade).to({
            alpha: 1
        }, 500);
        new createjs.Tween.get(_oPanelContainer).to({
            alpha: 0
        }, 500).call(function() {

            _oParent.unload();
            //s_oGame.onExit();
            oFunction();
        });
    };

    this._onButNo = function() {
        _oButNo.setClickable(false);
        _oButYes.setClickable(false);

        new createjs.Tween.get(_oFade).to({
            alpha: 0
        }, 500);
        new createjs.Tween.get(_oPanelContainer).to({
            alpha: 0
        }, 500).call(function() {
            _oParent.unload();

        });
    };

    this.unload = function() {
        _oButNo.unload();
        _oButYes.unload();

        s_oStage.removeChild(_oFade);
        s_oStage.removeChild(_oPanelContainer);

        _oFade.off("mousedown", function() {});
    };

    this.changeMessage = function(szText) {
        _oTitleStroke.text = szText;
        _oTitle.text = szText;
    };

    _oParent = this;
    this._init(oFunction);
}