/***
 * Excerpted from "Seven Web Frameworks in Seven Weeks",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material, 
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose. 
 * Visit http://www.pragmaticprogrammer.com/titles/7web for more book information.
***/
/*!
 * CanJS - 1.1.8
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Tue, 24 Sep 2013 21:59:55 GMT
 * Licensed MIT
 * Includes: can/construct/super
 * Download from: http://canjs.com
 */
(function(can, Construct) {

    // tests if we can get super in .toString()
    var isFunction = can.isFunction,

        fnTest = /xyz/.test(function() {
            xyz;
        }) ? /\b_super\b/ : /.*/;

    // overwrites a single property so it can still call super
    can.Construct._overwrite = function(addTo, base, name, val) {
        // Check if we're overwriting an existing function
        addTo[name] = isFunction(val) &&
            isFunction(base[name]) &&
            fnTest.test(val) ? (function(name, fn) {
                return function() {
                    var tmp = this._super,
                        ret;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = base[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    ret = fn.apply(this, arguments);
                    this._super = tmp;
                    return ret;
                };
            })(name, val) : val;
    }

    // overwrites an object with methods, sets up _super
    //   newProps - new properties
    //   oldProps - where the old properties might be
    //   addTo - what we are adding to
    can.Construct._inherit = function(newProps, oldProps, addTo) {
        addTo = addTo || newProps
        for (var name in newProps) {
            can.Construct._overwrite(addTo, oldProps, name, newProps[name]);
        }
    }

    return can;
})(can);