"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@atproto/api");
const dotenv = __importStar(require("dotenv"));
const cron_1 = require("cron");
const process = __importStar(require("process"));
const converter = __importStar(require("number-to-words"));
dotenv.config();
//
// Bluesky agent for posting
//
const agent = new api_1.BskyAgent({
    service: 'https://bsky.social',
});
//
// Character limit to stay under
//
const CHARACTER_LIMIT = 300;
//
// Lists for randomizing
//
const DOING = ['here', 'there', 'stand', 'kneel', 'sit', 'are'];
const EMOTE = ['adore', 'love', 'are fond of', 'somewhat like', 'are indifferent to', 'have taken a shine to', 'are sweet on',
    'kinda dislike', 'sorta hate'];
const SCATS = ['da', 'dee', 'deep', 'deepa', 'dip', 'dippa', 'dop', 'doopa', 'dub', 'dubba'];
const TITLES = ['kings', 'queens', 'princesses', 'dukes', 'duchesses', 'caliphs', 'emirs', 'emperors', 'empresses', 'archdukes',
    'archduchesses', 'viceroys', 'vicereines', 'marquesses', 'marchionesses', 'counts', 'countesses', 'earls',
    'viscounts', 'viscountesses', 'barons', 'baronesses', 'ranas', 'ranis', 'sultans', 'sultanas', 'emiras', 'caliphas',
    'maharajas', 'maharanis', 'padishahs', 'shahs', 'shabanus', 'khagans', 'khanums', 'pharaohs', 'satraps', 'omukamas',
    'sarkis', 'maliks', 'almamis', 'mwamis', 'arkhoonds', 'datus', 'holkars', 'hwangjes', 'lakans', 'nawabs', 'nizams',
    'rachas'];
const WHERE = ['before', 'in front of', 'ahead of', 'abreast of', 'aside', 'adjacent to', 'off to the side of'];
//
// Main posting function. Assemble lyrics then post
//
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield agent.login({
            identifier: process.env.BLUESKY_USERNAME,
            password: process.env.BLUESKY_PASSWORD
        });
        console.log('Logged into Bluesky');
        let lyric = '';
        while (lyric.length == 0 || lyric.length > CHARACTER_LIMIT) {
            let title = getRandomItem(TITLES);
            let number = Math.floor(Math.random() * 10 + 1);
            lyric = `Yeah ${converter.toWords(number)}, ${converter.toWords(number + 1)} ` +
                `${title} ${getRandomItem(DOING)} ${getRandomItem(WHERE)} you\n` +
                `\tThat\'s what I said now\n` +
                `${initCap(title)}, ${title} who ${getRandomItem(EMOTE)} you\n` +
                `\tJust go ahead now\n`;
        }
        yield agent.post({
            text: lyric + generateScat(lyric)
        });
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
            scat = `${scat} ${next}`;
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
const scheduleExpression = '0 * * * *';
const job = new cron_1.CronJob(scheduleExpression, main);
job.start();
