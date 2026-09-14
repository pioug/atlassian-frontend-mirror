import { mkdirSync, mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { buildPackageNameIndex } from '../build-package-name-index';

describe('buildPackageNameIndex', () => {
	it('indexes package.json files by name', () => {
		const root = mkdtempSync(join(tmpdir(), 'build-package-name-index-'));
		const pkgDir = join(root, 'design-system', 'button');
		mkdirSync(pkgDir, { recursive: true });
		writeFileSync(join(pkgDir, 'package.json'), '{"name":"@atlaskit/button"}');

		const index = buildPackageNameIndex(root);

		expect(index.get('@atlaskit/button')).toBe(join(pkgDir, 'package.json'));
	});
});
