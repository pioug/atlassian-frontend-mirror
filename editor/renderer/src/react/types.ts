import type { PropsWithChildren } from 'react';
import type { Node as PMNode, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { EventHandlers } from '@atlaskit/editor-common/ui';
import type { AnalyticsEventPayload } from '../analytics/events';
import type { Serializer } from '../serializer';
import type { RendererAppearance, HeadingAnchorLinksProps } from '../ui/Renderer/types';
import type { AnnotationId, AnnotationTypes } from '@atlaskit/adf-schema';

export interface RendererContext {
	objectAri?: string;
	containerAri?: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	adDoc?: any;
	schema?: Schema;
}

export interface NodeMeta {
	text?: PMNode['text'];
	providers?: ProviderFactory | undefined;
	eventHandlers?: EventHandlers | undefined;
	extensionHandlers?: ExtensionHandlers | undefined;
	portal?: HTMLElement | undefined;
	rendererContext?: RendererContext;
	serializer: Serializer<JSX.Element>;
	content?: {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	} | null;
	allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
	allowCopyToClipboard?: boolean;
	allowWrapCodeBlock?: boolean;
	allowPlaceholderText?: boolean;
	allowCustomPanels?: boolean;
	rendererAppearance?: RendererAppearance;
	fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
	nodeType: NodeType['name'];
	marks: PMNode['marks'];
	dataAttributes: {
		'data-renderer-start-pos': number;
	};
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export interface MarkMeta {
	dataAttributes: {
		'data-renderer-mark': true;
		'data-block-mark'?: true;
	};
	eventHandlers?: EventHandlers;
	fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	markKey?: any;
	// Whether the node this mark belongs to is an inline node, if available
	isInline?: boolean;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

export interface AnnotationMarkMeta extends MarkMeta {
	id: AnnotationId;
	annotationType: AnnotationTypes;
	annotationParentIds: string[];
	allowAnnotations: boolean;
	useBlockLevel?: boolean;
	isMediaInline?: boolean;
}

export type NodeProps<NodeAttrs = Object> = NodeAttrs & PropsWithChildren<NodeMeta>;
export type MarkProps<MarkAttrs = Object> = MarkAttrs & PropsWithChildren<MarkMeta>;

export type TextHighlighter = {
	pattern: RegExp;
	component: React.ComponentType<{
		children: React.ReactNode;
		match: string;
		marks: Set<string>; // In future maybe extract the mark names from Schema
		groups: Array<string> | undefined;
		startPos: number;
	}>;
};
