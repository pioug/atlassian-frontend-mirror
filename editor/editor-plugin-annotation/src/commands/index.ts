import { AnnotationTypes } from '@atlaskit/adf-schema';
import type {
  EditorAnalyticsAPI,
  RESOLVE_METHOD,
} from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
  Command,
  CommandDispatch,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import {
  type EditorState,
  NodeSelection,
} from '@atlaskit/editor-prosemirror/state';

import { createCommand } from '../pm-plugins/plugin-factory';
import type {
  InlineCommentAction,
  InlineCommentMap,
  InlineCommentMouseData,
} from '../pm-plugins/types';
import { ACTIONS } from '../pm-plugins/types';
import { AnnotationSelectionType } from '../types';
import type {
  AnnotationPlugin,
  InlineCommentInputMethod,
  TargetType,
} from '../types';
import {
  getPluginState,
  isSelectionValid,
  isSupportedBlockNode,
} from '../utils';

import transform from './transform';

export const updateInlineCommentResolvedState =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  (
    partialNewState: InlineCommentMap,
    resolveMethod?: RESOLVE_METHOD,
  ): Command => {
    const command: InlineCommentAction = {
      type: ACTIONS.UPDATE_INLINE_COMMENT_STATE,
      data: partialNewState,
    };

    const allResolved = Object.values(partialNewState).every(state => state);

    if (resolveMethod && allResolved) {
      return createCommand(
        command,
        transform.addResolveAnalytics(editorAnalyticsAPI)(resolveMethod),
      );
    }

    return createCommand(command);
  };

export const closeComponent = (): Command =>
  createCommand({
    type: ACTIONS.CLOSE_COMPONENT,
  });

export const clearDirtyMark = (): Command =>
  createCommand({
    type: ACTIONS.INLINE_COMMENT_CLEAR_DIRTY_MARK,
  });

const removeInlineCommentFromNode = (
  id: string,
  supportedBlockNodes: string[] = [],
  state: EditorState,
  dispatch?: CommandDispatch,
) => {
  const { tr, selection } = state;

  if (
    selection instanceof NodeSelection &&
    isSupportedBlockNode(selection.node, supportedBlockNodes)
  ) {
    const { $from } = selection;
    let currNode = selection.node;
    let from = $from.start();

    // for media annotation, the selection is on media Single
    if (
      currNode.type === state.schema.nodes.mediaSingle &&
      currNode.firstChild
    ) {
      currNode = currNode.firstChild;
      from = from + 1;
    }

    const { annotation: annotationMarkType } = state.schema.marks;
    const hasAnnotation = currNode.marks.some(
      mark => mark.type === annotationMarkType,
    );

    if (!hasAnnotation) {
      return false;
    }

    tr.removeNodeMark(
      from,
      annotationMarkType.create({
        id,
        type: AnnotationTypes.INLINE_COMMENT,
      }),
    );

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  }

  return false;
};

export const removeInlineCommentNearSelection =
  (id: string, supportedNodes: string[] = []): Command =>
  (state, dispatch): boolean => {
    const {
      tr,
      selection: { $from },
    } = state;

    if (removeInlineCommentFromNode(id, supportedNodes, state, dispatch)) {
      return true;
    }

    const { annotation: annotationMarkType } = state.schema.marks;

    const hasAnnotation = $from
      .marks()
      .some(mark => mark.type === annotationMarkType);

    if (!hasAnnotation) {
      return false;
    }

    // just remove entire mark from around the node
    tr.removeMark(
      $from.start(),
      $from.end(),
      annotationMarkType.create({
        id,
        type: AnnotationTypes.INLINE_COMMENT,
      }),
    );

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };

const getDraftCommandAction: (
  drafting: boolean,
  targetType: TargetType,
  isCommentOnMediaOn?: boolean,
) => (state: Readonly<EditorState>) => InlineCommentAction | false = (
  drafting: boolean,
  targetType: TargetType,
  isCommentOnMediaOn?: boolean,
) => {
  return (editorState: EditorState) => {
    // validate selection only when entering draft mode
    if (
      drafting &&
      isSelectionValid(editorState, isCommentOnMediaOn) !==
        AnnotationSelectionType.VALID
    ) {
      return false;
    }

    return {
      type: ACTIONS.SET_INLINE_COMMENT_DRAFT_STATE,
      data: {
        drafting,
        editorState,
        targetType,
      },
    };
  };
};

export const setInlineCommentDraftState =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  (
    drafting: boolean,
    inputMethod: InlineCommentInputMethod = INPUT_METHOD.TOOLBAR,
    targetType: TargetType = 'inline',
    isCommentOnMediaOn: boolean = false,
  ): Command => {
    const commandAction = getDraftCommandAction(
      drafting,
      targetType,
      isCommentOnMediaOn,
    );
    return createCommand(
      commandAction,
      transform.addOpenCloseAnalytics(editorAnalyticsAPI)(
        drafting,
        inputMethod,
      ),
    );
  };

export const addInlineComment =
  (
    editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
    editorAPI?: ExtractInjectionAPI<AnnotationPlugin> | undefined,
  ) =>
  (id: string): Command => {
    const commandAction: (editorState: EditorState) => InlineCommentAction = (
      editorState: EditorState,
    ) => ({
      type: ACTIONS.ADD_INLINE_COMMENT,
      data: {
        drafting: false,
        inlineComments: { [id]: false },
        // Auto make the newly inserted comment selected.
        // We move the selection to the head of the comment selection.
        selectedAnnotations: [{ id, type: AnnotationTypes.INLINE_COMMENT }],
        editorState,
      },
    });

    return createCommand(
      commandAction,
      transform.addInlineComment(editorAnalyticsAPI, editorAPI)(id),
    );
  };

export const updateMouseState = (mouseData: InlineCommentMouseData): Command =>
  createCommand({
    type: ACTIONS.INLINE_COMMENT_UPDATE_MOUSE_STATE,
    data: { mouseData },
  });

export const setSelectedAnnotation = (id: string): Command =>
  createCommand({
    type: ACTIONS.SET_SELECTED_ANNOTATION,
    data: {
      selectedAnnotations: [{ id, type: AnnotationTypes.INLINE_COMMENT }],
    },
  });

export const createAnnotation =
  (
    editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
    editorAPI?: ExtractInjectionAPI<AnnotationPlugin> | undefined,
  ) =>
  (
    id: string,
    annotationType: AnnotationTypes = AnnotationTypes.INLINE_COMMENT,
  ): Command =>
  (state, dispatch) => {
    // don't try to add if there are is no temp highlight bookmarked
    const { bookmark } = getPluginState(state) || {};
    if (!bookmark || !dispatch) {
      return false;
    }

    if (annotationType === AnnotationTypes.INLINE_COMMENT) {
      return addInlineComment(editorAnalyticsAPI, editorAPI)(id)(
        state,
        dispatch,
      );
    }

    return false;
  };

export const setInlineCommentsVisibility = (isVisible: boolean): Command => {
  return createCommand({
    type: ACTIONS.INLINE_COMMENT_SET_VISIBLE,
    data: { isVisible },
  });
};
