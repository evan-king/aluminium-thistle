"use strict";

const
    expect = require('chai').expect,
    distance = require('../lib/distance');

// pctDifference :: num -> num -> num
const pctDifference = (a, b) => Math.abs(b - a) / ((a+b) / 2);

// toCoords :: {coordinates: str} -> {lat: num, lng: num}
function toCoords(loc) {
    const coords = loc.coordinates.split(',');
    return {lat: coords[0], lng: coords[1]};
}

describe('distance', function() {
    
    it('calculates distance', function() {
        // London
        const origin = {lat: 51.515419, lng: -0.141099};
        
        // reference distances taken from online calculator:
        // http://www.meridianoutpost.com/resources/etools/calculators/calculator-latitude-longitude-distance.php
        const testData = [
            {
                lat: 48.96277,
                lng: 9.09699999999998,
                dist: 715.01,
            },
            {
                lat: 10.6792447,
                lng: -61.56065180000002,
                dist: 7121.56,
            },
            {
                lat: 51.515019,
                lng: -0.141599,
                dist: 0.06,
            },
            {
                lat: 52.0629009,
                lng: -1.3397750000000315,
                dist: 102.5,
            },
        ];
        
        testData.forEach(function(loc) {
            const res = distance(origin, loc);
            
            expect(pctDifference(res, loc.dist)).lt(0.1);
        });
    });
    
    it('rejects invalid inputs', function() {
        // London
        const
            origin = {lat: 51.515419, lng: -0.141099},
            test = loc => () => distance(origin, loc);
        
        expect(test(null)).throw(TypeError);
        expect(test(undefined)).throw(TypeError);
        expect(test(5)).throw(TypeError);
        expect(test({})).throw(TypeError);
        
        expect(test({lat: Number(1), lng: Number(1)})).not.throw();
        
        expect(test({lat: -90.1, lng: 0})).throw(RangeError);
        expect(test({lat: 90.1, lng: 0})).throw(RangeError);
        expect(test({lat: -90, lng: 0})).not.throw(RangeError);
        expect(test({lat: 90, lng: 0})).not.throw(RangeError);
        expect(test({lat: 0, lng: -180.1})).throw(RangeError);
        expect(test({lat: 0, lng: 180.1})).throw(RangeError);
        expect(test({lat: 0, lng: -180})).not.throw(RangeError);
        expect(test({lat: 0, lng: 180})).not.throw(RangeError);
        
        expect(test({lat: 0, lng: 0})).not.throw();
    });
    
});
