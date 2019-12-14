const { getMatches } = require('../../infrastructure/rlesports');
const { setMatches } = require('../../infrastructure/data');

async function refreshMatches() {
    const matches = await getMatches();
    await setMatches(matches);
}

refreshMatches().then(() => {}, (err) => console.log(err));
