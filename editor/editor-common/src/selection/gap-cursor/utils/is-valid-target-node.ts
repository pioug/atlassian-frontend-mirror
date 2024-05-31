import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { isIgnored } from './is-ignored';

export const isValidTargetNode = (node?: PMNode | null): boolean => {
	return !!node && !isIgnored(node);
};
