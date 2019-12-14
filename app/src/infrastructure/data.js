const fs = require('fs');
const pathUtils = require('path');

async function getMatches() {
    const matchesDataFilePath = getMatchesDataFilePath();
    if (!await fileExists(matchesDataFilePath)) { return []; }
    return await readJSONFile(matchesDataFilePath);
}

async function setMatches(data) {
    const matchesDataFilePath = getMatchesDataFilePath();
    await writeJSONFile(matchesDataFilePath, data);
}

function fileExists(path) {
    return new Promise((resolve, reject) => {
        fs.exists(path, (result) => resolve(result));
    });
}

function readJSONFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
            if (err) { return reject(err); }
            resolve(JSON.parse(data));
        })
    });
}

function writeJSONFile(path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, JSON.stringify(content, null, 2), (err) => {
            if (err) { return reject(err); }
            resolve();
        });
    });
}

const getMatchesDataFilePath = () =>
    pathUtils.join(process.cwd(), 'data', 'matches.json');

module.exports = {
    getMatches,
    setMatches
}
