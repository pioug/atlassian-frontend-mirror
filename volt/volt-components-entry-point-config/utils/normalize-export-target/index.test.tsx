import { normalizeExportTarget } from '../normalize-export-target';

describe('normalizeExportTarget', () => {
	it('returns string targets as-is', () => {
		expect(normalizeExportTarget('./src/index.tsx')).toBe('./src/index.tsx');
	});

	it('prefers default then publish then import then require', () => {
		expect(normalizeExportTarget({ publish: './a.tsx', default: './b.tsx' })).toBe('./b.tsx');
		expect(normalizeExportTarget({ require: './c.tsx' })).toBe('./c.tsx');
	});

	it('returns null when no usable target exists', () => {
		expect(normalizeExportTarget({})).toBeNull();
	});
});
