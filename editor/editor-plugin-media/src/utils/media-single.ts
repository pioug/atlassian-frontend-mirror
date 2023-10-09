import type {
  EditorAnalyticsAPI,
  InputMethodInsertMedia,
  InsertEventPayload,
} from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import {
  safeInsert,
  shouldSplitSelectedNodeOnNodeInsertion,
} from '@atlaskit/editor-common/insert';
import {
  getMaxWidthForNestedNodeNext,
  getMediaSingleInitialWidth,
  MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
  MEDIA_SINGLE_VIDEO_MIN_PIXEL_WIDTH,
} from '@atlaskit/editor-common/media-single';
import { atTheBeginningOfBlock } from '@atlaskit/editor-common/selection';
import type { Command } from '@atlaskit/editor-common/types';
import { checkNodeDown, isEmptyParagraph } from '@atlaskit/editor-common/utils';
import type { WidthPluginState } from '@atlaskit/editor-plugin-width';
import type {
  Node as PMNode,
  Schema,
} from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { safeInsert as pmSafeInsert } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { MediaState } from '../types';
import { copyOptionalAttrsFromMediaState } from '../utils/media-common';

import { isImage } from './is-image';

export interface MediaSingleState extends MediaState {
  dimensions: { width: number; height: number };
  scaleFactor?: number;
  contextId?: string;
}

const getInsertMediaAnalytics = (
  inputMethod: InputMethodInsertMedia,
  fileExtension?: string,
): InsertEventPayload => ({
  action: ACTION.INSERTED,
  actionSubject: ACTION_SUBJECT.DOCUMENT,
  actionSubjectId: ACTION_SUBJECT_ID.MEDIA,
  attributes: {
    inputMethod,
    fileExtension,
    type: ACTION_SUBJECT_ID.MEDIA_SINGLE,
  },
  eventType: EVENT_TYPE.TRACK,
});

function shouldAddParagraph(state: EditorState) {
  return (
    atTheBeginningOfBlock(state) &&
    !checkNodeDown(state.selection, state.doc, isEmptyParagraph)
  );
}

function insertNodesWithOptionalParagraph(
  nodes: PMNode[],
  analyticsAttributes: {
    inputMethod?: InputMethodInsertMedia;
    fileExtension?: string;
  } = {},
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Command {
  return function (state, dispatch) {
    const { tr, schema } = state;
    const { paragraph } = schema.nodes;
    const { inputMethod, fileExtension } = analyticsAttributes;

    let openEnd = 0;
    if (shouldAddParagraph(state)) {
      nodes.push(paragraph.create());
      openEnd = 1;
    }

    tr.replaceSelection(new Slice(Fragment.from(nodes), 0, openEnd));
    if (inputMethod) {
      editorAnalyticsAPI?.attachAnalyticsEvent(
        getInsertMediaAnalytics(inputMethod, fileExtension),
      )(tr);
    }

    if (dispatch) {
      dispatch(tr);
    }
    return true;
  };
}

export const isMediaSingle = (schema: Schema, fileMimeType?: string) =>
  !!schema.nodes.mediaSingle && isImage(fileMimeType);

export type InsertMediaAsMediaSingle = (
  view: EditorView,
  node: PMNode,
  inputMethod: InputMethodInsertMedia,
) => boolean;

export const insertMediaAsMediaSingle = (
  view: EditorView,
  node: PMNode,
  inputMethod: InputMethodInsertMedia,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): boolean => {
  const { state, dispatch } = view;
  const { mediaSingle, media } = state.schema.nodes;

  if (!mediaSingle) {
    return false;
  }

  // if not an image type media node
  if (
    node.type !== media ||
    (!isImage(node.attrs.__fileMimeType) && node.attrs.type !== 'external')
  ) {
    return false;
  }

  const mediaSingleNode = mediaSingle.create({}, node);
  const nodes = [mediaSingleNode];
  const analyticsAttributes = {
    inputMethod,
    fileExtension: node.attrs.__fileMimeType,
  };
  return insertNodesWithOptionalParagraph(
    nodes,
    analyticsAttributes,
    editorAnalyticsAPI,
  )(state, dispatch);
};

export const insertMediaSingleNode = (
  view: EditorView,
  mediaState: MediaState,
  inputMethod?: InputMethodInsertMedia,
  collection?: string,
  alignLeftOnInsert?: boolean,
  newInsertionBehaviour?: boolean,
  widthPluginState?: WidthPluginState | undefined,
  editorAnalyticsAPI?: EditorAnalyticsAPI | undefined,
): boolean => {
  if (collection === undefined) {
    return false;
  }

  const { state, dispatch } = view;
  const grandParentNodeType = state.selection.$from.node(-1)?.type;
  const parentNodeType = state.selection.$from.parent.type;

  // add undefined as fallback as we don't want media single width to have upper limit as 0
  // if widthPluginState.width is 0, default 760 will be used
  const contentWidth =
    getMaxWidthForNestedNodeNext(view, state.selection.$from.pos, true) ||
    widthPluginState?.lineLength ||
    widthPluginState?.width ||
    undefined;

  const node = createMediaSingleNode(
    state.schema,
    collection,
    contentWidth,
    mediaState.status !== 'error' && isVideo(mediaState.fileMimeType)
      ? MEDIA_SINGLE_VIDEO_MIN_PIXEL_WIDTH
      : MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
    alignLeftOnInsert,
  )(mediaState as MediaSingleState);

  let fileExtension: string | undefined;
  if (mediaState.fileName) {
    const extensionIdx = mediaState.fileName.lastIndexOf('.');
    fileExtension =
      extensionIdx >= 0
        ? mediaState.fileName.substring(extensionIdx + 1)
        : undefined;
  }
  // should split if media is valid content for the grandparent of the selected node
  // and the parent node is a paragraph
  if (
    shouldSplitSelectedNodeOnNodeInsertion({
      parentNodeType,
      grandParentNodeType,
      content: node,
    })
  ) {
    insertNodesWithOptionalParagraph(
      [node],
      { fileExtension, inputMethod },
      editorAnalyticsAPI,
    )(state, dispatch);
  } else {
    let tr: Transaction | null = null;
    if (newInsertionBehaviour) {
      tr = safeInsert(node, state.selection.from)(state.tr);
    }

    if (!tr) {
      const content = shouldAddParagraph(view.state)
        ? Fragment.fromArray([node, state.schema.nodes.paragraph.create()])
        : node;
      tr = pmSafeInsert(content, undefined, true)(state.tr);
    }

    if (inputMethod) {
      editorAnalyticsAPI?.attachAnalyticsEvent(
        getInsertMediaAnalytics(inputMethod, fileExtension),
      )(tr);
    }
    dispatch(tr);
  }

  return true;
};

export const createMediaSingleNode =
  (
    schema: Schema,
    collection: string,
    maxWidth?: number,
    minWidth?: number,
    alignLeftOnInsert?: boolean,
  ) =>
  (mediaState: MediaSingleState) => {
    const { id, dimensions, contextId, scaleFactor = 1 } = mediaState;
    const { width, height } = dimensions || {
      height: undefined,
      width: undefined,
    };
    const { media, mediaSingle } = schema.nodes;

    const scaledWidth = width && Math.round(width / scaleFactor);
    const mediaNode = media.create({
      id,
      type: 'file',
      collection,
      contextId,
      width: scaledWidth,
      height: height && Math.round(height / scaleFactor),
    });

    const mediaSingleAttrs = alignLeftOnInsert ? { layout: 'align-start' } : {};

    const extendedMediaSingleAttrs = getBooleanFF(
      'platform.editor.media.extended-resize-experience',
    )
      ? {
          ...mediaSingleAttrs,
          width: getMediaSingleInitialWidth(scaledWidth, maxWidth, minWidth),
          // TODO: change to use enum
          widthType: 'pixel',
        }
      : mediaSingleAttrs;

    copyOptionalAttrsFromMediaState(mediaState, mediaNode);
    return mediaSingle.createChecked(extendedMediaSingleAttrs, mediaNode);
  };

export function isCaptionNode(editorView: EditorView) {
  const { $from } = editorView.state.selection;
  const immediateWrapperParentNode = editorView.state.doc.nodeAt(
    $from.before(Math.max($from.depth, 1)),
  );
  if (
    immediateWrapperParentNode &&
    immediateWrapperParentNode.type.name === 'caption'
  ) {
    return true;
  }
  return false;
}

export const isVideo = (fileType?: string) =>
  !!fileType && fileType.includes('video');
