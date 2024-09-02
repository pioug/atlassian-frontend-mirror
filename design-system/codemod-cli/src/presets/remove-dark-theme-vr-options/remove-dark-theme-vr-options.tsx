import type { API, FileInfo } from 'jscodeshift';

import removeGeminiDarkOptionTransformer from './codemods/remove-gemini-dark-options-transformer';

export default async function transformer(file: FileInfo, api: API): Promise<string> {
	const transformers = [removeGeminiDarkOptionTransformer];
	let src = file.source;
	transformers.forEach((transformer) => {
		if (typeof src === 'undefined') {
			return;
		}
		const nextSrc = transformer({ ...file, source: src }, api);

		if (nextSrc) {
			src = nextSrc;
		}
	});

	return src;
}
