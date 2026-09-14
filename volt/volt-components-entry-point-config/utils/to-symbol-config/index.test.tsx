import { toSymbolConfig } from '../to-symbol-config';

const compliantReadiness = { voltCompliant: true, consumersMigrated: false };
const nonCompliantReadiness = { voltCompliant: false, consumersMigrated: false };
const stage2Readiness = { voltCompliant: true, consumersMigrated: true };

describe('toSymbolConfig', () => {
	it('omits entry-point when unmapped but still stamps package readiness', () => {
		expect(
			toSymbolConfig(
				{ exportName: 'Foo', localName: 'Foo', kind: 'component', sourceFilePath: null },
				null,
				compliantReadiness,
			),
		).toEqual({
			name: 'Foo',
			type: 'component',
			voltCompliant: true,
			consumersMigrated: false,
		});
	});

	it('sets voltCompliant from package readiness when mapped', () => {
		expect(
			toSymbolConfig(
				{ exportName: 'Foo', localName: 'Foo', kind: 'component', sourceFilePath: null },
				'/foo',
				compliantReadiness,
			),
		).toEqual({
			'entry-point': '/foo',
			name: 'Foo',
			type: 'component',
			voltCompliant: true,
			consumersMigrated: false,
		});

		expect(
			toSymbolConfig(
				{ exportName: 'Foo', localName: 'Foo', kind: 'component', sourceFilePath: null },
				'/foo',
				nonCompliantReadiness,
			),
		).toEqual({
			'entry-point': '/foo',
			name: 'Foo',
			type: 'component',
			voltCompliant: false,
			consumersMigrated: false,
		});
	});

	it('records the import form when the entry-point exposes a default export', () => {
		expect(
			toSymbolConfig(
				{ exportName: 'IconTile', localName: 'default', kind: 'component', sourceFilePath: null },
				'/icon-tile',
				compliantReadiness,
				{ shape: 'default' },
			),
		).toMatchObject({
			'entry-point': '/icon-tile',
			isDefaultExport: true,
			name: 'IconTile',
		});
	});

	it('records the entry-point name only when the barrel renamed the export', () => {
		expect(
			toSymbolConfig(
				{ exportName: 'TextFieldProps', localName: 'Props', kind: 'type', sourceFilePath: null },
				'/types',
				compliantReadiness,
				{ shape: 'named', exportedAs: 'Props' },
			),
		).toMatchObject({
			'entry-point': '/types',
			entryPointName: 'Props',
			name: 'TextFieldProps',
		});

		expect(
			toSymbolConfig(
				{ exportName: 'Foo', localName: 'Foo', kind: 'component', sourceFilePath: null },
				'/foo',
				compliantReadiness,
				{ shape: 'named', exportedAs: 'Foo' },
			),
		).not.toHaveProperty('entryPointName');
	});

	it('stamps consumersMigrated from package readiness', () => {
		expect(
			toSymbolConfig(
				{ exportName: 'Foo', localName: 'Foo', kind: 'component', sourceFilePath: null },
				'/foo',
				stage2Readiness,
			),
		).toMatchObject({
			voltCompliant: true,
			consumersMigrated: true,
		});
	});
});
