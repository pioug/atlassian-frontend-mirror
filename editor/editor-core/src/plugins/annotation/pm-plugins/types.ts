import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import type {
  EditorState,
  SelectionBookmark,
} from '@atlaskit/editor-prosemirror/state';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal-provider';
import type {
  Dispatch,
  EventDispatcher,
} from '@atlaskit/editor-common/event-dispatcher';
import type { InlineCommentAnnotationProvider, AnnotationInfo } from '../types';

export enum ACTIONS {
  UPDATE_INLINE_COMMENT_STATE,
  SET_INLINE_COMMENT_DRAFT_STATE,
  INLINE_COMMENT_UPDATE_MOUSE_STATE,
  INLINE_COMMENT_CLEAR_DIRTY_MARK,
  ADD_INLINE_COMMENT,
  INLINE_COMMENT_SET_VISIBLE,
  CLOSE_COMPONENT,
  SET_SELECTED_ANNOTATION,
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
  | {
      type: ACTIONS.CLOSE_COMPONENT;
      data: {
        lastClosedPos: number;
      };
    }
  | {
      type: ACTIONS.ADD_INLINE_COMMENT;
      data: {
        drafting: boolean;
        inlineComments: InlineCommentMap;
        editorState: EditorState;
        selectedAnnotations: AnnotationInfo[];
      };
    }
  | { type: ACTIONS.INLINE_COMMENT_SET_VISIBLE; data: { isVisible: boolean } }
  | {
      type: ACTIONS.SET_SELECTED_ANNOTATION;
      data: { selectedAnnotations: AnnotationInfo[] };
    };

export type InlineCommentPluginState = {
  annotations: InlineCommentMap;
  selectedAnnotations: AnnotationInfo[];
  dirtyAnnotations?: boolean;
  mouseData: InlineCommentMouseData;
  draftDecorationSet?: DecorationSet;
  bookmark?: SelectionBookmark;

  // Denotes if annotations are allowed to be create on empty nodes or nodes of whitespace (Confluence spec)
  disallowOnWhitespace: boolean;

  // Allow users to hide inline comments during editing
  isVisible: boolean;

  // Position of the last manually closed comment
  // This is used to prevent the closed comment from reopening unintentionally
  lastClosedPos?: number;
};
