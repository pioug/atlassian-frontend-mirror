import type { PropsWithChildren } from 'react';

import type { AnnotationId, AnnotationTypes } from '@atlaskit/adf-schema/annotation';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import type { Node as PMNode, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';

import type { AnalyticsEventPayload } from '../analytics/events';
import type { Serializer } from '../serializer';
import type {
	RendererAppearance,
	HeadingAnchorLinksProps,
	RendererContentMode,
	NestedRendererType,
} from '../ui/Renderer/types';

export interface RendererContext {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	adDoc?: any;
	containerAri?: string;
	nestedRendererType?: NestedRendererType;
	objectAri?: string;
	schema?: Schema;
}

/**
 * `Fragment.toJSON()`: the node's children as plain ADF JSON objects, or `null` for an empty
 * fragment. Not ProseMirror `Node` instances, so model APIs such as `nodeSize` or `childCount`
 * are unavailable.
 */
export type NodeContent = Array<{
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}> | null;

export interface NodeMeta {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
	allowCopyToClipboard?: boolean;
	allowCustomPanels?: boolean;
	allowDownloadCodeBlock?: boolean;
	allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
	allowPlaceholderText?: boolean;
	allowWrapCodeBlock?: boolean;
	asInline?: 'on' | undefined;
	dataAttributes: {
		'data-renderer-start-pos': number;
	};
	eventHandlers?: EventHandlers | undefined;
	extensionHandlers?: ExtensionHandlers | undefined;
	fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
	/**
	 * Serialized JSON (`Fragment.toJSON()`) of the node's subtree, computed on first call and
	 * memoized, so a node whose content nothing reads costs nothing.
	 */
	getContent?: () => NodeContent | undefined;
	hideExtensionKeysWhilePending?: string[];
	marks: PMNode['marks'];
	nodeType: NodeType['name'];
	/**
	 * Whether the text and paragraph fast path experiment is enabled for this render.
	 * Evaluated once per `ReactSerializer` instance rather than per node.
	 */
	plainTextFastPath?: boolean;
	portal?: HTMLElement | undefined;
	providers?: ProviderFactory | undefined;
	rendererAppearance?: RendererAppearance;
	rendererContentMode?: RendererContentMode;
	rendererContext?: RendererContext;
	serializer: Serializer<JSX.Element>;
	text?: PMNode['text'];
}

export interface MarkMeta {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
	dataAttributes: {
		'data-block-mark'?: true;
		'data-renderer-mark': true;
	};
	eventHandlers?: EventHandlers;
	fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
	// Whether the node this mark belongs to is an inline node, if available
	isInline?: boolean;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	markKey?: any;
}

export interface AnnotationMarkMeta extends MarkMeta {
	allowAnnotations: boolean;
	annotationParentIds: string[];
	annotationType: AnnotationTypes;
	id: AnnotationId;
	isMediaInline?: boolean;
	useBlockLevel?: boolean;
}

export type NodeProps<NodeAttrs = object> = NodeAttrs & PropsWithChildren<NodeMeta>;
export type MarkProps<MarkAttrs = object> = MarkAttrs & PropsWithChildren<MarkMeta>;

export type TextHighlighter = {
	component: React.ComponentType<{
		children: React.ReactNode;
		groups: Array<string> | undefined;
		marks: Set<string>; // In future maybe extract the mark names from Schema
		match: string;
		startPos: number;
	}>;
	pattern: RegExp;
};

export interface ExtensionViewportSize {
	extensionId?: string;
	viewportSize?: string;
}
