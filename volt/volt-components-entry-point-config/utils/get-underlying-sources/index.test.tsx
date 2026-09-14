import { mkdtempSync, realpathSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { getUnderlyingSources } from '../get-underlying-sources';

describe('getUnderlyingSources', () => {
	it('includes the file and its re-export targets', () => {
		const dir = mkdtempSync(join(tmpdir(), 'get-underlying-sources-'));
		const impl = join(dir, 'impl.tsx');
		const entry = join(dir, 'entry.tsx');
		writeFileSync(impl, 'export function Box() { return null; }\n');
		writeFileSync(entry, "export { Box } from './impl';\n");

		const sources = getUnderlyingSources(entry);
		expect(sources.has(entry)).toBe(true);
		expect(sources.has(realpathSync(impl))).toBe(true);
	});
});
