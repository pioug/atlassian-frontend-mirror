import legacyMetadata from '@atlaskit/icon/metadata';

import metadataCore from '../../metadata-core';
import migrationMap from '../../migration-map';

const newIconKeys = Object.keys(metadataCore);

describe('Migration map', () => {
	test('Validate migration map matches the set of legacy icons', () => {
		const migrationMapKeys = Object.keys(migrationMap).sort();
		const legacyMetadataKeys = Object.keys(legacyMetadata).sort();

		// Check if legacy icons are contained in migration map
		migrationMapKeys.forEach((key) => {
			expect(legacyMetadataKeys).toContain(key);
		});
	});
	test('Validate migration map links to real icons from the new set', () => {
		const migrationMapKeys = Object.values(migrationMap).reduce((acc: string[], map) => {
			if (map.newIcon?.name) {
				acc.push(map.newIcon?.name);
			}
			return acc;
		}, []);

		migrationMapKeys.forEach((key) => {
			expect(newIconKeys).toContain(key);
		});
	});
});
