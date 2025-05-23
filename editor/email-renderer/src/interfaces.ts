import type { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export type NodeSerializer = (opts: NodeSerializerOpts) => string;
export type MarkSerializer = (opts: MarkSerializerOpts) => string;

export type Style = { [key: string]: string | number | undefined };
export type Attrs = { [key: string]: string };

export interface NodeSerializerOpts {
	node: PMNode;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs: { [key: string]: any };
	marks: readonly Mark[];
	text?: string | null;
	parent?: PMNode;
	context?: MetaDataContext;
}

export interface MarkSerializerOpts {
	mark: Mark;
	text: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	context?: any;
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
	url: string;
	summary: string;
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
	name: string;
	mediaType: MediaType;
	mimeType: string;
	size: number;
}
export interface MetaDataContext {
	highlightedMentionNodeID?: string;
	baseURL?: string;
	conversion?: {
		inlineCardConversion?: { [key: string]: string };
	};
	hydration?: {
		mediaMetaData?: { [key: string]: MediaMetaDataContextItem };
	};
	renderExternalImages?: boolean;
}
