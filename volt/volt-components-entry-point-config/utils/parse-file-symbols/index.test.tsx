import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { parseFileSymbols } from '../parse-file-symbols';

describe('parseFileSymbols', () => {
	it('parses named and default exports', () => {
		const dir = mkdtempSync(join(tmpdir(), 'parse-file-symbols-'));
		const filePath = join(dir, 'mod.tsx');
		writeFileSync(
			filePath,
			[
				'export type FooProps = { id: string };',
				'export function Foo() { return null; }',
				'export default function Bar() { return null; }',
			].join('\n'),
		);

		const symbols = parseFileSymbols(filePath);
		const names = symbols.map((symbol) => symbol.exportName).sort();
		expect(names).toEqual(['Foo', 'FooProps', 'default']);
	});

	it('reports the name a re-exported symbol has inside its source module', () => {
		const dir = mkdtempSync(join(tmpdir(), 'parse-file-symbols-'));
		const filePath = join(dir, 'index.tsx');
		writeFileSync(join(dir, 'checkbox.tsx'), 'export const Checkbox = null;\n');
		writeFileSync(join(dir, 'icon-tile.tsx'), 'export default function IconTile() {}\n');
		writeFileSync(join(dir, 'types.tsx'), 'export type Props = { id: string };\n');
		writeFileSync(join(dir, 'list.tsx'), 'export default class List {}\n');
		writeFileSync(
			filePath,
			[
				"import List from './list';",
				"export { default as IconTile } from './icon-tile';",
				"export { Checkbox as default } from './checkbox';",
				"export type { Props as TextFieldProps } from './types';",
				'export { List };',
			].join('\n'),
		);

		const byExportName = new Map(
			parseFileSymbols(filePath).map((symbol) => [symbol.exportName, symbol.localName]),
		);

		expect(byExportName.get('IconTile')).toBe('default');
		expect(byExportName.get('default')).toBe('Checkbox');
		expect(byExportName.get('TextFieldProps')).toBe('Props');
		// Bound by a default import, so it is `default` in `list.tsx` despite the named re-export.
		expect(byExportName.get('List')).toBe('default');
	});
});
