import { DecorationSet } from 'prosemirror-view';
import { EditorState, SelectionBookmark } from 'prosemirror-state';
import { AnnotationId } from '@atlaskit/adf-schema';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { Dispatch, EventDispatcher } from '../../../event-dispatcher';
import { InlineCommentAnnotationProvider } from '../types';

export enum ACTIONS {
  UPDATE_INLINE_COMMENT_STATE,
  SET_INLINE_COMMENT_DRAFT_STATE,
  INLINE_COMMENT_UPDATE_MOUSE_STATE,
  INLINE_COMMENT_CLEAR_DIRTY_MARK,
}

export interface InlineCommentPluginOptions {
  dispatch: Dispatch;
  eventDispatcher: EventDispatcher;
  portalProviderAPI: PortalProviderAPI;
  provider: InlineCommentAnnotationProvider;
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
        mouseData: {
          x?: number;
          y?: number;
          isSelecting?: boolean;
        };
      };
    }
  | {
      type: ACTIONS.INLINE_COMMENT_CLEAR_DIRTY_MARK;
    };

export type InlineCommentPluginState = {
  annotations: InlineCommentMap;
  annotationsInSelection: AnnotationId[];
  dirtyAnnotations?: boolean;
  mouseData: {
    x: number;
    y: number;
    isSelecting: boolean;
  };
  draftDecorationSet?: DecorationSet;
  bookmark?: SelectionBookmark<any>;
};
