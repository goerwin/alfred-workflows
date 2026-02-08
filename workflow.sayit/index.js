const shell = require('shelljs');
const { getData, setData, stopCurrent } = require('./helpers');

const action = process.env.action;

if (action === 'stop') return stopCurrent();

const language = process.env.language;
const voiceAndSpeed =
  language === 'es' ? process.env.esVoice : process.env.enVoice;
const [voice, wpm] = voiceAndSpeed.split(',');
const wpmOptions = wpm ? `-r ${wpm}` : '';

let query = process.argv[2];
query = query.replace(/[.*+?^;$'#{}<>()|[\]\\]/g, '\\$&');
query = query.replace(/\n/g, '. ');
query = query.replace(/\-/g, ' ');

if (!query) return process.exit();

stopCurrent();

const data = getData();
setData({ ...data, runningPID: process.pid });
shell.exec(`say ${wpmOptions} -v ${voice} ${query}.`);
// shell.exec(`say -v ${'Samantha'} ${query}.`);
setData({ ...data, runningPID: null });
