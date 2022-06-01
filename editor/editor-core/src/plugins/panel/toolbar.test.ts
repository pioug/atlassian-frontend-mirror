/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { getToolbarItems, panelIconMap } from './toolbar';
import { IntlShape, MessageDescriptor, createIntl } from 'react-intl-next';
import * as actions from '../panel/actions';
import { PanelOptions } from './pm-plugins/main';
import {
  FloatingToolbarButton,
  FloatingToolbarColorPicker,
  FloatingToolbarEmojiPicker,
} from '../floating-toolbar/types';
import { DEFAULT_BORDER_COLOR } from '../../ui/ColorPalette/Palettes';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import panelPlugin from '.';
import {
  doc,
  DocBuilder,
  p,
  panel,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { PanelType } from '@atlaskit/adf-schema';
import analyticsPlugin from '../analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
  AnalyticsEventPayload,
} from '../analytics';
import { EditorView } from 'prosemirror-view';
import { emojiPluginKey } from '../emoji';
import { G75 } from '@atlaskit/theme/colors';
import { EmojiId } from '@atlaskit/emoji';

const dummyFormatMessage = (messageDescriptor: MessageDescriptor) =>
  (messageDescriptor.defaultMessage as string) || '';

const changePanelTypespy = jest.spyOn(actions, 'changePanelType');

describe('getToolbarItems', () => {
  const providerFactory = new ProviderFactory();
  providerFactory.setProvider(
    'emojiProvider',
    Promise.resolve(getTestEmojiResource()),
  );

  const panelPreset = new Preset<LightEditorPlugin>().add([
    panelPlugin,
    {
      allowCustomPanel: true,
      allowCustomPanelEdit: true,
    },
  ]);
  const itemsWithCustomPanelEnabled = getToolbarItems(
    dummyFormatMessage,
    defaultSchema.nodes.panel,
    true,
    true,
    providerFactory,
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
    );

    expect(items).toHaveLength(7);
  });

  describe('if allowCustomPanelEdit is true', () => {
    it('should return 11 items', () => {
      expect(itemsWithCustomPanelEnabled).toHaveLength(11);
    });

    it('should contain emoji and color picker button', () => {
      const emojiButton = itemsWithCustomPanelEnabled.find(
        (item) => item.type === 'select' && item.selectType === 'emoji',
      );
      const colorButton = itemsWithCustomPanelEnabled.find(
        (item) => item.type === 'select' && item.selectType === 'color',
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
        PanelType.CUSTOM,
      );

      const removeEmojiButton:
        | FloatingToolbarButton<any>
        | undefined = toolbarItems.find(
        (item) =>
          item.type === 'button' && item.id === 'editor.panel.removeEmoji',
      ) as FloatingToolbarButton<any>;

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
        (item) => item.type === 'select' && item.selectType === 'emoji',
      );
      (emojiPickerConfig as FloatingToolbarEmojiPicker<any>)!.onChange(emojiId)(
        editorView.state,
      );
      expect(changePanelTypespy).toBeCalledWith(
        PanelType.CUSTOM,
        {
          emoji: ':smiley:',
          emojiId: '1f603',
          emojiText: '😃',
        } as PanelOptions,
        true,
      );
    });

    it.each(standardPanels)(
      `should call changePanelType when clicked on color picker
          with previous icon for %p panel`,
      (value) => {
        const { editorView } = editor(
          doc(panel({ panelType: value })(p('text'))),
        );
        const colorPickerConfig = itemsWithCustomPanelEnabled.find(
          (item) => item.type === 'select' && item.selectType === 'color',
        );
        (colorPickerConfig as FloatingToolbarColorPicker<any>)!.onChange({
          label: 'Mintie',
          value: G75,
          border: DEFAULT_BORDER_COLOR,
        })(editorView.state);

        const emojiInfo = panelIconMap[value];
        expect(changePanelTypespy).toBeCalledWith(
          PanelType.CUSTOM,
          {
            color: G75,
            emoji: emojiInfo.shortName,
            emojiId: emojiInfo.id,
          } as PanelOptions,
          true,
        );
      },
    );

    it(`should call changePanelType when clicked on hide emoji`, () => {
      const removeEmojiButton:
        | FloatingToolbarButton<any>
        | undefined = itemsWithCustomPanelEnabled.find(
        (item) =>
          item.type === 'button' && item.id === 'editor.panel.removeEmoji',
      ) as FloatingToolbarButton<any>;

      removeEmojiButton!.onClick(editorView.state);

      expect(changePanelTypespy).toBeCalledWith(
        PanelType.CUSTOM,
        { emoji: undefined } as PanelOptions,
        true,
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
        PanelType.CUSTOM,
      );
      const removeEmojiButton:
        | FloatingToolbarButton<any>
        | undefined = toolbarItems.find(
        (item) =>
          item.type === 'button' && item.id === 'editor.panel.removeEmoji',
      ) as FloatingToolbarButton<any>;
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
        PanelType.CUSTOM,
        '#ABF5D1',
        '',
      );
      const removeEmojiButton:
        | FloatingToolbarButton<any>
        | undefined = toolbarItems.find(
        (item) =>
          item.type === 'button' && item.id === 'editor.panel.removeEmoji',
      ) as FloatingToolbarButton<any>;

      expect(removeEmojiButton.disabled).toBe(true);
    });

    it(`should have remove emoji button enabled when focus on panel with emoji`, () => {
      const toolbarItems = getToolbarItems(
        dummyFormatMessage,
        defaultSchema.nodes.panel,
        true,
        true,
        providerFactory,
        PanelType.CUSTOM,
        '#ABF5D1',
        ':smiley:',
      );
      const removeEmojiButton:
        | FloatingToolbarButton<any>
        | undefined = toolbarItems.find(
        (item) =>
          item.type === 'button' && item.id === 'editor.panel.removeEmoji',
      ) as FloatingToolbarButton<any>;

      expect(removeEmojiButton.disabled).toBe(false);
    });

    it(`should have remove emoji button enabled when focus on standard panel`, () => {
      const toolbarItems = getToolbarItems(
        dummyFormatMessage,
        defaultSchema.nodes.panel,
        true,
        true,
        providerFactory,
        PanelType.INFO,
        undefined,
        'info',
      );
      const removeEmojiButton:
        | FloatingToolbarButton<any>
        | undefined = toolbarItems.find(
        (item) =>
          item.type === 'button' && item.id === 'editor.panel.removeEmoji',
      ) as FloatingToolbarButton<any>;

      expect(removeEmojiButton.disabled).toBe(false);
    });
  });

  describe('analytics for custom panels', () => {
    const createEditor = createProsemirrorEditorFactory();
    let createAnalyticsEvent: jest.Mock = jest.fn(() => ({ fire() {} }));
    let editorView: EditorView;
    const emojiId: EmojiId = {
      shortName: ':smiley:',
      id: '1f603',
      fallback: '😃',
    };

    beforeEach(() => {
      ({ editorView } = createEditor({
        doc: doc(
          panel({
            panelType: 'info',
          })(p('{<>}')),
        ),
        preset: panelPreset.add([analyticsPlugin, { createAnalyticsEvent }]),
        providerFactory,
        pluginKey: emojiPluginKey,
      }));
    });

    it('Should trigger analytics when background color is changed', () => {
      const colorPickerConfig = itemsWithCustomPanelEnabled.find(
        (item) => item.type === 'select' && item.selectType === 'color',
      );
      (colorPickerConfig as FloatingToolbarColorPicker<any>)!.onChange({
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
      expect(createAnalyticsEvent).toHaveBeenCalledWith(payload);
    });

    it('Should trigger analytics when Icon is changed', () => {
      const emojiPickerConfig = itemsWithCustomPanelEnabled.find(
        (item) => item.type === 'select' && item.selectType === 'emoji',
      );
      (emojiPickerConfig as FloatingToolbarEmojiPicker<any>)!.onChange(emojiId)(
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
      expect(createAnalyticsEvent).toHaveBeenCalledWith(payload);
    });

    it('Should trigger analytics when Icon is removed', () => {
      const removeEmojiButton = itemsWithCustomPanelEnabled.find(
        (item) =>
          item.type === 'button' && item.id === 'editor.panel.removeEmoji',
      );
      const emojiPickerConfig = itemsWithCustomPanelEnabled.find(
        (item) => item.type === 'select' && item.selectType === 'emoji',
      );

      (emojiPickerConfig as FloatingToolbarEmojiPicker<any>)!.onChange(emojiId)(
        editorView.state,
        editorView.dispatch,
      );
      (removeEmojiButton as FloatingToolbarButton<any>)!.onClick(
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
      expect(createAnalyticsEvent).nthCalledWith(4, payload);
    });

    it('Should not fire analytics when the same background color is selected', () => {
      const colorPickerConfig = itemsWithCustomPanelEnabled.find(
        (item) => item.type === 'select' && item.selectType === 'color',
      );

      (colorPickerConfig as FloatingToolbarColorPicker<any>)!.onChange({
        label: 'Mintie',
        value: '#ABF5D1',
        border: DEFAULT_BORDER_COLOR,
      })(editorView.state, editorView.dispatch);

      (colorPickerConfig as FloatingToolbarColorPicker<any>)!.onChange({
        label: 'Mintie',
        value: '#ABF5D1',
        border: DEFAULT_BORDER_COLOR,
      })(editorView.state, editorView.dispatch);

      expect(createAnalyticsEvent).toHaveBeenCalledTimes(3);
    });

    it('Should not fire analtyics when same emoji is selected', () => {
      const emojiPickerConfig = itemsWithCustomPanelEnabled.find(
        (item) => item.type === 'select' && item.selectType === 'emoji',
      );
      (emojiPickerConfig as FloatingToolbarEmojiPicker<any>)!.onChange(emojiId)(
        editorView.state,
        editorView.dispatch,
      );

      (emojiPickerConfig as FloatingToolbarEmojiPicker<any>)!.onChange(emojiId)(
        editorView.state,
        editorView.dispatch,
      );
      expect(createAnalyticsEvent).toHaveBeenCalledTimes(3);
    });
  });
});
