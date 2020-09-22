import { DecorationSet } from 'prosemirror-view';
import { EditorState, SelectionBookmark } from 'prosemirror-state';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { Dispatch, EventDispatcher } from '../../../event-dispatcher';
import { InlineCommentAnnotationProvider, AnnotationInfo } from '../types';

export enum ACTIONS {
  UPDATE_INLINE_COMMENT_STATE,
  SET_INLINE_COMMENT_DRAFT_STATE,
  INLINE_COMMENT_UPDATE_MOUSE_STATE,
  INLINE_COMMENT_CLEAR_DIRTY_MARK,
  ADD_INLINE_COMMENT,
  INLINE_COMMENT_SET_VISIBLE,
  CLOSE_COMPONENT,
}

export interface InlineCommentPluginOptions {
  dispatch: Dispatch;
  eventDispatcher: EventDispatcher;
  portalProviderAPI: PortalProviderAPI;
  provider: InlineCommentAnnotationProvider;
}
export interface InlineCommentMouseData {
  isSelecting: boolean;
}

export type InlineCommentMap = { [key: string]: boolean };
export type InlineCommentAction =
  | {
      type: ACTIONS.UPDATE_INLINE_COMMENT_STATE;
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
        mouseData: InlineCommentMouseData;
      };
    }
  | { type: ACTIONS.INLINE_COMMENT_CLEAR_DIRTY_MARK }
  | { type: ACTIONS.CLOSE_COMPONENT }
  | {
      type: ACTIONS.ADD_INLINE_COMMENT;
      data: {
        drafting: boolean;
        inlineComments: InlineCommentMap;
        editorState: EditorState;
        selectedAnnotations: AnnotationInfo[];
      };
    }
  | { type: ACTIONS.INLINE_COMMENT_SET_VISIBLE; data: { isVisible: boolean } };

export type InlineCommentPluginState = {
  annotations: InlineCommentMap;
  selectedAnnotations: AnnotationInfo[];
  dirtyAnnotations?: boolean;
  mouseData: InlineCommentMouseData;
  draftDecorationSet?: DecorationSet;
  bookmark?: SelectionBookmark<any>;

  // Denotes if annotations are allowed to be create on empty nodes or nodes of whitespace (Confluence spec)
  disallowOnWhitespace: boolean;

  // Allow users to hide inline comments during editing
  isVisible: boolean;
};
