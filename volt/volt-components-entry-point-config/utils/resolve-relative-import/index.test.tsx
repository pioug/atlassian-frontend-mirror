import { mkdtempSync, realpathSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { resolveRelativeImport } from '../resolve-relative-import';

describe('resolveRelativeImport', () => {
	it('resolves a relative import from a file', () => {
		const dir = mkdtempSync(join(tmpdir(), 'resolve-relative-import-'));
		const fromFile = join(dir, 'index.tsx');
		const target = join(dir, 'child.tsx');
		writeFileSync(fromFile, '');
		writeFileSync(target, 'export {};');

		expect(resolveRelativeImport(fromFile, './child')).toBe(realpathSync(target));
	});

	it('returns null for non-relative imports', () => {
		expect(resolveRelativeImport('/tmp/index.tsx', '@atlaskit/button')).toBeNull();
	});
});
