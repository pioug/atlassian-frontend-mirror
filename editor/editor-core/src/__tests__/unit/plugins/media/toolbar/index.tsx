import React from 'react';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

import {
  bodiedExtension,
  doc,
  layoutColumn,
  layoutSection,
  li,
  media,
  mediaSingle,
  p,
  table,
  td,
  tr,
  ul,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import * as analytics from '../../../../../plugins/analytics/utils';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
/**
 * TS 3.9+ defines non-configurable property for exports, that's why it's not possible to mock them like this anymore:
 *
 * ```
 * import * as tableUtils from '../../../../../plugins/table/utils';
 * jest.spyOn(tableUtils, 'getColumnsWidths')
 * ```
 *
 * This is a workaround: https://github.com/microsoft/TypeScript/issues/38568#issuecomment-628637477
 */
jest.mock('@atlaskit/media-client', () => ({
  __esModule: true,
  ...jest.requireActual<Object>('@atlaskit/media-client'),
}));
import * as MediaClientModule from '@atlaskit/media-client';
import { FileState, MediaClient } from '@atlaskit/media-client';
import {
  asMockReturnValue,
  expectFunctionToHaveBeenCalledWith,
  fakeMediaClient,
  getDefaultMediaClientConfig,
  nextTick,
} from '@atlaskit/media-test-helpers';
import { shallow } from 'enzyme';
import { ReactElement } from 'react';
import { IntlProvider } from 'react-intl';
import commonMessages from '../../../../../messages';
import { messages as altTextMessages } from '../../../../../plugins/media/pm-plugins/alt-text/messages';
import {
  FloatingToolbarCustom,
  FloatingToolbarItem,
} from '../../../../../plugins/floating-toolbar/types';
import Button from '../../../../../plugins/floating-toolbar/ui/Button';
import { MediaOptions } from '../../../../../plugins/media/types';
import { stateKey } from '../../../../../plugins/media/pm-plugins/main';
import { floatingToolbar } from '../../../../../plugins/media/toolbar';
import { toolbarMessages } from '../../../../../ui/MediaAndEmbedsToolbar/toolbar-messages';
import { AnnotationToolbar } from '../../../../../plugins/media/toolbar/annotation';
import { toolbarMessages as annotateMessages } from '../../../../../plugins/media/toolbar/toolbar-messages';
import { setNodeSelection } from '../../../../../utils';
import {
  getFreshMediaProvider,
  temporaryFileId,
  testCollectionName,
} from '../_utils';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  getToolbarItems,
  findToolbarBtn,
} from '../../../../../plugins/floating-toolbar/__tests__/_helpers';
import { Command } from '../../../../../types';
import { MediaPluginState } from '../../../../../plugins/media/pm-plugins/types';

describe('media', () => {
  const createEditor = createEditorFactory<MediaPluginState>();

  let createAnalyticsEvent: jest.Mock<any>;

  const editor = (doc: DocBuilder, mediaPropsOverride: MediaOptions = {}) => {
    const contextIdentifierProvider = storyContextIdentifierProviderFactory();
    const providerFactory = ProviderFactory.create({
      contextIdentifierProvider,
    });
    return createEditor({
      doc,
      editorProps: {
        media: {
          provider: getFreshMediaProvider(),
          allowMediaSingle: true,
          ...mediaPropsOverride,
        },
        allowExtension: true,
        allowLayouts: true,
        allowTables: true,
        allowAnalyticsGASV3: true,
        contextIdentifierProvider,
      },
      providerFactory,
      createAnalyticsEvent,
      pluginKey: stateKey,
    });
  };

  const temporaryMedia = media({
    id: temporaryFileId,
    type: 'file',
    collection: testCollectionName,
    __fileMimeType: 'image/png',
    width: 100,
    height: 100,
  })();

  const temporaryMediaSingle = mediaSingle({ layout: 'center' })(
    temporaryMedia,
  );

  const docWithMediaSingle = doc(temporaryMediaSingle);

  beforeEach(() => {
    createAnalyticsEvent = jest.fn().mockReturnValue({
      fire() {},
    });
  });

  describe('toolbar', () => {
    const intlProvider = new IntlProvider({ locale: 'en' });
    const { intl } = intlProvider.getChildContext();

    const removeTitle = intl.formatMessage(commonMessages.remove);

    it('has a remove button', () => {
      const { editorView } = editor(docWithMediaSingle);

      const toolbar = floatingToolbar(editorView.state, intl);
      expect(toolbar).toBeDefined();
      const removeButton = findToolbarBtn(
        getToolbarItems(toolbar!, editorView),
        removeTitle,
      );

      expect(removeButton).toBeDefined();
      expect(removeButton).toMatchObject({
        appearance: 'danger',
        icon: RemoveIcon,
      });
    });

    it('should render alt text button when enabled', () => {
      const { editorView } = editor(docWithMediaSingle, {
        allowAltTextOnImages: true,
      });
      setNodeSelection(editorView, 0);

      const altTextTitle = intl.formatMessage(altTextMessages.altText);

      const toolbar = floatingToolbar(editorView.state, intl, {
        allowAltTextOnImages: true,
      });

      const button = findToolbarBtn(
        getToolbarItems(toolbar!, editorView),
        altTextTitle,
      );

      expect(button).toBeDefined();
    });

    it('should render alignment, wrapping and breakout buttons in full page without resizing enabled', () => {
      const { editorView } = editor(docWithMediaSingle);

      const toolbar = floatingToolbar(editorView.state, intl, {
        allowAdvancedToolBarOptions: true,
      });
      expect(toolbar).toBeDefined();
      expect(toolbar!.items.length).toEqual(11);
    });

    it('should only render alignment and wrapping buttons in full page when resizing is enabled', () => {
      const { editorView } = editor(docWithMediaSingle);

      const toolbar = floatingToolbar(editorView.state, intl, {
        allowResizing: true,
        allowAdvancedToolBarOptions: true,
      });
      expect(toolbar).toBeDefined();
      expect(toolbar!.items.length).toEqual(8);
    });

    it('can render regular toolbar with annotation in full page', () => {
      const { editorView } = editor(docWithMediaSingle);

      const toolbar = floatingToolbar(editorView.state, intl, {
        allowResizing: true,
        allowAnnotation: true,
        allowAdvancedToolBarOptions: true,
      });
      expect(toolbar).toBeDefined();
      expect(toolbar!.items.length).toEqual(9);
      const item = getToolbarItems(toolbar!, editorView).find(
        (cmd) => cmd.type === 'custom',
      );
      expect(item).toBeDefined();
    });

    it('should not render any layout buttons when in comment', () => {
      const { editorView } = editor(docWithMediaSingle);

      const toolbar = floatingToolbar(editorView.state, intl, {
        allowResizing: true,
        allowAdvancedToolBarOptions: false,
      });
      expect(toolbar).toBeDefined();
      expect(toolbar!.items.length).toEqual(1);
    });

    it('should not render any layout buttons when inside a macro', () => {
      const { editorView } = editor(
        doc(
          bodiedExtension({
            extensionKey: 'extensionKey',
            extensionType: 'bodiedExtension',
          })(temporaryMediaSingle),
        ),
      );

      const toolbar = floatingToolbar(editorView.state, intl, {
        allowResizing: true,
        allowAdvancedToolBarOptions: true,
      });
      expect(toolbar).toBeDefined();
      expect(toolbar!.items.length).toEqual(1);
    });

    it('should render layout buttons when inside columns', () => {
      const { editorView } = editor(
        doc(
          layoutSection(
            layoutColumn({ width: 50 })(p('')),
            layoutColumn({ width: 50 })(temporaryMediaSingle),
          ),
        ),
      );

      const toolbar = floatingToolbar(editorView.state, intl, {
        allowResizing: true,
        allowAdvancedToolBarOptions: true,
      });
      const findToolbarBtnByName = findToolbarBtn.bind(
        null,
        toolbar!.items as Array<FloatingToolbarItem<Command>>,
      );
      expect(toolbar).toBeDefined();
      expect(
        findToolbarBtnByName(commonMessages.alignImageLeft.defaultMessage),
      ).toBeDefined();
      expect(
        findToolbarBtnByName(commonMessages.alignImageCenter.defaultMessage),
      ).toBeDefined();
      expect(
        findToolbarBtnByName(commonMessages.alignImageRight.defaultMessage),
      ).toBeDefined();
      expect(
        findToolbarBtnByName(toolbarMessages.wrapLeft.defaultMessage),
      ).toBeDefined();
      expect(
        findToolbarBtnByName(toolbarMessages.wrapRight.defaultMessage),
      ).toBeDefined();
    });

    it('should not render any layout buttons when inside a list item', () => {
      const { editorView } = editor(doc(ul(li(temporaryMediaSingle))));

      const toolbar = floatingToolbar(editorView.state, intl, {
        allowResizing: true,
        allowAdvancedToolBarOptions: true,
      });
      expect(toolbar).toBeDefined();
      expect(toolbar!.items.length).toEqual(1);
    });

    it('should render layout buttons when inside a table and allowResizingInTable is enabled', () => {
      const { editorView } = editor(
        doc(table()(tr(td()(temporaryMediaSingle)))),
        {
          allowResizing: true,
          allowResizingInTables: true,
        },
      );

      const toolbar = floatingToolbar(editorView.state, intl, {
        allowResizing: true,
        allowAdvancedToolBarOptions: true,
        allowResizingInTables: true,
      });
      expect(toolbar).toBeDefined();
      expect(toolbar!.items.length).toEqual(8);
    });

    it('should not render layout buttons when inside a table and allowResizingInTable is disabled', () => {
      const { editorView } = editor(
        doc(table()(tr(td()(temporaryMediaSingle)))),
      );

      const toolbar = floatingToolbar(editorView.state, intl, {
        allowResizing: true,
        allowAdvancedToolBarOptions: true,
      });
      expect(toolbar).toBeDefined();
      expect(toolbar!.items.length).toEqual(1);
    });

    it('deletes a media single', () => {
      const { editorView } = editor(docWithMediaSingle);
      setNodeSelection(editorView, 0);

      const toolbar = floatingToolbar(editorView.state, intl);
      const removeButton = findToolbarBtn(
        getToolbarItems(toolbar!, editorView),
        removeTitle,
      );

      removeButton.onClick(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });

    it('aligns a media single to the left', () => {
      const { editorView } = editor(docWithMediaSingle);
      setNodeSelection(editorView, 0);
      const analyticsFn = jest.spyOn(analytics, 'addAnalytics');
      const alignLeftTitle = intl.formatMessage(commonMessages.alignImageLeft);

      const toolbar = floatingToolbar(editorView.state, intl, {
        allowResizing: true,
        allowAdvancedToolBarOptions: true,
      });

      const button = findToolbarBtn(
        getToolbarItems(toolbar!, editorView),
        alignLeftTitle,
      );

      button.onClick(editorView.state, editorView.dispatch);
      expect(analyticsFn).toBeCalled();
      expect(editorView.state.doc).toEqualDocument(
        doc(mediaSingle({ layout: 'align-start' })(temporaryMedia)),
      );
    });

    describe('image annotation', () => {
      let mockMediaClient: MediaClient;

      beforeEach(async () => {
        const mediaClientConfig = getDefaultMediaClientConfig();
        mockMediaClient = fakeMediaClient({
          ...mediaClientConfig,
          userAuthProvider: mediaClientConfig.authProvider,
        });
        asMockReturnValue(
          mockMediaClient.file.getCurrentState,
          Promise.resolve<FileState>({
            status: 'processed',
            id: 'some-id',
            name: 'some-name',
            size: 42,
            artifacts: {},
            mediaType: 'image',
            mimeType: 'image/png',
          }),
        );
        jest
          .spyOn(MediaClientModule, 'getMediaClient')
          .mockReturnValue(mockMediaClient);
      });

      afterEach(() => {
        jest.resetAllMocks();
      });

      it('should call getCurrentState for current state', () => {
        shallow(
          <AnnotationToolbar
            viewMediaClientConfig={mockMediaClient.config}
            id="1234"
            collection="some-collection"
            intl={intl}
          />,
        );

        expectFunctionToHaveBeenCalledWith(
          mockMediaClient.file.getCurrentState,
          ['1234', { collectionName: 'some-collection' }],
        );
      });

      it('should mount with default state if getCurrentState fails', async () => {
        asMockReturnValue(
          mockMediaClient.file.getCurrentState,
          Promise.reject(new Error('an error')),
        );

        const toolbar = shallow(
          <AnnotationToolbar
            viewMediaClientConfig={mockMediaClient.config}
            id="1234"
            collection="some-collection"
            intl={intl}
          />,
        );

        expectFunctionToHaveBeenCalledWith(
          mockMediaClient.file.getCurrentState,
          ['1234', { collectionName: 'some-collection' }],
        );

        await nextTick();

        expect(toolbar.state('isImage')).toBeFalsy();
      });

      it('has an AnnotationToolbar custom toolbar element', async () => {
        const { editorView, pluginState } = editor(docWithMediaSingle);
        await pluginState.setMediaProvider(getFreshMediaProvider());

        setNodeSelection(editorView, 0);

        const toolbar = floatingToolbar(editorView.state, intl, {
          allowResizing: true,
          allowAnnotation: true,
          allowAdvancedToolBarOptions: true,
        });

        const annotateToolbarComponent = getToolbarItems(
          toolbar!,
          editorView,
        ).find((item) => item.type === 'custom') as FloatingToolbarCustom<
          Command
        >;

        const annotationToolbar = shallow(
          annotateToolbarComponent.render(editorView) as ReactElement<any>,
        );
        expect(annotationToolbar.instance()).toBeInstanceOf(AnnotationToolbar);
      });

      it('renders an annotate button when an image is selected', async () => {
        const toolbar = shallow(
          <AnnotationToolbar
            viewMediaClientConfig={mockMediaClient.config}
            id="1234"
            intl={intl}
          />,
        );

        await mockMediaClient.file.getCurrentState('1234');

        expect(toolbar.find(Button).first().prop('title')).toEqual(
          annotateMessages.annotate.defaultMessage,
        );
      });

      it('fires analytics when the annotate button is clicked', async () => {
        const { editorView, pluginState } = editor(docWithMediaSingle);

        await pluginState.setMediaProvider(getFreshMediaProvider());

        setNodeSelection(editorView, 0);

        const toolbar = shallow(
          <AnnotationToolbar
            viewMediaClientConfig={mockMediaClient.config}
            id="1234"
            intl={intl}
            view={editorView}
          />,
        );

        await mockMediaClient.file.getCurrentState('1234');

        toolbar.find(Button).simulate('click');

        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'clicked',
          actionSubject: 'media',
          actionSubjectId: 'annotateButton',
          eventType: 'ui',
        });
      });
    });
  });
});
