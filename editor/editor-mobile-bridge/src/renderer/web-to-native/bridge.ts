import { AnnotationId, AnnotationTypes } from '@atlaskit/adf-schema';
import { AnnotationByMatches } from '@atlaskit/editor-common';
import { TaskState } from '@atlaskit/task-decision';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { Serialized } from '../../types';

export type AnnotationPayloadsByType = {
  annotationIds: AnnotationId[];
  annotationType: AnnotationTypes;
};

export type AnnotationWithRectPayloadsByType = {
  annotations: {
    rect: ClientRect;
    id: AnnotationId;
    text: string;
  }[];
  annotationType: AnnotationTypes;
};

export type AnnotationTypesAvailableOnCurrentSelection = {
  type: AnnotationTypes;
  canAnnotate: boolean;
};

export interface AnnotationBridge {
  onAnnotationClick(
    annotationClickPayload?: Serialized<AnnotationPayloadsByType[]>,
  ): void;

  onAnnotationClickWithRect(
    annotationClickWithGeometryPayload?: Serialized<
      AnnotationWithRectPayloadsByType[]
    >,
  ): void;

  fetchAnnotationStates(
    annotations: Serialized<AnnotationPayloadsByType[]>,
  ): void;

  canApplyAnnotationOnCurrentSelection(
    payload: Serialized<AnnotationTypesAvailableOnCurrentSelection[]>,
  ): void;

  annotationIndexMatch(payload: Serialized<AnnotationByMatches>): void;
}

export interface ContentBridge {
  onContentRendered(
    totalNodeSize: number,
    nodes: string,
    actualRenderingDuration: number,
    totalBridgeDuration: number,
  ): void;
  setContent(adf: Serialized<JSONDocNode>): void;
}

export interface TaskDecisionBridge {
  updateTask(taskId: string, state: TaskState): void;
}

export interface LinkBridge {
  onLinkClick(url: string): void;
}

export interface MediaBridge {
  onMediaClick(mediaId: string, occurrenceKey?: string | null): void;
}

export interface MentionBridge {
  onMentionClick(profileId: string): void;
}

export interface RenderBridge {
  onContentRendered(): void;
  onRenderedContentHeightChanged(newHeight: number): void;
}

export interface AnalyticsBridge {
  trackEvent(event: string): void;
}

export interface LifecycleBridge {
  rendererReady(): void;
  rendererDestroyed(): void;
}

export default interface WebBridge
  extends LinkBridge,
    TaskDecisionBridge,
    MediaBridge,
    MentionBridge,
    RenderBridge,
    AnalyticsBridge,
    LifecycleBridge {}

export interface RendererBridges {
  linkBridge?: LinkBridge;
  taskDecisionBridge?: TaskDecisionBridge;
  mediaBridge?: MediaBridge;
  mentionBridge?: MentionBridge;
  renderBridge?: RenderBridge;
  analyticsBridge?: AnalyticsBridge;
  annotationBridge?: AnnotationBridge;
  contentBridge?: ContentBridge;
  lifecycleBridge?: LifecycleBridge;
}

export type RendererPluginBridges = keyof RendererBridges;
