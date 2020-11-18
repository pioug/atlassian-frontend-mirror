import { Step } from 'prosemirror-transform';

import { AnnotationId, AnnotationTypes } from '@atlaskit/adf-schema';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';

import {
  AnnotationState,
  AnnotationUpdateEmitter,
  AnnotationUpdateEvent,
  AnnotationUpdateEventPayloads,
  OnAnnotationClickPayload,
} from './emitter';

export type { AnnotationState };

export type AnnotationByMatches = {
  originalSelection: string;
  numMatches: number;
  matchIndex: number;
  isAnnotationAllowed?: boolean;
};

type ActionResult = { step: Step; doc: JSONDocNode } | false;
export type AnnotationActionResult =
  | ({ step: Step; doc: JSONDocNode } & AnnotationByMatches)
  | false;

export type InlineCommentSelectionComponentProps = {
  /**
   * Range selected
   */
  range: Range;

  /**
   * Renderer/Editor DOM element ancestors wrapping the selection.
   */
  wrapperDOM: HTMLElement;

  /**
   * If it is possible to add an inline comment on this range
   */
  isAnnotationAllowed: boolean;

  /**
   * Creates an annotation mark in the document with the given id.
   */
  onCreate: (annotationId: AnnotationId) => AnnotationActionResult;

  /**
   * Indicates that a draft comment was discarded/cancelled
   */
  onClose: () => void;

  /**
   * Call this function to surround the range with a HTML tag.
   */
  applyDraftMode: (keepNativeSelection?: boolean) => void;

  /**
   * Call this function to remove the draft HTML tags created by the applyDraftMode
   */
  removeDraftMode: () => void;

  /**
   * getAnnotationIndexMatch finds the { numMatch, matchIndex } tuple of the current selection
   */
  getAnnotationIndexMatch?: () => AnnotationByMatches | false;
};

type AnnotationInfo = {
  id: AnnotationId;
  type: AnnotationTypes.INLINE_COMMENT;
};

export type InlineCommentViewComponentProps = {
  /**
   * Existing annotations where the cursor is placed.
   * These are provided in order, inner-most first.
   */
  annotations: Array<AnnotationInfo>;

  /**
   * eventTarget of the tapped annotation. Useful for UI positioning.
   */
  clickElementTarget?: HTMLElement;

  deleteAnnotation: (annotationInfo: AnnotationInfo) => ActionResult;
};

interface AnnotationTypeProvider<Type> {
  getState: (annotationIds: string[]) => Promise<AnnotationState<Type>[]>;
  updateSubscriber?: AnnotationUpdateEmitter;
  allowDraftMode?: boolean;
}

export type InlineCommentAnnotationProvider = AnnotationTypeProvider<
  AnnotationTypes.INLINE_COMMENT
> & {
  selectionComponent?: React.ComponentType<
    InlineCommentSelectionComponentProps
  >;
  viewComponent?: React.ComponentType<InlineCommentViewComponentProps>;
};

export type AnnotationProviders = {
  inlineComment: InlineCommentAnnotationProvider;
};

export { AnnotationUpdateEmitter, AnnotationUpdateEvent };
export type { AnnotationUpdateEventPayloads, OnAnnotationClickPayload };
