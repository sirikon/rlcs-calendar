const Koa = require('koa');
const KoaRouter = require('koa-router');
const koaViews = require('koa-views');
const koaStatic = require('koa-static');
const moment = require('moment-timezone');

const { getMatches } = require('../infrastructure/data');

function webApp() {
    const app = new Koa();
    const router = new KoaRouter();

    router.get('/', async (ctx, next) => {

        const from = parseInt(ctx.request.query.from || '0');
        const to = parseInt(ctx.request.query.to || '1');

        const today = moment().add(from, 'day').toDate();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        const tomorrow = moment().add(to, 'day').toDate();
        tomorrow.setHours(0);
        tomorrow.setMinutes(0);
        tomorrow.setSeconds(0);
        tomorrow.setMilliseconds(0);

        const matches = (await getMatches())
            .filter(m => m.utcTimestamp > today.getTime() && m.utcTimestamp < tomorrow.getTime())
            .map(m => {
                return {
                    info: m,
                    a_image_style: `background-image: url(${m.teams.a.logo})`,
                    b_image_style: `background-image: url(${m.teams.b.logo})`,
                    score_style: `display: ${(m.result.a.outcome || m.result.b.outcome ? 'block' : 'none')};`,
                    when: moment.utc(m.utcTimestamp).clone().tz('Europe/Madrid').format('HH:mm')
                };
            });

        await ctx.render('index', { matches });
    });

    app.use(koaViews(__dirname + '/views', {
        extension: 'pug',
        map: {
            pug: 'pug'
        }
    }));

    app.use(router.routes());
    app.use(router.allowedMethods());
    app.use(koaStatic(__dirname + '/static'));

    app.listen(process.env.PORT || 80, '0.0.0.0');
}

module.exports = webApp;
