import { EditorState, Plugin, Transaction } from 'prosemirror-state';

import { isPastedFile } from '../../../utils/clipboard';
import { isDroppedFile } from '../../../utils/drag-drop';

import { canInsertMedia, isMediaSelected } from '../utils';
import { ImageUploadPluginAction, ImageUploadPluginState } from '../types';
import { EditorView } from 'prosemirror-view';
import { insertExternalImage, startImageUpload } from './commands';
import { PMPluginFactoryParams } from '../../../types';
import {
  ImageUploadProvider,
  Providers,
} from '@atlaskit/editor-common/provider-factory';
import { stateKey } from './plugin-key';

type DOMHandlerPredicate = (e: Event) => boolean;
const createDOMHandler = (pred: DOMHandlerPredicate, eventName: string) => (
  view: EditorView,
  event: Event,
) => {
  if (!pred(event)) {
    return false;
  }

  event.preventDefault();
  event.stopPropagation();

  startImageUpload(event)(view.state, view.dispatch);

  return true;
};

const getNewActiveUpload = (
  tr: Transaction,
  pluginState: ImageUploadPluginState,
) => {
  const meta: ImageUploadPluginAction | undefined = tr.getMeta(stateKey);
  if (meta && meta.name === 'START_UPLOAD') {
    return {
      event: meta.event,
    };
  }

  return pluginState.activeUpload;
};

export const createPlugin = ({
  dispatch,
  providerFactory,
}: PMPluginFactoryParams) => {
  let uploadHandler: ImageUploadProvider | undefined;

  return new Plugin({
    state: {
      init(_config, state: EditorState): ImageUploadPluginState {
        return {
          active: false,
          enabled: canInsertMedia(state),
          hidden: !state.schema.nodes.media || !state.schema.nodes.mediaSingle,
        };
      },
      apply(tr, pluginState: ImageUploadPluginState, _oldState, newState) {
        const newActive = isMediaSelected(newState);
        const newEnabled = canInsertMedia(newState);
        const newActiveUpload = getNewActiveUpload(tr, pluginState);

        if (
          newActive !== pluginState.active ||
          newEnabled !== pluginState.enabled ||
          newActiveUpload !== pluginState.activeUpload
        ) {
          const newPluginState = {
            ...pluginState,
            active: newActive,
            enabled: newEnabled,
            activeUpload: newActiveUpload,
          };

          dispatch(stateKey, newPluginState);
          return newPluginState;
        }

        return pluginState;
      },
    },
    key: stateKey,
    view: () => {
      const handleProvider = async (
        name: string,
        provider?: Providers['imageUploadProvider'],
      ) => {
        if (name !== 'imageUploadProvider' || !provider) {
          return;
        }

        try {
          uploadHandler = await provider;
        } catch (e) {
          uploadHandler = undefined;
        }
      };

      providerFactory.subscribe('imageUploadProvider', handleProvider);

      return {
        update(view, prevState) {
          const { state: editorState } = view;
          const currentState: ImageUploadPluginState = stateKey.getState(
            editorState,
          )!;

          // if we've add a new upload to the state, execute the uploadHandler
          const oldState: ImageUploadPluginState = stateKey.getState(
            prevState,
          )!;
          if (
            currentState.activeUpload !== oldState.activeUpload &&
            currentState.activeUpload &&
            uploadHandler
          ) {
            uploadHandler(currentState.activeUpload.event, (options) =>
              insertExternalImage(options)(view.state, view.dispatch),
            );
          }
        },

        destroy() {
          providerFactory.unsubscribe('imageUploadProvider', handleProvider);
        },
      };
    },
    props: {
      handleDOMEvents: {
        drop: createDOMHandler(isDroppedFile, 'atlassian.editor.image.drop'),
        paste: createDOMHandler(isPastedFile, 'atlassian.editor.image.paste'),
      },
    },
  });
};
