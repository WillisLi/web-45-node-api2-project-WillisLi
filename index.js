const server = require('./api/server');

server.listen(4000, () => {
    console.log('Serving is running on local host 4000');
})