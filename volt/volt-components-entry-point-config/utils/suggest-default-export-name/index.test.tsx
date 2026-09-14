import { suggestDefaultExportName } from '../suggest-default-export-name';

describe('suggestDefaultExportName', () => {
	it('uses the file basename', () => {
		expect(suggestDefaultExportName('/pkg/src/ui/image/index.tsx', 'Default')).toBe('Image');
	});

	it('uses the fallback when path is missing', () => {
		expect(suggestDefaultExportName(null, 'Default')).toBe('Default');
	});
});
