import { type JSDoc } from 'ts-morph';

import { tagToString } from './tag-to-string';

export function docsToTagsString(docs: JSDoc[]): string {
	return docs
		.flatMap((doc) => doc.getTags())
		.filter((t) => !['private'].includes(t.getTagName()))
		.map(tagToString)
		.join('\n')
		.trim();
}
