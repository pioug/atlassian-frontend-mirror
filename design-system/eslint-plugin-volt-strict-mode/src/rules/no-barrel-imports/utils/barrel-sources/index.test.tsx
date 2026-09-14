/**
 * @jest-environment node
 */
import { config } from '@atlaskit/volt-components-entry-point-config';

import { buildBarrelSourceMap } from '../barrel-sources';

describe('buildBarrelSourceMap', () => {
	it('covers every barrel source in the live entry-point config', () => {
		// Pass config explicitly so this assertion does not depend on module-load order
		// relative to other tests that mock `@atlaskit/volt-components-entry-point-config`.
		const map = buildBarrelSourceMap(config);
		let expectedSources = 0;

		for (const barrels of Object.values(config)) {
			expectedSources += Object.keys(barrels).length;
		}

		expect(map.size).toBe(expectedSources);
		expect(map.size).toBeGreaterThan(0);
	});

	it('maps root barrel keys to the package name alone', () => {
		const map = buildBarrelSourceMap({
			'@atlaskit/flag': {
				'': {
					default: {
						'entry-point': '/flag',
						name: 'Flag',
						type: 'component',
						voltCompliant: true,
						consumersMigrated: false,
					},
				},
			},
		});

		expect(map.get('@atlaskit/flag')).toEqual({
			packageName: '@atlaskit/flag',
			barrelKey: '',
			exports: {
				default: {
					'entry-point': '/flag',
					name: 'Flag',
					type: 'component',
					voltCompliant: true,
					consumersMigrated: false,
				},
			},
		});
	});

	it('maps nested barrel keys onto packageName + barrelKey', () => {
		const map = buildBarrelSourceMap({
			'@atlaskit/primitives': {
				'/compiled': {
					Box: {
						'entry-point': '/compiled/box',
						name: 'Box',
						type: 'component',
						voltCompliant: true,
						consumersMigrated: false,
					},
				},
			},
		});

		expect(map.has('@atlaskit/primitives/compiled')).toBe(true);
		expect(map.get('@atlaskit/primitives/compiled')?.barrelKey).toBe('/compiled');
	});

	it('returns an empty map for an empty config', () => {
		expect(buildBarrelSourceMap({}).size).toBe(0);
	});
});
