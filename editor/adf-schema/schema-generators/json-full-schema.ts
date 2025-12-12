import path from 'path';
import { adfToJSON } from '@atlaskit/adf-schema-generator';
import adfNode from '../src/next-schema/full-schema.adf';
import { writeToFile } from './helpers/writeToFile';

const outputPath = path.join('json-schema', 'v1');

function main() {
	const fullSchema = adfToJSON(adfNode, true);
	const stage0 = adfToJSON(adfNode, false);

	writeToFile('full.json', JSON.stringify(fullSchema, null, 2), outputPath);
	writeToFile('stage-0.json', JSON.stringify(stage0, null, 2), outputPath);
}

main();
