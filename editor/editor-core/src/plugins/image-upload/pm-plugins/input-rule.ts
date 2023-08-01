import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createRule, createPlugin } from '@atlaskit/prosemirror-input-rules';
import { createExternalMediaNode } from '../utils';
import type { FeatureFlags } from '../../../types/feature-flags';

export function inputRulePlugin(
  schema: Schema,
  featureFlags: FeatureFlags,
): SafePlugin | undefined {
  if (!schema.nodes.media || !schema.nodes.mediaSingle) {
    return;
  }

  // ![something](link) should convert to an image
  const imageRule = createRule(
    /!\[(.*)\]\((\S+)\)$/,
    (state, match, start, end) => {
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
    },
  );

  return createPlugin('image-upload', [imageRule]);
}

export default inputRulePlugin;
