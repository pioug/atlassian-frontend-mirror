import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { readJsonFile } from '../read-json-file';

describe('readJsonFile', () => {
	it('parses JSON from disk', () => {
		const dir = mkdtempSync(join(tmpdir(), 'read-json-file-'));
		const filePath = join(dir, 'pkg.json');
		writeFileSync(filePath, '{"name":"@atlaskit/test"}');

		expect(readJsonFile(filePath)).toEqual({ name: '@atlaskit/test' });
	});
});
