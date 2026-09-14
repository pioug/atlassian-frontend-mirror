import type { DetectedBarrel, SubpathCandidate } from '../../scripts/types';
import { candidateExportsSymbol } from '../candidate-exports-symbol';

type ParsedSymbol = DetectedBarrel['symbols'][number];

function candidate(
	partial: Partial<SubpathCandidate> & Pick<SubpathCandidate, 'entryPoint'>,
): SubpathCandidate {
	return {
		entryPoint: partial.entryPoint,
		filePath: partial.filePath ?? '/pkg/src/entry-points/foo.tsx',
		symbols: partial.symbols ?? new Set(),
		underlyingSources: partial.underlyingSources ?? new Set(),
	};
}

function symbol(partial: Partial<ParsedSymbol> & Pick<ParsedSymbol, 'exportName'>): ParsedSymbol {
	return {
		exportName: partial.exportName,
		localName: partial.localName ?? partial.exportName,
		kind: partial.kind ?? 'component',
		sourceFilePath: partial.sourceFilePath ?? null,
	};
}

describe('candidateExportsSymbol', () => {
	it('matches when the candidate exports the symbol by name', () => {
		expect(
			candidateExportsSymbol(
				candidate({ entryPoint: '/box', symbols: new Set(['Box']) }),
				symbol({ exportName: 'Box' }),
			),
		).toEqual({ shape: 'named', exportedAs: 'Box' });
	});

	it('matches renamed default exports via underlying source', () => {
		expect(
			candidateExportsSymbol(
				candidate({
					entryPoint: '/avatar-item',
					symbols: new Set(['default']),
					underlyingSources: new Set(['/pkg/src/avatar-item.tsx']),
				}),
				symbol({
					exportName: 'AvatarItem',
					localName: 'default',
					sourceFilePath: '/pkg/src/avatar-item.tsx',
				}),
			),
		).toEqual({ shape: 'default' });
	});

	it('matches the name the source module uses when the barrel renamed it', () => {
		expect(
			candidateExportsSymbol(
				candidate({ entryPoint: '/types', symbols: new Set(['Props']) }),
				symbol({
					exportName: 'TextFieldProps',
					localName: 'Props',
					kind: 'type',
					sourceFilePath: '/pkg/src/types.tsx',
				}),
			),
		).toEqual({ shape: 'named', exportedAs: 'Props' });
	});

	it('does not let a sibling symbol claim the candidate default export', () => {
		// `base-new` re-exports some types from `types.tsx` and separately has a default.
		// Sharing that source file must not imply it also exports `IconTileProps`.
		expect(
			candidateExportsSymbol(
				candidate({
					entryPoint: '/base-new',
					symbols: new Set(['default', 'NewIconProps']),
					underlyingSources: new Set(['/pkg/src/types.tsx']),
				}),
				symbol({
					exportName: 'IconTileProps',
					localName: 'IconTileProps',
					kind: 'type',
					sourceFilePath: '/pkg/src/types.tsx',
				}),
			),
		).toBeNull();
	});

	it('returns null when there is no name or source match', () => {
		expect(
			candidateExportsSymbol(
				candidate({ entryPoint: '/box', symbols: new Set(['Box']) }),
				symbol({ exportName: 'Inline' }),
			),
		).toBeNull();
	});
});
