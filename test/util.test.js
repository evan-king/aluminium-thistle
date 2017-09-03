"use strict";

const
    keys = Object.keys,
    expect = require('chai').expect,
    {identity, mapObject, memoize} = require('../lib/util');

describe('Utility Methods', function() {

    describe('mapObject', function() {
        
        it('invokes callback once for each element, with value and key', function() {
            const
                slice = Array.prototype.slice,
                calls = [],
                cb = (v, k) => calls.push([v, k]),
                walk = mapObject(cb);
            
            walk({'': 1, ' ': 2, '.': 3});
            expect(calls).eql([[1, ''], [2, ' '], [3, '.']]);
        });
        
        it('creates new object with mapped values', function() {
            const
                orig = {a: 1, b: 2, c: 3},
                walk = mapObject((v, k) => k+v);
            
            expect(walk(orig)).eql({a: 'a1', b: 'b2', c: 'c3'});
        });
        
        it('preserves original key ordering', function() {
            const
                orig = {b: 1, a: 2, c: 3},
                walk = mapObject(identity);
            
            expect(keys(walk(orig))).eql(keys(orig));
        });
        
    });

    describe('memoize', function() {
        
        // collection of unique original elements
        const
            a = {val: 1},
            b = {val: 2},
            c = {val: 3},
            d = {val: 4};
        
        it('caches repeated invocations', function() {
            let calls = 0;
            const
                orig = [a, b, c, c, d, a, b],
                visit = arg => (calls++, arg.val),
                walk = memoize(new WeakMap())(visit),
                mapped = orig.map(walk);
            
            expect(calls).eql(4);
            expect(mapped).eql(orig.map(arg => arg.val));
        });
        
    });

});
