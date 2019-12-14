const { JSDOM } = require('jsdom');
const axios = require('axios');
const { VM } = require('vm2');

async function main() {
    const response = await axios.get('https://www.rocketleagueesports.com/ajax/matches-script/?league=7-57d5ab4-qm0qcw&season=7-e8fcccb7dd-7h0w65&region=0&stage=7-aafeeaf198-prnslp');
    const dom = new JSDOM(response.data);
    const jsContent = dom.window.document.querySelector('script').textContent;
    let data = null;
    const vm = new VM({
        sandbox: {
            callback: (d) => data = d,
        }
    });
    vm.run(`var $ = () => {};\n${jsContent};\callback(matches);`);
    console.log(data.map(parseMatch));
}

function parseMatch(match) {
    return {
        name: `${match.ta_name} vs ${match.tb_name}`
    }
}

main().then(
    () => {},
    (err) => console.log(err)
);
