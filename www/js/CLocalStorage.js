var localData = {};

function CLocalStorage () {
  var szName;
  var available;
  this._GamesLab_init = function () {
    szName = GAME_NAME;
  };

  this.available = function () {
    try {
      window.localStorage.setItem ( 'l', 't' );
      available = true;
      return true;
    } catch (e) {
      available = false;
      return false;
    }
  }

  this.saveItem = function ( key, val ) {
    try {
      window.localStorage.setItem ( szName + key, val );
    } catch (e) {
      localData[ szName + key ] = val;
    }
  }

  this.getTotalScore = function () {
    return parseInt ( this.getItem ( 'totalScore' ) || 0 );
  }

  this.getBestScore = function () {
    return parseInt ( this.getItem ( 'bestScore' ) || 0 );
  }

  this.playedBefore = function () {

    return false;
  }
  
  this.getLevelScore = function ( lvl ) {
    return parseInt ( this.getItem ( 'lvl_' + lvl + 'score' ) || 0 );
  }

  this.saveLevelScore = function ( lvl, score ) {
    this.saveItem ( 'lvl_' + lvl + 'score', score );

    var all = this.getAllLevelsScore();
    all[lvl]=score;

    this.saveItem ( 'all_lvl_score', JSON.stringify(all) );
 }
  
  this.getAllLevelsScore = function (  ) {
    var all = this.getItem('all_lvl_score') || "{}";
    return JSON.parse(all);
  }
 
  this.saveTotalScore = function ( score ) {
    this.saveItem ( 'totalScore', score );
  }

  this.saveBestScore = function ( score ) {
    this.saveItem ( 'bestScore', score );
  }

  this.getItem = function ( key ) {
    try {
      return window.localStorage.getItem ( szName + key );
    } catch (e) {
      return localData[ szName + key ];
    }
  }

  this._GamesLab_init ();
}
