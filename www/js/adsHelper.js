/*
cordova plugin add cordova-admob-plus --variable APP_ID_ANDROID=ca-app-pub-5477538004615349~2840745987 --variable APP_ID_IOS=ca-app-pub-5477538004615349~2840745987
 */

var adCounter = 1;
var adsInitialized = false;
var rewardAdReady = false;
var adFailedRetry = 0;
var adFailedRetryLimit = 2;
var bannerShown = false;

var AD_KEYS = {
    appId: "ca-app-pub-5477538004615349~2840745987",
    banner: {
        android: "ca-app-pub-5477538004615349/7332447346"
    },
    interstitial: {
        android: "ca-app-pub-5477538004615349/1144520930",
        ios: "ca-app-pub-5477538004615349/3680347681"
    },
    rewarded: {
        // replace with your ad unit IDs
        android: "ca-app-pub-5477538004615349/4131568938",
        ios: "ca-app-pub-5477538004615349/4214538452"
    }
}

function loadInterstitial() {
    try {
        admob.interstitial.isLoaded().then(function (loaded) {
            if (loaded) {
                return
            } else {
                admob.interstitial.load({
                    id: AD_KEYS.interstitial
                })
            }
        })
    } catch (e) {
        admob.interstitial.load({
            id: AD_KEYS.interstitial
        })
    }
}

function loadAndShowInterstitial() {
    admob.interstitial.load({
        id: AD_KEYS.interstitial
    }).then(function () {
        adFailedRetry = 0;
        admob.interstitial.show({id: AD_KEYS.interstitial});
    });
}

function prepareAdmobInterstitial(autoShow) {
    if (autoShow) {
        try {
            admob.interstitial.isLoaded().then(function (loaded) {
                if (loaded) {
                    admob.interstitial.show({id: AD_KEYS.interstitial});
                } else {
                    loadAndShowInterstitial()
                }
            })
        } catch (e) {
            loadAndShowInterstitial()
        }
    } else {
        loadInterstitial()
    }
}

function initAdMobFreeAds() {
    //admob.setDevMode(true);
    admob.state.applicationId = AD_KEYS.appId;

    document.addEventListener('admob.interstitial.close', function () {
        adFailedRetry = 0;
    });

    document.addEventListener('admob.interstitial.load_fail', function () {
        setTimeout(function () {
            adFailedRetry++;
            if (adFailedRetry < adFailedRetryLimit)
                prepareAdmobInterstitial();
        }, 5000);
    });

    adsInitialized = true;
}

function _Gameslab_initAds() {
    initAdMobFreeAds();
}

function _GamesLabs_showRewardVideo() {
    admob.rewardVideo.load({
        id: AD_KEYS.rewarded
    }).then(function () {
        return admob.rewardVideo.show();
    });
}

function _GamesLab_hideBanner() {
    admob.banner.hide(
        {
            id: AD_KEYS.banner
        }
    );

    bannerShown = false;
}


function _Gameslab_showBannerAd() {
    if (!adsInitialized)
        _Gameslab_initAds();

    try {
        admob.banner.show({
            id: AD_KEYS.banner
        });

    } catch (e) {
        console.error(e);
    }
}

function _GamesLabs_showInterstitialAd() {
    if (!adsInitialized) {
        _Gameslab_initAds();
    }

    try {
        prepareAdmobInterstitial(true);
    } catch (e) {
        console.error(e);
    }
}

document.addEventListener("start_session", function (evt) {
    if (adsInitialized)
        return;
    else
        _Gameslab_initAds();
});

document.addEventListener("show_banner", function (evt) {
    _Gameslab_showBannerAd();
});

document.addEventListener("hide_banner", function (evt) {
    _GamesLab_hideBanner();
});

function tryShowInterstitial() {
    if (adCounter > 0 && adCounter % 3 == 0) {
        _GamesLabs_showInterstitialAd();
    }
    adCounter++;
}

document.addEventListener("show_reward_video", function (evt) {
    _GamesLabs_showRewardVideo();
});

