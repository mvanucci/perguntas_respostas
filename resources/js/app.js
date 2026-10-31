
//require jquery
window._ = require('lodash');

try {
    window.Popper = require('@popperjs/core');
    window.$ = window.jQuery = require('jquery');
    
    //require bootstrap.js
    require('bootstrap');

} catch (error) {
    console.log(error);
}

