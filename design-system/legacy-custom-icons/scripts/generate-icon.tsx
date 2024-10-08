/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from 'path';

import { prompt } from 'enquirer';
import { outputFileSync, readFileSync } from 'fs-extra';

import iconTemplate from './templates/icon-template';
import { getPascalCase } from './utils';

function createFile(iconsDir: string, iconName: string) {
	const iconPath = `${iconsDir}/${iconName}/index.tsx`;
	const iconNamePascalCase = getPascalCase(iconName);
	const fileContent = iconTemplate.replace(new RegExp('{{iconName}}', 'g'), iconNamePascalCase);

	outputFileSync(iconPath, fileContent);
}

function updateExports(iconName: string) {
	const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

	['exports', 'af:exports'].forEach((exportType) => {
		packageJson[exportType][`./${iconName}`] = `./src/ui/${iconName}/index.tsx`;
	});

	outputFileSync('./package.json', JSON.stringify(packageJson, null, '\t'));
}

export default async function main() {
	const currentDir = resolve(__dirname);
	const iconsDir = resolve(currentDir, '../src/ui');

	const { iconName } = await prompt<{ iconName: string }>([
		{
			name: 'iconName',
			type: 'input',
			message: `Please enter the icon name using hyphen case? (eg. my-custom-icon)`,
		},
	]);

	createFile(iconsDir, iconName);
	updateExports(iconName);
}

main().catch((err) => {
	// eslint-disable-next-line no-console
	console.log(err);
	process.exit(1);
});
