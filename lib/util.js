"use strict";

// property name used to identify a function invocation repeated within itself
const CIRCULAR = module.exports.CIRCULAR = '$circular';

// identity :: * -> *
module.exports.identity = obj => obj;

// mapObject :: fn -> {*} -> {*}
module.exports.mapObject = fn => obj => Object
    .keys(obj)
    .reduce((accum, k) => (accum[k] = fn(obj[k], k), accum), {});

// memoize :: WeakMap -> ({*} -> *) -> ({*} -> *)
// Memoize a function that takes a single object as argument
module.exports.memoize = cache => fn => {
    return function memoized(obj) {
        if(!cache.has(obj)) {
            
            // break recursion cycles by temporarily storing a pointer object
            const ref = {};
            cache.set(obj, ref);
            
            const res = fn(obj);
            ref[CIRCULAR] = res;
            cache.set(obj, res);
        }
        return cache.get(obj);
    }
};

module.exports = Object.freeze(module.exports);