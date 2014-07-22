
define([
    'intern!object',
    'intern/chai!assert',
    'models/Model'
], function (registerSuite, assert, Model) {




    registerSuite({
        name: 'model',

        greet: function () {
            assert.strictEqual(Mode.hello(), 
                                'guttentag', 
                                'hello.greet should return a greeting for the person named in the first argument');
        }

    });
});
