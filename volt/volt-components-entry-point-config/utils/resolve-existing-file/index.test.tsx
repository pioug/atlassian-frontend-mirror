import { mkdtempSync, realpathSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { resolveExistingFile } from '../resolve-existing-file';

describe('resolveExistingFile', () => {
	it('resolves an exact file path', () => {
		const dir = mkdtempSync(join(tmpdir(), 'resolve-existing-file-'));
		const filePath = join(dir, 'thing.tsx');
		writeFileSync(filePath, 'export {};');

		expect(resolveExistingFile(filePath)).toBe(realpathSync(filePath));
	});

	it('resolves a path by appending a source extension', () => {
		const dir = mkdtempSync(join(tmpdir(), 'resolve-existing-file-'));
		const filePath = join(dir, 'thing.tsx');
		writeFileSync(filePath, 'export {};');

		expect(resolveExistingFile(join(dir, 'thing'))).toBe(realpathSync(filePath));
	});

	it('returns null when nothing matches', () => {
		expect(resolveExistingFile(join(tmpdir(), 'definitely-missing-file'))).toBeNull();
	});
});
