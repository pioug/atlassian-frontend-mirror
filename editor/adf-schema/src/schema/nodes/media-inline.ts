import { NodeSpec } from 'prosemirror-model';
import { LinkDefinition } from '../marks/link';
import { createMediaSpec, defaultAttrs, MediaBaseAttributes } from './media';

export interface MediaInlineAttributes extends MediaBaseAttributes {
  data?: object;
  type?: 'file' | 'link';
}

/**
 * @name mediaInline_node
 */
export interface MediaInlineDefinition {
  type: 'mediaInline';
  attrs: MediaInlineAttributes;
  marks?: Array<LinkDefinition>;
}

export const mediaInline: NodeSpec = createMediaSpec(defaultAttrs, true);
