"use strict";

const {identity, mapObject, memoize, CIRCULAR} = require('./util');

// isObject :: * -> bool
function isObject(value) {
    return typeof value === "object"
        && value !== null
        && !(value instanceof Boolean)
        && !(value instanceof Date)
        && !(value instanceof Number)
        && !(value instanceof RegExp)
        && !(value instanceof String);
}

// deepClone :: * -> *
/**
 * deepClone
 * Perform a deep memory copy of object data.
 * Preserves reference sharing and circular references,
 * using reference tracking with a WeakMap and temporary
 * pointer objects on circular references to break out of
 * recursion.
 * 
 * @param mixed data
 * @return mixed data
 * @author Evan King
 */
module.exports = function deepClone(data) {
    
    // Set up state tracking for circular/shared references via memoized copy functions
    const
        visited = new WeakMap(),
        visit = memoize(visited),
        copyArray = visit(arr => arr.slice().map(clone)),
        copyObject = visit(mapObject(clone));
    
    // recursive copy
    function clone(data) {
        if(Array.isArray(data)) return copyArray(data);
        if(isObject(data)) return copyObject(data);
        return data;
    }
    
    // walk the copy dereferencing pointer objects (caused
    // by circular references) but making no other changes
    function deref(data) {
        if(data && data[CIRCULAR]) return data[CIRCULAR];
        
        // Note: must not .map or similar - that creates shallow copies, breaking shared references
        if(Array.isArray(data)) {
            data.forEach((val, idx) => data[idx] = deref(val));
        } else if(isObject(data)) {
            Object.keys(data).forEach(k => data[k] = deref(data[k]));
        }
        
        return data;
    }
    
    return deref(clone(data));
    
}
