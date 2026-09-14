import { mkdirSync, mkdtempSync, realpathSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { resolvePackageRelativePath } from '../resolve-package-relative-path';

describe('resolvePackageRelativePath', () => {
	it('resolves package-relative export targets', () => {
		const dir = mkdtempSync(join(tmpdir(), 'resolve-package-relative-path-'));
		mkdirSync(join(dir, 'src'), { recursive: true });
		const filePath = join(dir, 'src', 'index.tsx');
		writeFileSync(filePath, 'export {};');

		expect(resolvePackageRelativePath(dir, './src/index.tsx')).toBe(realpathSync(filePath));
	});
});
