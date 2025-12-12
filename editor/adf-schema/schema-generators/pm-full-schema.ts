import path from 'path';
import { adfToPm } from '@atlaskit/adf-schema-generator';
import adfNode from '../src/next-schema/full-schema.adf';
import { writeToFile } from './helpers/writeToFile';

const outputPath = path.join('src', 'next-schema', 'generated');

function main() {
	const output = adfToPm(adfNode);

	if (output) {
		writeToFile('nodeTypes.ts', output.pmNodes, outputPath);
		writeToFile('markTypes.ts', output.pmMarks, outputPath);
		writeToFile('nodeGroupTypes.ts', output.pmNodeGroups, outputPath);
	}
}

main();
