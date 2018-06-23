function CCreditsPanel() {

    var _oFade;
    var _oPanelContainer;
    var _oButExit;
    var _oLogo;

    var _pStartPanelPos;

    this._init = function() {

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

        var oTitleStroke = new createjs.Text(TEXT_DEVELOPED, " 30px " + PRIMARY_FONT, "#3e240b");
        oTitleStroke.y = -oSprite.height / 2 + 175;
        oTitleStroke.textAlign = "center";
        oTitleStroke.textBaseline = "middle";
        oTitleStroke.lineWidth = 500;
        oTitleStroke.outline = 8;
        _oPanelContainer.addChild(oTitleStroke);

        var oTitle = new createjs.Text(TEXT_DEVELOPED, " 30px " + PRIMARY_FONT, "#ffd800");
        oTitle.y = oTitleStroke.y
        oTitle.textAlign = "center";
        oTitle.textBaseline = "middle";
        oTitle.lineWidth = 500;
        _oPanelContainer.addChild(oTitle);

        var oLinkStroke = new createjs.Text(TEXT_LINK, " 30px " + PRIMARY_FONT, "#3e240b");
        oLinkStroke.y = 160;
        oLinkStroke.textAlign = "center";
        oLinkStroke.textBaseline = "middle";
        oLinkStroke.lineWidth = 500;
        oLinkStroke.outline = 8;
        _oPanelContainer.addChild(oLinkStroke);

        var oLink = new createjs.Text(TEXT_LINK, " 30px " + PRIMARY_FONT, "#ffd800");
        oLink.y = oLinkStroke.y;
        oLink.textAlign = "center";
        oLink.textBaseline = "middle";
        oLink.lineWidth = 500;
        _oPanelContainer.addChild(oLink);

        var oSprite = s_oSpriteLibrary.getSprite('ctl_logo');
        _oLogo = createBitmap(oSprite);
        _oLogo.on("mousedown", this._onLogoButRelease);
        _oLogo.regX = oSprite.width / 2;
        _oLogo.regY = oSprite.height / 2;
        _oPanelContainer.addChild(_oLogo);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(330, -200, oSprite, _oPanelContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);

    };

    this.unload = function() {

        _oButExit.setClickable(false);

        new createjs.Tween.get(_oFade).to({
            alpha: 0
        }, 500);
        new createjs.Tween.get(_oPanelContainer).to({
            alpha: 0
        }, 500).call(function() {
            s_oStage.removeChild(_oFade);
            s_oStage.removeChild(_oPanelContainer);

            _oButExit.unload();
        });

        _oFade.off("mousedown", function() {});
        _oLogo.off("mousedown", this._onLogoButRelease);


    };

    this._onLogoButRelease = function() {
        CreateLinksInGame('Mini-Golf-World', 'pregame', 'logo');
    };

    this._onMoreGamesReleased = function() {
        CreateLinksInGame('Mini-Golf-World', 'pregame', 'logo');
    };

    this._init();


};