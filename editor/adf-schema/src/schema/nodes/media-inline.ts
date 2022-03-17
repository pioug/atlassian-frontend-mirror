import { NodeSpec } from 'prosemirror-model';
import { LinkDefinition } from '../marks/link';
import { MediaBaseAttributes, createMediaSpec, defaultAttrs } from './media';

export interface MediaInlineAttributes extends MediaBaseAttributes {
  data?: object;
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
