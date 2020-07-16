import React from 'react';
import { ActivityItem } from '@atlaskit/activity-provider';
import { ProviderFactory, ErrorMessage } from '@atlaskit/editor-common';
import { activityProviderFactory } from '@atlaskit/editor-test-helpers/activity-provider';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { render, fireEvent } from '@testing-library/react';

import {
  a,
  doc,
  table,
  th,
  tr,
  td,
  p,
  ol,
  li,
  layoutColumn,
  layoutSection,
  media,
  mediaSingle,
} from '@atlaskit/editor-test-helpers/schema-builder';

import { ReactWrapper } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { ReactElement } from 'react';
import { IntlProvider } from 'react-intl';
import { linkToolbarMessages, linkMessages } from '../../../../../messages';
import { INPUT_METHOD } from '../../../../../plugins/analytics';
import {
  FloatingToolbarButton,
  FloatingToolbarConfig,
  FloatingToolbarCustom,
  FloatingToolbarItem,
} from '../../../../../plugins/floating-toolbar/types';
import { MediaOptions } from '../../../../../plugins/media/types';
import {
  getMediaLinkingState,
  MediaLinkingState,
} from '../../../../../plugins/media/pm-plugins/linking';
import { stateKey } from '../../../../../plugins/media/pm-plugins/main';
import { floatingToolbar } from '../../../../../plugins/media/toolbar';
import {
  LinkAddToolbar,
  Props as LinkAddToolbarProps,
} from '../../../../../plugins/media/ui/MediaLinkingToolbar';
import { Command } from '../../../../../types';
import { setNodeSelection } from '../../../../../utils';
import {
  getFreshMediaProvider,
  temporaryFileId,
  testCollectionName,
} from '../_utils';
import safeUnmount from '../../../../__helpers/safeUnmount';
import {
  findToolbarBtn,
  getToolbarItems,
} from '../../floating-toolbar/_helpers';
import { MediaFloatingToolbarOptions } from '../../../../../plugins/media/types';
import PanelTextInput from '../../../../../ui/PanelTextInput';
import { MediaPluginState } from '../../../../../plugins/media/pm-plugins/types';

interface ToolbarWrapper {
  editorView: EditorView;
  toolbar: FloatingToolbarConfig | undefined;
  buttons: {
    addLink: FloatingToolbarButton<Command> | undefined;
    editLink: FloatingToolbarButton<Command> | undefined;
    openLink: FloatingToolbarButton<Command> | undefined;
  };
}

const recentItem1: ActivityItem = {
  objectId: 'recent1',
  name: 'recent item 1',
  container: 'container 1',
  iconUrl:
    'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
  url: 'recent1-url.com',
};

describe('media', () => {
  const intlProvider = new IntlProvider({ locale: 'en' });
  const { intl } = intlProvider.getChildContext();

  const createEditor = createEditorFactory<MediaPluginState>();
  const createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });

  const editor = (doc: any, mediaPropsOverride: MediaOptions = {}) => {
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
        allowExtension: true,
        allowLayouts: true,
        allowTables: true,
        allowAnalyticsGASV3: true,
        analyticsHandler: jest.fn(),
        contextIdentifierProvider,
      },
      providerFactory,
      createAnalyticsEvent,
      pluginKey: stateKey,
    });

    createAnalyticsEvent.mockClear();
    return wrapper;
  };

  const temporaryMedia = media({
    id: temporaryFileId,
    type: 'file',
    collection: testCollectionName,
    __fileMimeType: 'image/png',
    __contextId: 'DUMMY-OBJECT-ID',
    width: 100,
    height: 100,
  })();

  const temporaryMediaSingle = mediaSingle({ layout: 'center' })(
    temporaryMedia,
  );
  const googleUrl = 'http://google.com';
  const yahooUrl = 'http://yahoo.com';
  const invalidUrl = 'javascript://alert(233)';
  const docWithMediaSingle = doc(temporaryMediaSingle);
  const docWithMediaSingleLinked = doc(
    a({ href: googleUrl })(temporaryMediaSingle),
  );
  const docWithInvalidMediaSingleLink = doc(
    a({ href: invalidUrl })(temporaryMediaSingle),
  );

  async function setupToolbar(
    doc: any,
    options: MediaFloatingToolbarOptions,
    pos: number = 0,
  ): Promise<ToolbarWrapper> {
    // Setup editor
    const { editorView, pluginState } = editor(doc, {
      allowLinking: true,
    });
    await pluginState.setMediaProvider(getFreshMediaProvider());

    setNodeSelection(editorView, pos);

    const toolbar = floatingToolbar(editorView.state, intl, options);
    const items = getToolbarItems(toolbar!, editorView);

    return {
      editorView,
      toolbar,
      buttons: {
        addLink: findToolbarBtn(items, formattedMessages.addLink) as
          | FloatingToolbarButton<Command>
          | undefined,
        editLink: findToolbarBtn(items, formattedMessages.editLink) as
          | FloatingToolbarButton<Command>
          | undefined,
        openLink: findToolbarBtn(items, formattedMessages.openLink) as
          | FloatingToolbarButton<Command>
          | undefined,
      },
    };
  }

  function clickOnToolbarButton(
    wrapper: ToolbarWrapper,
    type: 'edit' | 'add',
    items: Array<ActivityItem>,
  ) {
    const { editorView, buttons } = wrapper;
    const button = type === 'edit' ? buttons.editLink : buttons.addLink;
    if (button) {
      button.onClick(editorView.state, editorView.dispatch, editorView);
    }

    const toolbar = floatingToolbar(editorView.state, intl, {
      allowLinking: true,
      allowAdvancedToolBarOptions: true,
      providerFactory: ProviderFactory.create({
        activityProvider: activityProviderFactory(items),
      }),
    });

    const linkingToolbarComponent = getToolbarItems(toolbar!, editorView).find(
      item => item.type === 'custom',
    ) as FloatingToolbarCustom;

    const linkingToolbar = mountWithIntl<LinkAddToolbarProps, any>(
      linkingToolbarComponent.render(editorView) as ReactElement<any>,
    );

    const linkingToolbarReactTestingLibrary = render(
      <IntlProvider>{linkingToolbarComponent.render(editorView)}</IntlProvider>,
    );

    return {
      toolbar,
      linkingToolbar,
      linkingToolbarReactTestingLibrary,
    };
  }

  let formattedMessages: { [key: string]: string } = {};
  beforeAll(() => {
    formattedMessages = {
      addLink: intl.formatMessage(linkToolbarMessages.addLink),
      editLink: intl.formatMessage(linkToolbarMessages.editLink),
      openLink: intl.formatMessage(linkMessages.openLink),
    };
  });

  describe('Toolbar', () => {
    describe('Media Linking', () => {
      let toolbarWrapper: ToolbarWrapper;
      let editorView: EditorView;
      let buttons: { [key: string]: FloatingToolbarItem<any> | undefined };

      it('should hide buttons when feature flag is off', async () => {
        ({ buttons } = await setupToolbar(docWithMediaSingle, {
          allowLinking: false,
          allowAdvancedToolBarOptions: true,
        }));

        expect(buttons.addLink).toBeUndefined();
        expect(buttons.editLink).toBeUndefined();
        expect(buttons.openLink).toBeUndefined();
      });

      describe('Media Without link', () => {
        beforeEach(async () => {
          toolbarWrapper = await setupToolbar(docWithMediaSingle, {
            allowLinking: true,
            allowAdvancedToolBarOptions: true,
          });
          ({ editorView, buttons } = toolbarWrapper);
        });

        it('should show add link button', async () => {
          expect(buttons.addLink).not.toBeUndefined();
        });

        it('should hide edit and open link buttons', async () => {
          expect(buttons.editLink).toBeUndefined();
          expect(buttons.openLink).toBeUndefined();
        });

        describe('Linking Toolbar', () => {
          let linkingToolbar: ReactWrapper<LinkAddToolbarProps>;
          let mediaLinkingState: MediaLinkingState;

          beforeEach(() => {
            ({ linkingToolbar } = clickOnToolbarButton(toolbarWrapper, 'add', [
              recentItem1,
            ]));
            mediaLinkingState = getMediaLinkingState(editorView.state);
          });

          afterEach(() => {
            safeUnmount(linkingToolbar);
          });

          it('should be present', () => {
            expect(linkingToolbar.instance()).toBeInstanceOf(LinkAddToolbar);
          });

          it('should add link toolbar button to be visible', () => {
            expect(mediaLinkingState.visible).toBe(true);
          });

          it('should set link into media single node on submit', () => {
            linkingToolbar
              .props()
              .onSubmit(googleUrl, { inputMethod: INPUT_METHOD.MANUAL });

            expect(editorView.state.doc).toEqualDocument(
              docWithMediaSingleLinked,
            );
          });

          it('should hide toolbar when I go back', () => {
            linkingToolbar.props().onBack('', {});

            expect(getMediaLinkingState(editorView.state).visible).toBe(false);
          });

          it('should hide toolbar on blur', () => {
            linkingToolbar.props().onBlur('');

            expect(getMediaLinkingState(editorView.state).visible).toBe(false);
          });

          describe('link validation', () => {
            let onSubmit: (value: string) => void;
            beforeEach(() => {
              onSubmit = linkingToolbar.find(PanelTextInput).props()
                .onSubmit as (value: string) => void;
            });

            describe('with manual link input', () => {
              it.each([
                ['invalid link'],
                ['javascript://invalid.link'],
                ['http//test/com'],
                [''],
              ])('should not allow <<%s>>', invalidValue => {
                onSubmit(invalidValue);
                linkingToolbar.update();

                const errorMessage = linkingToolbar.find(ErrorMessage);
                expect(errorMessage).toHaveLength(1);

                const expectedMessage = invalidValue
                  ? linkToolbarMessages.invalidLink.defaultMessage
                  : linkToolbarMessages.emptyLink.defaultMessage;
                expect(errorMessage.text().trim()).toEqual(expectedMessage);
              });

              it.each([
                ['https://www.atlassian.com'],
                ['http://atlassian.com'],
                ['atlassian.com'],
              ])('should allow <<%s>>', validValue => {
                onSubmit(validValue);

                linkingToolbar.update();

                const errorMessage = linkingToolbar.find(ErrorMessage);
                expect(errorMessage).toHaveLength(0);
              });
            });

            describe('with link input via selection', () => {
              it('should allow invalid url', () => {
                const {
                  linkingToolbarReactTestingLibrary,
                } = clickOnToolbarButton(toolbarWrapper, 'add', [recentItem1]);
                const {
                  getByPlaceholderText,
                  queryByText,
                } = linkingToolbarReactTestingLibrary;

                const inputText = recentItem1.name.substr(0, 1);
                let input = getByPlaceholderText(
                  linkToolbarMessages.linkPlaceholder.defaultMessage,
                );
                fireEvent.change(input, { target: { value: inputText } });

                // get new input to make sure typeAhead mode is registered
                input = getByPlaceholderText(
                  linkToolbarMessages.placeholder.defaultMessage,
                );

                fireEvent.keyDown(input, {
                  key: 'Enter',
                  code: 'Enter',
                  keyCode: 13,
                });

                const error = queryByText(
                  linkToolbarMessages.invalidLink.defaultMessage,
                );

                expect(error).toBeNull();
              });
            });
          });

          describe('Analytics GAS V3', () => {
            it('should create analytics event with input method manual ', () => {
              linkingToolbar
                .props()
                .onSubmit(googleUrl, { inputMethod: INPUT_METHOD.MANUAL });

              expect(createAnalyticsEvent).toBeCalledWith({
                eventType: 'track',
                action: 'inserted',
                actionSubject: 'document',
                actionSubjectId: 'mediaLink',
                attributes: expect.objectContaining({
                  inputMethod: 'manual',
                }),
              });
            });

            it('should create analytics event with input method typeahead ', () => {
              linkingToolbar
                .props()
                .onSubmit(googleUrl, { inputMethod: INPUT_METHOD.TYPEAHEAD });

              expect(createAnalyticsEvent).toBeCalledWith({
                eventType: 'track',
                action: 'inserted',
                actionSubject: 'document',
                actionSubjectId: 'mediaLink',
                attributes: expect.objectContaining({
                  inputMethod: 'typeAhead',
                }),
              });
            });
          });
        });
      });

      describe('Media With Link', () => {
        beforeEach(async () => {
          toolbarWrapper = await setupToolbar(docWithMediaSingleLinked, {
            allowLinking: true,
            allowAdvancedToolBarOptions: true,
          });
          ({ editorView, buttons } = toolbarWrapper);
        });

        it('should show edit link toolbar button', () => {
          expect(buttons.editLink).toBeDefined();
        });

        describe('Open Link', () => {
          it('should show open link toolbar button ', () => {
            expect(buttons.openLink).toBeDefined();
          });

          it('should create analytics event', () => {
            (buttons.openLink! as FloatingToolbarButton<Command>).onClick(
              editorView.state,
              editorView.dispatch,
              editorView,
            );

            expect(createAnalyticsEvent).toBeCalledWith({
              eventType: 'track',
              action: 'visited',
              actionSubject: 'mediaSingle',
              actionSubjectId: 'mediaLink',
            });
          });
        });

        describe('with invalid link', () => {
          beforeEach(async () => {
            toolbarWrapper = await setupToolbar(docWithInvalidMediaSingleLink, {
              allowLinking: true,
              allowAdvancedToolBarOptions: true,
            });
          });

          it('should not display unlink button and not display invalid url', async () => {
            const { linkingToolbar } = clickOnToolbarButton(
              toolbarWrapper,
              'edit',
              [recentItem1],
            );

            expect(
              linkingToolbar.find('button[aria-label="Unlink"]').length,
            ).toEqual(0);
            expect(
              linkingToolbar.find(PanelTextInput).props().defaultValue,
            ).toEqual('');
          });
        });

        describe('Linking Toolbar', () => {
          let linkingToolbar: ReactWrapper<LinkAddToolbarProps>;

          beforeEach(() => {
            ({ linkingToolbar } = clickOnToolbarButton(toolbarWrapper, 'edit', [
              recentItem1,
            ]));
          });

          afterEach(() => {
            safeUnmount(linkingToolbar);
          });

          it('should pass link to toolbar', () => {
            expect(linkingToolbar.props().displayUrl).toBe(googleUrl);
          });

          it('should be editing', () => {
            expect(linkingToolbar.props().editing).toBe(true);
          });

          describe('Change Link', () => {
            beforeEach(() => {
              linkingToolbar
                .props()
                .onSubmit(yahooUrl, { inputMethod: INPUT_METHOD.MANUAL });
            });

            it('should change link', () => {
              expect(editorView.state.doc).toEqualDocument(
                doc(a({ href: yahooUrl })(temporaryMediaSingle)),
              );
            });

            it('should create analytics event', () => {
              expect(createAnalyticsEvent).toBeCalledWith({
                eventType: 'track',
                action: 'changedUrl',
                actionSubject: 'mediaSingle',
                actionSubjectId: 'mediaLink',
              });
            });
          });

          describe('Unlink', () => {
            beforeEach(() => {
              linkingToolbar.props().onUnlink();
            });

            it('should remove link', () => {
              expect(editorView.state.doc).toEqualDocument(docWithMediaSingle);
            });

            it('should create analytics event', () => {
              expect(createAnalyticsEvent).toBeCalledWith({
                eventType: 'track',
                action: 'unlinked',
                actionSubject: 'mediaSingle',
                actionSubjectId: 'mediaLink',
              });
            });
          });
        });
      });

      describe.each<[string, ReturnType<typeof doc>, number]>([
        [
          'table',
          doc(
            table()(
              tr(
                th({ colwidth: [100] })(p('1')),
                th({ colwidth: [100] })(p('2')),
                th({ colwidth: [480] })(p('3')),
              ),
              tr(
                td({ colwidth: [100] })(temporaryMediaSingle),
                td({ colwidth: [100] })(p('5')),
                td({ colwidth: [480] })(p('6')),
              ),
            ),
          ),
          20,
        ],
        ['list', doc(ol(li(temporaryMediaSingle))), 2],
        [
          'layout',
          doc(
            layoutSection(
              layoutColumn({ width: 50 })(temporaryMediaSingle),
              layoutColumn({ width: 50 })(p('')),
            ),
          ),
          2,
        ],
      ])('Media inside %s', (_, doc, pos) => {
        beforeEach(async () => {
          toolbarWrapper = await setupToolbar(doc, { allowLinking: true }, pos);
        });

        test('should media be selected', () => {
          const mediaLinkingState = getMediaLinkingState(
            toolbarWrapper.editorView.state,
          );

          expect(mediaLinkingState.mediaPos).toEqual(expect.any(Number));
        });

        test('should hide add link button from media toolbar', () => {
          expect(toolbarWrapper.buttons.addLink).toBeUndefined();
        });

        test('should hide open link button from media toolbar', () => {
          expect(toolbarWrapper.buttons.openLink).toBeUndefined();
        });

        test('should hide edit link button from media toolbar', () => {
          expect(toolbarWrapper.buttons.editLink).toBeUndefined();
        });
      });
    });
  });
});
