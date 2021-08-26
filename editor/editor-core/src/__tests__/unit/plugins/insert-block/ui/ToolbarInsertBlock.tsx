import React from 'react';
import { InjectedIntlProps } from 'react-intl';
import { ReactWrapper, mount } from 'enzyme';
import { EditorView } from 'prosemirror-view';

import Item from '@atlaskit/item';
import { EmojiPicker as AkEmojiPicker } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import Button from '@atlaskit/button/standard-button';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  doc,
  p,
  decisionList,
  decisionItem,
  taskList,
  taskItem,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { uuid } from '@atlaskit/adf-schema';
import layoutPlugin from '../../../../../plugins/layout';
import featureFlagsPlugin from '../../../../../plugins/feature-flags-context';
import blockTypePlugin from '../../../../../plugins/block-type';
import panelPlugin from '../../../../../plugins/panel';
import rulePlugin from '../../../../../plugins/rule';
import tablePlugin from '../../../../../plugins/table';
import statusPlugin from '../../../../../plugins/status';
import expandPlugin from '../../../../../plugins/expand';
import analyticsPlugin from '../../../../../plugins/analytics';
import typeAheadPlugin from '../../../../../plugins/type-ahead';
import quickInsertPlugin from '../../../../../plugins/quick-insert';
import taskDecisionPlugin from '../../../../../plugins/tasks-and-decisions';
import mentionsPlugin from '../../../../../plugins/mentions';

import { pluginKey as blockTypePluginKey } from '../../../../../plugins/block-type/pm-plugins/main';
import {
  CODE_BLOCK,
  PANEL,
  BLOCK_QUOTE,
} from '../../../../../plugins/block-type/types';
import ToolbarInsertBlock from '../../../../../plugins/insert-block/ui/ToolbarInsertBlock';
import { MediaProvider } from '../../../../../plugins/media';
import {
  stateKey as hyperlinkPluginKey,
  LinkAction,
} from '../../../../../plugins/hyperlink/pm-plugins/main';
import {
  INPUT_METHOD,
  DispatchAnalyticsEvent,
} from '../../../../../plugins/analytics';

import { TooltipShortcut } from '../../../../../keymaps';
import { messages } from '../../../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';
import { messages as blockTypeMessages } from '../../../../../plugins/block-type/messages';
import { Props as ToolbarInsertBlockProps } from '../../../../../plugins/insert-block/ui/ToolbarInsertBlock/types';

import { MenuItem } from '../../../../../ui/DropdownMenu/types';
import DropdownMenu from '../../../../../ui/DropdownMenu';
import ToolbarButton from '../../../../../ui/ToolbarButton';

import { openElementBrowserModal } from '../../../../../plugins/quick-insert/commands';
import InsertMenu from '../../../../../ui/ElementBrowser/InsertMenu';

jest.mock('../../../../../plugins/quick-insert/commands', () => ({
  openElementBrowserModal: jest.fn(() => jest.fn()),
}));

jest.mock('../../../../../ui/ElementBrowser/InsertMenu', () => () => <div />);

type ToolbarOptionWrapper = ReactWrapper<
  ToolbarInsertBlockProps & InjectedIntlProps
>;

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
    .find(Button);

const getInsertMenuButton = (
  title: string,
  toolbarOption: ToolbarOptionWrapper,
) => {
  openInsertMenu(toolbarOption);
  return toolbarOption
    .find<any>(Item)
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
  let pluginState: any;
  let toolbarOption: ToolbarOptionWrapper;
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  let dispatchAnalyticsSpy: jest.SpyInstance<DispatchAnalyticsEvent>;
  let dispatchSpy: jest.SpyInstance;

  const providerFactory = ProviderFactory.create({
    mediaProvider,
    taskDecisionProvider: Promise.resolve(getMockTaskDecisionResource()),
  });

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      pluginKey: blockTypePluginKey,
      preset: new Preset<LightEditorPlugin>()
        .add(blockTypePlugin)
        .add([featureFlagsPlugin, { newInsertionBehaviour: true }])
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(layoutPlugin)
        .add(panelPlugin)
        .add(rulePlugin)
        .add(tablePlugin)
        .add([statusPlugin, { menuDisabled: true }])
        .add(expandPlugin)
        .add(taskDecisionPlugin)
        .add([typeAheadPlugin, { createAnalyticsEvent }])
        .add(mentionsPlugin)
        .add([quickInsertPlugin, { disableDefaultItems: true }]),
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
    toolbarOption = mountWithIntl<ToolbarInsertBlockProps, {}>(
      <ToolbarInsertBlock {...defaultProps} {...props} />,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchAnalyticsSpy = jest.fn();
    ({ editorView, pluginState } = editor(doc(p('text'))));
    dispatchSpy = jest.spyOn(editorView, 'dispatch');
  });

  afterEach(() => {
    if (toolbarOption) {
      toolbarOption.unmount();
    }
  });

  it('should render nothing if none of the plugins are present', () => {
    buildToolbar();
    expect(toolbarOption.html()).toEqual(null);
  });

  it('should disable toolbar buttons if isDisabled is true', () => {
    buildToolbar({
      isDisabled: true,
      availableWrapperBlockTypes: pluginState.availableWrapperBlockTypes,
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
          expect(tooltipContent.find(TooltipShortcut).text()).toEqual(result);
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
          expect(items.items.map((item) => item.content)).toEqual(expected);
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
          expect(items.items.map((item) => item.content)).toEqual(sortedItems);
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
          expect(items.items.map((item) => item.content)).toEqual(sortedItems);
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
          expect(items.items.map((item) => item.content)).toEqual(sortedItems);
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

          toolbarOption.setState({ isPlusMenuOpen: true });
          toolbarOption.update();

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

          toolbarOption.setState({ isPlusMenuOpen: true });
          toolbarOption.update();

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

        toolbarOption.setState({ isPlusMenuOpen: true });
        toolbarOption.update();

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
      const spy = jest.spyOn(toolbarOption.instance() as any, 'insertExpand');

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
      const spy = jest.spyOn(toolbarOption.instance() as any, 'insertExpand');

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

      describe('mentions option', () => {
        it('should fire v3 analytics event when mention option clicked', () => {
          buildToolbarForMenu({
            mentionsSupported: true,
            isTypeAheadAllowed: true,
          });
          menu.clickButton(messages.mention.defaultMessage, toolbarOption);
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'invoked',
            actionSubject: 'typeAhead',
            actionSubjectId: 'mentionTypeAhead',
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
            messages.filesAndImages.defaultMessage,
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
          buildToolbarForMenu({ linkSupported: true });
          menu.clickButton(messages.link.defaultMessage, toolbarOption);
        });

        it('should insert link', () => {
          const linkMeta = dispatchSpy.mock.calls[0][0].getMeta(
            hyperlinkPluginKey,
          );
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
          buildToolbarForMenu({ horizontalRuleEnabled: true });
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
        beforeEach(() => {
          ({ editorView } = editor(doc(p('text'))));
          buildToolbarForMenu({ tableSupported: true });
          menu.clickButton(messages.table.defaultMessage, toolbarOption);
        });

        it('should fire v3 analytics event', () => {
          expect(createAnalyticsEvent).toBeCalledWith({
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
          buildToolbarForMenu({ actionSupported: true });
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
          buildToolbarForMenu({ decisionSupported: true });
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

      describe('click mview more (macro) option', () => {
        it('should open the element browser', () => {
          const insertMacroFromMacroBrowserSpy = jest.fn();
          buildToolbarForMenu({
            insertMenuItems: [],
            showElementBrowserLink: true,
            onInsertMacroFromMacroBrowser: () => insertMacroFromMacroBrowserSpy,
          });

          menu.clickButton(messages.viewMore.defaultMessage, toolbarOption);
          expect(insertMacroFromMacroBrowserSpy).not.toHaveBeenCalled();
          expect(openElementBrowserModal).toHaveBeenCalled();
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
          buildToolbarForMenu({ layoutSectionEnabled: true });
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
          buildToolbarForMenu({ nativeStatusSupported: true });
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
