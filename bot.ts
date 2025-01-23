import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import { CronJob } from 'cron';
import * as process from 'process';
import * as converter from 'number-to-words';

dotenv.config();

//
// Bluesky agent for posting
//
const agent = new BskyAgent({
  service: 'https://bsky.social',
});

//
// Character limit to stay under
//
const CHARACTER_LIMIT = 300;

//
// Lists for randomizing
//
const DOING  = ['here', 'there', 'stand', 'kneel', 'sit', 'are']
const EMOTE  = ['adore', 'love', 'are fond of', 'somewhat like', 'are indifferent to', 'have taken a shine to', 'are sweet on', 
                'kinda dislike', 'sorta hate']
const SCATS  = ['da', 'dee', 'deep', 'deepa', 'dip', 'dippa', 'dop', 'doopa', 'dub', 'dubba']
const TITLES = ['kings', 'queens', 'princesses', 'dukes', 'duchesses', 'caliphs', 'emirs', 'emperors', 'empresses', 'archdukes',
                'archduchesses', 'viceroys', 'vicereines', 'marquesses', 'marchionesses', 'counts', 'countesses', 'earls',
                'viscounts', 'viscountesses', 'barons', 'baronesses', 'ranas', 'ranis', 'sultans', 'sultanas', 'emiras', 'caliphas',
                'maharajas', 'maharanis', 'padishahs', 'shahs', 'shabanus', 'khagans', 'khanums', 'pharaohs', 'satraps', 'omukamas', 
                'sarkis', 'maliks', 'almamis', 'mwamis', 'arkhoonds', 'datus', 'holkars', 'hwangjes', 'lakans', 'nawabs', 'nizams',
                'rachas']
const WHERE  = ['before', 'in front of', 'ahead of', 'abreast of', 'aside', 'adjacent to', 'off to the side of']

//
// Main posting function. Assemble lyrics then post
//
async function main() {

  await agent.login({
    identifier: process.env.BLUESKY_USERNAME!,
    password: process.env.BLUESKY_PASSWORD!
  });
  console.log('Logged into Bluesky');

  let lyric = '';

  while (lyric.length == 0 || lyric.length > CHARACTER_LIMIT) {

    let title = getRandomItem(TITLES);
    let number = Math.floor(Math.random() * 10 + 1);
   
    lyric = `Yeah ${converter.toWords(number)}, ${converter.toWords(number + 1)} ` +
                `${title} ${getRandomItem(DOING)} ${getRandomItem(WHERE)} you\n`       +
                `\tThat\'s what I said now\n`                                          +
                `${initCap(title)}, ${title} who ${getRandomItem(EMOTE)} you\n`        +
                `\tJust go ahead now\n`;
  }

  await agent.post({
    text: lyric + generateScat(lyric)
  });

}

//
// Get a random item from an array
//
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

//
// Capitalize the first letter of a string
//
function initCap(s) {
    return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}

//
// Assemble a randomized assortment of scats (?!?!?!)
//
function generateScat(lyric) {

  let scat = '';

  for (let i = 0; i < Math.random() * 4 + 8; i++) {
    
    if (scat.length > 0) {
      scat = `${scat} `;
    }

    let next = getRandomItem(SCATS);
    if (`${lyric} ${scat} ${next}`.length < CHARACTER_LIMIT) {
      scat = `${scat} ${next}`
    }
    else {
      break;
    }

  }

  return scat;

}

//
// Do the thing
//
main();

//
// And then do it on a schedule
//
const scheduleExpression = '0 */6 * * *';
const job = new CronJob(scheduleExpression, main);

job.start();


