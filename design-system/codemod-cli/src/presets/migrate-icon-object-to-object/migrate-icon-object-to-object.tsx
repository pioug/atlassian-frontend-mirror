import type { API, FileInfo } from 'jscodeshift';

import migrateIconObjectToObjectTransformer from './codemods/migrate-icon-object-to-object';

export default async function transformer(file: FileInfo, api: API): Promise<string> {
	const transformers = [migrateIconObjectToObjectTransformer];

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
