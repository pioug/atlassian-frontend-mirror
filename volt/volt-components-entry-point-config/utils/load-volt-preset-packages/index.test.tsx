import { mkdtempSync, mkdirSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { loadVoltPresetPackageMap } from '../load-volt-preset-packages';

describe('loadVoltPresetPackageMap', () => {
	it('maps Stage 1 / Stage 2 flags and prefers package.json names', () => {
		const root = mkdtempSync(join(tmpdir(), 'volt-preset-'));
		const presetDir = join(root, 'platform');
		const pkgDir = join(root, 'platform/packages/uip/atlassian-context');
		mkdirSync(presetDir, { recursive: true });
		mkdirSync(pkgDir, { recursive: true });

		writeFileSync(
			join(pkgDir, 'package.json'),
			JSON.stringify({ name: '@atlaskit/atlassian-context' }),
		);
		writeFileSync(
			join(presetDir, 'volt-preset-packages.json'),
			JSON.stringify({
				packages: [
					{
						name: '@atlassian/atlassian-context',
						dir: 'platform/packages/uip/atlassian-context',
						voltCompliant: true,
						consumersMigrated: true,
					},
					{
						name: '@atlaskit/button',
						dir: 'platform/packages/design-system/missing',
						voltCompliant: false,
					},
					{
						name: '@atlaskit/flag',
						dir: 'platform/packages/design-system/also-missing',
						voltCompliant: true,
					},
				],
			}),
		);

		expect(loadVoltPresetPackageMap(root)).toEqual({
			'@atlaskit/atlassian-context': { voltCompliant: true, consumersMigrated: true },
			'@atlaskit/button': { voltCompliant: false, consumersMigrated: false },
			'@atlaskit/flag': { voltCompliant: true, consumersMigrated: false },
		});
	});
});
