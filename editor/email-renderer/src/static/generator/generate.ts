// Move this file out of src if it is a build script
// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace, import/no-extraneous-dependencies
import * as svgexport from 'svgexport';
import { resolve } from 'path';
import { writeFileSync, readFileSync } from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import rimraf from 'rimraf';
import imageSources from './image-sources';
import { imageOutputType } from './constants';

const coreIconSrc = resolve(__dirname, '../svg');
const tempFolder = resolve(__dirname, './tmp');
const generatedWarning = `
// DO NOT EDIT THIS FILE DIRECTLY!
// This file was auto generated and may be overritten.
// To make changes, use the generator.
`;

const exportOpts = imageSources.map((file) => ({
	name: file.name,
	outputPath: resolve(tempFolder, `./${file.name}.${imageOutputType}`),
	input: resolve(coreIconSrc, `${file.input}.svg`),
	output: resolve(tempFolder, `./${file.name}.${imageOutputType}`) + ` ${file.exportSize} 80%`,
}));

const createIcons = () => {
	svgexport.render(exportOpts, () => {
		createIndividualIconModules();

		const indexFileExports = exportOpts
			.map((icon) => `export { ${icon.name} } from './${icon.name}'`)
			.join('\n');

		const indexFileEnum = `
      export enum IconName {
        ${exportOpts.map((icon) => `${icon.name} = '${icon.name}',`).join('\n')}
      }`;

		const indexFileIconNameType = `
      export type IconString =
        ${exportOpts.map((icon) => `'${icon.name}'`).join(' | ')}
      `;

		const indexFileContents = [
			generatedWarning,
			indexFileExports,
			indexFileEnum,
			indexFileIconNameType,
		].join('\n');

		writeFileSync(resolve(__dirname, `../icons/index.ts`), indexFileContents);

		rimraf(tempFolder, () => {
			// if (err) return console.log(err);
		});
	});
};

const createIndividualIconModules = () => {
	exportOpts.map((icon) =>
		writeFileSync(
			resolve(__dirname, `../icons/${icon.name}.ts`),
			`${generatedWarning}
      export const ${icon.name} = '${readFileSync(icon.outputPath).toString('base64')}'`,
		),
	);
};

createIcons();
