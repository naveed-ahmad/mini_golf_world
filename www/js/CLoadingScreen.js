function CLoadingScreen(oParentContainer) {

    var _oFadeLoading = null;
    var _oLoadingText;
    var _oLoadingAnim;
    var _oContainer;
    var _oParentContainer = oParentContainer;

    this._init = function() {

        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);

        _oFadeLoading = new createjs.Shape();
        _oFadeLoading.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFadeLoading.on("click", function() {});

        _oContainer.addChild(_oFadeLoading);

        _oLoadingText = new createjs.Text(TEXT_LOADING, "30px " + PRIMARY_FONT, "#ffffff");
        _oLoadingText.x = CANVAS_WIDTH / 2;
        _oLoadingText.y = CANVAS_HEIGHT / 2;
        _oLoadingText.textAlign = "center";
        _oLoadingText.textBaseline = "alphabetic";
        _oLoadingText.alpha = 0;
        _oContainer.addChild(_oLoadingText);


        var oSpriteLoadingAnim = s_oSpriteLibrary.getSprite("preloader_anim");
        _oLoadingAnim = createBitmap(oSpriteLoadingAnim);
        _oLoadingAnim.x = CANVAS_WIDTH / 2;
        _oLoadingAnim.y = CANVAS_HEIGHT / 2 + 40;
        _oLoadingAnim.regX = oSpriteLoadingAnim.width * 0.5;
        _oLoadingAnim.regY = oSpriteLoadingAnim.height * 0.5;
        _oLoadingAnim.alpha = 0;
        _oContainer.addChild(_oLoadingAnim);

        createjs.Tween.get(_oLoadingAnim).to({
            alpha: 1
        }, 500);
        createjs.Tween.get(_oLoadingText).to({
            alpha: 1
        }, 500);

        this.animLoad();
    };

    this.animLoad = function() {
        var oParent = this;

        createjs.Tween.get(_oLoadingAnim).to({
            rotation: _oLoadingAnim.rotation + 360
        }, 1000).call(function() {
            oParent.animLoad();
        });
    };

    this.unload = function() {
        _oFadeLoading.removeAllEventListeners();

        createjs.Tween.get(_oContainer).to({
            alpha: 0
        }, 500).call(function() {
            _oParentContainer.removeChild(_oContainer);
        });
    };

    this._init();

    return this;
}