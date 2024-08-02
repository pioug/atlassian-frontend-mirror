import legacyMetadata from '../../metadata';
import metadataCore from '../../metadata-core';
import metadataUtility from '../../metadata-utility';
import migrationMap from '../../migration-map';

const newIconKeys = Object.keys(metadataCore).concat(Object.keys(metadataUtility));

// TODO: skip this test until migration map is updated
xdescribe('Migration map', () => {
	test('Validate migration map matches the set of legacy icons', () => {
		const migrationMapKeys = Object.keys(migrationMap).sort();
		const legacyMetadataKeys = Object.keys(legacyMetadata).sort();

		// Check if all legacy icons have a migration map
		expect(migrationMapKeys).toEqual(legacyMetadataKeys);
	});
	test('Validate migration map links to real icons from the new set', () => {
		const migrationMapKeys = Object.values(migrationMap).reduce((acc: string[], map) => {
			if (map.newIcon?.name) {
				acc.push(map.newIcon?.name);
			}
			if (map.additionalIcons) {
				map.additionalIcons.forEach((icon) => {
					acc.push(icon.name);
				});
			}
			return acc;
		}, []);

		migrationMapKeys.forEach((key) => {
			expect(newIconKeys).toContain(key);
		});
	});
});
