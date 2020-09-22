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
  /**
   * Indicates that a draft comment was discarded/cancelled
   */
  onClose?: () => void;
};

export type InlineCommentCreateComponentProps = AnnotationComponentProps & {
  /**
   * Creates an annotation mark in the document with the given id.
   */
  onCreate: (id: string) => void;
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
  disallowOnWhitespace?: boolean;
}

export type InlineCommentState = { resolved: boolean };

export type InlineCommentAnnotationProvider = AnnotationTypeProvider<
  AnnotationTypes.INLINE_COMMENT,
  InlineCommentState
> & {
  createComponent?: React.ComponentType<InlineCommentCreateComponentProps>;
  viewComponent?: React.ComponentType<InlineCommentViewComponentProps>;
  // always position toolbar above the selection
  isToolbarAbove?: boolean;
};

export interface AnnotationProviders {
  inlineComment: InlineCommentAnnotationProvider;
}

export enum AnnotationSelectionType {
  INVALID = 'invalid', // Annotation should not be created, toolbar should not be shown
  DISABLED = 'disabled', // Annotation should not be created, toolbar should be shown, but disabled
  VALID = 'valid', // Annotation can be created
}

const prefix = 'ak-editor-annotation';
export const AnnotationTestIds = {
  prefix,
  floatingComponent: `${prefix}-floating-component`,
  floatingToolbarCreateButton: `${prefix}-toolbar-create-button`,
  componentSave: `${prefix}-dummy-save-button`,
  componentClose: `${prefix}-dummy-close-button`,
};
