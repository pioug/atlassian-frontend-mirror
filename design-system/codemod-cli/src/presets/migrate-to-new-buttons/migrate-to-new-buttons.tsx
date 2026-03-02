import type { API, FileInfo } from 'jscodeshift';

import migrateLinkButtonToLinkTransformer from './codemods/next-migrate-link-button-to-link';
import migrateToNewButtonVariantsTransformer from './codemods/next-migrate-to-new-button-variants';
import removeUnsafeSizeTransformer from './codemods/next-remove-unsafe-size';
import splitImportsTransformer from './codemods/next-split-imports';

export default async function transformer(file: FileInfo, api: API): Promise<string> {
	const transformers = [
		splitImportsTransformer,
		migrateToNewButtonVariantsTransformer,
		removeUnsafeSizeTransformer,
		migrateLinkButtonToLinkTransformer,
	];
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
