import { type default as core, type Node } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { addCommentBefore } from './add-comment-before';

export function addCommentToStartOfFile({
	j,
	base,
	message,
}: {
	j: core.JSCodeshift;
	base: Collection<Node>;
	message: string;
}): void {
	addCommentBefore({
		j,
		// @ts-ignore
		target: base.find(j.Program),
		message,
	});
}
