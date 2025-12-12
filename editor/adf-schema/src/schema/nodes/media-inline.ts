import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';
import type { LinkDefinition } from '../marks/link';
import type { MediaBaseAttributes } from './media';
import { createMediaSpec } from './media';
import type { BorderMarkDefinition } from '../marks/border';
import type { AnnotationMarkDefinition } from '../marks/annotation';

import { uuid } from '../../utils/uuid';
import { mediaInline as mediaInlineFactory } from '../../next-schema/generated/nodeTypes';

export interface MediaInlineAttributes extends MediaBaseAttributes {
	data?: object;
	type?: 'file' | 'link' | 'image';
	url?: string | null;
}

/**
 * @name mediaInline_node
 */
export interface MediaInlineDefinition {
	attrs: MediaInlineAttributes;
	marks?: Array<LinkDefinition | BorderMarkDefinition | AnnotationMarkDefinition>;
	type: 'mediaInline';
}

export const mediaInline: NodeSpec = createMediaSpec(mediaInlineFactory({}).attrs, true);

export const mediaInlineWithLocalId: NodeSpec = createMediaSpec(
	{ ...mediaInlineFactory({}).attrs, localId: { default: uuid.generate() } },
	true,
	true,
);
