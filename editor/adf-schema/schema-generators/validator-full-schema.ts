import path from 'path';
import { adfToValidatorSpec } from '@atlaskit/adf-schema-generator';
import adfNode from '../src/next-schema/full-schema.adf';
import { writeToFile } from './helpers/writeToFile';

const outputPath = path.join('src', 'validator-schema', 'generated');

function generateValidatorSpec() {
	const output = adfToValidatorSpec(adfNode);
	return Object.entries(output)
		.map(([key, value]) => `export const ${key} = ${JSON.stringify(value.json)};`)
		.join('\n\n');
}

function main() {
	const spec = generateValidatorSpec();
	writeToFile('validatorSpec.ts', spec, outputPath);
}

main();
