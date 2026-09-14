import { createBarrelImportListeners } from '../create-barrel-import-listeners';

describe('createBarrelImportListeners', () => {
	it('registers only node-type listeners (no per-source attribute selectors)', () => {
		const onImport = jest.fn();
		const onExport = jest.fn();

		const listeners = createBarrelImportListeners({ onImport, onExport });

		expect(Object.keys(listeners).sort()).toEqual(['ExportNamedDeclaration', 'ImportDeclaration']);
		expect(listeners.ImportDeclaration).toBe(onImport);
		expect(listeners.ExportNamedDeclaration).toBe(onExport);
	});
});
