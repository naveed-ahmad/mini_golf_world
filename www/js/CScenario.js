function CScenario(iLevel) {
    var _oWorld;
    var _oGroundMaterial;
    var _oBallMaterial;
    var _oWallMaterial;
    var _oBallShape;
    var _oBallBody;
    var _oBallMesh;
    var _oHolePosition;
    var _oFieldMesh;
    var _oFieldBody;
    var _aBigSandBody;
    var _aBigSandMesh;
    var _aBigSandPosition;
    var _aWaterBody;
    var _aHoleBody;

    var _bTerrainCollision;

    var _iCurSandCollisionID;
    var _iCurWaterCollisionID;
    var _iCurHoleCollisionID;
    var _iTimeStep;

    if (SHOW_3D_RENDER)
        var _oDemo = new CANNON.Demo();


    this.getDemo = function() {
        return _oDemo;
    };

    this._GamesLab_init = function() {
        _iTimeStep = 1 / 60;

        _iCurSandCollisionID = null;
        _iCurWaterCollisionID = null;
        _iCurHoleCollisionID = null;

        _aBigSandBody = new Array();
        _aWaterBody = new Array();
        _aHoleBody = new Array();


        if (SHOW_3D_RENDER) {
            _oWorld = _oDemo.getWorld();
        } else {
            _oWorld = new CANNON.World();
        }

        //_oWorld.gravity.set(0, 0, -9.81);
        _oWorld.gravity.set(0, 0, -98.1);
        //_oWorld.gravity.set(0, 0, -180.1);
        _oWorld.broadphase = new CANNON.NaiveBroadphase();
        _oWorld.solver.iterations = 10;

        _oGroundMaterial = new CANNON.Material();
        _oBallMaterial = new CANNON.Material();
        _oWallMaterial = new CANNON.Material();



        var ball_basket_cm = new CANNON.ContactMaterial(
            _oBallMaterial, _oWallMaterial, {
                friction: 0.0,
                restitution: 0.4,
                contactEquationStiffness: 1e8,
                contactEquationRelaxation: 3,
                frictionEquationStiffness: 1e8,
                frictionEquationRegularizationTime: 3
            });

        _oWorld.addContactMaterial(ball_basket_cm);

        _aBigSandMesh = new Array();
        _aBigSandPosition = new Array();

        // s_oScenario._createBallBody();


        //           model FBX
        var manager = new THREE.LoadingManager();
        manager.onProgress = function(item, loaded, total) {
            console.log(item, loaded, total);
        };

        var onProgress = function(xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                //console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        };

        var onError = function(xhr) {};

        var loader = new THREE.FBXLoader(manager);
        var oParent = this;

        loader.load('./models/level_' + iLevel + '.fbx', function(objects) {
            s_oScenario.parseFile(objects);
            s_oGame.scenarioLoaded();
            objects = null;

        }, onProgress, onError);
    };

    this.parseFile = function(oFile) {
        //        console.log(oFile);

        for (var i = 0; i < oFile.children.length; i++) {
            var oMesh = oFile.children[i];

            console.log("oMesh.name: " + oMesh.name);

            if (oMesh.name === "field") {
                s_oScenario._createFieldBody(oMesh);
            } else if (oMesh.name === "ball") {
                s_oScenario._createBallBody(oMesh);
            } else if (oMesh.name === "hole") {
                s_oScenario._createHoleBody(oMesh);
            } else if (oMesh.name === "sand") {
                s_oScenario._createBigSandBody(oMesh);
            } else if (oMesh.name === "water") {
                s_oScenario._createWaterBody(oMesh);
            }
        }
    };

    this._createFieldBody = function(oMesh) {
        _oFieldMesh = this.__extractMeshData(oMesh);

        // Add to compound
        _oFieldBody = new CANNON.Body({
            mass: 0,
            material: _oWallMaterial
        });
        _oFieldBody.addShape(_oFieldMesh);

        var v3IniPos = new CANNON.Vec3(oMesh.position.x, oMesh.position.y, oMesh.position.z);
        _oFieldBody.position.copy(v3IniPos);

        _oFieldBody.addEventListener("collide", function(e) {
            _bTerrainCollision = true;
        });

        // Create bodys
        _oWorld.addBody(_oFieldBody);

        if (SHOW_3D_RENDER)
            _oDemo.addVisual(_oFieldBody);
    };

    this._createBallBody = function(oMesh) {
        _oBallShape = new CANNON.Sphere(BALL_RADIUS);
        _oBallBody = new CANNON.Body({
            mass: BALL_MASS,
            material: _oBallMaterial,
            linearDamping: BALL_LINEAR_DAMPING,
            angularDamping: BALL_LINEAR_DAMPING
        });

        var v3IniPos = new CANNON.Vec3(oMesh.position.x, oMesh.position.y, oMesh.position.z);
        _oBallBody.position.copy(v3IniPos);
        _oBallBody.previousPosition.copy(v3IniPos);

        _oBallBody.addShape(_oBallShape);
        _oWorld.add(_oBallBody);
        if (SHOW_3D_RENDER)
            _oBallMesh = _oDemo.addVisual(_oBallBody);
    };

    this.testPosMesh = function() {
        return _oBallMesh;
    };

    this._createHoleBody = function(oMesh) {

        _oHolePosition = new CANNON.Vec3(oMesh.position.x, oMesh.position.y, oMesh.position.z);

        var oHoleMesh = this.__extractMeshData(oMesh);

        var iID = _aHoleBody.length;

        _aHoleBody.push(new CANNON.Body({
            mass: 0,
            material: _oWallMaterial
        }));

        _aHoleBody[iID].collisionResponse = 0;

        _aHoleBody[iID].ID = iID;
        _aHoleBody[iID].addEventListener("collide", function(e) {
            _iCurHoleCollisionID = e.target.ID;
        });

        _aHoleBody[iID].addShape(oHoleMesh);
        _aHoleBody[iID].position.copy(_oHolePosition);

        _oWorld.add(_aHoleBody[iID]);

        if (SHOW_3D_RENDER)
            _oDemo.addVisual(_aHoleBody[iID], 0xff0000);
    };

    this._createBigSandBody = function(oMesh) {

        var iID = _aBigSandBody.length;

        _aBigSandPosition[iID] = new CANNON.Vec3(oMesh.position.x, oMesh.position.y, oMesh.position.z);

        _aBigSandMesh[iID] = this.__extractMeshData(oMesh);

        _aBigSandBody[iID] = new CANNON.Body({
            mass: 0,
            material: _oWallMaterial
        });

        _aBigSandBody[iID].collisionResponse = 0;

        _aBigSandBody[iID].ID = iID;
        _aBigSandBody[iID].addEventListener("collide", function(e) {
            _iCurSandCollisionID = e.target.ID;
        });

        _aBigSandBody[iID].addShape(_aBigSandMesh[iID]);
        _aBigSandBody[iID].position.copy(_aBigSandPosition[iID]);

        _oWorld.add(_aBigSandBody[iID]);

        if (SHOW_3D_RENDER)
            _oDemo.addVisual(_aBigSandBody[iID], 0xee9700);
    };

    this._createWaterBody = function(oMesh) {


        var oWaterPos = new CANNON.Vec3(oMesh.position.x, oMesh.position.y, oMesh.position.z);
        var oWaterMesh = this.__extractMeshData(oMesh);

        var iID = _aWaterBody.length;

        _aWaterBody.push(new CANNON.Body({
            mass: 0,
            material: _oWallMaterial
        }));

        _aWaterBody[iID].collisionResponse = 0;

        _aWaterBody[iID].ID = iID;
        _aWaterBody[iID].addEventListener("collide", function(e) {
            _iCurWaterCollisionID = e.target.ID;
        });

        _aWaterBody[iID].addShape(oWaterMesh);
        _aWaterBody[iID].position.copy(oWaterPos);

        _oWorld.add(_aWaterBody[iID]);

        if (SHOW_3D_RENDER)
            _oDemo.addVisual(_aWaterBody[iID], 0x0000ff);

    };

    this.__extractMeshData = function(oMesh) {

        var aRawFaces = oMesh.geometry.faces;
        var aRawVerts = oMesh.geometry.vertices;
        var aOnlyFaceCoord = new Array();

        for (var i = 0; i < aRawFaces.length; i++) {
            aOnlyFaceCoord[i] = {
                a: aRawFaces[i].a,
                b: aRawFaces[i].b,
                c: aRawFaces[i].c
            };
        }

        var verts = [],
            faces = [];
        var fScale = 1; //0.5;
        // Get vertices
        for (var i = 0; i < aRawVerts.length; i++) {
            verts.push(aRawVerts[i].x * fScale);
            verts.push(aRawVerts[i].y * fScale);
            verts.push(aRawVerts[i].z * fScale);
        }
        // Get faces
        for (var i = 0; i < aRawFaces.length; i++) {
            faces.push(aRawFaces[i].a);
            faces.push(aRawFaces[i].b);
            faces.push(aRawFaces[i].c);
        }
        // Construct polyhedron
        return new CANNON.Trimesh(verts, faces);
    };

    this.addImpulse = function(oBody, oVec3) {
        var v3WorldPoint = new CANNON.Vec3(0, 0, BALL_RADIUS);
        var v3Impulse = new CANNON.Vec3(oVec3.x, oVec3.y, 0);
        oBody.applyImpulse(v3Impulse, v3WorldPoint);
    };

    this.getBodyVelocity = function(oBody) {
        return oBody.velocity;
    };

    this.ballBody = function() {
        return _oBallBody;
    };

    this.ballMesh = function() {
        return _oBallMesh;
    };

    this.getCamera = function() {
        return _oDemo.camera();
    };

    this.collisionWithBall = function() {
        s_oGame.ballCollision();
    };

    this.setElementVelocity = function(oElement, oVec3) {
        var v3 = new CANNON.Vec3(oVec3.x, oVec3.y, oVec3.z);
        oElement.velocity = v3;
    };

    this.setElementLinearDamping = function(oElement, fValue) {
        oElement.linearDamping = fValue;
    };

    this.setGravity = function(iVal) {
        _oWorld.gravity.set(0, 0, iVal);
    };

    this.update = function() {
        _oWorld.step(_iTimeStep);

        if (_bTerrainCollision) {
            this._checkTerrainCollision();
        }

        if (_iCurSandCollisionID !== null) {
            this._checkSandCollision();
        }
        if (_iCurWaterCollisionID !== null) {
            this._checkWaterCollision();
        }
        if (_iCurHoleCollisionID !== null) {
            this._checkHoleCollision();
        }
    };

    this._checkTerrainCollision = function() {
        for (var i = 0; i < _oWorld.contacts.length; i++) {
            var c = _oWorld.contacts[i];
            if ((c.bi === _oFieldBody && c.bj === _oBallBody) || (c.bi === _oBallBody && c.bj === _oFieldBody)) {
                s_oGame.ballCollideWithTerrain(true);
                return true;
            }
        }
        s_oGame.ballCollideWithTerrain(false);
        _bTerrainCollision = false;
        return false;
    };

    this._checkSandCollision = function() {
        for (var i = 0; i < _oWorld.contacts.length; i++) {
            var c = _oWorld.contacts[i];
            if ((c.bi === _aBigSandBody[_iCurSandCollisionID] && c.bj === _oBallBody) || (c.bi === _oBallBody && c.bj === _aBigSandBody[_iCurSandCollisionID])) {
                s_oGame.ballCollideWithSand(true);
                return true;
            }
        }
        s_oGame.ballCollideWithSand(false);
        _iCurSandCollisionID = null;
        return false;
    };

    this._checkWaterCollision = function() {
        for (var i = 0; i < _oWorld.contacts.length; i++) {
            var c = _oWorld.contacts[i];
            if ((c.bi === _aWaterBody[_iCurWaterCollisionID] && c.bj === _oBallBody) || (c.bi === _oBallBody && c.bj === _aWaterBody[_iCurWaterCollisionID])) {
                s_oGame.ballCollideWithWater(true);
                return true;
            }
        }
        s_oGame.ballCollideWithWater(false);
        _iCurWaterCollisionID = null;
        return false;
    };

    this._checkHoleCollision = function() {
        for (var i = 0; i < _oWorld.contacts.length; i++) {
            var c = _oWorld.contacts[i];
            if ((c.bi === _aHoleBody[_iCurHoleCollisionID] && c.bj === _oBallBody) || (c.bi === _oBallBody && c.bj === _aHoleBody[_iCurHoleCollisionID])) {
                s_oGame.ballCollideWithHole(true);
                return true;
            }
        }
        s_oGame.ballCollideWithHole(false);
        _iCurHoleCollisionID = null;
        return false;
    };

    this.getHolePosition = function() {
        return _oHolePosition;
    };

    this.getAllBigSandsPosition = function() {
        return _aBigSandPosition;
    };

    this.getBigSandPositionByID = function(iID) {
        return _aBigSandPosition[iID];
    };

    this.getWorld = function() {
        return _oWorld;
    };

    this.getField = function() {
        return _oFieldBody;
    };

    s_oScenario = this;

    if (SHOW_3D_RENDER) {
        _oDemo.addScene("Test", this._GamesLab_init);
        _oDemo.start();
    } else {
        this._GamesLab_init();
    }
}

var s_oScenario;
