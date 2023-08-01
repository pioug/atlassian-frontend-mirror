import { pluginFactory } from '../../../../utils/plugin-state-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey, NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { Mark } from '@atlaskit/editor-prosemirror/model';
import type { Dispatch } from '../../../../event-dispatcher';
import type { MediaLinkingActions } from './actions';
import type { MediaLinkingState, InitialState } from './types';
import reducer from './reducer';
import type { LinkAttributes } from '@atlaskit/adf-schema';

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

  const mediaPos = tr.selection.$from.pos + 1;

  const node = tr.doc.nodeAt(mediaPos);
  if (!node || node.type.name !== 'media') {
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
