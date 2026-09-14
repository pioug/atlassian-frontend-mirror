/* eslint-disable @atlaskit/editor/no-re-export -- VOLTC-139 tracks removal of these deprecated compatibility re-export shims. */
import type { AttributeSpec, NodeSpec } from '@atlaskit/editor-prosemirror/model';

import { media as mediaFactory } from '../../next-schema/generated/nodeTypes';
import { uuid } from '../../utils/uuid';
import type { AnnotationMarkDefinition } from '../marks/annotation';
import type { BorderMarkDefinition } from '../marks/border';
import type { LinkDefinition } from '../marks/link';
import { createMediaSpec } from './create-media-spec';

export type MediaType = 'file' | 'link' | 'external';

export type DisplayType = 'file' | 'thumbnail';

export type DefaultAttributes<T> = {
	[P in keyof T]: {
		default?: T[P] | null;
	};
};

/**
 * @name media_node
 */
export interface MediaDefinition {
	/**
	 * Minimum item: 1
	 */
	attrs: MediaADFAttrs;
	marks?: Array<LinkDefinition | BorderMarkDefinition | AnnotationMarkDefinition>;

	type: 'media';
}

export interface MediaBaseAttributes {
	// For copy & paste
	__contextId?: string | null;
	// For JIRA
	__displayType?: DisplayType | null;
	// is set to true when new external media is inserted, false for external media in existing documents
	__external?: boolean;
	__fileMimeType?: string | null;
	// For both CQ and JIRA
	__fileName?: string | null;
	// For CQ
	__fileSize?: number | null;
	// For tracing media operations
	__mediaTraceId?: string | null;
	alt?: string;
	collection: string;
	height?: number;
	/**
	 * Minimum length: 1
	 */
	id: string;
	localId?: string;

	/**
	 * Occurrence key (minimum length: 1)
	 */
	occurrenceKey?: string;
	width?: number;
}

export interface MediaAttributes extends MediaBaseAttributes {
	type: 'file' | 'link';
}

export interface ExternalMediaAttributes {
	__external?: boolean;
	alt?: string;
	height?: number;
	localId?: string;
	type: 'external';
	url: string;
	width?: number;
}

export type MediaADFAttrs = MediaAttributes | ExternalMediaAttributes;

export const defaultAttrs:
	| {
			[name: string]: AttributeSpec;
	  }
	| undefined = {
	...mediaFactory({}).attrs,
};

export interface MutableMediaAttributes extends MediaAttributes {
	[key: string]: string | number | undefined | null | boolean;
}

export const media: NodeSpec = createMediaSpec(defaultAttrs, false, false);

export const mediaWithLocalId: NodeSpec = createMediaSpec(
	{ ...defaultAttrs, localId: { default: uuid.generate() } },
	false,
	true,
);

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { camelCaseToKebabCase } from './camel-case-to-kebab-case';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { copyPrivateAttributes } from './copy-private-attributes';
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- Public compatibility re-export.
export { toJSON } from './to-json-2';
