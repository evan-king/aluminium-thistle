"use strict";

const 
    expect = require('chai').expect,
    lib = require('../index');

describe('aluminium-thistle', function() {
    
    const output = [
        {
            organization: 'Blue Square 360',
            addresses: [
                'Ocean Financial Centre, Level 40, 10 Collyer Quay, Singapore, 049315',
                'St Saviours Wharf, London SE1 2BE'
            ],
        },
        {
            organization: 'Gallus Consulting',
            addresses: [
                'Newton House, Northampton Science Park, Moulton Park, Kings Park Road, Northampton, NN3 6LG',
                'No1 Royal Exchange, London, EC3V 3DG',
                '3 Hardman Square, Spinningfields, Manchester, M3 3EB'
            ],
        }
    ];

    
    it('finds and displays companies with nearby offices', function() {
        
        expect(lib()).eql(output);
        
    });
    
});
