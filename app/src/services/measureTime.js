const logger = require('./logger');

async function measure(name, cb) {
    const hrstart = process.hrtime();
    const result = await cb();
    const hrend = process.hrtime(hrstart);
    logger.info(
        `Block '${name}' executed in ${hrend[0]}s ${hrend[1] / 1000000}ms`,
        {
            ellapsedMs: (hrend[0] * 1000) + (hrend[1] / 1000000)
        }
    );
    return result;
}

module.exports = {
    measure
}
