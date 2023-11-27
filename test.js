import pckg from './index.js';

pckg.on('newPair', (pair) => {
    console.log(pair);
});
