import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

export const defaultWordWrapState = false;

export const codeBlockWrappedStates: WeakMap<PmNode, boolean | undefined> = new WeakMap();

export const isCodeBlockWordWrapEnabled = (codeBlockNode: PmNode): boolean => {
	if (!fg('editor_support_code_block_wrapping')) {
		return false;
	}
	const currentNodeWordWrapState = codeBlockWrappedStates.get(codeBlockNode);

	return currentNodeWordWrapState !== undefined ? currentNodeWordWrapState : defaultWordWrapState;
};

/**
 * As the code block node is used as the key, there is instances where the node will be destroyed & recreated and is no longer a valid key.
 * In these instances, we must get the value from that old node and set it to the value of the new node.
 */
export const transferCodeBlockWrappedValue = (
	oldCodeBlockNode: PmNode,
	newCodeBlockNode: PmNode,
): void => {
	if (!fg('editor_support_code_block_wrapping')) {
		return;
	}

	const previousValue = codeBlockWrappedStates.get(oldCodeBlockNode);

	if (previousValue !== undefined) {
		codeBlockWrappedStates.set(newCodeBlockNode, previousValue);

		codeBlockWrappedStates.delete(oldCodeBlockNode);
	}
};
