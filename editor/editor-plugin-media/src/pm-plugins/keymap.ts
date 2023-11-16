import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  bindKeymapWithCommand,
  decreaseMediaSize,
  enter,
  increaseMediaSize,
  insertNewLine,
  moveDown,
  moveLeft,
  moveRight,
  quickDecreaseMediaSize,
  quickIncreaseMediaSize,
  tab,
  undo,
} from '@atlaskit/editor-common/keymaps';
import {
  calcMediaSingleMaxWidth,
  MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
} from '@atlaskit/editor-common/media-single';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { GapCursorSelection, Side } from '@atlaskit/editor-common/selection';
import type { Command } from '@atlaskit/editor-common/types';
import type { EditorSelectionAPI } from '@atlaskit/editor-plugin-selection';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';

import {
  insertAndSelectCaptionFromMediaSinglePos,
  selectCaptionFromMediaSinglePos,
} from '../commands/captions';
import { stateKey } from '../pm-plugins/plugin-key';
import { updateMediaSingleWidth } from '../toolbar/commands';
import { calcNewLayout, getSelectedMediaSingle } from '../toolbar/utils';
import type { MediaOptions } from '../types';
import type { PixelEntryValidation } from '../ui/PixelEntry/types';

import { mediaResizeAnnouncerMess } from './mediaResizeAnnouncerMess';
import type { MediaPluginState } from './types';

export function keymapPlugin(
  options: MediaOptions | undefined,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
  editorSelectionAPI: EditorSelectionAPI | undefined,
  widthPlugin: WidthPlugin | undefined,
  getIntl: any,
): SafePlugin {
  const list = {};

  bindKeymapWithCommand(undo.common!, ignoreLinksInSteps, list);
  bindKeymapWithCommand(enter.common!, splitMediaGroup, list);

  if (options?.allowCaptions) {
    bindKeymapWithCommand(
      moveDown.common!,
      insertAndSelectCaption(editorAnalyticsAPI),
      list,
    );
    bindKeymapWithCommand(
      tab.common!,
      insertAndSelectCaption(editorAnalyticsAPI),
      list,
    );

    bindKeymapWithCommand(
      moveLeft.common!,
      arrowLeftFromMediaSingle(editorSelectionAPI),
      list,
    );
    bindKeymapWithCommand(
      moveRight.common!,
      arrowRightFromMediaSingle(editorSelectionAPI),
      list,
    );
  }

  bindKeymapWithCommand(insertNewLine.common!, splitMediaGroup, list);
  bindKeymapWithCommand(
    increaseMediaSize.common!,
    handleMediaIncrease(editorAnalyticsAPI, widthPlugin, options, getIntl),
    list,
  );
  bindKeymapWithCommand(
    decreaseMediaSize.common!,
    handleMediaDecrease(editorAnalyticsAPI, widthPlugin, options, getIntl),
    list,
  );
  bindKeymapWithCommand(
    quickIncreaseMediaSize.common!,
    handleMediaQuickIncrease(editorAnalyticsAPI, widthPlugin, options, getIntl),
    list,
  );
  bindKeymapWithCommand(
    quickDecreaseMediaSize.common!,
    handleMediaQuickDecrease(editorAnalyticsAPI, widthPlugin, options, getIntl),
    list,
  );

  return keymap(list) as SafePlugin;
}

const ignoreLinksInSteps: Command = state => {
  const mediaPluginState = stateKey.getState(state) as MediaPluginState;
  mediaPluginState.ignoreLinks = true;
  return false;
};

const splitMediaGroup: Command = state => {
  const mediaPluginState = stateKey.getState(state) as MediaPluginState;
  return mediaPluginState.splitMediaGroup();
};

const createAnnouncer = (
  action: string,
  mediaWidth: number,
  changeAmount: number,
  validation: string,
  getIntl: any,
) => {
  let announcerContainer: HTMLElement =
    document.getElementById('media-announcer') || document.createElement('div');
  const intl = getIntl();
  if (!announcerContainer.id) {
    announcerContainer.id = 'media-announcer';
    announcerContainer.setAttribute('role', 'status');
    announcerContainer.setAttribute('aria-live', 'polite');
    announcerContainer.setAttribute('aria-atomic', 'true');

    const style: any = announcerContainer.style;
    style.position = 'absolute';
    style.width = '1px';
    style.height = '1px';
    style.marginTop = '-1px';
    style.opacity = '0';
    style.overflow = 'hidden';

    document.body.appendChild(announcerContainer);
  } else {
    const newMediaWidth: number = mediaWidth + changeAmount;
    if (validation === 'greater-than-max') {
      announcerContainer.textContent = intl.formatMessage(
        mediaResizeAnnouncerMess.MediaWidthIsMax,
      );
    } else if (validation === 'less-than-min') {
      announcerContainer.textContent = intl.formatMessage(
        mediaResizeAnnouncerMess.MediaWidthIsMin,
      );
    } else {
      announcerContainer.textContent = intl.formatMessage(
        mediaResizeAnnouncerMess.DefaultMediaWidth,
        { action: action, newMediaWidth: newMediaWidth },
      );
    }
  }
};

const handleMediaSizeChange =
  (
    editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
    widthPlugin: WidthPlugin | undefined,
    options: MediaOptions | undefined,
    changeAmount: number,
    action: string,
    getIntl: any,
  ) =>
  (state: any, dispatch: any) => {
    const selectedNode: any = getSelectedMediaSingle(state);
    const layout: any = selectedNode?.node?.attrs?.layout;
    const mediaWidth: any = selectedNode?.node?.attrs?.width;
    const contentWidth: number =
      // @ts-ignore readonly sharedState
      widthPlugin?.sharedState.currentState()?.lineLength ||
      akEditorDefaultLayoutWidth;
    const minWidth: number = MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH;
    let maxWidth: number;
    let validation: PixelEntryValidation = 'valid';
    let newWidth: number = mediaWidth + changeAmount;
    const intl = getIntl();

    if (options?.fullWidthEnabled) {
      // @ts-ignore readonly sharedState
      maxWidth = widthPlugin?.sharedState.currentState()?.lineLength;
    } else {
      maxWidth = calcMediaSingleMaxWidth(
        // @ts-ignore readonly sharedState
        widthPlugin?.sharedState.currentState()?.width,
      );
    }

    if (newWidth > maxWidth) {
      newWidth = maxWidth;
      validation = 'greater-than-max';
    } else if (newWidth < minWidth) {
      newWidth = minWidth;
      validation = 'less-than-min';
    } else {
      newWidth;
      validation = 'valid';
    }

    if (action === 'increased') {
      action = intl.formatMessage(mediaResizeAnnouncerMess.IncreasedAction);
    } else if (action === 'decreased') {
      action = intl.formatMessage(mediaResizeAnnouncerMess.DecreasedAction);
    }

    const newLayout = calcNewLayout(
      newWidth,
      layout,
      contentWidth,
      options?.fullWidthEnabled,
    );

    updateMediaSingleWidth(editorAnalyticsAPI)(
      newWidth,
      validation,
      'keyboard',
      newLayout,
    )(state, dispatch);

    createAnnouncer(action, mediaWidth, changeAmount, validation, getIntl);

    return true;
  };

const handleMediaIncrease = (
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
  widthPlugin: WidthPlugin | undefined,
  options: MediaOptions | undefined,
  getIntl: any,
) =>
  handleMediaSizeChange(
    editorAnalyticsAPI,
    widthPlugin,
    options,
    1,
    'increased',
    getIntl,
  );

const handleMediaDecrease = (
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
  widthPlugin: WidthPlugin | undefined,
  options: MediaOptions | undefined,
  getIntl: any,
) =>
  handleMediaSizeChange(
    editorAnalyticsAPI,
    widthPlugin,
    options,
    -1,
    'decreased',
    getIntl,
  );

const handleMediaQuickIncrease = (
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
  widthPlugin: WidthPlugin | undefined,
  options: MediaOptions | undefined,
  getIntl: any,
) =>
  handleMediaSizeChange(
    editorAnalyticsAPI,
    widthPlugin,
    options,
    10,
    'increased',
    getIntl,
  );

const handleMediaQuickDecrease = (
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
  widthPlugin: WidthPlugin | undefined,
  options: MediaOptions | undefined,
  getIntl: any,
) =>
  handleMediaSizeChange(
    editorAnalyticsAPI,
    widthPlugin,
    options,
    -10,
    'decreased',
    getIntl,
  );

const insertAndSelectCaption =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
  (state, dispatch) => {
    const { selection, schema } = state;
    if (
      selection instanceof NodeSelection &&
      selection.node.type === schema.nodes.mediaSingle &&
      schema.nodes.caption
    ) {
      if (dispatch) {
        const { from, node } = selection;
        if (
          !insertAndSelectCaptionFromMediaSinglePos(editorAnalyticsAPI)(
            from,
            node,
          )(state, dispatch)
        ) {
          selectCaptionFromMediaSinglePos(from, node)(state, dispatch);
        }
      }
      return true;
    }
    return false;
  };

const arrowLeftFromMediaSingle =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null): Command =>
  (state, dispatch) => {
    const { selection } = state;
    if (
      editorSelectionAPI &&
      selection instanceof NodeSelection &&
      selection.node.type.name === 'mediaSingle'
    ) {
      const tr = editorSelectionAPI.selectNearNode({
        selectionRelativeToNode: undefined,
        selection: new GapCursorSelection(
          state.doc.resolve(selection.from),
          Side.LEFT,
        ),
      })(state);

      if (dispatch) {
        dispatch(tr);
      }
      return true;
    }

    return false;
  };

const arrowRightFromMediaSingle =
  (editorSelectionAPI: EditorSelectionAPI | undefined | null): Command =>
  (state, dispatch) => {
    const { selection } = state;
    if (
      editorSelectionAPI &&
      selection instanceof NodeSelection &&
      selection.node.type.name === 'mediaSingle'
    ) {
      const tr = editorSelectionAPI.selectNearNode({
        selectionRelativeToNode: undefined,
        selection: new GapCursorSelection(
          state.doc.resolve(selection.to),
          Side.RIGHT,
        ),
      })(state);

      if (dispatch) {
        dispatch(tr);
      }
      return true;
    }

    return false;
  };

export default keymapPlugin;
