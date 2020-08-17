import { Step } from 'prosemirror-transform';

import { AnnotationId, AnnotationTypes } from '@atlaskit/adf-schema';
// eslint-disable-next-line import/no-extraneous-dependencies
import { JSONDocNode } from '@atlaskit/editor-json-transformer';

import {
  AnnotationUpdateEmitter,
  AnnotationUpdateEvent,
  AnnotationUpdateEventPayloads,
} from './emitter';

export interface AnnotationState<Type, State> {
  annotationType: Type;
  id: AnnotationId;
  state: State | null;
}

type ActionResult = { step: Step; doc: JSONDocNode } | false;

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
  onCreate: (annotationId: AnnotationId) => ActionResult;

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
};

export type AnnotationProviders<State> = {
  [AnnotationTypes.INLINE_COMMENT]: {
    getState: (
      annotationIds: AnnotationId[],
    ) => Promise<AnnotationState<AnnotationTypes.INLINE_COMMENT, State>[]>;
    updateSubscriber?: AnnotationUpdateEmitter;
    allowDraftMode?: boolean;

    /**
     * After the user selects a the document this component will be renderer.
     *
     * Usually, it should a floating component
     */
    selectionComponent?: React.ComponentType<
      InlineCommentSelectionComponentProps
    >;
  };
};

export {
  AnnotationUpdateEmitter,
  AnnotationUpdateEvent,
  AnnotationUpdateEventPayloads,
};
