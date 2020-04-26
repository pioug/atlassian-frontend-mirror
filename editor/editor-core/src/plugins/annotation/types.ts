import React from 'react';
import { AnnotationType } from '@atlaskit/adf-schema';
import { ACTIONS } from './pm-plugins/actions';
import { DecorationSet } from 'prosemirror-view';
import { EditorState, SelectionBookmark } from 'prosemirror-state';

export type AnnotationInfo = {
  id: string;
  type: AnnotationType;
};

export enum AnnotationTypes {
  INLINE_COMMENT = 'inlineComment',
}

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

export type AnnotationCreateComponentProps = AnnotationComponentProps & {
  /**
   * Creates an annotation mark in the document with the given id.
   */
  onCreate: (id: string) => void;

  /**
   * Indicates that a draft comment was discarded/cancelled
   */
  onClose?: () => void;
};

export type AnnotationViewComponentProps = AnnotationComponentProps & {
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
  pollingInterval?: number;
}

export type InlineCommentState = { resolved: boolean };
export type AnnotationTypeProviders = {
  inlineComment: AnnotationTypeProvider<
    AnnotationTypes.INLINE_COMMENT,
    InlineCommentState
  >;
};

export interface AnnotationProvider {
  providers?: AnnotationTypeProviders;
  createComponent?: React.ComponentType<AnnotationCreateComponentProps>;
  viewComponent?: React.ComponentType<AnnotationViewComponentProps>;
}

export type InlineCommentMap = { [key: string]: boolean };
export type InlineCommentAction =
  | {
      type: ACTIONS.INLINE_COMMENT_RESOLVE;
      data: { id: string };
    }
  | {
      type: ACTIONS.SET_INLINE_COMMENT_STATE;
      data: InlineCommentMap;
    }
  | {
      type: ACTIONS.SET_INLINE_COMMENT_DRAFT_STATE;
      data: {
        drafting: boolean;
        editorState: EditorState;
      };
    }
  | {
      type: ACTIONS.INLINE_COMMENT_UPDATE_MOUSE_STATE;
      data: {
        mouseData: {
          x?: number;
          y?: number;
          isSelecting?: boolean;
        };
      };
    };

export type InlineCommentPluginState = {
  annotations: InlineCommentMap;
  mouseData: {
    x: number;
    y: number;
    isSelecting: boolean;
  };
  draftDecorationSet?: DecorationSet;
  bookmark?: SelectionBookmark<any>;
};

const prefix = 'ak-editor-annotation';
export const AnnotationTestIds = {
  prefix,
  floatingComponent: `${prefix}-floating-component`,
  floatingToolbarCreateButton: `${prefix}-toolbar-create-button`,
};

export const DraftDecorationClassName = `${prefix}-draft-selection`;
