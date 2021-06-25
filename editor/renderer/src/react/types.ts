import { PropsWithChildren } from 'react';
import { Node as PMNode, NodeType, Schema } from 'prosemirror-model';
import {
  EventHandlers,
  ProviderFactory,
  ExtensionHandlers,
} from '@atlaskit/editor-common';
import { AnalyticsEventPayload } from '../analytics/events';
import { Serializer } from '../index';
import {
  RendererAppearance,
  HeadingAnchorLinksProps,
} from '../ui/Renderer/types';
import { AnnotationId, AnnotationTypes } from '@atlaskit/adf-schema';

export interface RendererContext {
  objectAri?: string;
  containerAri?: string;
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
    [key: string]: any;
  } | null;
  allowDynamicTextSizing?: boolean;
  allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
  allowCopyToClipboard?: boolean;
  allowPlaceholderText?: boolean;
  allowCustomPanels?: boolean;
  rendererAppearance?: RendererAppearance;
  fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
  nodeType: NodeType['name'];
  marks: PMNode['marks'];
  dataAttributes: {
    'data-renderer-start-pos': number;
  };
  [key: string]: any;
}

export interface MarkMeta {
  dataAttributes: {
    'data-renderer-mark': true;
  };
  eventHandlers?: EventHandlers;
  fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
  markKey?: any;
  // Whether the node this mark belongs to is an inline node, if available
  isInline?: boolean;
  [key: string]: any;
}

export interface AnnotationMarkMeta extends MarkMeta {
  id: AnnotationId;
  annotationType: AnnotationTypes;
  annotationParentIds: string[];
  allowAnnotations: boolean;
}

export type NodeProps<NodeAttrs = {}> = NodeAttrs & PropsWithChildren<NodeMeta>;
export type MarkProps<MarkAttrs = {}> = MarkAttrs & PropsWithChildren<MarkMeta>;
