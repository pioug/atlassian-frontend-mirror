import React from 'react';
import { AnnotationType } from '@atlaskit/adf-schema';

export type AnnotationInfo = {
  id: string;
  type: AnnotationType;
};

export type AnnotationComponentProps = {
  /**
   * Existing annotations where the cursor is placed.
   * These are provided in order, inner-most first.
   */
  annotations: Array<AnnotationInfo>;

  /**
   * Selected text (can be used when creating a comment)
   */
  textSelection?: string;

  /**
   * DOM element around selected text (for positioning)
   */
  dom?: HTMLElement;

  /**
   * Deletes an annotation with the given ID around the selection.
   */
  onDelete: (id: string) => void;

  /**
   * Resolves an annotation with the given ID around the selection.
   */
  onResolve: (id: string) => void;
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
  pollingInterval?: number;
}

export type InlineCommentState = { resolved: boolean };
export type ReactionState = {};

export type InlineCommentAction =
  | {
      type: 'INLINE_COMMENT_RESOLVE';
      data: { id: string };
    }
  | {
      type: 'SET_INLINE_COMMENT_STATE';
      data: InlineCommentPluginState;
    };

export type AnnotationTypeProviders = {
  inlineComment: AnnotationTypeProvider<'inlineComment', InlineCommentState>;
  // reaction?: AnnotationTypeProvider<'reaction', ReactionState>; // REMOVED FOR EXPERIMENT
};

export interface AnnotationProvider {
  providers?: AnnotationTypeProviders;
  component?: React.ComponentType<AnnotationComponentProps>;
}

export type InlineCommentPluginState = { [key: string]: boolean };
