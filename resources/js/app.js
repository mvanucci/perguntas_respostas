
//require jquery
window._ = require('lodash');

try {
    window.Popper = require('popper.js').default;
    window.$ = window.jQuery = require('jquery');
    
    //require bootstrap.js
    require('bootstrap');

} catch (error) {
    console.log(error);
}

