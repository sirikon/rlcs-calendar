const { Worker } = require('worker_threads');
const pathUtils = require('path');
const uuid = require('uuid/v4');

const mainLogger = require('../services/logger');

const jobs = {
    refreshMatches: 1000 * 60 * 15 // 15 minutes
}

const runningJobs = {};

function main() {
    Object.keys(jobs).forEach(jobName => {
        spin(jobName);
    })
}

function spin(jobName) {
    const jobId = uuid();
    const log = mainLogger.child({ jobName, jobId });
    run(log, jobName, jobId);
    setInterval(() => {
        run(log, jobName, jobId);
    }, jobs[jobName]);
}

function run(log, jobName, jobId) {
    if (runningJobs[jobName]) { return; }
    log.info('Running')
    runningJobs[jobName] = true;
    const worker = new Worker(pathUtils.join(__dirname, 'jobs', `${jobName}.js`), {
        workerData: { jobName, jobId }
    });
    worker.on('exit', (exitCode) => {
        if (exitCode) {
            log.info('Finished with non-zero exit code', { exitCode });
        }
        log.info('Finished');
        runningJobs[jobName] = false;
    });
}

module.exports = main;
