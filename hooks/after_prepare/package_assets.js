#!/usr/bin/env node

/*jshint latedef:nofunc, node:true*/

var path = require('path');
var fs = require('fs');
var xml2js = require('xml2js');

var concatFiles = require('concat');

// cordova-uglify module dependencies
var UglifyJS = require("uglify-js");

//var UglifyJS = require ( 'uglify-js2' );
var domprops = require("uglify-js/tools/domprops");
var CleanCSS = require('clean-css');

// Process
var rootDir = process.argv[2];
var platformPath = path.join(rootDir, 'platforms');
var platforms = process.env.CORDOVA_PLATFORMS.split(',');
var cliCommand = process.env.CORDOVA_CMDLINE;

// Hook configuration
var configFilePath = path.join(rootDir, 'hooks/uglify-config.json');
var hookConfig = JSON.parse(fs.readFileSync(configFilePath));
var isRelease = hookConfig.alwaysRun || (cliCommand.indexOf('--release') > -1);
var recursiveFolderSearch = hookConfig.recursiveFolderSearch; // set this to false to manually indicate the folders to process
var foldersToProcess = hookConfig.foldersToProcess; // add other www folders in here if needed (ex. js/controllers)
var cssMinifier = new CleanCSS(hookConfig.cleanCssOptions);

var noop = function () {

}


function loadConfigXMLDoc(filePath) {
  var json = "";
  try {
    var fileData = fs.readFileSync(filePath, 'ascii');
    var parser = new xml2js.Parser();
    parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
      //console.log("config.xml as JSON", JSON.stringify(result, null, 2));
      json = result;
    });
    console.log("File '" + filePath + "' was successfully read.");
    return json;
  } catch (ex) {
    console.log(ex)
  }
}

function replaceVersion(source, wwwPath) {
  var configXMLPath = "config.xml";
  var rawJSON = loadConfigXMLDoc(configXMLPath);
  var version = rawJSON.widget.$.version;
  var to_replace = "__APP_VERSION__";

  console.log("===========> APP VERSION IS ", version);

  var result = source.replace(new RegExp(to_replace, "g"), version);

  fs.writeFileSync(path.join(wwwPath, "js", "bundle.js"), result, 'utf8');
}

// Run uglifier
run();

/**
 * Run compression for all specified platforms.
 * @return {undefined}
 */
function run() {
  platforms.forEach(function (platform) {
    var wwwPath;

    switch (platform) {
      case 'android':
        wwwPath = path.join(platformPath, platform, 'app', 'src', 'main', 'assets', 'www');
        break;

      case 'ios':
        wwwPath = path.join(platformPath, platform, 'www');
      case 'browser':
        wwwPath = path.join(platformPath, platform, 'www');
        break;
      case 'wp8':
      case 'windows':
        wwwPath = path.join(platformPath, platform, 'www');
        break;

      default:
        console.log('this hook only supports android, ios, wp8, windows, and browser currently');
        return;
    }

    concatGameFiles(wwwPath);
  });
}

function concatGameFiles(wwwPath) {
  var game_js_files = [
    path.join ( wwwPath, "js","ctl_utils.js"),
    path.join ( wwwPath, "js","CMotivationalText.js"),
    path.join ( wwwPath, "js","sprite_lib.js"),
    path.join ( wwwPath, "js","settings.js"),
    path.join ( wwwPath, "js","levelSettings.js"),
    path.join ( wwwPath, "js","CLocalStorage.js"),
    path.join ( wwwPath, "js","CTweenController.js"),
    path.join ( wwwPath, "js","CRollingTextController.js"),
    path.join ( wwwPath, "js","adsHelper.js"),
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

  var reserved = [];//domprops.concat("addChild,removeChild,resize,extend,promote,indexOf,Event,EventDispatcher,Ticker,UID,MouseEvent,Matrix2D,DisplayProps,Point,Rectangle,ButtonHelper,Shadow,SpriteSheet,Graphics,DisplayObject,Container,Stage,Bitmap,Sprite,Shape,Text,BitmapText,MovieClip,SpriteSheetUtils,SpriteSheetBuilder,DOMElement,Filter,BlurFilter,AlphaMapFilter,AlphaMaskFilter,ColorFilter,ColorMatrix,ColorMatrixFilter,Touch,EaselJS,PreloadJS,proxy,ErrorEvent,ProgressEvent,DomUtils,DataUtils,LoadItem,RequestUtils,AbstractLoader,AbstractMediaLoader,AbstractRequest,TagRequest,MediaTagRequest,XHRRequest,LoadQueue,TextLoader,BinaryLoader,CSSLoader,ImageLoader,JavaScriptLoader,JSONLoader,JSONPLoader,ManifestLoader,SoundLoader,VideoLoader,SpriteSheetLoader,SVGLoader,XMLLoader,SoundJS,BrowserDetect,PlayPropsConfig,Sound,AbstractSoundInstance,DefaultSoundInstance,AbstractPlugin,WebAudioLoader,WebAudioSoundInstance,WebAudioPlugin,HTMLAudioTagPool,HTMLAudioSoundInstance,HTMLAudioPlugin,Tween,Timeline,Ease,MotionGuidePlugin,TweenJS".split((',')));
  reserved = reserved.concat(['Object','s_aLevels',  'getContext', 'body', 'removeChild', 'createElement', 'jQuery', '$', 'addEventListener', 'enableMouseOver', 'css', 'navigator', 'userAgent', 'vendor', 'opera', 'devMode', 'state', 'applicationId', 'ga', 'trackEvent', 'plugins', 'firebase', 'analytics', 'logEvent', 'interstitial', 'banner', 'platformId', 'admob', 'rewardVideo', 'load', 'jQuery', 'reward', 'hint', 'stars', 'unlocked', 'notify', 'on', 'fadeIn', 'mute', 'volume', 'cordova', 'fireDocumentEvent', 'admob', 'interstitial', 'banner']);

  uglifyJsOptions = {
    "compress": {
      "drop_console": true,
      "drop_debugger": true,
      "unused": true,
      "passes": 2,
      "toplevel": true
    },
    mangle: {
      reserved: reserved,
      "toplevel": true,
      "properties": {
        reserved: reserved,
        regex: /_GamesLab/
      },
    },
    "nameCache": {},
    "output": {
      "code": true
    },
    "warnings": false
  };

  uglifyJsOptionsNoMangle = {
    "compress": {
      "drop_console": true,
      "drop_debugger": true,
      "unused": false,
      "passes": 2,
      "toplevel": true,
    },
    "nameCache": {},
    "output": {
      "code": true
    },
    "warnings": false
  };

  console.info("concating js files ====================>>>>>>>>>>>");

  concatFiles(game_js_files).then(function (source) {
    var result;
    result = UglifyJS.minify(source, uglifyJsOptions);

    if (isRelease)
      replaceVersion(result.code, wwwPath)
    //fs.writeFileSync(path.join(wwwPath, "js", "bundle.js"), result.code, 'utf8', noop);
    else
      replaceVersion(source, wwwPath)

    for (i = 0; i < game_js_files.length; i++) {
      console.log('removing js file from build ' + game_js_files[i]);
      fs.unlink(game_js_files[i], noop);
    }
    concatStyles(wwwPath);
  });
}

function concatStyles(wwwPath) {
  var css_files = [
    path.join(wwwPath, "css", "main.css"),
    path.join(wwwPath, "css", "reset.css"),
  ];

  concatFiles(css_files).then(function (source) {
    var result;
    if (isRelease) {
      result = cssMinifier.minify(source).styles;
      fs.writeFileSync(path.join(wwwPath, "css", "bundle.css"), result, 'utf8', noop);

      css_files.forEach(function (file) {
        console.log('removing css file from build ' + file);
        fs.unlink(file, noop);
      });
    } else {
      result = source;
      fs.writeFileSync(path.join(wwwPath, "css", "bundle.css"), result, 'utf8', noop);
    }

  });

  processProjectFiles(wwwPath);
}

function processProjectFiles(wwwPath) {
  processFile(path.join(wwwPath, "index.html"));
  if (isRelease) {
    // fs.unlink(path.join(wwwPath, "index_dev.html"));
  }
}

function processFile(file) {
  console.info("processing file", file);

  fs.stat(file, function (err, stat) {
    if (err) {
      console.log('file process error: ' + err);

      return;
    }

    if (stat.isFile()) {
      compress(file);

      return;
    }
  });
}

/**
 * Compresses file.
 * @param  {string} file - File path
 * @return {undefined}
 */
function compress(file) {
  var ext = path.extname(file),
      res,
      source,
      result;

  switch (ext) {
    case '.css':
      console.log('minifying css file ' + file);
      try {
        source = fs.readFileSync(file, 'utf8');
        result = cssMinifier.minify(source);
        fs.writeFileSync(file, result.styles, 'utf8', noop); // overwrite the original unminified file
      } catch (e) {
        console.error("error", e);
      }
      break;
    case '.html':
      console.log('minifying html file ' + file);
      var minify = require('html-minifier').minify;
      source = fs.readFileSync(file, 'utf8');
      var result = minify(source, {
        removeAttributeQuotes: true,
        trimCustomFragments: true,
        removeRedundantAttributes: true,
        removeComments: true,
        collapseWhitespace: true
      });
      fs.writeFileSync(file, result, 'utf8', noop); // overwrite the original unminified file
      break;
    default:
      console.log('encountered a ' + ext + ' file, not compressing it');
      break;
  }
}