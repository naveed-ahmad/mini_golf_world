function CGfxButton(iXPos, iYPos, oSprite, oParentContainer) {

    var _bScalable;
    var _bDisabled;

    var _aCbCompleted;
    var _aCbOwner;
    var _oButton;
    var _oParent
    var _oTween;

    this._GamesLab_init = function(iXPos, iYPos, oSprite, oParentContainer) {
        _bDisabled = false;
        _bScalable = true;

        _aCbCompleted = new Array();
        _aCbOwner = new Array();

        _oButton = createBitmap(oSprite);
        _oButton.x = iXPos;
        _oButton.y = iYPos;

        _oButton.regX = oSprite.width / 2;
        _oButton.regY = oSprite.height / 2;

        if (!s_bMobile)
            _oButton.cursor = "pointer";

        oParentContainer.addChild(_oButton);


        this._GamesLab_initListener();
    };

    this.unload = function() {
        _oButton.off("mousedown", this.buttonDown);
        _oButton.off("pressup", this.buttonRelease);

        oParentContainer.removeChild(_oButton);
    };

    this.setVisible = function(bVisible) {
        _oButton.visible = bVisible;
    };

    this.setCursorType = function(szValue) {
        _oButton.cursor = szValue;
    };

    this._GamesLab_initListener = function() {
        _oButton.on("mousedown", this.buttonDown);
        _oButton.on("pressup", this.buttonRelease);
    };

    this.addEventListener = function(iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.buttonRelease = function() {
        if (_bDisabled) {
            return;
        }

        if (_bScalable) {
            _oButton.scaleX = 1;
            _oButton.scaleY = 1;
        } else {
            new createjs.Tween.get(_oButton).to({
                y: _oButton.y - 50
            }, 100);
        }


        playSound("click", 1, 0);

        if (_aCbCompleted[ON_MOUSE_UP]) {
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP]);
        }
    };

    this.buttonDown = function() {
        if (_bDisabled) {
            return;
        }

        if (_bScalable) {
            _oButton.scaleX = 0.9;
            _oButton.scaleY = 0.9;
        } else {
            new createjs.Tween.get(_oButton).to({
                y: _oButton.y + 50
            }, 100);
        }

        if (_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
        }
    };

    this.pulseAnimation = function() {
        _oTween = createjs.Tween.get(_oButton).to({
            scaleX: 0.9,
            scaleY: 0.9
        }, 850, createjs.Ease.quadOut).to({
            scaleX: 1,
            scaleY: 1
        }, 650, createjs.Ease.quadIn).call(function() {
            _oParent.pulseAnimation();
        });
    };

    this.trembleAnimation = function() {
        _oTween = createjs.Tween.get(_oButton).to({
            rotation: 2
        }, 75, createjs.Ease.quadOut).to({
            rotation: -2
        }, 140, createjs.Ease.quadIn).to({
            rotation: 0
        }, 75, createjs.Ease.quadIn).wait(750).call(function() {
            _oParent.trembleAnimation();
        });
    };

    this.setPosition = function(iXPos, iYPos) {
        _oButton.x = iXPos;
        _oButton.y = iYPos;
    };

    this.setX = function(iXPos) {
        _oButton.x = iXPos;
    };

    this.setY = function(iYPos) {
        _oButton.y = iYPos;
    };

    this.setScalable = function(bVal) {
        _bScalable = bVal;
    };

    this.getButtonImage = function() {
        return _oButton;
    };

    this.getX = function() {
        return _oButton.x;
    };

    this.getY = function() {
        return _oButton.y;
    };

    this.setClickable = function(bVal) {
        _bDisabled = !bVal;
    };

    this._GamesLab_init(iXPos, iYPos, oSprite, oParentContainer);

    _oParent = this;
    return this;
}
