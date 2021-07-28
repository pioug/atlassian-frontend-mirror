import React from 'react';

import { checkMediaType } from '../../../../../plugins/media/utils/check-media-type';
jest.mock('../../../../../plugins/media/utils/check-media-type', () => ({
  checkMediaType: jest.fn(),
}));

import { ActivityItem } from '@atlaskit/activity-provider';
import { ProviderFactory, ErrorMessage } from '@atlaskit/editor-common';
import { activityProviderFactory } from '@atlaskit/editor-test-helpers/mock-activity-provider';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
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
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { ReactWrapper } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { ReactElement } from 'react';
import { IntlProvider } from 'react-intl';
import { linkToolbarMessages, linkMessages } from '../../../../../messages';
import { INPUT_METHOD } from '../../../../../plugins/analytics';
import {
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
import { LinkingToolbarProps } from '../../../../../plugins/media/toolbar/linking-toolbar-appearance';

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
import { getToolbarItems } from '../../../../../plugins/floating-toolbar/__tests__/_helpers';
import { MediaFloatingToolbarOptions } from '../../../../../plugins/media/types';
import PanelTextInput from '../../../../../ui/PanelTextInput';
import { MediaPluginState } from '../../../../../plugins/media/pm-plugins/types';

interface LinkingActions {
  [key: string]: React.MouseEventHandler | undefined;
}
interface ToolbarWrapper {
  editorView: EditorView;
  toolbar: FloatingToolbarConfig | undefined;
  actions: LinkingActions;
  linkToolbarAppearance: ReactElement<LinkingToolbarProps> | undefined;
}

const recentItem1: ActivityItem = {
  objectId: 'recent1',
  name: 'recent item 1',
  container: 'container 1',
  iconUrl:
    'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
  url: 'recent1-url.com',
};

const waitForStateUpdate = async () => {
  await Promise.resolve({});
};

describe('media', () => {
  const intlProvider = new IntlProvider({ locale: 'en' });
  const { intl } = intlProvider.getChildContext();

  const createEditor = createEditorFactory<MediaPluginState>();
  const createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });

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

  const googleUrl = 'http://google.com';
  const yahooUrl = 'http://yahoo.com';
  const invalidUrl = 'javascript://alert(233)';

  const temporaryMediaSingle = (
    linkType?: 'linked' | 'invalidLink' | 'doubleMark' | 'mediaSingleMark',
  ) => {
    switch (linkType) {
      case 'linked': {
        return mediaSingle({ layout: 'center' })(
          a({ href: googleUrl })(temporaryMedia),
        );
      }
      case 'invalidLink': {
        return mediaSingle({ layout: 'center' })(
          a({ href: invalidUrl })(temporaryMedia),
        );
      }
      case 'mediaSingleMark': {
        return a({ href: yahooUrl })(
          mediaSingle({ layout: 'center' })(temporaryMedia),
        );
      }
      case 'doubleMark': {
        return a({ href: yahooUrl })(
          mediaSingle({ layout: 'center' })(
            a({ href: googleUrl })(temporaryMedia),
          ),
        );
      }
      default: {
        return mediaSingle({ layout: 'center' })(temporaryMedia);
      }
    }
  };

  const selectors = {
    OPEN_LINK: `[title="${linkMessages.openLink.defaultMessage}"]`,
    ADD_LINK: `button[aria-label="${linkToolbarMessages.addLink.defaultMessage}"]`,
    EDIT_LINK: `button[aria-label="${linkToolbarMessages.editLink.defaultMessage}"]`,
    BAD_LINK: `button[aria-label="${linkToolbarMessages.unableToOpenLink.defaultMessage}"]`,
  };

  const docWithMediaSingle = doc(temporaryMediaSingle());
  const docWithMediaSingleLinked = doc(temporaryMediaSingle('linked'));
  const docWithInvalidMediaSingleLink = doc(
    temporaryMediaSingle('invalidLink'),
  );

  async function setupToolbar(
    doc: DocBuilder,
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

    let linkToolbarAppearance: ReactElement<LinkingToolbarProps> | undefined;

    if (toolbar?.items) {
      const customLinkingToolbar = (toolbar.items as FloatingToolbarItem<
        Command
      >[]).find((item) => item.type === 'custom') as FloatingToolbarCustom<
        Command
      >;

      linkToolbarAppearance = customLinkingToolbar
        ? (customLinkingToolbar.render(editorView, 1) as ReactElement<
            LinkingToolbarProps
          >)
        : undefined;
    }

    const { onAddLink, onEditLink, onOpenLink } =
      linkToolbarAppearance?.props || {};

    return {
      editorView,
      toolbar,
      actions: {
        addLink: onAddLink,
        editLink: onEditLink,
        openLink: onOpenLink,
      },
      linkToolbarAppearance,
    };
  }

  function clickOnToolbarButton(
    wrapper: ToolbarWrapper,
    type: 'edit' | 'add',
    items: Array<ActivityItem>,
  ) {
    const mouseEvent = new MouseEvent('click', { bubbles: true });
    const { editorView, actions } = wrapper;
    const action = type === 'edit' ? actions.editLink : actions.addLink;
    if (action) {
      action(mouseEvent as any);
    }

    const toolbar = floatingToolbar(editorView.state, intl, {
      allowLinking: true,
      allowAdvancedToolBarOptions: true,
      providerFactory: ProviderFactory.create({
        activityProvider: activityProviderFactory(items),
      }),
    });

    const linkingToolbarComponent = getToolbarItems(toolbar!, editorView).find(
      (item) => item.type === 'custom',
    ) as FloatingToolbarCustom<Command>;

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
    (checkMediaType as jest.Mock).mockReturnValue(Promise.resolve('image'));
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
      let linkToolbarAppearance: ReactElement<LinkingToolbarProps> | undefined;

      it('should hide buttons when feature flag is off', async () => {
        ({ linkToolbarAppearance } = await setupToolbar(docWithMediaSingle, {
          allowLinking: false,
          allowAdvancedToolBarOptions: true,
        }));

        expect(linkToolbarAppearance).toBeUndefined();
      });

      describe('Media Without link', () => {
        let linkingToolbarAppearanceWrapper: ReactWrapper<any>;

        beforeEach(async () => {
          (checkMediaType as jest.Mock).mockReturnValue(
            Promise.resolve('image'),
          );
          toolbarWrapper = await setupToolbar(docWithMediaSingle, {
            allowLinking: true,
            allowAdvancedToolBarOptions: true,
          });
          ({ editorView, linkToolbarAppearance } = toolbarWrapper);

          linkingToolbarAppearanceWrapper = mountWithIntl(
            linkToolbarAppearance!,
          );

          await waitForStateUpdate();

          linkingToolbarAppearanceWrapper.update();
        });

        afterEach(() => {
          safeUnmount(linkingToolbarAppearanceWrapper);
        });

        it('should show add link button', () => {
          expect(
            linkingToolbarAppearanceWrapper
              .find(`[label="${formattedMessages.addLink}"]`)
              .exists(),
          ).toBe(true);
        });

        it('should hide edit and open link buttons', async () => {
          expect(
            linkingToolbarAppearanceWrapper
              .text()
              .includes(formattedMessages.editLink),
          ).toBe(false);
          expect(
            linkingToolbarAppearanceWrapper
              .find('.hyperlink-open-link')
              .exists(),
          ).toBe(false);
        });

        describe('video media', () => {
          beforeEach(async () => {
            (checkMediaType as jest.Mock).mockReturnValue(
              Promise.resolve('video'),
            );
            toolbarWrapper = await setupToolbar(docWithMediaSingle, {
              allowLinking: true,
              allowAdvancedToolBarOptions: true,
            });
            ({ linkToolbarAppearance } = toolbarWrapper);

            linkingToolbarAppearanceWrapper = mountWithIntl(
              linkToolbarAppearance!,
            );
            await waitForStateUpdate();
            linkingToolbarAppearanceWrapper.update();
          });

          it('should not show media link controls', () => {
            linkingToolbarAppearanceWrapper.update();

            expect(
              linkingToolbarAppearanceWrapper
                .find(`[label="${formattedMessages.addLink}"]`)
                .exists(),
            ).toBe(false);

            expect(
              linkingToolbarAppearanceWrapper
                .text()
                .includes(formattedMessages.editLink),
            ).toBe(false);
            expect(
              linkingToolbarAppearanceWrapper
                .find('.hyperlink-open-link')
                .exists(),
            ).toBe(false);
          });
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

          it('should set link into media node on submit', () => {
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
              ])('should not allow <<%s>>', (invalidValue) => {
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
              ])('should allow <<%s>>', (validValue) => {
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
        });
      });

      describe('With mark on mediaSingle - toggles mark only on media', () => {
        let linkingToolbar: ReactWrapper<LinkAddToolbarProps>;
        let linkingToolbarAppearanceWrapper: ReactWrapper<any>;
        beforeEach(async () => {
          toolbarWrapper = await setupToolbar(
            doc(temporaryMediaSingle('mediaSingleMark')),
            {
              allowLinking: true,
              allowAdvancedToolBarOptions: true,
            },
          );
          ({ linkingToolbar } = clickOnToolbarButton(toolbarWrapper, 'add', [
            recentItem1,
          ]));
          ({ editorView, linkToolbarAppearance } = toolbarWrapper);
          linkingToolbarAppearanceWrapper = mountWithIntl(
            linkToolbarAppearance!,
          );

          await waitForStateUpdate();

          linkingToolbarAppearanceWrapper.update();
        });

        it('should add link on the media node', () => {
          linkingToolbar
            .props()
            .onSubmit(googleUrl, { inputMethod: INPUT_METHOD.MANUAL });
          expect(editorView.state.doc).toEqualDocument(
            doc(temporaryMediaSingle('doubleMark')),
          );
        });

        it('should remove the link only from media node', () => {
          linkingToolbar.props().onUnlink();
          expect(editorView.state.doc).toEqualDocument(
            doc(temporaryMediaSingle('mediaSingleMark')),
          );
        });
      });

      describe('Media With Link', () => {
        let linkingToolbarAppearanceWrapper: any;
        beforeEach(async () => {
          (checkMediaType as jest.Mock).mockReturnValue(
            Promise.resolve('image'),
          );
          toolbarWrapper = await setupToolbar(docWithMediaSingleLinked, {
            allowLinking: true,
            allowAdvancedToolBarOptions: true,
          });
          ({ editorView } = toolbarWrapper);

          ({ editorView, linkToolbarAppearance } = toolbarWrapper);

          linkingToolbarAppearanceWrapper = mountWithIntl(
            linkToolbarAppearance!,
          );

          await waitForStateUpdate();
          linkingToolbarAppearanceWrapper.update();
        });

        it('should show edit link toolbar button', () => {
          expect(
            linkingToolbarAppearanceWrapper.find(selectors.EDIT_LINK),
          ).toBeDefined();
        });

        describe('Open Link', () => {
          beforeEach(() => {
            createAnalyticsEvent.mockClear();
          });
          it('should show open link toolbar button ', () => {
            expect(
              linkingToolbarAppearanceWrapper.find(selectors.OPEN_LINK).length,
            ).toEqual(1);
          });

          it('should create analytics event', () => {
            linkingToolbarAppearanceWrapper
              .find(selectors.OPEN_LINK)
              .props()
              .onClick();

            expect(createAnalyticsEvent).toBeCalledWith({
              eventType: 'track',
              action: 'visited',
              actionSubject: 'media',
              actionSubjectId: 'link',
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
                doc(
                  mediaSingle({ layout: 'center' })(
                    a({ href: yahooUrl })(temporaryMedia),
                  ),
                ),
              );
            });
          });

          describe('Unlink', () => {
            it('should remove link', () => {
              linkingToolbar.props().onUnlink();
              expect(editorView.state.doc).toEqualDocument(docWithMediaSingle);
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
                td({ colwidth: [100] })(temporaryMediaSingle()),
                td({ colwidth: [100] })(p('5')),
                td({ colwidth: [480] })(p('6')),
              ),
            ),
          ),
          20,
        ],
        ['list', doc(ol(li(temporaryMediaSingle()))), 2],
        [
          'layout',
          doc(
            layoutSection(
              layoutColumn({ width: 50 })(temporaryMediaSingle()),
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
      });
    });
  });
});
