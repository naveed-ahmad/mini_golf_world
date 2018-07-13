var NUM_HOLES = 18;

var PAR = new Array();

var FLAGS_POS = new Array();
FLAGS_POS[0] = [{
    x: 424,
    y: -488
}, {
    x: 655,
    y: -340
}];
FLAGS_POS[1] = [{
    x: 660,
    y: 102
}, {
    x: 924,
    y: -54
}];
FLAGS_POS[2] = [{
    x: 816,
    y: -1212
}, {
    x: 1580,
    y: -704
}];
FLAGS_POS[3] = [{
    x: 64,
    y: -588
}, {
    x: 464,
    y: -816
}];
FLAGS_POS[4] = [{
    x: 693,
    y: -1307
}, {
    x: 1308,
    y: -912
}];
FLAGS_POS[5] = [{
    x: 175,
    y: -1252
}, {
    x: 480,
    y: -1052
}];
FLAGS_POS[6] = [{
    x: -432,
    y: 852
}, {
    x: -204,
    y: 1010
}];
FLAGS_POS[7] = [{
    x: -1430,
    y: 632
}, {
    x: -1200,
    y: 788
}];
FLAGS_POS[8] = [{
    x: -856,
    y: 1220
}, {
    x: -628,
    y: 1372
}];
FLAGS_POS[9] = [{
    x: -2140,
    y: 1042
}, {
    x: -1910,
    y: 1196
}];
FLAGS_POS[10] = [{
    x: -1612,
    y: 736
}, {
    x: -1380,
    y: 892
}];
FLAGS_POS[11] = [{
    x: -112,
    y: -136
}, {
    x: 125,
    y: 20
}];
FLAGS_POS[12] = [{
    x: -1618,
    y: 236
}, {
    x: -1390,
    y: 392
}];
FLAGS_POS[13] = [{
    x: -1860,
    y: 735
}, {
    x: -1396,
    y: 1048
}];
FLAGS_POS[17] = [{
    x: 692,
    y: -588
}, {
    x: 924,
    y: -440
}];
FLAGS_POS[15] = [{
    x: 1930,
    y: -484
}, {
    x: 2088,
    y: -384
}];
FLAGS_POS[16] = [{
    x: -1740,
    y: -30
}, {
    x: -1276,
    y: 276
}];
FLAGS_POS[14] = [{
    x: 960,
    y: -764
}, {
    x: 1216,
    y: -590
}];

var CAUSTICS_POS = new Array();
CAUSTICS_POS[0] = null;
CAUSTICS_POS[1] = null;
CAUSTICS_POS[2] = {
    x: 1148,
    y: -750,
    scale: 1
};
CAUSTICS_POS[3] = null;
CAUSTICS_POS[4] = null;
CAUSTICS_POS[5] = null;
CAUSTICS_POS[6] = {
    x: 904,
    y: -730,
    scale: 1
};
CAUSTICS_POS[7] = {
    x: 468,
    y: -328,
    scale: 1
};
CAUSTICS_POS[8] = {
    x: 1392,
    y: 108,
    scale: 0.3
};
CAUSTICS_POS[9] = {
    x: 508,
    y: -272,
    scale: 1
};
CAUSTICS_POS[10] = null;
CAUSTICS_POS[11] = {
    x: -838,
    y: -386,
    scale: 0.70
};
CAUSTICS_POS[12] = {
    x: 514,
    y: -60,
    scale: 1
};
CAUSTICS_POS[13] = null;
CAUSTICS_POS[17] = {
    x: 688,
    y: -60,
    scale: 0.4
};
CAUSTICS_POS[15] = null;
CAUSTICS_POS[16] = null;
CAUSTICS_POS[14] = {
    x: 846,
    y: -496,
    scale: 1
};
