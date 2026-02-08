import fs from 'fs';
import path from 'path';
import { outputAlfredItems } from './helpers';

export type AlfredListItem = {
  title: string;
  subtitle?: string;
  arg?: string;
  variables: {
    action?: string;
    noteFilePath: string;
  };
};

const defaultNoteFilename = process.env.defaultNoteFilename;
const notesFolderPath = process.env.notesFolderPath;
const homePath = process.env.HOME;

if (!homePath) throw new Error('No env HOME set');
if (notesFolderPath === undefined)
  throw new Error('No env notesFolderPath set');
if (!defaultNoteFilename) throw new Error('No env defaultNoteFilename set');

const notesFolderParsedPath = notesFolderPath.replace('~', homePath);

const files = fs
  .readdirSync(notesFolderParsedPath)
  .filter((file) => /\.md$/.test(file))
  .map((file) => {
    const noteFilePath = path.resolve(notesFolderParsedPath, file);

    return {
      title: file,
      type: 'file:skipcheck',
      arg: noteFilePath,
      variables: { action: 'openFile', noteFilePath },
    };
  });

const defaultNoteFilePath = path.resolve(
  notesFolderParsedPath,
  defaultNoteFilename
);

const userInput = process.argv.slice(2).join(' ').trim();

const matches: AlfredListItem[] = files
  .filter((it) => it.title.toLowerCase().includes(userInput.toLowerCase()))
  .sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1));

if (!userInput)
  matches.unshift({
    title: `Open ${defaultNoteFilename}`,
    variables: {
      action: 'openFile',
      noteFilePath: defaultNoteFilePath,
    },
  });
else {
  const previewText =
    userInput.length > 30 ? `${userInput.slice(0, 30)}...` : userInput;

  matches.push({
    title: 'Add new note',
    subtitle: `"${previewText}" to ${notesFolderParsedPath}`,
    arg: userInput,
    variables: { noteFilePath: defaultNoteFilePath },
  });
}

outputAlfredItems(matches);
