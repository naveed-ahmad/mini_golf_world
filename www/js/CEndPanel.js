function CEndPanel(oSpriteBg) {

    var _oBg;
    var _oMsgText;
    var _oMsgTextBack;

    var _oGroup;
    var _oButMenu;
    var _oFade;

    this._init = function(oSpriteBg) {

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            new createjs.Tween.get(s_oSoundTrack).to({
                volume: 1
            }, 1000);
        }

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 1;
        _oFade.on("mousedown", function() {});
        s_oStage.addChild(_oFade);

        _oBg = createBitmap(oSpriteBg);
        _oBg.regX = oSpriteBg.width / 2;
        _oBg.regY = oSpriteBg.height / 2;
        _oBg.x = CANVAS_WIDTH / 2;
        _oBg.y = CANVAS_HEIGHT / 2;

        _oMsgTextBack = new createjs.Text("", "50px " + PRIMARY_FONT, "#3e240b");
        _oMsgTextBack.x = CANVAS_WIDTH / 2;
        _oMsgTextBack.y = CANVAS_HEIGHT / 2 - 100;
        _oMsgTextBack.outline = 10;
        _oMsgTextBack.textAlign = "center";
        _oMsgTextBack.textBaseline = "alphabetic";
        _oMsgTextBack.lineWidth = 500;

        _oMsgText = new createjs.Text("", "50px " + PRIMARY_FONT, "#ffd800");
        _oMsgText.x = _oMsgTextBack.x;
        _oMsgText.y = _oMsgTextBack.y;
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.lineWidth = 500;

        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible = false;

        _oGroup.addChild(_oBg, _oMsgTextBack, _oMsgText);

        var oParent = this;
        var oSpriteButHome = s_oSpriteLibrary.getSprite("but_home");
        _oButMenu = new CGfxButton(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5 + 180, oSpriteButHome, _oGroup);
        _oButMenu.addEventListener(ON_MOUSE_DOWN, oParent._onExit, this);


        s_oStage.addChild(_oGroup);

        cordova.fireDocumentEvent("show_interlevel_ad");

    };

    this.unload = function() {

    };

    this.show = function(iShot, iTime, iLv) {
        _oMsgTextBack.text = TEXT_ALL_COMPLETE;
        _oMsgText.text = TEXT_ALL_COMPLETE;

        _oGroup.visible = true;


        createjs.Tween.get(_oGroup).to({
            alpha: 1
        }, 500);

        createjs.Tween.get(_oFade).to({
            alpha: 0.7
        }, 500);
    };



    this._onExit = function() {
        s_oStage.removeChild(_oGroup);
        _oButMenu.unload();
        _oButMenu = null;


        s_oGame.onExit();
    };

    this._init(oSpriteBg);

    return this;
}
