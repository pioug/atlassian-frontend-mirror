import type { NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';

import { inlineCardNodeView } from './inlineCard';
import type { InlineCardNodeViewProperties } from './inlineCard';

export const lazyInlineCardView = (props: InlineCardNodeViewProperties): NodeViewConstructor => {
	return inlineCardNodeView(props);
};
