import { Node as PMNode, Schema, Fragment, Slice } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import {
  safeInsert as pmSafeInsert,
  hasParentNodeOfType,
} from 'prosemirror-utils';
import { EditorState, Selection, Transaction } from 'prosemirror-state';
import { MediaSingleLayout, MediaSingleAttributes } from '@atlaskit/adf-schema';
import {
  calcPxFromPct,
  breakoutWideScaleRatio,
  akEditorBreakoutPadding,
} from '@atlaskit/editor-common';
import { checkNodeDown, isEmptyParagraph } from '../../../utils';
import { copyOptionalAttrsFromMediaState } from '../utils/media-common';
import { MediaState } from '../types';
import { Command } from '../../../types';
import { mapSlice } from '../../../utils/slice';
import { getParentNodeWidth } from '../../../utils/node-width';
import { alignmentLayouts } from '../ui/ResizableMediaSingle/utils';
import { WidthPluginState } from '../../width';
import {
  addAnalytics,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
  InputMethodInsertMedia,
  InsertEventPayload,
} from '../../analytics';
import { safeInsert } from '../../../utils/insert';
import { getFeatureFlags } from '../../feature-flags-context';
import { isImage } from './is-image';
import { atTheBeginningOfBlock } from '../../../utils/prosemirror/position';

export const wrappedLayouts: MediaSingleLayout[] = [
  'wrap-left',
  'wrap-right',
  'align-end',
  'align-start',
];

export const floatingLayouts = ['wrap-left', 'wrap-right'];

export const nonWrappedLayouts: MediaSingleLayout[] = [
  'center',
  'wide',
  'full-width',
];

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
  return function(state, dispatch) {
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
): boolean => {
  if (collection === undefined) {
    return false;
  }

  const { state, dispatch } = view;
  const grandParent = state.selection.$from.node(-1);
  const node = createMediaSingleNode(
    state.schema,
    collection,
  )(mediaState as MediaSingleState);
  const shouldSplit =
    grandParent && grandParent.type.validContent(Fragment.from(node));
  let fileExtension: string | undefined;
  if (mediaState.fileName) {
    const extensionIdx = mediaState.fileName.lastIndexOf('.');
    fileExtension =
      extensionIdx >= 0
        ? mediaState.fileName.substring(extensionIdx + 1)
        : undefined;
  }

  if (shouldSplit) {
    insertNodesWithOptionalParagraph([node], { fileExtension, inputMethod })(
      state,
      dispatch,
    );
  } else {
    const { newInsertionBehaviour } = getFeatureFlags(view.state);
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

export const createMediaSingleNode = (schema: Schema, collection: string) => (
  mediaState: MediaSingleState,
) => {
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

  copyOptionalAttrsFromMediaState(mediaState, mediaNode);
  return mediaSingle.createChecked({}, mediaNode);
};

export function transformSliceForMedia(slice: Slice, schema: Schema) {
  const {
    mediaSingle,
    layoutSection,
    table,
    bulletList,
    orderedList,
    media,
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
      newSlice = mapSlice(newSlice, node =>
        node.type.name === 'mediaSingle'
          ? mediaSingle.createChecked({}, node.content, node.marks)
          : node,
      );
    }

    newSlice = mapSlice(newSlice, node =>
      node.type.name === 'media' && node.attrs.type === 'external'
        ? media.createChecked(
            { ...node.attrs, __external: true },
            node.content,
            node.marks,
          )
        : node,
    );

    return newSlice;
  };
}

export const alignAttributes = (
  layout: MediaSingleLayout,
  oldAttrs: MediaSingleAttributes,
  gridSize: number = 12,
): MediaSingleAttributes => {
  let width = oldAttrs.width;
  const oldLayout: MediaSingleLayout = oldAttrs.layout;

  if (
    wrappedLayouts.indexOf(oldLayout) === -1 &&
    wrappedLayouts.indexOf(layout) > -1
  ) {
    if (
      !width ||
      width >= 100 ||
      ['full-width', 'wide'].indexOf(oldLayout) > -1
    ) {
      width = 50;
    }
  } else if (
    layout !== oldLayout &&
    ['full-width', 'wide'].indexOf(oldLayout) > -1
  ) {
    // unset width
    width = undefined;
  } else if (width) {
    const cols = Math.round((width / 100) * gridSize);
    let targetCols = cols;

    if (
      wrappedLayouts.indexOf(oldLayout) > -1 &&
      nonWrappedLayouts.indexOf(layout) > -1
    ) {
      // wrap -> center needs to align to even grid
      targetCols = Math.floor(targetCols / 2) * 2;
      width = undefined;
    } else if (
      nonWrappedLayouts.indexOf(oldLayout) > -1 &&
      wrappedLayouts.indexOf(layout) > -1
    ) {
      // cannot resize to full column width, and cannot resize to 1 column

      if (cols <= 1) {
        targetCols = 2;
      } else if (cols >= gridSize) {
        targetCols = 10;
      }
    }

    if (targetCols !== cols) {
      width = (targetCols / gridSize) * 100;
    }
  }

  return {
    ...oldAttrs,
    layout,
    width,
  };
};

export const calcMediaPxWidth = (opts: {
  origWidth: number;
  origHeight: number;
  state: EditorState;
  containerWidth: WidthPluginState;
  layout?: MediaSingleLayout;
  pctWidth?: number;
  pos?: number;
  isFullWidthModeEnabled?: boolean;
  resizedPctWidth?: number;
}): number => {
  const {
    origWidth,
    origHeight,
    layout,
    pctWidth,
    containerWidth,
    isFullWidthModeEnabled,
    pos,
    state,
    resizedPctWidth,
  } = opts;
  const { width, lineLength } = containerWidth;
  const nestedWidth = getParentNodeWidth(
    pos,
    state,
    containerWidth,
    isFullWidthModeEnabled,
  );
  const calculatedPctWidth = calcPctWidth(
    containerWidth,
    pctWidth,
    origWidth,
    origHeight,
  );
  const calculatedResizedPctWidth = calcPctWidth(
    containerWidth,
    resizedPctWidth,
    origWidth,
    origHeight,
  );

  if (nestedWidth) {
    return Math.min(calculatedPctWidth || origWidth, nestedWidth);
  } else if (layout === 'wide') {
    if (lineLength) {
      const wideWidth = Math.ceil(lineLength * breakoutWideScaleRatio);
      return wideWidth > width ? lineLength : wideWidth;
    }
  } else if (layout === 'full-width') {
    return width - akEditorBreakoutPadding;
  } else if (calculatedPctWidth) {
    if (wrappedLayouts.indexOf(layout!) > -1) {
      if (calculatedResizedPctWidth) {
        if (resizedPctWidth! < 50) {
          return calculatedResizedPctWidth;
        }
        return calculatedPctWidth;
      }
      return Math.min(calculatedPctWidth, origWidth);
    }
    if (calculatedResizedPctWidth) {
      return calculatedResizedPctWidth;
    }
    return calculatedPctWidth;
  } else if (layout === 'center') {
    if (calculatedResizedPctWidth) {
      return calculatedResizedPctWidth;
    }
    return Math.min(origWidth, lineLength || width);
  } else if (layout && alignmentLayouts.indexOf(layout) !== -1) {
    const halfLineLength = Math.ceil((lineLength || width) / 2);
    return origWidth <= halfLineLength ? origWidth : halfLineLength;
  }

  return origWidth;
};

const calcPctWidth = (
  containerWidth: WidthPluginState,
  pctWidth?: number,
  origWidth?: number,
  origHeight?: number,
): number | undefined =>
  pctWidth &&
  origWidth &&
  origHeight &&
  Math.ceil(
    calcPxFromPct(
      pctWidth / 100,
      containerWidth.lineLength || containerWidth.width,
    ),
  );
