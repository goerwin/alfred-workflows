const path = require('path');
const shell = require('shelljs');
const fs = require('fs-extra');

const workflowDirPath = path.resolve(
  process.env.alfred_preferences,
  'workflows',
  process.env.alfred_workflow_uid
);
const dataFilePath = path.resolve(workflowDirPath, 'data.json');

function getData() {
  const data = fs.readFileSync(dataFilePath, { encoding: 'utf8' });
  if (data) return JSON.parse(data);
  return {};
}

function setData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data), { encoding: 'utf8' });
}

function killProcessesWithSameGPIDAsPID(pid) {
  const gpid = Number(shell.exec(`ps -o pgid ${pid} | tail -1`));
  if (isNaN(gpid)) return;
  shell.exec(`kill -- -${gpid}`);
}

function stopCurrent() {
  const data = getData();
  if (data.runningPID) killProcessesWithSameGPIDAsPID(data.runningPID);
}

module.exports = {
  killProcessesWithSameGPIDAsPID,
  getData,
  setData,
  stopCurrent,
};
