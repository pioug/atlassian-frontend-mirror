import type { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export type NodeSerializer = (opts: NodeSerializerOpts) => string;
export type MarkSerializer = (opts: MarkSerializerOpts) => string;

export type Style = { [key: string]: string | number | undefined };
export type Attrs = { [key: string]: string };

export interface NodeSerializerOpts {
	ancestors?: PMNode[];
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs: { [key: string]: any };
	context?: MetaDataContext;
	marks: readonly Mark[];
	node: PMNode;
	parent?: PMNode;
	text?: string | null;
}

export interface MarkSerializerOpts {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	context?: any;
	mark: Mark;
	text: string;
}

export interface SmartCardWithUrlAttributes {
	url: string;
}

interface ScData {
	'@type': string;
	generator: {
		'@type': string;
		name: string;
	};
	name: string;
	summary: string;
	url: string;
}

export interface SmartCardWithDataAttributes {
	data: ScData;
}

export interface EmailSerializerOpts {
	isImageStubEnabled: boolean;
	isInlineCSSEnabled: boolean;
}

// Based on https://media-api-internal.atlassian.io/api.html#file
export type MediaType = 'image' | 'doc' | 'video' | 'audio' | 'archive' | 'unknown';

export interface MediaMetaDataContextItem {
	mediaType: MediaType;
	mimeType: string;
	name: string;
	size: number;
}
export interface MetaDataContext {
	ancestors?: string[];
	baseURL?: string;
	conversion?: {
		inlineCardConversion?: { [key: string]: string };
	};
	highlightedMentionNodeID?: string;
	hydration?: {
		mediaMetaData?: { [key: string]: MediaMetaDataContextItem };
	};
	renderExternalImages?: boolean;
}
