import { mkdirSync, mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import type { LocatedPackage } from '../../scripts/types';
import { buildSubpathCandidates } from '../build-subpath-candidates';

describe('buildSubpathCandidates', () => {
	it('skips barrel keys and builds candidates for remaining exports', () => {
		const dir = mkdtempSync(join(tmpdir(), 'build-subpath-candidates-'));
		mkdirSync(join(dir, 'src'), { recursive: true });
		writeFileSync(join(dir, 'src', 'index.tsx'), 'export const Root = 1;\n');
		writeFileSync(join(dir, 'src', 'box.tsx'), 'export const Box = 1;\n');

		const pkg: LocatedPackage = {
			name: '@atlaskit/test',
			packageDir: dir,
			packageJsonPath: join(dir, 'package.json'),
			packageJson: {
				name: '@atlaskit/test',
				exports: {
					'.': './src/index.tsx',
					'./box': './src/box.tsx',
				},
			},
		};

		const candidates = buildSubpathCandidates(pkg, ['']);
		expect(candidates).toHaveLength(1);
		expect(candidates[0].entryPoint).toBe('/box');
		expect(candidates[0].symbols.has('Box')).toBe(true);
	});
});
