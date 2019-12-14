const webApp = require('./web/app');
const worker = require('./worker/worker');

process.on('SIGTERM', () => {
    console.log('SIGTERM detected. Shutting down.');
    process.exit();
});

webApp();
worker();
