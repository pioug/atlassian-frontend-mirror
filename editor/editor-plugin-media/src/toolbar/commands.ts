import type {
  BorderMarkAttributes,
  RichMediaLayout,
} from '@atlaskit/adf-schema';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { Command } from '@atlaskit/editor-common/types';
import type { ForceFocusSelector } from '@atlaskit/editor-plugin-floating-toolbar';
import type { WidthPluginState } from '@atlaskit/editor-plugin-width';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import {
  NodeSelection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import {
  findParentNodeClosestToPos,
  isNodeSelection,
  removeSelectedNode,
  safeInsert,
} from '@atlaskit/editor-prosemirror/utils';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { EventInput } from '../pm-plugins/types';
import type { PixelEntryValidation } from '../ui/PixelEntry/types';
import {
  findChangeFromLocation,
  getChangeMediaAnalytics,
  getMediaInputResizeAnalyticsEvent,
} from '../utils/analytics';
import {
  currentMediaInlineNodeWithPos,
  currentMediaNodeWithPos,
} from '../utils/current-media-node';
import { isSelectionMediaSingleNode } from '../utils/media-common';
import { changeFromMediaInlineToMediaSingleNode } from '../utils/media-single';

import { getSelectedMediaSingle, removeMediaGroupNode } from './utils';

export const DEFAULT_BORDER_COLOR = '#091e4224';
export const DEFAULT_BORDER_SIZE = 2;

export const getNodeType = (state: EditorState) => {
  const { mediaSingle, mediaInline } = state.schema.nodes;
  return isSelectionMediaSingleNode(state)
    ? (mediaSingle.name as 'mediaSingle')
    : (mediaInline.name as 'mediaInline');
};

export const changeInlineToMediaCard =
  (
    editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
    forceFocusSelector: ForceFocusSelector | undefined,
  ): Command =>
  (state, dispatch) => {
    const { media, mediaInline, mediaGroup, paragraph, heading } =
      state.schema.nodes;
    const selectedNode =
      state.selection instanceof NodeSelection &&
      state.selection.node.type === mediaInline &&
      state.selection.node;

    if (!selectedNode) {
      return false;
    }

    const { id, type, collection } = selectedNode.attrs;
    const mediaNode = media.createChecked({
      id,
      type,
      collection,
    });
    const group = mediaGroup.createChecked({}, mediaNode);

    const parent = findParentNodeClosestToPos(state.selection.$from, node => {
      return node.type === paragraph || node.type === heading;
    })?.node;

    let tr = state.tr;

    if (
      !!parent &&
      parent.content.size === 2 &&
      parent.content.firstChild?.type.name === 'mediaInline' &&
      parent.content.lastChild?.type.name === 'text' &&
      parent.content.lastChild?.text?.trim() === ''
    ) {
      /// Empty paragraph or empty heading
      /// Drop the corresponding card on the current line
      const insertPos = state.tr.doc.resolve(state.selection.from).start() - 1;
      if (insertPos < 0) {
        return false;
      }
      tr = tr.delete(insertPos, insertPos + parent.nodeSize);
      tr = safeInsert(group, insertPos, false)(tr);
    } else {
      /// Non-empty paragraph, non-empty heading, or other nodes (e.g., action, list)
      /// Drop the corresponding card underneath the current line
      const insertPos = state.tr.doc.resolve(state.selection.from).end();
      tr = removeSelectedNode(tr);
      tr = safeInsert(group, insertPos, false)(tr);
    }

    if (dispatch) {
      editorAnalyticsAPI?.attachAnalyticsEvent({
        action: ACTION.CHANGED_TYPE,
        actionSubject: ACTION_SUBJECT.MEDIA,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          newType: ACTION_SUBJECT_ID.MEDIA_GROUP,
          previousType: ACTION_SUBJECT_ID.MEDIA_INLINE,
        },
      })(tr);

      const nodePos = state.tr.doc.resolve(state.selection.from).end();
      if (getBooleanFF('platform.editor.ally-media-file-dropdown_1kxo8')) {
        const $endOfNode = tr.doc.resolve(nodePos + 1);
        const newSelection = new NodeSelection($endOfNode);
        tr.setSelection(newSelection);
        forceFocusSelector?.(`.thumbnail-appearance`)(tr);
      }
      dispatch(tr);
    }
    return true;
  };

export const changeMediaCardToInline =
  (
    editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
    forceFocusSelector: ForceFocusSelector | undefined,
  ): Command =>
  (state, dispatch) => {
    const { media, mediaInline, paragraph } = state.schema.nodes;
    const selectedNode =
      state.selection instanceof NodeSelection && state.selection.node;

    // @ts-ignore - [unblock prosemirror bump] redundant check comparing boolean to media
    if (!selectedNode || !selectedNode.type === media) {
      return false;
    }

    const mediaInlineNode = mediaInline.create({
      id: selectedNode.attrs.id,
      collection: selectedNode.attrs.collection,
    });
    const space = state.schema.text(' ');
    let content = Fragment.from([mediaInlineNode, space]);
    const node = paragraph.createChecked({}, content);

    const nodePos = state.tr.doc.resolve(state.selection.from).start() - 1;

    let tr = removeMediaGroupNode(state);
    tr = safeInsert(node, nodePos, false)(tr);

    if (dispatch) {
      editorAnalyticsAPI?.attachAnalyticsEvent({
        action: ACTION.CHANGED_TYPE,
        actionSubject: ACTION_SUBJECT.MEDIA,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          newType: ACTION_SUBJECT_ID.MEDIA_INLINE,
          previousType: ACTION_SUBJECT_ID.MEDIA_GROUP,
        },
      })(tr);

      if (getBooleanFF('platform.editor.ally-media-file-dropdown_1kxo8')) {
        const newSelection = NodeSelection.create(
          tr.doc,
          state.selection.anchor,
        );
        tr.setSelection(newSelection);
        forceFocusSelector?.(`.inline-appearance`)(tr);
      }
      dispatch(tr);
    }

    return true;
  };

export const changeMediaInlineToMediaSingle =
  (
    editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
    widthPluginState: WidthPluginState | undefined,
  ): Command =>
  (state, dispatch, view) => {
    const { mediaInline } = state.schema.nodes;
    const selectedNode =
      state.selection instanceof NodeSelection &&
      state.selection.node.type === mediaInline &&
      state.selection.node;

    if (!selectedNode) {
      return false;
    }

    if (view) {
      return changeFromMediaInlineToMediaSingleNode(
        view,
        selectedNode,
        widthPluginState,
        editorAnalyticsAPI,
      );
    }
    return true;
  };

export const removeInlineCard: Command = (state, dispatch) => {
  if (isNodeSelection(state.selection)) {
    if (dispatch) {
      dispatch(removeSelectedNode(state.tr));
    }
    return true;
  }
  return false;
};

export const toggleBorderMark =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
  (state, dispatch) => {
    const nodeWithPos =
      currentMediaNodeWithPos(state) || currentMediaInlineNodeWithPos(state);
    if (!nodeWithPos) {
      return false;
    }

    const { node, pos } = nodeWithPos;

    const borderMark = node.marks.find(m => m.type.name === 'border');
    const marks = node.marks
      .filter(m => m.type.name !== 'border')
      .concat(
        borderMark
          ? []
          : state.schema.marks.border.create({
              color: DEFAULT_BORDER_COLOR,
              size: DEFAULT_BORDER_SIZE,
            }),
      );

    const tr = state.tr.setNodeMarkup(pos, node.type, node.attrs, marks);
    tr.setMeta('scrollIntoView', false);
    if (state.selection instanceof NodeSelection) {
      if (state.selection.$anchor.pos === state.selection.from) {
        tr.setSelection(NodeSelection.create(tr.doc, state.selection.from));
      }
    }

    if (dispatch) {
      const type = getNodeType(state);
      if (borderMark?.attrs) {
        editorAnalyticsAPI?.attachAnalyticsEvent({
          action: ACTION.DELETED,
          actionSubject: ACTION_SUBJECT.MEDIA,
          actionSubjectId: ACTION_SUBJECT_ID.BORDER,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            type,
            previousColor: borderMark.attrs.color,
            previousSize: borderMark.attrs.size,
            mediaType: node.attrs.type,
          },
        })(tr);
      } else {
        editorAnalyticsAPI?.attachAnalyticsEvent({
          action: ACTION.ADDED,
          actionSubject: ACTION_SUBJECT.MEDIA,
          actionSubjectId: ACTION_SUBJECT_ID.BORDER,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            type,
            color: DEFAULT_BORDER_COLOR,
            size: DEFAULT_BORDER_SIZE,
            mediaType: node.attrs.type,
          },
        })(tr);
      }

      dispatch(tr);
    }

    return true;
  };

export const setBorderMark =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  (attrs: Partial<BorderMarkAttributes>): Command =>
  (state, dispatch) => {
    const nodeWithPos =
      currentMediaNodeWithPos(state) || currentMediaInlineNodeWithPos(state);
    if (!nodeWithPos) {
      return false;
    }

    const { node, pos } = nodeWithPos;

    const borderMark = node.marks.find(m => m.type.name === 'border')
      ?.attrs as BorderMarkAttributes;
    const color = attrs.color ?? borderMark?.color ?? DEFAULT_BORDER_COLOR;
    const size = attrs.size ?? borderMark?.size ?? DEFAULT_BORDER_SIZE;
    const marks = node.marks
      .filter(m => m.type.name !== 'border')
      .concat(state.schema.marks.border.create({ color, size }));

    const tr = state.tr.setNodeMarkup(pos, node.type, node.attrs, marks);
    tr.setMeta('scrollIntoView', false);
    if (state.selection instanceof NodeSelection) {
      if (state.selection.$anchor.pos === state.selection.from) {
        tr.setSelection(NodeSelection.create(tr.doc, state.selection.from));
      }
    }

    if (dispatch) {
      editorAnalyticsAPI?.attachAnalyticsEvent({
        action: ACTION.UPDATED,
        actionSubject: ACTION_SUBJECT.MEDIA,
        actionSubjectId: ACTION_SUBJECT_ID.BORDER,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          type: getNodeType(state),
          mediaType: node.attrs.type,
          previousColor: borderMark?.color,
          previousSize: borderMark?.size,
          newColor: color,
          newSize: size,
        },
      })(tr);
      dispatch(tr);
    }

    return true;
  };

export const updateMediaSingleWidth =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  (
    width: number,
    validation: PixelEntryValidation,
    inputMethod: EventInput,
    layout: RichMediaLayout,
  ): Command =>
  (state, dispatch) => {
    const selectedMediaSingleNode = getSelectedMediaSingle(state);
    if (!selectedMediaSingleNode) {
      return false;
    }

    const tr = state.tr.setNodeMarkup(selectedMediaSingleNode.pos, undefined, {
      ...selectedMediaSingleNode.node.attrs,
      width,
      widthType: 'pixel',
      layout,
    });
    tr.setMeta('scrollIntoView', false);
    tr.setSelection(NodeSelection.create(tr.doc, selectedMediaSingleNode.pos));

    const $pos = state.doc.resolve(selectedMediaSingleNode.pos);
    const parentNodeType = $pos ? $pos.parent.type.name : undefined;

    const payload = getMediaInputResizeAnalyticsEvent('mediaSingle', {
      width,
      layout,
      validation,
      inputMethod,
      parentNode: parentNodeType,
    });

    if (payload) {
      editorAnalyticsAPI?.attachAnalyticsEvent(payload)(tr);
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };

export const changeMediaSingleToMediaInline =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
  (state, dispatch) => {
    const selectedNodeWithPos = getSelectedMediaSingle(state);
    const { mediaInline, paragraph } = state.schema.nodes;

    if (!selectedNodeWithPos) {
      return false;
    }
    const mediaSingleNode = selectedNodeWithPos.node;
    const mediaNode = mediaSingleNode.firstChild;
    if (!mediaNode) {
      return false;
    }

    const mediaInlineNode = mediaInline.create(
      {
        ...mediaNode.attrs,
        type: 'image',
      },
      null,
      mediaNode.marks,
    );

    const space = state.schema.text(' ');
    const content = Fragment.from([mediaInlineNode, space]);

    const node = paragraph.createChecked({}, content);

    const { from } = state.selection;
    let tr = state.tr;
    tr = removeSelectedNode(tr);
    tr = safeInsert(node, from, false)(tr);
    // 3 accounts for  paragraph 1 + mediaInline size 1 + space 1
    tr.setSelection(TextSelection.create(tr.doc, from + 3));

    if (dispatch) {
      editorAnalyticsAPI?.attachAnalyticsEvent(
        getChangeMediaAnalytics(
          ACTION_SUBJECT_ID.MEDIA_SINGLE,
          ACTION_SUBJECT_ID.MEDIA_INLINE,
          findChangeFromLocation(state.selection),
        ),
      )(tr);
      dispatch(tr);
    }

    return true;
  };
