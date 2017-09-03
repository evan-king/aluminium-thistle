"use strict";

const
    expect = require('chai').expect,
    clone = require('../lib/deep-clone');


describe('deepClone', function() {
    
    const meta = {name: "Paddy", address: {town: "Lerum", country: "Sweden"}};
    
    it('returns deep-cloned data', function() {
        const copy = clone(meta);
        expect(copy).eql(meta);
        
        copy.address.town = "Fredericton";
        expect(copy).not.eql(meta);
    });
    
    it('handles all literal types', function() {
        const data = {num: 1.2, bool: false, undef: undefined, nil: null, str: 'string'};
        expect(clone(data)).eql(data);
    });
    
    it('preserves shared references', function() {
        const
            shared = {val: true},
            data = {
                outer1: {inner: shared},
                outer2: shared
            };
        
        const copy = clone(data);
        
        expect(copy).eql(data);
        shared.val = false;
        expect(data.outer2.val).eql(false);
        expect(copy.outer2.val).eql(true);
        
        copy.outer1.inner.val = 'blah';
        expect(copy.outer2.val).eql('blah');
    });
    
    it('handles circular references', function() {
        const data = [{one: {two: {three: null}}}];
        data[0].one.two.three = data;
        
        const copy = clone(data);
        expect(copy).eql(data);
        
        copy[0].one.two.three[0].another = true;
        expect(copy[0].another).true;
        expect(data[0].another).not.true;
    });
    
    // to accomplish, use Object.create+Object.getOwnPropertyDescriptor
    // and gather the necessary property definition metadata (not implemented)
    it.skip('preserves object prototypes');
    
});
