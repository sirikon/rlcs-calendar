const { JSDOM } = require('jsdom');
const axios = require('axios');
const { VM } = require('vm2');

const { measure } = require('../services/measureTime');

const MATCHES_SCRIPT_URL = 'https://www.rocketleagueesports.com/ajax/matches-script/';

async function getMatches() {
    const rawMatches = await fetchRawMatchesFromWeb();
    return rawMatches.map(parseMatch);
}

async function fetchRawMatchesFromWeb() {
    const response = await fetchMatchesScript();
    return await evaluateScript(response.data);
}

const evaluateScript = async (data) => 
    await measure('Evaluate script', async () => {
        const dom = new JSDOM(data);
        const jsContent = dom.window.document.querySelector('script').textContent;
        let matches = null;
        const vm = new VM({
            sandbox: {
                callback: (d) => matches = d,
            }
        });
        vm.run(`var $ = () => {};\n${jsContent};\callback(matches);`);
        return matches;
    });

const fetchMatchesScript = async () =>
    await measure('Fetch matches script', async () =>
        await axios.get(MATCHES_SCRIPT_URL));

function parseMatch(match) {
    const dateParts = match.pdt_date.split(' ');
    const dayParts = dateParts[0].split('/');
    const hourParts = dateParts[1].split(':');

    const year = parseInt(dayParts[0]);
    const month = parseInt(dayParts[1])-1;
    const day = parseInt(dayParts[2]);

    const hour = parseInt(hourParts[0]);
    const minute = parseInt(hourParts[1]);

    const utcTimestamp = Date.UTC(year, month, day, hour, minute) + (420*60000);

    return {

        teams: {
            a: {
                name: match.ta_name,
                region: match.ta_region,
                logo: match.ta_logo,
                url: match.ta_url
            },
            b: {
                name: match.tb_name,
                region: match.tb_region,
                logo: match.tb_logo,
                url: match.tb_url
            }
        },

        result: {
            a: {
                wins: match.ta_wins,
                outcome: match.ta_outcome || (match.tb_outcome === 'loss' ? 'win' : '')
            },
            b: {
                wins: match.tb_wins,
                outcome: match.tb_outcome || (match.ta_outcome === 'loss' ? 'win' : '')
            }
        },

        description: match.name,
        utcTimestamp
    }
}

module.exports = {
    getMatches
}
