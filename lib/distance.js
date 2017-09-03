"use strict";

const clone = require('./deep-clone');
const {abs, acos, sin, cos, PI} = Math;

const EARTH_RADIUS = 6367.445; // mean radius, in km

// toRadians :: num -> num
const toRadians = deg => (deg * PI) / 180;

function validateCoords(loc) {
    if(!loc || typeof loc.lat != 'number' || typeof loc.lng != 'number') {
        throw new TypeError('invalid input format (should be {lat: n, lng: n})');
    }
    
    if(Math.abs(loc.lat) > 90) {
        throw new RangeError('latitude outside valid range (+/-90)');
    }
    
    if(Math.abs(loc.lng) > 180) {
        throw new RangeError('longitude outside valid range (+/-180)');
    }
}

// distance :: {lat: num, lng: num} -> {lat: num, lng: num} -> num
// Convert coordinate pairs into distance in km
// Based on simplest calculation offered at:
// https://en.wikipedia.org/wiki/Great-circle_distance#Formulas
function distance(origin, dest) {
    validateCoords(origin);
    validateCoords(dest);
    
    const
        r = toRadians,
        aLatR = r(origin.lat),
        aLngR = r(origin.lng),
        bLatR = r(dest.lat),
        bLngR = r(dest.lng);
    
    return EARTH_RADIUS
        * acos(
            sin(aLatR) * sin(bLatR)
            + cos(aLatR) * cos(bLatR) * cos(abs(bLngR-aLngR))
        );
}

module.exports = distance;
