#!/usr/bin/env node

/*jshint latedef:nofunc, node:true*/

// Modules

var concatFiles = require ( 'concat' );
var fs = require ( 'fs' );
var path = require ( 'path' );
var dependencyPath = path.join ( process.cwd (), 'node_modules' );
// cordova-uglify module dependencies
var UglifyJS = require ( path.join ( dependencyPath, 'uglify-js' ) );

//var UglifyJS = require ( 'uglify-js2' );
const domprops = require ( path.join ( dependencyPath, 'uglify-js/tools/domprops' ) );// require ( "uglify-js2/tools/domprops" )

var CleanCSS = require ( path.join ( dependencyPath, 'clean-css' ) );
 
// Process

var rootDir = process.argv[ 2 ];
var platformPath = path.join ( rootDir, 'platforms' );

var platforms = process.env.CORDOVA_PLATFORMS.split ( ',' );
var cliCommand = process.env.CORDOVA_CMDLINE;

// Hook configuration
var configFilePath = path.join ( rootDir, 'hooks/uglify-config.json' );
var hookConfig = JSON.parse ( fs.readFileSync ( configFilePath ) );
var isRelease = hookConfig.alwaysRun || (cliCommand.indexOf ( '--release' ) > - 1);
var cssMinifier = new CleanCSS ( hookConfig.cleanCssOptions );

// Run uglifier
run ();

/**
 * Run compression for all specified platforms.
 * @return {undefined}
 */
function run () {
  platforms.forEach ( function ( platform ) {
    var wwwPath;

    switch (platform) {
      case 'android':
        wwwPath = path.join ( platformPath, platform, 'app', 'src', 'main', 'assets', 'www' );
        break;

      case 'ios':
      case 'browser':
        wwwPath = path.join ( platformPath, platform, 'www' );
        break;
      case 'wp8':
      case 'windows':
        wwwPath = path.join ( platformPath, platform, 'www' );
        break;

      default:
        console.log ( 'this hook only supports android, ios, wp8, windows, and browser currently' );
        return;
    }

    concatGameFiles ( wwwPath );
  } );
}
function concatGameFiles ( wwwPath ) {
  var game_js_files = [
    path.join ( wwwPath, "js","createjs.min.js"),
    path.join ( wwwPath, "js","howler.min.js"),
    path.join ( wwwPath, "js","eventHelper.js"),
    path.join ( wwwPath, "js","ctl_utils.js"),
    path.join ( wwwPath, "js","sprite_lib.js"),
    path.join ( wwwPath, "js","settings.js"),
    path.join ( wwwPath, "js","levelSettings.js"),
    path.join ( wwwPath, "js","CLocalStorage.js"),
    path.join ( wwwPath, "js","CTweenController.js"),
    path.join ( wwwPath, "js","CRollingTextController.js"),
    path.join ( wwwPath, "js","CLang.js"),
    path.join ( wwwPath, "js","CPreloader.js"),
    path.join ( wwwPath, "js","CLoadingScreen.js"),
    path.join ( wwwPath, "js","CMain.js"),
    path.join ( wwwPath, "js","CTextButton.js"),
    path.join ( wwwPath, "js","CToggle.js"),
    path.join ( wwwPath, "js","CGfxButton.js"),
    path.join ( wwwPath, "js","CMenu.js"),
    path.join ( wwwPath, "js","CGame.js"),
    path.join ( wwwPath, "js","CInterface.js"),
    path.join ( wwwPath, "js","CCreditsPanel.js"),
    path.join ( wwwPath, "js","CHelpPanel.js"),
    path.join ( wwwPath, "js","CEndPanel.js"),
    path.join ( wwwPath, "js","CAreYouSurePanel.js"),
    path.join ( wwwPath, "js","CAchievementStars.js"),
    path.join ( wwwPath, "js","CLevelCompletePanel.js"),
    path.join ( wwwPath, "js","cannon.js"),
    path.join ( wwwPath, "js","CLevelMenu.js"),
    path.join ( wwwPath, "js","CLevelBut.js"),
    path.join ( wwwPath, "js","CBall.js"),
    path.join ( wwwPath, "js","CScenario.js"),
    path.join ( wwwPath, "js","Three.js"),
    path.join ( wwwPath, "js","Detector.js"),
    path.join ( wwwPath, "js","smoothie.js"),
    path.join ( wwwPath, "js","Stats.js"),
    path.join ( wwwPath, "js","TrackballControls.js"),
    path.join ( wwwPath, "js","dat.gui.js"),
    path.join ( wwwPath, "js","FBXLoader.js"),
    path.join ( wwwPath, "js","CanvasRenderer.js"),
    path.join ( wwwPath, "js","SoftwareRenderer.js"),
    path.join ( wwwPath, "js","Projector.js"),
    path.join ( wwwPath, "js","OBJLoader.js"),
    path.join ( wwwPath, "js","CVector2.js"),
    path.join ( wwwPath, "js","CBackground.js"),
    path.join ( wwwPath, "js","index.js")
  ];


  console.info(game_js_files);
  var reserved = domprops.concat ( "extend,promote,indexOf,Event,EventDispatcher,Ticker,UID,MouseEvent,Matrix2D,DisplayProps,Point,Rectangle,ButtonHelper,Shadow,SpriteSheet,Graphics,DisplayObject,Container,Stage,Bitmap,Sprite,Shape,Text,BitmapText,MovieClip,SpriteSheetUtils,SpriteSheetBuilder,DOMElement,Filter,BlurFilter,AlphaMapFilter,AlphaMaskFilter,ColorFilter,ColorMatrix,ColorMatrixFilter,Touch,EaselJS,PreloadJS,proxy,ErrorEvent,ProgressEvent,DomUtils,DataUtils,LoadItem,RequestUtils,AbstractLoader,AbstractMediaLoader,AbstractRequest,TagRequest,MediaTagRequest,XHRRequest,LoadQueue,TextLoader,BinaryLoader,CSSLoader,ImageLoader,JavaScriptLoader,JSONLoader,JSONPLoader,ManifestLoader,SoundLoader,VideoLoader,SpriteSheetLoader,SVGLoader,XMLLoader,SoundJS,BrowserDetect,PlayPropsConfig,Sound,AbstractSoundInstance,DefaultSoundInstance,AbstractPlugin,WebAudioLoader,WebAudioSoundInstance,WebAudioPlugin,HTMLAudioTagPool,HTMLAudioSoundInstance,HTMLAudioPlugin,Tween,Timeline,Ease,MotionGuidePlugin,TweenJS".split ( (',') ) );
  reserved = reserved.concat ( [ 'mute', 'volume' ] );

  uglifyJsOptions = {
    "compress": {
      "drop_console": true,
      "drop_debugger": true,
      "unused": false,
      "passes": 2,
      "toplevel": true
    },
    mangle: {
      reserved: reserved,
      "toplevel": true,
      "properties": {
        reserved: reserved,
        regex: /_GamesLab/
      }
    },
    "nameCache": {},
    "output": {
      "code": true
    },
    "warnings": false
  };

  console.info ( "concating js files ====================>>>>>>>>>>>" );

  concatFiles ( game_js_files ).then ( function ( source ) {
    var result;
    if (isRelease) {
      result = UglifyJS.minify ( source, uglifyJsOptions );

      fs.writeFileSync ( path.join ( wwwPath, "js", "bundle.min.js" ), result.code, 'utf8' );

      fs.writeFileSync ( path.join ( wwwPath, "js", "bundle.js" ), result.code, 'utf8' );

      game_js_files.forEach ( function ( file ) {
        console.log ( 'removing js file from build ' + file );
        fs.unlink ( file );
      } );
      concatStyles ( wwwPath );
    } else {
      result = source;
      fs.writeFileSync ( path.join ( wwwPath, "js", "bundle.js" ), source, 'utf8' );
      concatStyles ( wwwPath );
    }
  });
}

function concatStyles ( wwwPath ) {
  var css_files = [
    path.join ( wwwPath, "css", "main.css" ),
    path.join ( wwwPath, "css", "reset.css" ),
  ];

  concatFiles ( css_files ).then ( function ( source ) {
    var result;
    if (isRelease) {
      result = cssMinifier.minify ( source ).styles;
      fs.writeFileSync ( path.join ( wwwPath, "css", "bundle.css" ), result, 'utf8' );

      css_files.forEach ( function ( file ) {
        console.log ( 'removing css file from build ' + file );
        fs.unlink ( file );
      } );
    }
    else {
      result = source;
      fs.writeFileSync ( path.join ( wwwPath, "css", "bundle.css" ), result, 'utf8' );
    }

  });

  processProjectFiles ( wwwPath );
}

function processProjectFiles ( wwwPath ) {
  processFile ( path.join ( wwwPath, "index.html" ) );
  if (isRelease) {
    fs.unlink ( path.join ( wwwPath, "index_dev.html" ) );
  }
}

function processFile ( file ) {
  console.info ( "processing file", file );

  fs.stat ( file, function ( err, stat ) {
    if (err) {
      console.log ( 'file process error: ' + err );

      return;
    }

    if (stat.isFile ()) {
      compress ( file );

      return;
    }
  } );
}

/**
 * Compresses file.
 * @param  {string} file - File path
 * @return {undefined}
 */
function compress ( file ) {
  var ext = path.extname ( file ),
    res,
    source,
    result;

  switch (ext) {
    case '.css':
      console.log ( 'minifying css file ' + file );
      try {
        source = fs.readFileSync ( file, 'utf8' );
        result = cssMinifier.minify ( source );
        fs.writeFileSync ( file, result.styles, 'utf8' ); // overwrite the original unminified file
      } catch (e) {
        console.error ( "error", e );
      }
      break;
    case '.html':
      console.log ( 'minifying html file ' + file );
      var minify = require ( 'html-minifier' ).minify;
      source = fs.readFileSync ( file, 'utf8' );
      var result = minify ( source, {
        removeAttributeQuotes: true,
        trimCustomFragments: true,
        removeRedundantAttributes: true,
        removeComments: true,
        collapseWhitespace: true
      } );
      fs.writeFileSync ( file, result, 'utf8' ); // overwrite the original unminified file
      break;
    default:
      console.log ( 'encountered a ' + ext + ' file, not compressing it' );
      break;
  }
}
