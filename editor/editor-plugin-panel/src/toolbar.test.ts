import type { IntlShape, MessageDescriptor } from 'react-intl-next';
import { createIntl } from 'react-intl-next';

import { PanelType } from '@atlaskit/adf-schema';
import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type {
  DocBuilder,
  FloatingToolbarButton,
  FloatingToolbarColorPicker,
  FloatingToolbarEmojiPicker,
  PublicPluginAPI,
} from '@atlaskit/editor-common/types';
import { DEFAULT_BORDER_COLOR } from '@atlaskit/editor-common/ui-color';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
// eslint-disable-next-line import/no-extraneous-dependencies
import { panelPlugin } from '@atlaskit/editor-plugin-panel';
import { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, panel } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import type { EmojiId } from '@atlaskit/emoji';
import { G75 } from '@atlaskit/theme/colors';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';

import * as actions from './actions';
import { getToolbarItems, panelIconMap } from './toolbar';

const setNodeMarkupSpy = jest.spyOn(Transaction.prototype, 'setNodeMarkup');

const dummyFormatMessage = (messageDescriptor: MessageDescriptor) =>
  (messageDescriptor.defaultMessage as string) || '';

const changePanelTypespy = jest.spyOn(actions, 'changePanelType');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFloatingToolbarButton = FloatingToolbarButton<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFloatingToolbarColorPicker = FloatingToolbarColorPicker<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFloatingToolbarEmojiPicker = FloatingToolbarEmojiPicker<any>;

describe('getToolbarItems', () => {
  const providerFactory = new ProviderFactory();
  providerFactory.setProvider(
    'emojiProvider',
    Promise.resolve(getTestEmojiResource()),
  );

  const panelPreset = new Preset<LightEditorPlugin>()
    .add(decorationsPlugin)
    .add([
      panelPlugin,
      {
        allowCustomPanel: true,
        allowCustomPanelEdit: true,
      },
    ]);
  let itemsWithCustomPanelEnabled = getToolbarItems(
    dummyFormatMessage,
    defaultSchema.nodes.panel,
    true,
    true,
    providerFactory,
    undefined,
    undefined,
    PanelType.INFO,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 7 items when allowCustomPanelEdit is false', () => {
    const items = getToolbarItems(
      dummyFormatMessage,
      defaultSchema.nodes.panel,
      false,
      false,
      providerFactory,
      undefined,
      undefined,
    );

    expect(items).toHaveLength(7);
  });

  it('should return 7 items when allowCustomPanelEdit is false and allowCustomPanel is true', () => {
    const items = getToolbarItems(
      dummyFormatMessage as IntlShape['formatMessage'],
      defaultSchema.nodes.panel,
      true,
      false,
      providerFactory,
      undefined,
      undefined,
    );

    expect(items).toHaveLength(7);
  });

  it('should return 7 items when allowCustomPanelEdit is true and allowCustomPanel is false', () => {
    const items = getToolbarItems(
      dummyFormatMessage,
      defaultSchema.nodes.panel,
      false,
      true,
      providerFactory,
      undefined,
      undefined,
    );

    expect(items).toHaveLength(7);
  });

  describe('if allowCustomPanelEdit is true', () => {
    it('should return 11 items', () => {
      expect(itemsWithCustomPanelEnabled).toHaveLength(11);
    });

    it('should contain emoji and color picker button', () => {
      const emojiButton = itemsWithCustomPanelEnabled.find(
        item => item.type === 'select' && item.selectType === 'emoji',
      );
      const colorButton = itemsWithCustomPanelEnabled.find(
        item => item.type === 'select' && item.selectType === 'color',
      );
      expect(emojiButton).not.toBeUndefined();
      expect(colorButton).not.toBeUndefined();
    });
  });

  describe('when locale is en', () => {
    const intl = createIntl({ locale: 'en' });

    it('should return default message when locale is en', () => {
      const { formatMessage } = intl;
      const toolbarItems = getToolbarItems(
        formatMessage,
        defaultSchema.nodes.panel,
        true,
        true,
        providerFactory,
        undefined,
        undefined,
        PanelType.CUSTOM,
      );

      const removeEmojiButton: AnyFloatingToolbarButton | undefined =
        toolbarItems.find(
          item =>
            item.type === 'button' && item.id === 'editor.panel.removeEmoji',
        ) as AnyFloatingToolbarButton;

      const result = removeEmojiButton.title;

      expect(result).toEqual('Remove emoji');
    });
  });

  describe('custom panel toolbar items', () => {
    const createEditor = createProsemirrorEditorFactory();
    const { editorView } = createEditor({
      doc: doc(panel({ panelType: 'info' })(p('{<>}'))),
      preset: panelPreset,
      providerFactory,
    });

    const editor = (doc: DocBuilder) => {
      return createEditor({
        doc,
        preset: panelPreset,
        providerFactory,
      });
    };

    const standardPanels: Exclude<PanelType, PanelType.CUSTOM>[] = [
      PanelType.INFO,
      PanelType.NOTE,
      PanelType.SUCCESS,
      PanelType.WARNING,
      PanelType.ERROR,
      PanelType.TIP,
    ];

    it(`should call changePanelType when clicked on emoji picker
          with changed emoji`, () => {
      const emojiId: EmojiId = {
        shortName: ':smiley:',
        id: '1f603',
        fallback: '😃',
      };
      const emojiPickerConfig = itemsWithCustomPanelEnabled.find(
        item => item.type === 'select' && item.selectType === 'emoji',
      );
      (emojiPickerConfig as AnyFloatingToolbarEmojiPicker)!.onChange(emojiId)(
        editorView.state,
      );
      expect(setNodeMarkupSpy).toBeCalledWith(
        expect.any(Number),
        expect.any(Object),
        expect.objectContaining({
          panelType: PanelType.CUSTOM,
          panelIcon: ':smiley:',
          panelIconId: '1f603',
          panelIconText: '😃',
          panelColor: '#DEEBFF',
        }),
      );
    });

    it.each(standardPanels)(
      `should call changePanelType when clicked on color picker
          with previous icon for %p panel`,
      value => {
        const { editorView } = editor(
          doc(panel({ panelType: value })(p('text'))),
        );
        const colorPickerConfig = itemsWithCustomPanelEnabled.find(
          item => item.type === 'select' && item.selectType === 'color',
        );
        (colorPickerConfig as AnyFloatingToolbarColorPicker)!.onChange({
          label: 'Mintie',
          /* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage */
          value: G75,
          border: DEFAULT_BORDER_COLOR,
        })(editorView.state);

        const emojiInfo = panelIconMap[value];
        expect(setNodeMarkupSpy).toBeCalledWith(
          expect.any(Number),
          expect.any(Object),
          expect.objectContaining({
            panelType: PanelType.CUSTOM,
            panelIcon: emojiInfo.shortName,
            panelIconId: emojiInfo.id,
            panelColor: G75,
          }),
        );
      },
    );

    it(`should call changePanelType when clicked on hide emoji`, () => {
      const removeEmojiButton: AnyFloatingToolbarButton | undefined =
        itemsWithCustomPanelEnabled.find(
          item =>
            item.type === 'button' && item.id === 'editor.panel.removeEmoji',
        ) as AnyFloatingToolbarButton;

      removeEmojiButton!.onClick(editorView.state);

      expect(setNodeMarkupSpy).toBeCalledWith(
        expect.any(Number),
        expect.any(Object),
        expect.objectContaining({
          panelType: PanelType.CUSTOM,
          panelIcon: undefined,
        }),
      );
    });

    it(`should not call changePanelType when clicked on remove emoji when no emoji in panel`, () => {
      const { editorView } = createEditor({
        doc: doc(panel({ panelType: 'custom' })(p('{<>}'))),
        preset: panelPreset,
        providerFactory,
      });
      const toolbarItems = getToolbarItems(
        dummyFormatMessage,
        defaultSchema.nodes.panel,
        true,
        true,
        providerFactory,
        undefined,
        undefined,
        PanelType.CUSTOM,
      );
      const removeEmojiButton: AnyFloatingToolbarButton | undefined =
        toolbarItems.find(
          item =>
            item.type === 'button' && item.id === 'editor.panel.removeEmoji',
        ) as AnyFloatingToolbarButton;
      changePanelTypespy.mockClear();

      removeEmojiButton!.onClick(editorView.state);

      expect(changePanelTypespy).not.toBeCalled();
    });

    it(`should have remove emoji button disabled when focus on panel without emoji`, () => {
      const toolbarItems = getToolbarItems(
        dummyFormatMessage,
        defaultSchema.nodes.panel,
        true,
        true,
        providerFactory,
        undefined,
        undefined,
        PanelType.CUSTOM,
        '#ABF5D1',
        '',
      );
      const removeEmojiButton: AnyFloatingToolbarButton | undefined =
        toolbarItems.find(
          item =>
            item.type === 'button' && item.id === 'editor.panel.removeEmoji',
        ) as AnyFloatingToolbarButton;

      expect(removeEmojiButton.disabled).toBe(true);
    });

    it(`should have remove emoji button enabled when focus on panel with emoji`, () => {
      const toolbarItems = getToolbarItems(
        dummyFormatMessage,
        defaultSchema.nodes.panel,
        true,
        true,
        providerFactory,
        undefined,
        undefined,
        PanelType.CUSTOM,
        '#ABF5D1',
        ':smiley:',
      );
      const removeEmojiButton: AnyFloatingToolbarButton | undefined =
        toolbarItems.find(
          item =>
            item.type === 'button' && item.id === 'editor.panel.removeEmoji',
        ) as AnyFloatingToolbarButton;

      expect(removeEmojiButton.disabled).toBe(false);
    });

    it(`should have remove emoji button enabled when focus on standard panel`, () => {
      const toolbarItems = getToolbarItems(
        dummyFormatMessage,
        defaultSchema.nodes.panel,
        true,
        true,
        providerFactory,
        undefined,
        undefined,
        PanelType.INFO,
        undefined,
        'info',
      );
      const removeEmojiButton: AnyFloatingToolbarButton | undefined =
        toolbarItems.find(
          item =>
            item.type === 'button' && item.id === 'editor.panel.removeEmoji',
        ) as AnyFloatingToolbarButton;

      expect(removeEmojiButton.disabled).toBe(false);
    });
  });

  describe('analytics for custom panels', () => {
    const createEditor = createProsemirrorEditorFactory();
    let editorView: EditorView;
    let editorAPI: PublicPluginAPI<[AnalyticsPlugin]>;
    const emojiId: EmojiId = {
      shortName: ':smiley:',
      id: '1f603',
      fallback: '😃',
    };

    beforeEach(() => {
      ({ editorView, editorAPI } = createEditor({
        doc: doc(
          panel({
            panelType: 'info',
          })(p('{<>}')),
        ),
        preset: panelPreset
          .add([featureFlagsPlugin, {}])
          .add([analyticsPlugin, {}]),
        providerFactory,
      }));
      jest.spyOn(editorAPI?.analytics?.actions, 'attachAnalyticsEvent');

      itemsWithCustomPanelEnabled = getToolbarItems(
        dummyFormatMessage,
        defaultSchema.nodes.panel,
        true,
        true,
        providerFactory,
        undefined,
        editorAPI?.analytics?.actions,
        PanelType.INFO,
      );
    });

    it('Should trigger analytics when background color is changed', () => {
      const colorPickerConfig = itemsWithCustomPanelEnabled.find(
        item => item.type === 'select' && item.selectType === 'color',
      );
      (colorPickerConfig as AnyFloatingToolbarColorPicker)!.onChange({
        label: 'Mintie',
        value: '#ABF5D1',
        border: DEFAULT_BORDER_COLOR,
      })(editorView.state, editorView.dispatch);

      const payload: AnalyticsEventPayload = {
        action: ACTION.CHANGED_BACKGROUND_COLOR,
        actionSubject: ACTION_SUBJECT.PANEL,
        actionSubjectId: ACTION_SUBJECT_ID.PANEL,
        attributes: expect.objectContaining({
          newColor: '#ABF5D1',
          previousColor: '#DEEBFF',
        }),
        eventType: EVENT_TYPE.TRACK,
      };
      expect(
        editorAPI?.analytics?.actions.attachAnalyticsEvent,
      ).toHaveBeenCalledWith(payload, undefined);
    });

    it('Should trigger analytics when Icon is changed', () => {
      const emojiPickerConfig = itemsWithCustomPanelEnabled.find(
        item => item.type === 'select' && item.selectType === 'emoji',
      );
      (emojiPickerConfig as AnyFloatingToolbarEmojiPicker)!.onChange(emojiId)(
        editorView.state,
        editorView.dispatch,
      );

      const payload: AnalyticsEventPayload = {
        action: ACTION.CHANGED_ICON,
        actionSubject: ACTION_SUBJECT.PANEL,
        actionSubjectId: ACTION_SUBJECT_ID.PANEL,
        attributes: expect.objectContaining({
          newIcon: ':smiley:',
          previousIcon: '',
        }),
        eventType: EVENT_TYPE.TRACK,
      };
      expect(
        editorAPI?.analytics?.actions?.attachAnalyticsEvent,
      ).toHaveBeenCalledWith(payload, undefined);
    });

    it('Should trigger analytics when Icon is removed', () => {
      const removeEmojiButton = itemsWithCustomPanelEnabled.find(
        item =>
          item.type === 'button' && item.id === 'editor.panel.removeEmoji',
      );
      const emojiPickerConfig = itemsWithCustomPanelEnabled.find(
        item => item.type === 'select' && item.selectType === 'emoji',
      );

      (emojiPickerConfig as AnyFloatingToolbarEmojiPicker)!.onChange(emojiId)(
        editorView.state,
        editorView.dispatch,
      );
      (removeEmojiButton as AnyFloatingToolbarButton)!.onClick(
        editorView.state,
        editorView.dispatch,
      );

      const payload: AnalyticsEventPayload = {
        action: ACTION.REMOVE_ICON,
        actionSubject: ACTION_SUBJECT.PANEL,
        actionSubjectId: ACTION_SUBJECT_ID.PANEL,
        attributes: expect.objectContaining({
          icon: ':smiley:',
        }),
        eventType: EVENT_TYPE.TRACK,
      };
      expect(editorAPI?.analytics?.actions?.attachAnalyticsEvent).nthCalledWith(
        4,
        payload,
        undefined,
      );
    });

    it('Should not fire analytics when the same background color is selected', () => {
      const colorPickerConfig = itemsWithCustomPanelEnabled.find(
        item => item.type === 'select' && item.selectType === 'color',
      );
      expect(
        editorAPI?.analytics?.actions?.attachAnalyticsEvent,
      ).toHaveBeenCalledTimes(0);

      (colorPickerConfig as AnyFloatingToolbarColorPicker)!.onChange({
        label: 'Mintie',
        value: '#ABF5D1',
        border: DEFAULT_BORDER_COLOR,
      })(editorView.state, editorView.dispatch);

      expect(
        editorAPI?.analytics?.actions?.attachAnalyticsEvent,
      ).toHaveBeenCalledTimes(2);

      (colorPickerConfig as AnyFloatingToolbarColorPicker)!.onChange({
        label: 'Mintie',
        value: '#ABF5D1',
        border: DEFAULT_BORDER_COLOR,
      })(editorView.state, editorView.dispatch);

      expect(
        editorAPI?.analytics?.actions.attachAnalyticsEvent,
      ).toHaveBeenCalledTimes(3);
      expect(
        editorAPI?.analytics?.actions?.attachAnalyticsEvent,
      ).not.toHaveBeenNthCalledWith(3, {
        action: 'changedBackgroundColor',
      });
    });

    it('Should not fire analytics when same emoji is selected', () => {
      const emojiPickerConfig = itemsWithCustomPanelEnabled.find(
        item => item.type === 'select' && item.selectType === 'emoji',
      );

      expect(
        editorAPI?.analytics?.actions?.attachAnalyticsEvent,
      ).toHaveBeenCalledTimes(0);

      (emojiPickerConfig as AnyFloatingToolbarEmojiPicker)!.onChange(emojiId)(
        editorView.state,
        editorView.dispatch,
      );

      expect(
        editorAPI?.analytics?.actions?.attachAnalyticsEvent,
      ).toHaveBeenCalledTimes(2);

      (emojiPickerConfig as AnyFloatingToolbarEmojiPicker)!.onChange(emojiId)(
        editorView.state,
        editorView.dispatch,
      );
      expect(
        editorAPI?.analytics?.actions?.attachAnalyticsEvent,
      ).toHaveBeenCalledTimes(3);
      expect(
        editorAPI?.analytics?.actions?.attachAnalyticsEvent,
      ).not.toHaveBeenNthCalledWith(3, { action: 'changedIcon' });
    });
  });
});
