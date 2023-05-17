import { Node as PMNode, Schema, Fragment, Slice } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import {
  safeInsert as pmSafeInsert,
  hasParentNodeOfType,
} from 'prosemirror-utils';
import { EditorState, Selection, Transaction } from 'prosemirror-state';
import { checkNodeDown } from '../../../utils';
import { isEmptyParagraph } from '@atlaskit/editor-common/utils';

import { copyOptionalAttrsFromMediaState } from '../utils/media-common';
import { MediaState } from '../types';
import { Command } from '../../../types';
import { mapSlice } from '../../../utils/slice';
import { addAnalytics } from '../../analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
  InputMethodInsertMedia,
  InsertEventPayload,
} from '@atlaskit/editor-common/analytics';
import {
  safeInsert,
  shouldSplitSelectedNodeOnNodeInsertion,
} from '@atlaskit/editor-common/insert';

import { isImage } from './is-image';
import { atTheBeginningOfBlock } from '../../../utils/prosemirror/position';
import { getRandomHex } from '@atlaskit/media-common';

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
      addAnalytics(
        state,
        tr,
        getInsertMediaAnalytics(inputMethod, fileExtension),
      );
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
  return insertNodesWithOptionalParagraph(nodes, analyticsAttributes)(
    state,
    dispatch,
  );
};

export const insertMediaSingleNode = (
  view: EditorView,
  mediaState: MediaState,
  inputMethod?: InputMethodInsertMedia,
  collection?: string,
  alignLeftOnInsert?: boolean,
  newInsertionBehaviour?: boolean,
): boolean => {
  if (collection === undefined) {
    return false;
  }

  const { state, dispatch } = view;
  const grandParentNodeType = state.selection.$from.node(-1)?.type;
  const parentNodeType = state.selection.$from.parent.type;
  const node = createMediaSingleNode(
    state.schema,
    collection,
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
    insertNodesWithOptionalParagraph([node], { fileExtension, inputMethod })(
      state,
      dispatch,
    );
  } else {
    let tr: Transaction<any> | null = null;
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
      tr = addAnalytics(
        state,
        tr,
        getInsertMediaAnalytics(inputMethod, fileExtension),
      );
    }
    dispatch(tr);
  }

  return true;
};

export const createMediaSingleNode =
  (schema: Schema, collection: string, alignLeftOnInsert?: boolean) =>
  (mediaState: MediaSingleState) => {
    const { id, dimensions, contextId, scaleFactor = 1 } = mediaState;
    const { width, height } = dimensions || {
      height: undefined,
      width: undefined,
    };
    const { media, mediaSingle } = schema.nodes;

    const mediaNode = media.create({
      id,
      type: 'file',
      collection,
      contextId,
      width: width && Math.round(width / scaleFactor),
      height: height && Math.round(height / scaleFactor),
    });

    const mediaSingleAttrs = alignLeftOnInsert ? { layout: 'align-start' } : {};

    copyOptionalAttrsFromMediaState(mediaState, mediaNode);
    return mediaSingle.createChecked(mediaSingleAttrs, mediaNode);
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
      ])(selection)
    ) {
      newSlice = mapSlice(newSlice, (node) => {
        const attrs = hasParentNodeOfType([layoutSection, table])(selection)
          ? { layout: node.attrs.layout }
          : {};

        return node.type.name === 'mediaSingle'
          ? mediaSingle.createChecked(attrs, node.content, node.marks)
          : node;
      });
    }

    const __mediaTraceId = getRandomHex(8);

    newSlice = mapSlice(newSlice, (node) => {
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
