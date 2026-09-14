import { type JSDoc } from 'ts-morph';

export function docsToString(docs: JSDoc[]): string {
	return docs.length > 0
		? docs
				.map((d) => d.getDescription())
				.join('\n')
				.trim()
		: '';
}
