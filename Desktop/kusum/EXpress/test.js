const _ = require('lodash');

const num = _.random(0,30);
console.log(num);
const greet = _.once(() => {
    console.log('Hello')
    });
greet(); 
greet()
greet()
