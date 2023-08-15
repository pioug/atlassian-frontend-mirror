import { isPastedFile } from '@atlaskit/editor-common/paste';
import type { Providers } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { ImageUploadPluginReferenceEvent } from '@atlaskit/editor-common/types';
import type {
  EditorState,
  ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type {
  ImageUploadPluginAction,
  ImageUploadPluginState,
  UploadHandlerReference,
} from '../types';
import { canInsertMedia, isMediaSelected } from '../utils';
import { isClipboardEvent } from '../utils/clipboard';
import { isDragEvent, isDroppedFile } from '../utils/drag-drop';

import { insertExternalImage, startImageUpload } from './commands';
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

const createReferenceEventFromEvent = (
  event: Event,
): ImageUploadPluginReferenceEvent | null => {
  if (!isDragEvent(event) && !isClipboardEvent(event)) {
    return null;
  }

  // Get files list and early exit if files is undefined
  const files = isDragEvent(event)
    ? event.dataTransfer?.files
    : event.clipboardData?.files;
  if (!files) {
    return null;
  }

  // Convert filelist into an array
  const filesArray = Array.from(files);

  // Creating a new DataTransfer object should remove any mutation that could be possible from the original event
  const dataTransfer = filesArray.reduce((acc, value) => {
    acc.items.add(value);
    return acc;
  }, new DataTransfer());

  return {
    type: isDragEvent(event) ? 'drop' : 'paste',
    ...(isDragEvent(event) && {
      dataTransfer,
    }),
    ...(isClipboardEvent(event) && {
      clipboardData: dataTransfer,
    }),
  };
};

const createDOMHandler =
  (
    pred: DOMHandlerPredicate,
    _eventName: string,
    uploadHandlerReference: UploadHandlerReference,
  ) =>
  (view: EditorView, event: Event) => {
    if (!pred(event)) {
      return false;
    }

    const shouldUpload = !hasScreenshotImageFromMSOffice(event);
    const referenceEvent = createReferenceEventFromEvent(event);

    if (shouldUpload && referenceEvent) {
      event.preventDefault();
      event.stopPropagation();

      // Insert external image into document
      if (uploadHandlerReference.current) {
        uploadHandlerReference.current(referenceEvent, options => {
          insertExternalImage(options)(view.state, view.dispatch);
        });
      }

      // Start image upload
      startImageUpload(referenceEvent)(view.state, view.dispatch);
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

export const createPlugin =
  (uploadHandlerReference: UploadHandlerReference) =>
  ({ dispatch, providerFactory }: PMPluginFactoryParams) => {
    return new SafePlugin({
      state: {
        init(_config, state: EditorState): ImageUploadPluginState {
          return {
            active: false,
            enabled: canInsertMedia(state),
            hidden:
              !state.schema.nodes.media || !state.schema.nodes.mediaSingle,
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
            const imageUploadProvider = await provider;
            uploadHandlerReference.current = imageUploadProvider;
          } catch (e) {
            uploadHandlerReference.current = null;
          }
        };

        providerFactory.subscribe('imageUploadProvider', handleProvider);

        return {
          destroy() {
            uploadHandlerReference.current = null;
            providerFactory.unsubscribe('imageUploadProvider', handleProvider);
          },
        };
      },
      props: {
        handleDOMEvents: {
          drop: createDOMHandler(
            isDroppedFile,
            'atlassian.editor.image.drop',
            uploadHandlerReference,
          ),
          paste: createDOMHandler(
            event => isPastedFile(event as ClipboardEvent),
            'atlassian.editor.image.paste',
            uploadHandlerReference,
          ),
        },
      },
    });
  };
