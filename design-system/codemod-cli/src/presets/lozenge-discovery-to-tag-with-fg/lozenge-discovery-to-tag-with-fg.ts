import type { API, FileInfo } from 'jscodeshift';

import lozengeDiscoveryToTagWithFgTransformer from './codemods/lozenge-discovery-to-tag-with-fg';

export default async function transformer(file: FileInfo, api: API): Promise<string> {
	const transformers = [lozengeDiscoveryToTagWithFgTransformer];
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
