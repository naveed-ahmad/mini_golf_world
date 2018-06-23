var admobid = { // for Android
  pub_id: "ca-app-pub-5477538004615349~2840745987",
  banner: "ca-app-pub-5477538004615349/7332447346",
  interstitial: "ca-app-pub-5477538004615349/1144520930",
  rewardvideo: "ca-app-pub-5477538004615349/4131568938",
  intersitialVideo: "ca-app-pub-5477538004615349/1144520930"
};

var adsInitialized = false;
var bannerShown = false;
var adFailedRetry = 0;
var adFailedRetryLimit = 3;


function prepareAdmobInterstitial ( autoShow ) {
  return;
  var iRand = Math.floor ( Math.random () * 100 );
  var adId;

  if (iRand > 90)
    adId = admobid.intersitialVideo;
  else
    adId = admobid.interstitial;

  setTimeout ( function () {
    AdMob.prepareInterstitial ( {
      adId: adId,
      autoShow: ! ! autoShow
    } );
  }, 1000 );
}

function initAdMobFreeAds () {
  if (adsInitialized) return;

  document.addEventListener ( 'onAdFailLoad', function ( e ) {
    // ad loading failed, maybe init adcolony or something
    if (typeof e.originalEvent !== 'undefined') e = e.originalEvent;
    var data = e.data || e;
    logFireBaseEvent ( 'onAdFailLoad', data );

    if (data.adType === 'rewardvideo') {

    } else if (data.adType === 'interstitial') {
      adFailedRetry ++;

      if (adFailedRetry < adFailedRetryLimit) {
        try {
          prepareAdmobInterstitial ();
        } catch (e) {
        }


      }
    }
  } );

  document.addEventListener ( 'onAdDismiss', function ( e ) {

    if (typeof e.originalEvent !== 'undefined') e = e.originalEvent;
    var data = e.data || e;
    logFireBaseEvent ( 'onAdDismiss', data );

    if (data.adType === 'interstitial') {
      try {
        prepareAdmobInterstitial ();
      } catch (e) {
      }
    }
  } );

  try {
    prepareAdmobInterstitial ( false );
  } catch (e) {
  }
  adsInitialized = true;
}

function _Gameslab_initAds () {
  setTimeout ( function () {
    initAdMobFreeAds ();
  }, 100 );
}

function _GamesLabs_showRewardVideo () {
  AdMob.prepareRewardVideoAd ( {
    adId: admobid.rewardvideo,
    autoShow: true
  } );
}

function _GamesLab_hideBanner () {
  if (bannerShown) {
    bannerShown = false;
    AdMob.hideBanner ();
  }
}

function _Gameslab_showBannerAd () {
  if (bannerShown)
    return;
  logFireBaseEvent ( 'show banner' );

  setTimeout ( function () {
    AdMob.createBanner ( {
      adId: admobid.banner,
      position: AdMob.AD_POSITION.TOP_CENTER,
      autoShow: true,
      overlap: true,
      success: function () {
        bannerShown = true;
        logFireBaseEvent ( 'show banner success' );
      },
      error: function () {
        logFireBaseEvent ( 'show banner failed' );
      }
    } );
  }, 100 )

}

function _GamesLabs_showInterstitialAd () {
  // check and show it at end of a game level
  logFireBaseEvent ( 'show InterstitialAd' );

  AdMob.isInterstitialReady ( function ( isready ) {
    if (isready)
      AdMob.showInterstitial ();
    else
      prepareAdmobInterstitial ( true );
  } );

}

document.addEventListener ( "start_session", function ( evt ) {
  if (adsInitialized) {
    logFireBaseEvent ( 'start_session' );

    prepareAdmobInterstitial ();
  }
  else
    _Gameslab_initAds ();
} );

document.addEventListener ( "show_banner", function ( evt ) {
  try {
    _Gameslab_showBannerAd ();
  } catch (e) {
  }
} );

document.addEventListener ( "hide_banner", function ( evt ) {
  setTimeout ( function () {
    try {
      _GamesLab_hideBanner ();

    } catch (e) {
    }
  }, 10000 );
} );


document.addEventListener ( "show_interlevel_ad", function ( evt ) {
  try {
    _GamesLabs_showInterstitialAd ();

  } catch (e) {
  }
} );

function shareResults ( score, level ) {
  return;
  //no share for now
  s_oStage.cache ( 0, 0, 768, 1280 );
  var dataURI = s_oStage.cacheCanvas.toDataURL ( "image/jpeg", 0.5 );
  dataURI = dataURI.replace ( 'data&colon;image/png;base64,', '' );
  s_oStage.uncache ();

  var title = "Of GamesLabAdventure game";
  var message = "https://play.google.com/store/apps/details?id=com.gameslab.piratesadventure #piratesadventure"

  var options = {
    message: message.replace ( 'L_NUMBER', level ).replace ( 'SCORE', score ), // not supported on some apps (Facebook, Instagram)
    subject: title.replace ( 'L_NUMBER', level ), // fi. for email
    files: [ dataURI ], // an array of filenames either locally or remotely
    url: 'https://play.google.com/store/apps/details?id=com.gameslab.piratesadventure',
    chooserTitle: "Select app" // Android only, you can override the default share sheet title
  }

  var onSuccess = function ( result ) {
    delete dataURI;
    dataURI = null;
    logFireBaseEvent ( 'share_success', { completed: result.completed, app: result.app } );
  }

  var onError = function ( msg ) {
    delete dataURI;
    dataURI = null;
    logFireBaseEvent ( 'share_eror', { error: msg } );
  }

  try {
    window.plugins.socialsharing.shareWithOptions ( options, onSuccess, onError );
  } catch (e) {
    console.error ( e );
  }
}

document.addEventListener ( "share_event", function ( evt ) {
  shareResults ( evt.score, evt.level );
} );


function logFireBaseEvent ( name, data ) {
  try {
    cordova.plugins.firebase.analytics.logEvent ( name, data );
  } catch (e) {
    console.error ( e );
  }
}

function setCurrentScreen ( name ) {
  try {
    cordova.plugins.firebase.analytics.setCurrentScreen ( name );

  } catch (e) {
  }
}
