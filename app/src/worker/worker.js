const { Worker, isMainThread } = require('worker_threads');
const pathUtils = require('path');

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
    run(jobName);
    setInterval(() => {
        run(jobName);
    }, jobs[jobName]);
}

function run(jobName) {
    if (runningJobs[jobName]) { return; }
    console.log(`Running job ${jobName}`);
    runningJobs[jobName] = true;
    const worker = new Worker(pathUtils.join(__dirname, 'jobs', `${jobName}.js`));
    worker.on('exit', (exitCode) => {
        if (exitCode) {
            console.log(`Job ${jobName} finished with code ${exitCode}`);
        }
        console.log(`Job ${jobName} finished`);
        runningJobs[jobName] = false;
    });
}

module.exports = main;
