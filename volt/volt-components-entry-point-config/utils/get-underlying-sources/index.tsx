import { parseFileSymbols } from '../parse-file-symbols';

/**
 * Collect this file plus any relative modules it re-exports from.
 */
export function getUnderlyingSources(filePath: string): Set<string> {
	const sources = new Set<string>([filePath]);
	const symbols = parseFileSymbols(filePath);
	for (const symbol of symbols) {
		if (symbol.sourceFilePath) {
			sources.add(symbol.sourceFilePath);
		}
	}
	return sources;
}
