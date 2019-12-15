const { isMainThread, workerData } = require('worker_threads');

const pathUtils = require('path');
const winston = require('winston');

function createLogger() {
    return winston.createLogger({
        level: 'info',
        defaultMeta: getDefaultMeta(),
        transports: getTransports()
    });
}

const getTransports = () => [
    new winston.transports.File({
        dirname: getLogDirPath(),
        filename: getLogFileName(),
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json())
    }),
    new winston.transports.Console({
        format: winston.format.simple()
    })
];

const getDefaultMeta = () =>
    isMainThread ? {} : {
        jobName: workerData.jobName,
        jobId: workerData.jobId
    }

const getLogFileName = () => 
    isMainThread ? 'main.log' : `${workerData.jobName}.log`;

const getLogDirPath = () =>
    pathUtils.join(process.cwd(), 'logs');

module.exports = createLogger();
