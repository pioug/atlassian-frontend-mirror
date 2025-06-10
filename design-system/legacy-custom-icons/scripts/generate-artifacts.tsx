/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from 'path';

import { outputFileSync, readdirSync } from 'fs-extra';

import format from '@af/formatting/sync';
import { createSignedArtifact } from '@atlassian/codegen';

import { getPascalCase } from './utils';

function generateArtifacts(iconDirs: string[]) {
	const currentDir = resolve(__dirname);
	const artifactsFile = resolve(currentDir, '../examples/artifacts/icons.tsx');

	const listOfIcons = format(
		`export {
			${iconDirs
				.map((dir) => {
					return getPascalCase(dir);
				})
				.join(',')}
		} from '@atlaskit/legacy-custom-icons';
	`,
		'typescript',
	);

	const signedArtifact = createSignedArtifact(
		listOfIcons,
		'yarn workspace @atlaskit/legacy-custom-icons generate-artifacts',
	);
	outputFileSync(artifactsFile, signedArtifact);
}

function generateIndex(iconDirs: string[]) {
	const currentDir = resolve(__dirname);
	const indexFile = resolve(currentDir, '../src/index.tsx');

	const listOfIcons = format(
		`
		${iconDirs
			.map((dir) => {
				return `export { default as ${getPascalCase(dir)} } from './ui/${dir}';`;
			})
			.join('')}
	`,
		'typescript',
	);

	const signedArtifact = createSignedArtifact(
		listOfIcons,
		'yarn workspace @atlaskit/legacy-custom-icons generate-artifacts',
	);
	outputFileSync(indexFile, signedArtifact);
}

export default async function main() {
	const currentDir = resolve(__dirname);
	const uiDir = resolve(currentDir, '../src/ui');
	const iconDirs = readdirSync(uiDir);

	generateArtifacts(iconDirs);
	generateIndex(iconDirs);
}

main().catch((err) => {
	// eslint-disable-next-line no-console
	console.log(err);
	process.exit(1);
});
