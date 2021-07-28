import { ProviderFactory } from '@atlaskit/editor-common';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  media,
  mediaSingle,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { MediaAttributes } from '@atlaskit/adf-schema';
import { EditorView } from 'prosemirror-view';
import { IntlProvider } from 'react-intl';
import { messages as altTextMessages } from '../../../../../plugins/media/pm-plugins/alt-text/messages';
import {
  FloatingToolbarButton,
  FloatingToolbarConfig,
} from '../../../../../plugins/floating-toolbar/types';
import { MediaOptions } from '../../../../../plugins/media/types';
import { stateKey } from '../../../../../plugins/media/pm-plugins/main';
import { floatingToolbar } from '../../../../../plugins/media/toolbar';
import { Command } from '../../../../../types';
import { setNodeSelection } from '../../../../../utils';
import {
  getFreshMediaProvider,
  temporaryFileId,
  testCollectionName,
} from '../_utils';
import {
  findToolbarBtn,
  getToolbarItems,
} from '../../../../../plugins/floating-toolbar/__tests__/_helpers';
import { MediaPluginState } from '../../../../../plugins/media/pm-plugins/types';

interface ToolbarWrapper {
  editorView: EditorView;
  toolbar: FloatingToolbarConfig | undefined;
  buttons: {
    altText: FloatingToolbarButton<Command> | undefined;
    editAltText: FloatingToolbarButton<Command> | undefined;
  };
}

describe('media', () => {
  const intlProvider = new IntlProvider({ locale: 'en' });
  const { intl } = intlProvider.getChildContext();

  const createEditor = createEditorFactory<MediaPluginState>();

  const editor = (doc: DocBuilder, mediaPropsOverride: MediaOptions = {}) => {
    const contextIdentifierProvider = storyContextIdentifierProviderFactory();
    const mediaProvider = getFreshMediaProvider();
    const providerFactory = ProviderFactory.create({
      contextIdentifierProvider,
      mediaProvider,
    });
    const wrapper = createEditor({
      doc,
      editorProps: {
        media: {
          provider: mediaProvider,
          allowMediaSingle: true,
          ...mediaPropsOverride,
        },
      },
      providerFactory,
      pluginKey: stateKey,
    });
    return wrapper;
  };

  const dummyMediaAttributes: MediaAttributes = {
    id: temporaryFileId,
    type: 'file',
    collection: testCollectionName,
    __fileMimeType: 'image/png',
    __contextId: 'DUMMY-OBJECT-ID',
    width: 100,
    height: 100,
  };

  const temporaryMediaSingleWithoutAltText = mediaSingle({ layout: 'center' })(
    media(dummyMediaAttributes)(),
  );

  const temporaryMediaSingleWithAltText = mediaSingle({ layout: 'center' })(
    media({
      ...dummyMediaAttributes,
      alt: 'test',
    })(),
  );

  const docWithAltText = doc(temporaryMediaSingleWithAltText);
  const docWithoutAltText = doc(temporaryMediaSingleWithoutAltText);

  async function setupToolbar(
    doc: DocBuilder,
    allowAltTextOnImages = false,
  ): Promise<ToolbarWrapper> {
    // Setup editor
    const { editorView, pluginState } = editor(doc, {
      allowAltTextOnImages,
    });
    await pluginState.setMediaProvider(getFreshMediaProvider());

    setNodeSelection(editorView, 0);

    const toolbar = floatingToolbar(editorView.state, intl, {
      allowAltTextOnImages,
    });
    const items = getToolbarItems(toolbar!, editorView);

    return {
      editorView,
      toolbar,
      buttons: {
        altText: findToolbarBtn(
          items,
          intl.formatMessage(altTextMessages.altText),
        ),
        editAltText: findToolbarBtn(
          items,
          intl.formatMessage(altTextMessages.editAltText),
        ),
      },
    };
  }

  describe('Toolbar', () => {
    describe('Alt Text', () => {
      describe('when feature flag is off', () => {
        it('should hide alt text button', async () => {
          const { buttons } = await setupToolbar(docWithoutAltText, false);

          expect(buttons.altText).toBeUndefined();
          expect(buttons.editAltText).toBeUndefined();
        });
      });

      describe('when feature flag is on', () => {
        it('should show alt text button if there is no alt text in the image', async () => {
          const { buttons } = await setupToolbar(docWithoutAltText, true);

          expect(buttons.altText).toBeDefined();
          expect(buttons.editAltText).toBeUndefined();
        });

        it('should show edit alt text button if there is alt text in the image', async () => {
          const { buttons } = await setupToolbar(docWithAltText, true);

          expect(buttons.altText).toBeUndefined();
          expect(buttons.editAltText).toBeDefined();
        });
      });
    });
  });
});
