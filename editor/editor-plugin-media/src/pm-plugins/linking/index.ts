import type { LinkAttributes } from '@atlaskit/adf-schema';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { MediaLinkingActions } from './actions';
import reducer from './reducer';
import type { InitialState, MediaLinkingState } from './types';

export const mediaLinkingPluginKey = new PluginKey<MediaLinkingState>(
  'mediaLinking',
);

const initialState: InitialState = {
  visible: false,
  editable: false,
  mediaPos: null,
  link: '',
};

function mapping(
  tr: ReadonlyTransaction,
  pluginState: MediaLinkingState,
): MediaLinkingState {
  if (pluginState && pluginState.mediaPos !== null) {
    return {
      ...pluginState,
      mediaPos: tr.mapping.map(pluginState.mediaPos),
    };
  }
  return pluginState;
}

function onSelectionChanged(tr: ReadonlyTransaction): MediaLinkingState {
  const isNodeSelection = tr.selection instanceof NodeSelection;
  if (!isNodeSelection) {
    return initialState;
  }

  const pos = tr.selection.$from.pos;
  const mediaPos =
    tr.selection.node.type.name === 'mediaInline' ? pos : pos + 1;

  const node = tr.doc.nodeAt(mediaPos);

  if (!node || !['media', 'mediaInline'].includes(node.type.name)) {
    return initialState;
  }

  const mark = node.marks.find((mark: Mark) => mark.type.name === 'link');
  if (mark) {
    return {
      ...initialState,
      mediaPos,
      editable: true,
      link: (mark.attrs as LinkAttributes).href,
    };
  }

  return {
    ...initialState,
    mediaPos,
  };
}

const mediaLinkingPluginFactory = pluginFactory<
  MediaLinkingState,
  MediaLinkingActions,
  InitialState
>(mediaLinkingPluginKey, reducer, {
  mapping,
  onSelectionChanged,
});

export const {
  createCommand: createMediaLinkingCommand,
  getPluginState: getMediaLinkingState,
} = mediaLinkingPluginFactory;

export type { MediaLinkingState } from './types';

export default (dispatch: Dispatch) =>
  new SafePlugin({
    key: mediaLinkingPluginKey,
    state: mediaLinkingPluginFactory.createPluginState(dispatch, initialState),
  });
