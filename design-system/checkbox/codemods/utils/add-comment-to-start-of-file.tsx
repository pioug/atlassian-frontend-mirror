import { type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { addCommentBefore } from './add-comment-before';

export function addCommentToStartOfFile({
	j,
	base,
	message,
}: {
	j: JSCodeshift;
	base: Collection<Node>;
	message: string;
}): void {
	addCommentBefore({
		j,
		target: base.find(j.Program),
		message,
	});
}
