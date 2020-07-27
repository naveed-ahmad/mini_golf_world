/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var Game = {
  // Application Constructor
  initialize: function () {
    document.addEventListener ( 'deviceready', this._GamesLab_onDeviceReady.bind ( this ), false );
  },

  _GamesLab_onPause: function () {
    s_oMain._GamesLab_stopUpdate ();
  },
  _GamesLab_onResume: function () {
    s_oMain._GamesLab_startUpdate ();
  },
  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  _GamesLab_onDeviceReady: function () {
    _Gameslab_initAds();

    var oMain = new CMain({

      stage_par: [ // NUMBER OF SHOTS EXPECTED TO COMPLETE EACH STAGE. THE MORE SHOTS YOU TAKE OVER THE PAR, THE LESS POINTS YOU'LL

        3, /// STAGE 1
        3, /// STAGE 2
        4, /// STAGE 3
        5, /// STAGE 4
        4, /// STAGE 5
        5, /// STAGE 6
        5, /// STAGE 7
        5, /// STAGE 8
        6, /// STAGE 9
        5, /// STAGE 10
        5, /// STAGE 11
        6, /// STAGE 12
        7, /// STAGE 13
        8, /// STAGE 14
        6, /// STAGE 15
        10, /// STAGE 16
        7, /// STAGE 17
        7 /// STAGE 18
      ],


      par_points: 5000, //POINT EARNED IF PLAYER SCORES A PAR (BALLS LAUNCHED = BALLS EXPECTED TO COMPLETE A SINGLE LEVEL)
      added_points: 1000, //POINT TO ADD/SUBTRACT IF PLAYER LAUNCH LESS/MORE BALLS THEN A PAR, RESPECTIVELY.

      max_shot_power: 152 //MAX POWER OF BALL SHOT (CANNOT BE MORE THEN 160)

    });
    document.addEventListener ( 'pause', this._GamesLab_onPause.bind ( this ), false );
    document.addEventListener ( 'resume', this._GamesLab_onResume.bind ( this ), false );
    window.addEventListener ( "orientationchange", onOrientationChange );
    window.addEventListener ( 'resize', function () {
      sizeHandler ();
    }, true );


    sizeHandler ();

  }
};

Game.initialize ();

