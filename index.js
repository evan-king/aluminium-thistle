"use strict";

const
    clone = require('./lib/deep-clone'),
    distance = require('./lib/distance'),
    partners = require('./data.json');

const
    LONDON = {coordinates: "51.515419,-0.141099"},
    MAX_DIST = 100; // in km


// pick :: [str] -> {*} -> {*}
// make a partial object copy, containing only the specified properties
const pick = keys => obj => keys.reduce((accum, k) => (accum[k] = obj[k], accum), {});

// toCoords :: {coordinates: str} -> {lat: num, lng: num}
function toCoords(loc) {
    const coords = loc.coordinates.split(',');
    return {lat: Number(coords[0]), lng: Number(coords[1])};
}

// minDistance :: coords -> [coords] -> num
function minDistance(origin, destinations) {
    return destinations.reduce(
        (min, dest) => Math.min(min, distance(origin, dest)),
        20000 // slightly larger than greatest distance possible between two coordinates
    );
}

// compareProp :: str -> ({str: *} -> {str: *} -> num)
// build sort comparator by property
function compareProp(name) {
    return function(a, b) {
        if(a[name] < b[name]) return -1;
        if(a[name] > b[name]) return 1;
        return 0
    }
}

// officeCoords :: {offices: [{coordinates: str}]} -> [{lat: num, lng: num}]
const officeCoords = company => company.offices.map(toCoords);

/**
 * nearestPartners
 * Get list of companies with offices within 100km, sorted by name.
 * Includes all addresses of any company having any address within 100km.
 * (Exercise was ambiguous but specified filtering in context of company, not location.)
 * 
 * @return [obj]
 * @author Evan King
 */
module.exports = function nearestPartners() {
    const nearest = minDistance.bind(null, toCoords(LONDON));
    
    return clone(partners)
        // calculate distance of closest office per company
        .map(obj => (obj.distance = nearest(officeCoords(obj)), obj))
        
        // add top-level list of office addresses
        .map(obj => (obj.addresses = obj.offices.map(office => office.address), obj))
        
        // prune down to companies within the max range
        .filter(obj => obj.distance < MAX_DIST)
        
        // strip down to desired output
        .map(pick(['organization', 'addresses']))
        
        // put in alphabetical order by company name
        .sort(compareProp('organization'))
    
}
