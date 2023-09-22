import type {
  Node as PMNode,
  Schema,
} from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
  safeInsert as pmSafeInsert,
  hasParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import type {
  EditorState,
  Selection,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import {
  checkNodeDown,
  isEmptyParagraph,
  mapSlice,
} from '@atlaskit/editor-common/utils';
import {
  getMediaSingleInitialWidth,
  MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
  MEDIA_SINGLE_VIDEO_MIN_PIXEL_WIDTH,
  getMaxWidthForNestedNodeNext,
} from '@atlaskit/editor-common/media-single';

import { copyOptionalAttrsFromMediaState } from '../utils/media-common';
import type { MediaState } from '../types';
import type { Command } from '@atlaskit/editor-common/types';
import type {
  InputMethodInsertMedia,
  InsertEventPayload,
  EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';
import {
  safeInsert,
  shouldSplitSelectedNodeOnNodeInsertion,
} from '@atlaskit/editor-common/insert';

import { isImage } from './is-image';
import { atTheBeginningOfBlock } from '@atlaskit/editor-common/selection';
import { getRandomHex } from '@atlaskit/media-common';
import type { WidthPluginState } from '@atlaskit/editor-plugin-width';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

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

export function transformSliceForMedia(slice: Slice, schema: Schema) {
  const {
    mediaSingle,
    layoutSection,
    table,
    bulletList,
    orderedList,
    media,
    mediaInline,
    expand,
    nestedExpand,
  } = schema.nodes;

  return (selection: Selection) => {
    let newSlice = slice;
    if (
      hasParentNodeOfType([
        layoutSection,
        table,
        bulletList,
        orderedList,
        expand,
        nestedExpand,
      ])(selection)
    ) {
      newSlice = mapSlice(newSlice, (node) => {
        const extendedOrLegacyAttrs = getBooleanFF(
          'platform.editor.media.extended-resize-experience',
        )
          ? {
              layout: node.attrs.layout,
              widthType: node.attrs.widthType,
              width: node.attrs.width,
            }
          : { layout: node.attrs.layout };

        let attrs = {};
        if (hasParentNodeOfType([layoutSection, table])(selection)) {
          // Supports layouts
          attrs = { ...extendedOrLegacyAttrs };
        } else if (
          hasParentNodeOfType([bulletList, orderedList, expand, nestedExpand])(
            selection,
          )
        ) {
          // does not support other layouts
          attrs = { ...extendedOrLegacyAttrs, layout: 'center' };
        }

        return node.type.name === 'mediaSingle'
          ? mediaSingle.createChecked(attrs, node.content, node.marks)
          : node;
      });
    }

    const __mediaTraceId = getRandomHex(8);

    newSlice = mapSlice(newSlice, (node) => {
      // This logic is duplicated in editor-plugin-ai where external images can be inserted
      // from external sources through the use of AI.  The editor-plugin-ai package is avoiding
      // sharing dependencies with editor-core to support products using it with various versions
      // of editor packages.
      // The duplication is in the following file:
      // packages/editor/editor-plugin-ai/src/prebuilt/content-transformers/markdown-to-pm/markdown-transformer.ts
      if (node.type.name === 'media') {
        return media.createChecked(
          {
            ...node.attrs,
            __external: node.attrs.type === 'external',
            __mediaTraceId:
              node.attrs.type === 'external' ? null : __mediaTraceId,
          },
          node.content,
          node.marks,
        );
      }

      if (node.type.name === 'mediaInline') {
        return mediaInline.createChecked(
          {
            ...node.attrs,
            __mediaTraceId,
          },
          node.content,
          node.marks,
        );
      }

      return node;
    });

    return newSlice;
  };
}

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
