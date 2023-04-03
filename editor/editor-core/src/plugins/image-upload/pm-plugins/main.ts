import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState, ReadonlyTransaction } from 'prosemirror-state';

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

/**
 * Microsoft Office includes a screenshot image when copying text content.
 *
 * This function determines whether or not we can ignore the image if it
 * came from MS Office. We do this by checking for
 *
 * - plain text
 * - HTML text which includes the MS Office namespace
 * - the number of files and the file name/type
 *
 * It is easy to manually verify this using by using Office on Mac
 * (or Excel if on Windows) and pasting into
 * https://evercoder.github.io/clipboard-inspector/
 *
 * Note: image content in Word is stored in the `text/html` portion
 * of the clipboard, not under `files` attachment like the screenshot.
 *
 * @returns boolean True if the paste event contains a screenshot from MS Office
 */
const hasScreenshotImageFromMSOffice = (ev?: Event): boolean => {
  const { clipboardData } = ev as ClipboardEvent;

  if (!clipboardData || clipboardData.files.length !== 1) {
    return false;
  }

  const textPlain = !!clipboardData.getData('text/plain');
  const textHtml = clipboardData.getData('text/html');
  const isOfficeXMLNamespace = textHtml.includes(
    'urn:schemas-microsoft-com:office:office',
  );

  const file = clipboardData.files[0];
  const isImagePNG = file.type === 'image/png' && file.name === 'image.png';

  return isImagePNG && textPlain && isOfficeXMLNamespace;
};

type DOMHandlerPredicate = (e: Event) => boolean;
const createDOMHandler =
  (pred: DOMHandlerPredicate, eventName: string) =>
  (view: EditorView, event: Event) => {
    if (!pred(event)) {
      return false;
    }

    const shouldUpload = !hasScreenshotImageFromMSOffice(event);

    if (shouldUpload) {
      event.preventDefault();
      event.stopPropagation();

      startImageUpload(event)(view.state, view.dispatch);
    }

    return shouldUpload;
  };

const getNewActiveUpload = (
  tr: ReadonlyTransaction,
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

  return new SafePlugin({
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
          const currentState: ImageUploadPluginState =
            stateKey.getState(editorState)!;

          // if we've add a new upload to the state, execute the uploadHandler
          const oldState: ImageUploadPluginState =
            stateKey.getState(prevState)!;

          if (
            currentState.activeUpload !== oldState.activeUpload &&
            currentState.activeUpload &&
            uploadHandler
          ) {
            const { event } = currentState.activeUpload;

            if (!event || !hasScreenshotImageFromMSOffice(event)) {
              uploadHandler(event, (options) =>
                insertExternalImage(options)(view.state, view.dispatch),
              );
            }
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
