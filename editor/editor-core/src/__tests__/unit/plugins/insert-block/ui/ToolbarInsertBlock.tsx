import React from 'react';
import type { WrappedComponentProps } from 'react-intl-next';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ReactWrapper, mount } from 'enzyme';
import { mountWithIntl } from '../../../../__helpers/enzyme';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { EmojiPicker as AkEmojiPicker } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type {
  DocBuilder,
  ExtractPublicEditorAPI,
} from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  decisionList,
  decisionItem,
  taskList,
  taskItem,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { uuid } from '@atlaskit/adf-schema';
import { layoutPlugin } from '@atlaskit/editor-plugin-layout';
import { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';
import { panelPlugin } from '@atlaskit/editor-plugin-panel';
import { rulePlugin } from '@atlaskit/editor-plugin-rule';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { statusPlugin } from '@atlaskit/editor-plugin-status';
import { expandPlugin } from '@atlaskit/editor-plugin-expand';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import { quickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';
import taskDecisionPlugin from '../../../../../plugins/tasks-and-decisions';
import { mentionsPlugin } from '@atlaskit/editor-plugin-mentions';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { emojiPlugin } from '@atlaskit/editor-plugin-emoji';
import { mediaPlugin } from '@atlaskit/editor-plugin-media';
import { datePlugin } from '@atlaskit/editor-plugin-date';
import { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import { floatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { imageUploadPlugin } from '@atlaskit/editor-plugin-image-upload';
import { widthPlugin } from '@atlaskit/editor-plugin-width';

import {
  CODE_BLOCK,
  PANEL,
  BLOCK_QUOTE,
} from '@atlaskit/editor-plugin-block-type/consts';
import ToolbarInsertBlock, {
  ToolbarInsertBlock as BaseToolbarInsertBlock,
} from '../../../../../plugins/insert-block/ui/ToolbarInsertBlock';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { stateKey as hyperlinkPluginKey } from '@atlaskit/editor-plugin-hyperlink/src/pm-plugins/main';
import { LinkAction } from '@atlaskit/editor-common/link';
import { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';

import { messages } from '../../../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';
import { blockTypeMessages } from '@atlaskit/editor-common/messages';
import type { Props as ToolbarInsertBlockProps } from '../../../../../plugins/insert-block/ui/ToolbarInsertBlock/types';

import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import { DropdownMenuWithKeyboardNavigation as DropdownMenu } from '@atlaskit/editor-common/ui-menu';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import InsertMenu from '../../../../../plugins/insert-block/ui/ElementBrowser/InsertMenu';
import extensionPlugin from '../../../../../plugins/extension';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { compositionPlugin } from '@atlaskit/editor-plugin-composition';
import { focusPlugin } from '@atlaskit/editor-plugin-focus';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import { copyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';
import { placeholderTextPlugin } from '@atlaskit/editor-plugin-placeholder-text';

import ReactEditorViewContext from '../../../../../create-editor/ReactEditorViewContext';
import { codeBlockPlugin } from '@atlaskit/editor-plugin-code-block';

jest.mock(
  '../../../../../plugins/insert-block/ui/ElementBrowser/InsertMenu',
  () => () => <div />,
);

type ToolbarOptionWrapper = ReactWrapper;

const emojiProvider = getTestEmojiResource();

const mediaProvider: Promise<MediaProvider> = Promise.resolve({
  viewMediaClientConfig: {} as any,
  uploadMediaClientConfig: {} as any,
});

const openInsertMenu = (toolbarOption: ToolbarOptionWrapper) => {
  toolbarOption.find('button').simulate('click');
};

const getToolbarButton = (
  title: string,
  toolbarOption: ToolbarOptionWrapper,
): ReactWrapper =>
  toolbarOption
    .find(ToolbarButton)
    .filterWhere((toolbarButton) => toolbarButton.find('Memo(Icon)').length > 0)
    .find('button');

const getInsertMenuButton = (
  title: string,
  toolbarOption: ToolbarOptionWrapper,
) => {
  openInsertMenu(toolbarOption);
  return toolbarOption
    .find('span[role="menuitem"]')
    .filterWhere((n) => n.text().indexOf(title) > -1);
};

const clickToolbarButton = (
  title: string,
  toolbarOption: ToolbarOptionWrapper,
) => {
  getToolbarButton(title, toolbarOption).simulate('click');
};

const clickInsertMenuOption = (
  title: string,
  toolbarOption: ToolbarOptionWrapper,
) => {
  getInsertMenuButton(title, toolbarOption).simulate('click');
};

const menus = [
  {
    name: INPUT_METHOD.TOOLBAR,
    numButtons: 1,
    getButton: getToolbarButton,
    clickButton: clickToolbarButton,
  },
  {
    name: INPUT_METHOD.INSERT_MENU,
    numButtons: 0,
    getButton: getInsertMenuButton,
    clickButton: clickInsertMenuOption,
  },
];

describe('@atlaskit/editor-core/ui/ToolbarInsertBlock', () => {
  const createEditor = createProsemirrorEditorFactory();

  let editorView: EditorView;
  let toolbarOption: ToolbarOptionWrapper;
  let baseToolbarOption: ReactWrapper<
    ToolbarInsertBlockProps & WrappedComponentProps
  >;

  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  let dispatchAnalyticsSpy: jest.SpyInstance<DispatchAnalyticsEvent>;
  let dispatchSpy: jest.SpyInstance;

  const providerFactory = ProviderFactory.create({
    mediaProvider,
    taskDecisionProvider: Promise.resolve(getMockTaskDecisionResource()),
  });

  const createPreset = (createAnalyticsEvent: CreateUIAnalyticsEvent) =>
    new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, { newInsertionBehaviour: true }])
      .add(blockTypePlugin)
      .add(editorDisabledPlugin)
      .add([analyticsPlugin, { createAnalyticsEvent }])
      .add(widthPlugin)
      .add(guidelinePlugin)
      .add(contentInsertionPlugin)
      .add(decorationsPlugin)
      .add(layoutPlugin)
      .add(panelPlugin)
      .add(rulePlugin)
      .add(selectionPlugin)
      .add(tablesPlugin)
      .add(imageUploadPlugin)
      .add([statusPlugin, { menuDisabled: true }])
      .add(expandPlugin)
      .add(taskDecisionPlugin)
      .add([typeAheadPlugin, { createAnalyticsEvent }])
      .add(mentionsPlugin)
      .add(hyperlinkPlugin)
      .add([quickInsertPlugin, { disableDefaultItems: true }])
      .add(datePlugin)
      .add(emojiPlugin)
      .add(compositionPlugin)
      .add(gridPlugin)
      .add(copyButtonPlugin)
      .add(focusPlugin)
      .add([placeholderTextPlugin, {}])
      .add(floatingToolbarPlugin)
      .add([codeBlockPlugin, {}])
      .add([mediaPlugin, { allowMediaSingle: true }])
      .add(extensionPlugin);

  let editorAPI: ExtractPublicEditorAPI<ReturnType<typeof createPreset>>;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      preset: createPreset(createAnalyticsEvent),
      providerFactory,
    });
  };

  const buildToolbar = (props: Partial<ToolbarInsertBlockProps> = {}) => {
    let defaultProps = {
      editorView,
      isReducedSpacing: false,
      buttons: 0,
      dispatchAnalyticsEvent: dispatchAnalyticsSpy as any,
    };
    const editorRef = {
      current: document.createElement('div'),
    };
    toolbarOption = mountWithIntl(
      <ReactEditorViewContext.Provider value={{ editorRef }}>
        <ToolbarInsertBlock
          {...defaultProps}
          {...props}
          featureFlags={props.featureFlags || {}}
        />
      </ReactEditorViewContext.Provider>,
    );
    baseToolbarOption = toolbarOption.find(BaseToolbarInsertBlock);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchAnalyticsSpy = jest.fn();
    ({ editorView, editorAPI } = editor(doc(p('text'))));
    dispatchSpy = jest.spyOn(editorView, 'dispatch');
  });

  afterEach(() => {
    if (toolbarOption) {
      toolbarOption.unmount();
    }
  });

  it('should render nothing if none of the plugins are present', () => {
    buildToolbar();
    expect(baseToolbarOption.html()).toEqual(null);
  });

  it('should disable toolbar buttons if isDisabled is true', () => {
    const pluginState = editorAPI.blockType.sharedState.currentState();
    buildToolbar({
      isDisabled: true,
      availableWrapperBlockTypes: pluginState!.availableWrapperBlockTypes,
    });
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toEqual(true);
  });

  describe('tooltip with shortcut', () => {
    [
      { toolbarProps: { mentionsSupported: true }, result: '/' },
      {
        toolbarProps: { tableSupported: true, buttons: 2 },
        result: 'Shift+Alt+T',
      },
    ].forEach(({ toolbarProps, result }) => {
      describe('render the tooltip with shortcut', () => {
        let tooltipContent: ReactWrapper;

        beforeEach(() => {
          buildToolbar(toolbarProps);
          tooltipContent = mount(
            <div>
              {toolbarOption.find(ToolbarButton).first().prop('title')}
            </div>,
          );
        });

        afterEach(() => {
          if (tooltipContent) {
            tooltipContent.unmount();
          }
        });

        it(`the shortcut ${result} is displayed with a background`, () => {
          expect(
            tooltipContent.find('[className$="-tooltip-shortcut"]').text(),
          ).toEqual(result);
        });
      });
    });
  });

  describe('plus menu', () => {
    it('should not render for zero items', () => {
      jest.mock(
        '../../../../../plugins/insert-block/ui/ToolbarInsertBlock/create-items',
        () => ({
          createItems: () => [],
        }),
      );

      buildToolbar({
        insertMenuItems: [],
      });

      expect(toolbarOption.find(DropdownMenu)).toHaveLength(0);

      jest.unmock(
        '../../../../../plugins/insert-block/ui/ToolbarInsertBlock/create-items',
      );
    });

    describe('legacy', () => {
      describe('sort dropdown items', () => {
        it('should sort non macro items alphabetically', () => {
          const customItems = [
            {
              content: 'B',
              value: { name: 'B' },
            },
            {
              content: 'D',
              value: { name: 'D' },
            },
            {
              content: 'C',
              value: { name: 'C' },
            },
            {
              content: 'A',
              value: { name: 'A' },
            },
          ];

          const expected = ['A', 'B', 'C', 'D'];

          buildToolbar({
            insertMenuItems: customItems,
          });
          const items = toolbarOption.find(DropdownMenu).prop('items')[0];
          expect(
            items.items.map((item: { content: any }) => item.content),
          ).toEqual(expected);
        });

        it('should sort alphabetically with non-macro items at end', () => {
          const customItemsWithMacros = [
            {
              content: 'B macro',
              value: { name: 'B Macro' },
            },
            {
              content: 'A macro',
              value: { name: 'A Macro' },
            },
            {
              content: 'B',
              value: { name: 'B' },
            },
            {
              content: 'A',
              value: { name: 'A' },
            },
          ];
          const sortedItems = ['A', 'B', 'A macro', 'B macro'];
          buildToolbar({
            insertMenuItems: customItemsWithMacros,
          });
          const items = toolbarOption.find(DropdownMenu).prop('items')[0];
          expect(
            items.items.map((item: { content: any }) => item.content),
          ).toEqual(sortedItems);
        });

        it('macro browser should always be last item if there is no slash-onboarding', () => {
          const customItems = [
            {
              content: 'View more',
              value: { name: 'macro-browser' },
            },
            {
              content: 'Date',
              value: { name: 'date' },
            },
            {
              content: 'Action',
              value: { name: 'action' },
            },
            {
              content: 'ZZ',
              value: { name: 'macro-zz' },
            },
          ];
          const sortedItems = ['Action', 'Date', 'ZZ', 'View more'];
          buildToolbar({
            insertMenuItems: customItems,
          });
          const items = toolbarOption.find(DropdownMenu).prop('items')[0];
          expect(
            items.items.map((item: { content: any }) => item.content),
          ).toEqual(sortedItems);
        });

        it('slash onboarding should always be last item', () => {
          const customItems = [
            {
              content: 'Some help text',
              value: { name: 'slash-onboarding' },
            },
            {
              content: 'ZZ',
              value: { name: 'ZZ' },
            },
            {
              content: 'View more',
              value: { name: 'macro-browser' },
            },
            {
              content: 'Macro',
              value: { name: 'macro' },
            },
          ];
          const sortedItems = ['Macro', 'ZZ', 'View more', 'Some help text'];
          buildToolbar({
            insertMenuItems: customItems,
          });
          const items = toolbarOption.find(DropdownMenu).prop('items')[0];
          expect(
            items.items.map((item: { content: any }) => item.content),
          ).toEqual(sortedItems);
        });

        it('should render a DropDown', () => {
          const customItems = [
            {
              content: 'Some help text',
              value: { name: 'slash-onboarding' },
            },
            {
              content: 'ZZ',
              value: { name: 'ZZ' },
            },
            {
              content: 'View more',
              value: { name: 'macro-browser' },
            },
            {
              content: 'Macro',
              value: { name: 'macro' },
            },
          ];

          buildToolbar({
            insertMenuItems: customItems,
            replacePlusMenuWithElementBrowser: false,
          });

          baseToolbarOption.setState({ isPlusMenuOpen: true });
          baseToolbarOption.update();

          expect(toolbarOption.find(DropdownMenu).length).toEqual(1);
          expect(toolbarOption.find(InsertMenu).length).toEqual(0);
        });

        it('should render dropdown content into popupsMountPoint dom node if passed', () => {
          const customItems = [
            {
              content: 'Some help text',
              value: { name: 'slash-onboarding' },
            },
          ];

          const popupTarget = document.createElement('div');
          popupTarget.classList.add('popup-target');
          document.body.appendChild(popupTarget);

          buildToolbar({
            insertMenuItems: customItems,
            replacePlusMenuWithElementBrowser: false,
            popupsMountPoint: popupTarget,
          });

          baseToolbarOption.setState({ isPlusMenuOpen: true });
          baseToolbarOption.update();

          expect(popupTarget.innerText).toContain(customItems[0].content);
        });
      });
    });

    describe('modern: using the element browser', () => {
      it('should render the ElementBrowser on a popup if flag is true', () => {
        const customItems = [
          {
            content: 'Some help text',
            value: { name: 'slash-onboarding' },
          },
          {
            content: 'ZZ',
            value: { name: 'ZZ' },
          },
          {
            content: 'View more',
            value: { name: 'macro-browser' },
          },
          {
            content: 'Macro',
            value: { name: 'macro' },
          },
        ];

        buildToolbar({
          insertMenuItems: customItems,
          replacePlusMenuWithElementBrowser: true,
        });

        baseToolbarOption.setState({ isPlusMenuOpen: true });
        baseToolbarOption.update();

        expect(toolbarOption.find(InsertMenu).length).toEqual(1);
        expect(toolbarOption.find(DropdownMenu).length).toEqual(0);
      });
    });
  });

  describe('image upload', () => {
    it('should call handleImageUpload onClick if enabled, supported and handled', () => {
      const cb = jest.fn();
      const handleImageUpload = () => cb;

      buildToolbar({
        handleImageUpload,
        imageUploadEnabled: true,
        imageUploadSupported: true,
      });

      clickInsertMenuOption(messages.image.defaultMessage, toolbarOption);
      expect(cb).toHaveBeenCalledTimes(1);
    });
  });

  describe('custom items', () => {
    let customItems: MenuItem[];

    beforeEach(() => {
      customItems = [
        {
          content: 'Custom A',
          value: { name: 'custom-a' },
          onClick: jest.fn(),
        },
        {
          content: 'Custom B',
          value: { name: 'custom-b' },
          onClick: jest.fn(),
        },
      ];

      buildToolbar({ insertMenuItems: customItems });
    });

    it('should add custom items to the insert menu', () => {
      const items = toolbarOption.find(DropdownMenu).prop('items')[0];
      expect(items.items.length).toEqual(customItems.length);
    });

    it("should call custom item's onClick callback when it is clicked in menu", () => {
      const onItemActivated = toolbarOption
        .find(DropdownMenu)
        .prop('onItemActivated');

      onItemActivated!.call(
        { props: { insertMenuItems: customItems } },
        { item: customItems[0] },
      );

      expect(customItems[0].onClick).toHaveBeenCalled();
    });
  });

  describe('item validation', () => {
    it('should not conflict with disabled native expand', () => {
      const customItems = [
        {
          content: 'Custom A',
          value: { name: 'expand' },
          onClick: jest.fn(),
        },
      ];

      buildToolbar({
        expandEnabled: false,
        insertMenuItems: customItems,
      });
      const spy = jest.spyOn(
        baseToolbarOption.instance() as any,
        'insertExpand',
      );

      const onItemActivated = toolbarOption
        .find(DropdownMenu)
        .prop('onItemActivated');

      onItemActivated!.call(
        { props: { insertMenuItems: customItems } },
        { item: customItems[0] },
      );

      expect(spy).not.toHaveBeenCalled();
      expect(customItems[0].onClick).toHaveBeenCalled();
    });

    it('should not conflict with enabled native expand', () => {
      const customItems = [
        {
          content: 'Custom A',
          value: { name: 'expand' },
          onClick: jest.fn(),
        },
      ];

      buildToolbar({
        expandEnabled: true,
        insertMenuItems: customItems,
      });
      const spy = jest.spyOn(
        baseToolbarOption.instance() as any,
        'insertExpand',
      );

      const onItemActivated = toolbarOption
        .find(DropdownMenu)
        .prop('onItemActivated');

      onItemActivated!.call(
        { props: { insertMenuItems: customItems, expandEnabled: true } },
        { item: customItems[0] },
      );

      expect(spy).toHaveBeenCalled();
      expect(customItems[0].onClick).not.toHaveBeenCalled();
    });
  });

  menus.forEach((menu) => {
    describe(`for menu type ${menu.name}`, () => {
      const buildToolbarForMenu = (props: Partial<ToolbarInsertBlockProps>) =>
        buildToolbar({ buttons: menu.numButtons, ...props });

      describe('click emoji option', () => {
        const clickEmojiOption = () => {
          menu.clickButton(messages.emoji.defaultMessage, toolbarOption);
        };

        beforeEach(() => {
          buildToolbarForMenu({
            emojiDisabled: false,
            isTypeAheadAllowed: true,
            emojiProvider,
          });
          clickEmojiOption();
        });

        it('should open emoji picker', () => {
          expect(toolbarOption.find(AkEmojiPicker).exists()).toBe(true);
        });

        it('should close emoji picker when emoji option is clicked again', () => {
          if (menu.name === INPUT_METHOD.TOOLBAR) {
            clickEmojiOption();
          } else {
            openInsertMenu(toolbarOption);
          }
          expect(toolbarOption.find(AkEmojiPicker).exists()).toBe(false);
        });

        it('should fire analytics event when emoji picker opened', () => {
          expect(dispatchAnalyticsSpy).toHaveBeenCalledWith({
            action: 'opened',
            actionSubject: 'picker',
            actionSubjectId: 'emojiPicker',
            attributes: expect.objectContaining({ inputMethod: menu.name }),
            eventType: 'ui',
          });
        });
      });

      describe('click media option', () => {
        let onShowMediaPickerSpy = jest.fn();

        beforeEach(() => {
          buildToolbarForMenu({
            mediaSupported: true,
            mediaUploadsEnabled: true,
            onShowMediaPicker: onShowMediaPickerSpy,
          });
          menu.clickButton(
            messages.addMediaFiles.defaultMessage,
            toolbarOption,
          );
        });

        it('should call onShowMediaPicker', () => {
          expect(onShowMediaPickerSpy).toHaveBeenCalledTimes(1);
        });

        it('should fire v3 analytics event', () => {
          expect(dispatchAnalyticsSpy).toHaveBeenCalledWith({
            action: 'opened',
            actionSubject: 'picker',
            actionSubjectId: 'cloudPicker',
            attributes: expect.objectContaining({ inputMethod: menu.name }),
            eventType: 'ui',
          });
        });
      });

      describe('click link option', () => {
        beforeEach(() => {
          buildToolbarForMenu({
            linkSupported: true,
            pluginInjectionApi: editorAPI,
          });
          menu.clickButton(messages.link.defaultMessage, toolbarOption);
        });

        it('should insert link', () => {
          const linkMeta =
            dispatchSpy.mock.calls[0][0].getMeta(hyperlinkPluginKey);
          expect(linkMeta.type).toEqual(LinkAction.SHOW_INSERT_TOOLBAR);
          dispatchSpy.mockRestore();
        });

        it('should fire analytics event', () => {
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'invoked',
            actionSubject: 'typeAhead',
            actionSubjectId: 'linkTypeAhead',
            attributes: expect.objectContaining({ inputMethod: menu.name }),
            eventType: 'ui',
          });
        });
      });

      describe('click rule option', () => {
        it('should fire v3 analytics event', () => {
          buildToolbarForMenu({
            horizontalRuleEnabled: true,
            pluginInjectionApi: editorAPI,
          });
          menu.clickButton(
            messages.horizontalRule.defaultMessage,
            toolbarOption,
          );

          expect(createAnalyticsEvent).toBeCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'divider',
            attributes: expect.objectContaining({ inputMethod: menu.name }),
            eventType: 'track',
          });
        });
      });

      describe('click table option', () => {
        const insertTable = jest.fn().mockImplementation(() => () => {});
        const pluginInjectionApi: any = {
          table: {
            actions: {
              insertTable,
            },
          },
        };

        beforeEach(() => {
          ({ editorView } = editor(doc(p('text'))));
          buildToolbarForMenu({ tableSupported: true, pluginInjectionApi });
          menu.clickButton(messages.table.defaultMessage, toolbarOption);
        });

        it('should fire v3 analytics event', () => {
          expect(insertTable).toBeCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'table',
            attributes: expect.objectContaining({ inputMethod: menu.name }),
            eventType: 'track',
          });
        });
      });

      describe('click action option', () => {
        beforeEach(() => {
          uuid.setStatic('local-highlight');
          buildToolbarForMenu({
            actionSupported: true,
            pluginInjectionApi: editorAPI,
          });
          menu.clickButton(messages.action.defaultMessage, toolbarOption);
        });

        afterEach(() => {
          uuid.setStatic(false);
        });

        it('should insert action', () => {
          expect(editorView.state.doc).toEqualDocument(
            doc(
              taskList({ localId: 'local-highlight' })(
                taskItem({ localId: 'local-highlight', state: 'TODO' })('text'),
              ),
            ),
          );
        });

        it('should fire v3 analytics event', () => {
          expect(createAnalyticsEvent).toBeCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'action',
            attributes: expect.objectContaining({ inputMethod: menu.name }),
            eventType: 'track',
          });
        });
      });

      describe('click decision option', () => {
        beforeEach(() => {
          uuid.setStatic('local-highlight');
          buildToolbarForMenu({
            decisionSupported: true,
            pluginInjectionApi: editorAPI,
          });
          menu.clickButton(messages.decision.defaultMessage, toolbarOption);
        });

        afterEach(() => {
          uuid.setStatic(false);
        });

        it('should insert decision', () => {
          expect(editorView.state.doc).toEqualDocument(
            doc(
              decisionList({ localId: 'local-highlight' })(
                decisionItem({ localId: 'local-highlight' })('text'),
              ),
            ),
          );
        });

        it('should fire v3 analytics event', () => {
          expect(createAnalyticsEvent).toBeCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'decision',
            attributes: expect.objectContaining({ inputMethod: menu.name }),
            eventType: 'track',
          });
        });
      });

      describe('click view more (macro) option', () => {
        it('should open the element browser', () => {
          const pluginInjectionApi: any = {
            core: {
              actions: {
                execute: jest.fn(),
              },
            },
            quickInsert: {
              commands: {
                openElementBrowserModal: jest.fn(),
              },
            },
          };

          const insertMacroFromMacroBrowserSpy = jest.fn();
          buildToolbarForMenu({
            insertMenuItems: [],
            showElementBrowserLink: true,
            onInsertMacroFromMacroBrowser: () => insertMacroFromMacroBrowserSpy,
            pluginInjectionApi,
          });

          menu.clickButton(messages.viewMore.defaultMessage, toolbarOption);
          expect(insertMacroFromMacroBrowserSpy).not.toHaveBeenCalled();
          expect(pluginInjectionApi.core.actions.execute).toHaveBeenCalledTimes(
            1,
          );
          expect(pluginInjectionApi.core.actions.execute).toHaveBeenCalledWith(
            pluginInjectionApi.quickInsert.commands.openElementBrowserModal,
          );
        });
      });

      describe('click placeholder option', () => {
        beforeEach(() => {
          buildToolbarForMenu({ placeholderTextEnabled: true });
          menu.clickButton(
            messages.placeholderText.defaultMessage,
            toolbarOption,
          );
        });
      });

      describe('click columns option', () => {
        beforeEach(() => {
          buildToolbarForMenu({
            layoutSectionEnabled: true,
            pluginInjectionApi: editorAPI,
          });
          menu.clickButton(messages.columns.defaultMessage, toolbarOption);
        });

        it('should fire v3 analytics event', () => {
          expect(createAnalyticsEvent).toBeCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'layout',
            attributes: expect.objectContaining({ inputMethod: menu.name }),
            eventType: 'track',
          });
        });
      });

      describe('click status option', () => {
        beforeEach(() => {
          buildToolbarForMenu({
            nativeStatusSupported: true,
            pluginInjectionApi: editorAPI,
          });
          menu.clickButton(messages.status.defaultMessage, toolbarOption);
        });

        it('should fire v3 analytics event', () => {
          expect(createAnalyticsEvent).toBeCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'status',
            attributes: expect.objectContaining({ inputMethod: menu.name }),
            eventType: 'track',
          });
        });
      });

      const blockTypes = [
        {
          type: PANEL,
          title: blockTypeMessages.infoPanel.defaultMessage,
        },
        {
          type: CODE_BLOCK,
          title: blockTypeMessages.codeblock.defaultMessage,
        },
        {
          type: BLOCK_QUOTE,
          title: blockTypeMessages.blockquote.defaultMessage,
        },
      ];
      blockTypes.forEach((blockType) => {
        const { type, title } = blockType;
        describe(`click ${type.name} option`, () => {
          let insertBlockTypeSpy: jest.Mock;

          beforeEach(() => {
            insertBlockTypeSpy = jest.fn(() => () => true);
            buildToolbarForMenu({
              availableWrapperBlockTypes: [type],
              onInsertBlockType: insertBlockTypeSpy,
            });
            menu.clickButton(title, toolbarOption);
          });

          it('should call insertBlockType', () => {
            expect(insertBlockTypeSpy).toHaveBeenCalledTimes(1);
            expect(insertBlockTypeSpy).toHaveBeenCalledWith(type.name);
          });
        });
      });
    });
  });
});
