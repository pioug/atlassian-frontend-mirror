import fs from 'fs';
import path from 'path';

import { OBJECT_MAP } from '../../../build';

/**
 * Required to ensure that the package.json exports are updated correctly
 * by the build script.
 */
describe('Package.json exports', () => {
	it('should have all object components exported in package.json', () => {
		const packageJsonPath = path.resolve(__dirname, '../../../package.json');
		const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
		const packageJson = JSON.parse(packageJsonContent);

		// Get all object names from OBJECT_MAP (source of truth)
		const expectedObjectNames = Object.keys(OBJECT_MAP).sort();

		// Get all exports from package.json
		const exports = packageJson.exports || {};
		const exportedObjectNames = Object.keys(exports)
			.filter(
				(exportPath) =>
					exportPath.startsWith('./') &&
					!exportPath.includes('*') &&
					!exportPath.startsWith('./tile/'),
			)
			.map((exportPath) => exportPath.substring(2)) // Remove './' prefix
			.sort();

		// Check that all objects from OBJECT_MAP are exported
		expectedObjectNames.forEach((objectName) => {
			expect(exportedObjectNames).toContain(objectName);
		});

		// Check that all exported objects exist in OBJECT_MAP
		exportedObjectNames.forEach((objectName) => {
			expect(expectedObjectNames).toContain(objectName);
		});

		// Verify the export paths are correct
		expectedObjectNames.forEach((objectName) => {
			const expectedPath = `./src/components/object/components/${objectName}.tsx`;
			expect(exports[`./${objectName}`]).toBe(expectedPath);
		});
	});

	it('should have all object tile components exported in package.json', () => {
		const packageJsonPath = path.resolve(__dirname, '../../../package.json');
		const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
		const packageJson = JSON.parse(packageJsonContent);

		// Get all object names from OBJECT_MAP (source of truth)
		const expectedObjectNames = Object.keys(OBJECT_MAP).sort();

		// Get all tile exports from package.json
		const exports = packageJson.exports || {};
		const exportedTileNames = Object.keys(exports)
			.filter((exportPath) => exportPath.startsWith('./tile/'))
			.map((exportPath) => exportPath.substring(7)) // Remove './tile/' prefix
			.sort();

		// Check that all objects from OBJECT_MAP have tile exports
		expectedObjectNames.forEach((objectName) => {
			expect(exportedTileNames).toContain(objectName);
		});

		// Check that all exported tile objects exist in OBJECT_MAP
		exportedTileNames.forEach((objectName) => {
			expect(expectedObjectNames).toContain(objectName);
		});

		// Verify the tile export paths are correct
		expectedObjectNames.forEach((objectName) => {
			const expectedPath = `./src/components/object-tile/components/${objectName}.tsx`;
			expect(exports[`./tile/${objectName}`]).toBe(expectedPath);
		});
	});
});
