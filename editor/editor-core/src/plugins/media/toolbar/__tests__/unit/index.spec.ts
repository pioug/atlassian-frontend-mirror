jest.mock('@atlaskit/editor-prosemirror/utils', () => ({
  ...jest.requireActual<any>('@atlaskit/editor-prosemirror/utils'),
  findParentNodeOfType: jest
    .fn()
    .mockReturnValue(() => ({ node: { type: 'mediaGroup' } })),
}));
jest.mock('@atlaskit/media-client', () => ({
  ...jest.requireActual<any>('@atlaskit/media-client'),
  getMediaClient: jest.fn().mockReturnValue({
    file: {
      getCurrentState: jest
        .fn()
        .mockReturnValue({ status: 'processed', name: 'some-file-name' }),
      downloadBinary: jest.fn(),
    },
  }),
}));

import { getMediaClient } from '@atlaskit/media-client';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  media,
  mediaGroup,
  mediaInline,
  doc,
  p,
  mediaSingle,
} from '@atlaskit/editor-test-helpers/doc-builder';
import type {
  MediaAttributes,
  ExtendedMediaAttributes,
} from '@atlaskit/adf-schema';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { createIntl } from 'react-intl-next';
import type { MediaOptions } from '../../../../../plugins/media/types';
import { stateKey } from '../../../../../plugins/media/pm-plugins/main';
import { floatingToolbar } from '../../index';
import * as utils from '../../utils';
import * as commands from '../../commands';
import {
  getFreshMediaProvider,
  temporaryFileId,
  testCollectionName,
} from '../../../../../__tests__/unit/plugins/media/_utils';
import {
  getToolbarItems,
  findToolbarBtn,
  findPixelEntry,
} from '../../../../../plugins/floating-toolbar/__tests__/_helpers';
import type { MediaPluginState } from '../../../../../plugins/media/pm-plugins/types';

const mockInjectionAPI: any = {
  dependencies: {
    decorations: {
      actions: {
        hoverDecoration: () => () => {},
      },
    },
    width: {
      sharedState: {
        currentState: () => {
          return { lineLength: 760, width: 1800 };
        },
      },
    },
  },
};

describe('floatingToolbar()', () => {
  const intl = createIntl({ locale: 'en' });
  const createEditor = createEditorFactory<MediaPluginState>();

  const editor = (
    doc: DocBuilder,
    mediaPropsOverride: MediaOptions = {},
    allowBorder: boolean = false,
  ) => {
    const contextIdentifierProvider = storyContextIdentifierProviderFactory();
    const mediaProvider = getFreshMediaProvider();
    const providerFactory = ProviderFactory.create({
      contextIdentifierProvider,
      mediaProvider,
    });
    const wrapper = createEditor({
      doc,
      editorProps: {
        UNSAFE_allowBorderMark: allowBorder,
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('mediaGroup', () => {
    const setup = async (allowMediaInline: boolean) => {
      const attrs: MediaAttributes = {
        id: temporaryFileId,
        type: 'file',
        collection: testCollectionName,
        __fileMimeType: 'image/png',
        __contextId: 'DUMMY-OBJECT-ID',
        width: 100,
        height: 100,
      };

      const doc = mediaGroup(media(attrs)());
      const { editorView, pluginState } = editor(doc, {
        featureFlags: { mediaInline: allowMediaInline },
        allowLinking: true,
      });
      await pluginState.setMediaProvider(getFreshMediaProvider());

      // manually override type to pass mediaGroup node checking
      // @ts-ignore - [unblock prosemirror bump] assigning string instead of NodeType object
      editorView.state.schema.nodes.mediaGroup = 'mediaGroup';
      const toolbar = floatingToolbar(
        editorView.state,
        intl,
        {
          allowMediaInline,
        },
        mockInjectionAPI,
      );
      const items = getToolbarItems(toolbar!, editorView);
      const mediaPluginState: MediaPluginState | undefined = stateKey.getState(
        editorView.state,
      );

      return {
        editorView,
        items,
        mediaPluginState,
      };
    };

    it('should return media group items', async () => {
      const { items } = await setup(true);

      expect(items).toMatchSnapshot();
    });

    it('should not return media group items if allowMediaInline is false', async () => {
      const { items } = await setup(false);

      expect(items).toMatchSnapshot();
    });

    it('should download file when clicking on the download button', async () => {
      const { items, editorView } = await setup(true);
      const downloadButton = findToolbarBtn(items, 'Download');
      const mediaClient = getMediaClient({} as any);

      expect(mediaClient.file.downloadBinary).toHaveBeenCalledTimes(0);
      downloadButton.onClick(editorView.state);
      await mediaClient.file.downloadBinary;
      expect(mediaClient.file.downloadBinary).toHaveBeenCalledTimes(1);
      expect(mediaClient.file.downloadBinary).toBeCalledWith(
        undefined,
        'some-file-name',
        '',
      );
    });

    it('should remove card when clicking on the delete button', async () => {
      const { items, editorView } = await setup(true);
      const removeButton = findToolbarBtn(items, 'Remove');
      const spy = jest.spyOn(utils, 'removeMediaGroupNode');

      expect(spy).toBeCalledTimes(0);
      removeButton.onClick(editorView.state);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('mediaInline', () => {
    const setup = async () => {
      const attrs: MediaAttributes = {
        id: temporaryFileId,
        type: 'file',
        collection: testCollectionName,
        __fileMimeType: 'image/png',
        __contextId: 'DUMMY-OBJECT-ID',
        width: 100,
        height: 100,
      };

      const document = doc(p('{<node>}', mediaInline(attrs)()));
      const { editorView, pluginState } = editor(document, {
        featureFlags: { mediaInline: true },
        allowLinking: true,
      });
      await pluginState.setMediaProvider(getFreshMediaProvider());

      const toolbar = floatingToolbar(
        editorView.state,
        intl,
        {
          allowMediaInline: true,
        },
        mockInjectionAPI,
      );
      const items = getToolbarItems(toolbar!, editorView);
      const mediaPluginState: MediaPluginState | undefined = stateKey.getState(
        editorView.state,
      );

      return {
        editorView,
        items,
        mediaPluginState,
      };
    };

    it('should return media inline items', async () => {
      const { items } = await setup();

      expect(items).toMatchSnapshot();
    });

    it('should download file when clicking on the download button', async () => {
      const { items, editorView } = await setup();
      const downloadButton = findToolbarBtn(items, 'Download');
      const mediaClient = getMediaClient({} as any);

      expect(mediaClient.file.downloadBinary).toHaveBeenCalledTimes(0);
      downloadButton.onClick(editorView.state);
      await mediaClient.file.downloadBinary;
      expect(mediaClient.file.downloadBinary).toHaveBeenCalledTimes(1);
      expect(mediaClient.file.downloadBinary).toBeCalledWith(
        temporaryFileId,
        'some-file-name',
        testCollectionName,
      );
    });

    it('should remove inline file when clicking on the delete button', async () => {
      const spy = jest.spyOn(commands, 'removeInlineCard');
      const { items, editorView } = await setup();
      const removeButton = findToolbarBtn(items, 'Remove');

      expect(spy).toBeCalledTimes(0);
      removeButton.onClick(editorView.state);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('mediaSingle', () => {
    const exampleMediaWidth = 100;
    const exampleMediaHeight = 100;
    const pixelEntryMediaProps = {
      mediaWidth: exampleMediaWidth,
      mediaHeight: exampleMediaHeight,
    };
    const setup = async (
      allowBorder: boolean = false,
      mediaSingleAttrs?: ExtendedMediaAttributes,
    ) => {
      const attrs: MediaAttributes = {
        id: temporaryFileId,
        type: 'file',
        collection: testCollectionName,
        __fileMimeType: 'image/png',
        __contextId: 'DUMMY-OBJECT-ID',
        width: exampleMediaWidth,
        height: exampleMediaHeight,
      };

      const document = doc(
        mediaSingle(mediaSingleAttrs)(media({ ...attrs })()),
      );
      const { editorView, pluginState } = editor(document, {}, allowBorder);
      await pluginState.setMediaProvider(getFreshMediaProvider());

      const toolbar = floatingToolbar(
        editorView.state,
        intl,
        {
          allowLinking: true,
          allowAdvancedToolBarOptions: true,
          allowResizing: true,
        },
        mockInjectionAPI,
      );
      const items = getToolbarItems(toolbar!, editorView);
      const mediaPluginState: MediaPluginState | undefined = stateKey.getState(
        editorView.state,
      );

      return {
        editorView,
        items,
        mediaPluginState,
      };
    };

    it('should return media single items', async () => {
      const { items } = await setup();

      expect(items).toMatchSnapshot();
    });

    it('should return media single items with border option', async () => {
      const { items } = await setup(true);

      expect(items).toMatchSnapshot();
    });

    const layoutButtonTitles = [
      'Wrap left',
      'Wrap right',
      'Align right',
      'Align left',
      'Align center',
    ];

    describe('should disable layout buttons when media width is greater than content width', () => {
      ffTest(
        'platform.editor.media.extended-resize-experience',
        async () => {
          const { items } = await setup(undefined, {
            layout: 'wide',
            width: 900,
            widthType: 'pixel',
          });
          layoutButtonTitles.forEach((layout) => {
            const button = findToolbarBtn(items, layout);
            expect(button).toBeDefined();

            if (layout === 'Align center') {
              expect(button.disabled).toBe(false);
            } else {
              expect(button.disabled).toBe(true);
            }
          });
        },
        // check no buttons are disabled when FF is off
        async () => {
          const { items } = await setup(undefined, {
            layout: 'wide',
            width: 900,
            widthType: 'pixel',
          });
          layoutButtonTitles.forEach((layout) => {
            const button = findToolbarBtn(items, layout);
            expect(button).toBeDefined();
            expect(button.disabled).toBeUndefined();
          });
        },
      );
    });

    describe('should enable layout buttons when media width is less than content width', () => {
      ffTest(
        'platform.editor.media.extended-resize-experience',
        async () => {
          const { items } = await setup(undefined, {
            layout: 'center',
            width: 500,
            widthType: 'pixel',
          });
          layoutButtonTitles.forEach((layout) => {
            const button = findToolbarBtn(items, layout);
            expect(button).toBeDefined();
            expect(button.disabled).toBeUndefined();
          });
        },
        // check no buttons are disabled when FF is off
        async () => {
          const { items } = await setup(undefined, {
            layout: 'center',
            width: 500,
            widthType: 'pixel',
          });
          layoutButtonTitles.forEach((layout) => {
            const button = findToolbarBtn(items, layout);
            expect(button).toBeDefined();
            expect(button.disabled).toBeUndefined();
          });
        },
      );
    });

    describe.each<{
      id: string;
      source: ExtendedMediaAttributes;
      result: { width: number; mediaWidth: number; mediaHeight: number };
    }>([
      {
        id: 'no widthType and no width',
        source: {
          layout: 'center',
        },
        result: {
          ...pixelEntryMediaProps,
          width: 100,
        },
      },
      {
        id: 'no widthType and wide',
        source: {
          layout: 'wide',
        },
        result: {
          ...pixelEntryMediaProps,
          width: 1011,
        },
      },
      {
        id: 'no widthType and fullwidth',
        source: {
          layout: 'full-width',
        },
        result: {
          ...pixelEntryMediaProps,
          width: 1736,
        },
      },
      {
        id: '50% width',
        source: {
          layout: 'center',
          widthType: 'percentage',
          width: 50,
        },
        result: {
          ...pixelEntryMediaProps,
          width: 368,
        },
      },
      {
        id: '100% width',
        source: {
          layout: 'center',
          widthType: 'percentage',
          width: 100,
        },
        result: {
          ...pixelEntryMediaProps,
          width: 760,
        },
      },
      {
        id: '100% width wide',
        source: {
          layout: 'wide',
          widthType: 'percentage',
          width: 100,
        },
        result: {
          ...pixelEntryMediaProps,
          width: 1011,
        },
      },
      {
        id: '100% width full-width',
        source: {
          layout: 'full-width',
          widthType: 'percentage',
          width: 100,
        },
        result: {
          ...pixelEntryMediaProps,
          width: 1736,
        },
      },
      {
        id: 'pixel type',
        source: {
          layout: 'center',
          widthType: 'pixel',
          width: 123,
        },
        result: {
          ...pixelEntryMediaProps,
          width: 123,
        },
      },
      {
        id: 'pixel type full-width',
        source: {
          layout: 'full-width',
          widthType: 'pixel',
          width: 1800,
        },
        result: {
          ...pixelEntryMediaProps,
          width: 1800,
        },
      },
    ])('pixel entry initial values', ({ id, source, result }) => {
      describe(`${id}`, () => {
        ffTest(
          'platform.editor.media.extended-resize-experience',
          async () => {
            const { items, editorView } = await setup(undefined, source);
            const pixelEntry = findPixelEntry(items);
            const pixelEntryInstance = pixelEntry.render(editorView) as any;
            expect(pixelEntryInstance).not.toBe(null);
            if (pixelEntryInstance) {
              expect(pixelEntryInstance.props.width).toBe(result.width);
              expect(pixelEntryInstance.props.mediaWidth).toBe(
                result.mediaWidth,
              );
              expect(pixelEntryInstance.props.mediaHeight).toBe(
                result.mediaHeight,
              );
            }
          },
          // check no buttons are disabled when FF is off
          async () => {
            const { items } = await setup(undefined, source);
            const pixelEntry = findPixelEntry(items);
            expect(pixelEntry).not.toBeDefined();
          },
        );
      });
    });
  });
});
