import type { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  activateVideoControls,
  bindKeymapWithCommand,
  decreaseMediaSize,
  enter,
  increaseMediaSize,
  insertNewLine,
  moveDown,
  moveLeft,
  moveRight,
  tab,
  undo,
} from '@atlaskit/editor-common/keymaps';
import { mediaResizeAnnouncerMessMessages as mediaResizeAnnouncerMess } from '@atlaskit/editor-common/media';
import {
  calcMediaSingleMaxWidth,
  MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
} from '@atlaskit/editor-common/media-single';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { GapCursorSelection, Side } from '@atlaskit/editor-common/selection';
import type {
  Command,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import type { EditorSelectionAPI } from '@atlaskit/editor-plugin-selection';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import {
  insertAndSelectCaptionFromMediaSinglePos,
  selectCaptionFromMediaSinglePos,
} from '../commands/captions';
import type { MediaNextEditorPluginType } from '../next-plugin-type';
import { stateKey } from '../pm-plugins/plugin-key';
import { updateMediaSingleWidth } from '../toolbar/commands';
import { calcNewLayout, getSelectedMediaSingle } from '../toolbar/utils';
import type { MediaOptions } from '../types';
import type { PixelEntryValidation } from '../ui/PixelEntry/types';

import type { MediaPluginState } from './types';

type WidthPlugin = ExtractInjectionAPI<MediaNextEditorPluginType>['width'];

export function keymapPlugin(
  options: MediaOptions | undefined,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
  editorSelectionAPI: EditorSelectionAPI | undefined,
  widthPlugin: WidthPlugin | undefined,
  getIntl: () => IntlShape,
): SafePlugin {
  const list = {};

  bindKeymapWithCommand(undo.common!, ignoreLinksInSteps, list);

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
  bindKeymapWithCommand(enter.common!, splitMediaGroup, list);

  if (getBooleanFF('platform.editor.media.extended-resize-experience')) {
    if (getBooleanFF('platform.editor.a11y-media-resizing_b5v0o')) {
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
    }
  }

  if (
    getBooleanFF('platform.editor.a11y_video_controls_keyboard_support_yhcxh')
  ) {
    bindKeymapWithCommand(activateVideoControls.common!, focusPlayButton, list);
  }
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

const focusPlayButton: Command = state => {
  const videoControlsWrapperRef = stateKey.getState(state)?.element;
  if (videoControlsWrapperRef) {
    const firstButton =
      videoControlsWrapperRef?.querySelector<HTMLButtonElement>(
        'button, [tabindex]:not([tabindex="-1"])',
      );
    firstButton?.focus();
  }
  return true;
};

const validationMaxMin = (
  newWidth: number,
  maxWidth: number,
  minWidth: number,
  validation: PixelEntryValidation,
): { newWidthValidated: number; validation: PixelEntryValidation } => {
  let newWidthValidated: number;
  if (newWidth > maxWidth) {
    newWidthValidated = maxWidth;
    validation = 'greater-than-max';
  } else if (newWidth < minWidth) {
    newWidthValidated = minWidth;
    validation = 'less-than-min';
  } else {
    newWidthValidated = newWidth;
    validation = 'valid';
  }
  return { newWidthValidated, validation };
};

const createAnnouncer = (
  action: 'increased' | 'decreased',
  mediaWidth: number,
  changeAmount: number,
  validation: string,
  getIntl: () => IntlShape,
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
        action === 'increased'
          ? mediaResizeAnnouncerMess.DefaultMediaWidthIncreased
          : mediaResizeAnnouncerMess.DefaultMediaWidthDecreased,
        { newMediaWidth },
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
    action: 'increased' | 'decreased',
    getIntl: () => IntlShape,
  ): Command =>
  (state, dispatch) => {
    const { selection } = state;
    if (
      !(
        selection instanceof NodeSelection &&
        selection.node.type.name === 'mediaSingle'
      )
    ) {
      return false;
    }
    const mediaWidth: number =
      getSelectedMediaSingle(state)?.node?.attrs?.width;
    const contentWidth: number =
      widthPlugin?.sharedState.currentState()?.lineLength ||
      akEditorDefaultLayoutWidth;
    const mediaPluginState = stateKey.getState(state) as MediaPluginState;
    const maxWidthForNestedNode: number | undefined =
      mediaPluginState.currentMaxWidth;
    const minWidth: number = MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH;
    let maxWidth: any = maxWidthForNestedNode;
    const currentMaxWidth: number =
      widthPlugin?.sharedState.currentState()?.width || maxWidth;

    if (maxWidth === undefined && maxWidthForNestedNode === undefined) {
      maxWidth = options?.fullWidthEnabled
        ? widthPlugin?.sharedState.currentState()?.lineLength
        : calcMediaSingleMaxWidth(currentMaxWidth);
    }

    let validation: PixelEntryValidation = 'valid';
    let newWidth: number = mediaWidth + changeAmount;

    if (options?.fullWidthEnabled) {
      maxWidth = widthPlugin?.sharedState.currentState()?.lineLength;
    } else if (maxWidthForNestedNode === undefined) {
      maxWidth = calcMediaSingleMaxWidth(currentMaxWidth);
    }

    const { newWidthValidated, validation: validationResult } =
      validationMaxMin(newWidth, maxWidth, minWidth, validation);

    const newLayout = calcNewLayout(
      newWidthValidated,
      getSelectedMediaSingle(state)?.node?.attrs?.layout,
      contentWidth,
      options?.fullWidthEnabled,
    );
    updateMediaSingleWidth(editorAnalyticsAPI)(
      newWidthValidated,
      validationResult,
      'keyboard',
      newLayout,
    )(state, dispatch);
    createAnnouncer(
      action,
      mediaWidth,
      changeAmount,
      validationResult,
      getIntl,
    );
    return true;
  };

const handleMediaIncrease = (
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
  widthPlugin: WidthPlugin | undefined,
  options: MediaOptions | undefined,
  getIntl: () => IntlShape,
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
  getIntl: () => IntlShape,
) =>
  handleMediaSizeChange(
    editorAnalyticsAPI,
    widthPlugin,
    options,
    -1,
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
