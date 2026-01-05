import type { API, FileInfo } from 'jscodeshift';

import migrateDeprecatedIconTransformer from './codemods/migrate-deprecated-icon';

export default async function transformer(file: FileInfo, api: API): Promise<string> {
	const transformers = [migrateDeprecatedIconTransformer];

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
