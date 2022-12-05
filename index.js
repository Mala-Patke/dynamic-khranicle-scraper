import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';

const get = axios.get;

function kget(uri) {
    return new Promise((res, rej) => {
        get('https://khranicle.com' + uri)
            .then(res)
            .catch(rej);
    });
}

async function main() {
    console.time('request');
    const { data } = await kget('/');
    writeFileSync('./khranicle.htm', data);
    const $ = cheerio.load(data);
    console.timeLog('request');
    console.time('organize');
    let obj = [];
    let articles = $('.list-item-content');
    console.time('filter');
    articles.each((i, e) => {
        obj.push({
            name: $(e).children().first().children().first().text().trim(),
            desc: $(e).children().first().children().last().text().trim(),
            href: $(e).children().last().children().first().children().first().attr('href')
        });
    });
    console.log(obj);
    console.timeLog('organize')
    console.timeLog('request')
}  

(async()=>await main())();