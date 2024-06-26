import migrationMap from '../../migration-map';
import legacyMetadata from '../../metadata';

describe('Migration map', () => {
	test('Validate migration map matches the set of legacy icons', () => {
		const migrationMapKeys = Object.keys(migrationMap).sort();
		const legacyMetadataKeys = Object.keys(legacyMetadata).sort();

		// Check if all legacy icons have a migration map
		expect(migrationMapKeys).toEqual(legacyMetadataKeys);
	});
	test('Validate migration map links to real icons from the new set', () => {
		const migrationMapKeys = Object.keys(migrationMap).sort();
		const legacyMetadataKeys = Object.keys(legacyMetadata).sort();

		// Check if all legacy icons have a migration map
		expect(migrationMapKeys).toEqual(legacyMetadataKeys);
	});
});
