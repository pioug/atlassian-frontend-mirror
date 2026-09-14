import { mkdirSync, mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import type { LocatedPackage } from '../../scripts/types';
import { detectBarrels } from '../detect-barrels';

describe('detectBarrels', () => {
	it('detects root and nested barrels with children', () => {
		const dir = mkdtempSync(join(tmpdir(), 'detect-barrels-'));
		mkdirSync(join(dir, 'src', 'compiled'), { recursive: true });
		writeFileSync(join(dir, 'src', 'index.tsx'), 'export const Root = 1;\n');
		writeFileSync(join(dir, 'src', 'compiled', 'index.tsx'), 'export const Compiled = 1;\n');
		writeFileSync(join(dir, 'src', 'compiled', 'box.tsx'), 'export const Box = 1;\n');

		const pkg: LocatedPackage = {
			name: '@atlaskit/test',
			packageDir: dir,
			packageJsonPath: join(dir, 'package.json'),
			packageJson: {
				name: '@atlaskit/test',
				exports: {
					'.': './src/index.tsx',
					'./compiled': './src/compiled/index.tsx',
					'./compiled/box': './src/compiled/box.tsx',
				},
			},
		};

		const barrels = detectBarrels(pkg);
		expect(barrels.map((barrel) => barrel.barrelKey).sort()).toEqual(['', '/compiled']);
	});
});
