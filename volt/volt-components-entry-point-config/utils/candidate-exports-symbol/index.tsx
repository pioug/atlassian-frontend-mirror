import type { DetectedBarrel, SubpathCandidate, SymbolMatch } from '../../scripts/types';

/**
 * Determine how `candidate` exposes `symbol`, or `null` when it does not export it.
 */
export function candidateExportsSymbol(
	candidate: SubpathCandidate,
	symbol: DetectedBarrel['symbols'][number],
): SymbolMatch | null {
	if (symbol.exportName !== 'default' && candidate.symbols.has(symbol.exportName)) {
		return { shape: 'named', exportedAs: symbol.exportName };
	}

	// The barrel may publish the symbol under a different name than its source module uses
	// (`export { Checkbox as default }`), and entry-points re-export the source name.
	if (symbol.localName !== 'default' && candidate.symbols.has(symbol.localName)) {
		return { shape: 'named', exportedAs: symbol.localName };
	}

	const sameSource =
		symbol.sourceFilePath !== null && candidate.underlyingSources.has(symbol.sourceFilePath);

	// The symbol is its source module's default export, which the entry-point re-exports as
	// `default`. Matching on the local name rather than on source-file identity alone is what
	// stops every other symbol declared in that file from also claiming this default.
	if (symbol.localName === 'default' && sameSource && candidate.symbols.has('default')) {
		return { shape: 'default' };
	}

	return null;
}
