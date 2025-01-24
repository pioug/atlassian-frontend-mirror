import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import { createRule } from '@atlaskit/editor-common/utils';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { createPlugin } from '@atlaskit/prosemirror-input-rules';

import { createExternalMediaNode } from '../ui/hooks/utils';

export function inputRulePlugin(
	schema: Schema,
	featureFlags: FeatureFlags,
): SafePlugin | undefined {
	if (!schema.nodes.media || !schema.nodes.mediaSingle) {
		return;
	}

	// ![something](link) should convert to an image
	// eslint-disable-next-line require-unicode-regexp
	const imageRule = createRule(/!\[(.*)\]\((\S+)\)$/, (state, match, start, end) => {
		const { schema } = state;
		const attrs = {
			src: match[2],
			alt: match[1],
		};

		const node = createExternalMediaNode(attrs.src, schema);
		if (node) {
			return state.tr.replaceWith(start, end, node);
		}

		return null;
	});

	return new SafePlugin(createPlugin('image-upload', [imageRule]));
}

export default inputRulePlugin;
