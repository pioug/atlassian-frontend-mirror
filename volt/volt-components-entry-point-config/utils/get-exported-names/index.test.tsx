import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { getExportedNames } from '../get-exported-names';

describe('getExportedNames', () => {
	it('returns a set of export names', () => {
		const dir = mkdtempSync(join(tmpdir(), 'get-exported-names-'));
		const filePath = join(dir, 'mod.tsx');
		writeFileSync(filePath, 'export const alpha = 1;\nexport const beta = 2;\n');

		expect(getExportedNames(filePath)).toEqual(new Set(['alpha', 'beta']));
	});
});
