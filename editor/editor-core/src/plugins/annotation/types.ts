import React from 'react';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { AnnotationUpdateEmitter } from './update-provider';

export type AnnotationInfo = {
  id: string;
  type: AnnotationTypes.INLINE_COMMENT;
};

type AnnotationComponentProps = {
  /**
   * Selected text (can be used when creating a comment)
   */
  textSelection?: string;

  /**
   * DOM element around selected text (for positioning)
   */
  dom?: HTMLElement;
};

export type InlineCommentCreateComponentProps = AnnotationComponentProps & {
  /**
   * Creates an annotation mark in the document with the given id.
   */
  onCreate: (id: string) => void;

  /**
   * Indicates that a draft comment was discarded/cancelled
   */
  onClose?: () => void;
};

export type InlineCommentViewComponentProps = AnnotationComponentProps & {
  /**
   * Existing annotations where the cursor is placed.
   * These are provided in order, inner-most first.
   */
  annotations: Array<AnnotationInfo>;

  /**
   * Resolves an annotation with the given ID around the selection.
   */
  onResolve: (id: string) => void;

  /**
   * Removes the annotation from the document
   */
  onDelete?: (id: string) => void;
};

export interface AnnotationState<Type, State> {
  annotationType: Type;
  id: string;
  state: State;
}

export interface AnnotationTypeProvider<Type, State> {
  getState: (
    annotationIds: string[],
  ) => Promise<AnnotationState<Type, State>[]>;
  updateSubscriber?: AnnotationUpdateEmitter;
}

export type InlineCommentState = { resolved: boolean };

export type InlineCommentAnnotationProvider = AnnotationTypeProvider<
  AnnotationTypes.INLINE_COMMENT,
  InlineCommentState
> & {
  createComponent?: React.ComponentType<InlineCommentCreateComponentProps>;
  viewComponent?: React.ComponentType<InlineCommentViewComponentProps>;
};

export interface AnnotationProviders {
  inlineComment: InlineCommentAnnotationProvider;
}

const prefix = 'ak-editor-annotation';
export const AnnotationTestIds = {
  prefix,
  floatingComponent: `${prefix}-floating-component`,
  floatingToolbarCreateButton: `${prefix}-toolbar-create-button`,
  componentSave: `${prefix}-dummy-save-button`,
};
