import { parseFileSymbols } from '../parse-file-symbols';

export function getExportedNames(filePath: string): Set<string> {
	const symbols = parseFileSymbols(filePath);
	return new Set(symbols.map((symbol) => symbol.exportName));
}
