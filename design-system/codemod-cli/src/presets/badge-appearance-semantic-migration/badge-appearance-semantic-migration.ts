import type { API, FileInfo } from 'jscodeshift';

import badgeAppearanceSemanticMigrationTransformer from './codemods/badge-appearance-semantic-migration';

export default async function transformer(file: FileInfo, api: API): Promise<string> {
	const transformers = [badgeAppearanceSemanticMigrationTransformer];
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
