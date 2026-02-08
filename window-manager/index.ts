/**
 * This script generates the `emojis.json` file and downloads downloads all
 * the emojis from the emojilib repository and saves them
 * to the `icons` directory.
 *
 * To run the script, run the following:
 *
 * ```sh
 * npm install
 * node index.ts
 * ```
 */

import fs from "node:fs/promises";
import path from "node:path";
import twemoji from "twemoji";

const __dirname = decodeURIComponent(
	path.dirname(new URL(import.meta.url).pathname),
);

async function getAllEmojis() {
	const path =
		"https://raw.githubusercontent.com/muan/emojilib/refs/heads/main/dist/emoji-en-US.json";
	const response = await fetch(path);
	const jsonResponse = await response.json();
	return jsonResponse;
}

function getEmojiUrl(emojiKey: string) {
	let url = "";

	twemoji.parse(emojiKey, {
		folder: "svg",
		ext: ".svg",

		// this is synchronous, so we can return the url immediately
		callback: (icon) => {
			url = `https://twemoji.maxcdn.com/v/latest/svg/${icon}.svg`;
			return icon;
		},
	});

	return url;
}

async function downloadFileFromUrl(url: string) {
	const response = await fetch(url);
	const data = await response.text();
	return data;
}

async function fileExists(path: string): Promise<boolean> {
	try {
		await fs.access(path);
		return true;
	} catch {
		return false;
	}
}

async function saveFileToDisk(filePath: string, data: string) {
	await fs.writeFile(filePath, data, { encoding: "utf-8" });
	return filePath;
}

const emojis: Record<string, string[]> = await getAllEmojis();

//
// expected format:
// https://www.alfredapp.com/help/workflows/inputs/script-filter/json/
//
const parsedList = {
	items: Object.keys(emojis).map((emojiKey) => {
		const emojiData = emojis[emojiKey];
		const title = emojiData?.[0];

		if (!emojiData || !title) return {};

		const filePath = path.join(__dirname, "icons", `${title}.svg`);

		return {
			uid: title,
			emojiKey,
			title: title
				.replaceAll("_", " ")
				.split(" ")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" "),
			subtitle: emojiData.slice(1).join(" "),
			match: emojiData.slice(1).join(" "),
			arg: emojiKey,
			icon: { path: filePath },
		};
	}),
};

console.log("Downloading icons...");

for await (const item of parsedList.items) {
	if (!item.emojiKey) continue;

	if (await fileExists(item.icon.path)) {
		console.log(`Skipping ${item.emojiKey} because it already exists`);
		continue;
	}

	const emojiUrl = getEmojiUrl(item.emojiKey);
	if (!emojiUrl) {
		console.error(`Error getting emoji URL for ${item.emojiKey}`);
		continue;
	}

	console.log(`Downloading ${emojiUrl}...`);
	const emojiSVGFile = await downloadFileFromUrl(emojiUrl);
	await saveFileToDisk(item.icon.path, emojiSVGFile);
}

console.log("Saving list to emojis.json...");

await fs.writeFile(
	path.join(__dirname, "emojis.json"),
	JSON.stringify(parsedList, null, 2),
);

console.log("Done!");
