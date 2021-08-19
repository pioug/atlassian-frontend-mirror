import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { ProviderFactory } from '@atlaskit/editor-common';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { FormattedMessage } from 'react-intl';
import { getToolbarItems } from './toolbar';
import * as actions from '../panel/actions';
import { PanelOptions } from './pm-plugins/main';
import {
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
import { doc, p, panel } from '@atlaskit/editor-test-helpers/doc-builder';
import { PanelType } from '@atlaskit/adf-schema';

const dummyFormatMessage = (
  messageDescriptor: FormattedMessage.MessageDescriptor,
): string => messageDescriptor.defaultMessage || '';

const spy = jest
  .spyOn(actions, 'changePanelType')
  .mockImplementation(() => jest.fn());

describe('getToolbarItems', () => {
  const providerFactory = new ProviderFactory();
  providerFactory.setProvider(
    'emojiProvider',
    Promise.resolve(getTestEmojiResource()),
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 7 items when isCustomPanelEnabled is false', () => {
    const items = getToolbarItems(
      dummyFormatMessage,
      defaultSchema.nodes.panel,
      false,
      providerFactory,
    );

    expect(items).toHaveLength(7);
  });
  describe('if isCustomPanelEnabled is true', () => {
    const items = getToolbarItems(
      dummyFormatMessage,
      defaultSchema.nodes.panel,
      true,
      providerFactory,
      PanelType.INFO,
    );

    it('should return 10 items', () => {
      expect(items).toHaveLength(10);
    });

    it('should contain emoji and color picker button', () => {
      const emojiButton = items.find(
        (item) => item.type === 'select' && item.selectType === 'emoji',
      );
      const colorButton = items.find(
        (item) => item.type === 'select' && item.selectType === 'color',
      );
      expect(emojiButton).not.toBeUndefined();
      expect(colorButton).not.toBeUndefined();
    });
  });

  describe('custom panel toolbar items', () => {
    const createEditor = createProsemirrorEditorFactory();
    const panelPreset = new Preset<LightEditorPlugin>().add([
      panelPlugin,
      {
        UNSAFE_allowCustomPanel: true,
      },
    ]);
    const { editorView } = createEditor({
      doc: doc(panel({ panelType: 'info' })(p('{<>}'))),
      preset: panelPreset,
      providerFactory,
    });

    const items = getToolbarItems(
      dummyFormatMessage,
      defaultSchema.nodes.panel,
      true,
      providerFactory,
      PanelType.INFO,
    );

    it(`should call changePanelType when clicked on emoji picker
          with changed emoji`, () => {
      const emojiPickerConfig = items.find(
        (item) => item.type === 'select' && item.selectType === 'emoji',
      );
      (emojiPickerConfig as FloatingToolbarEmojiPicker<any>)!.onChange(
        ':smiley:',
      )(editorView.state);
      expect(spy).toBeCalledWith(
        PanelType.CUSTOM,
        { emoji: ':smiley:' } as PanelOptions,
        true,
      );
    });
    it(`should call changePanelType when clicked on color picker
          with changed color`, () => {
      const colorPickerConfig = items.find(
        (item) => item.type === 'select' && item.selectType === 'color',
      );
      (colorPickerConfig as FloatingToolbarColorPicker<any>)!.onChange({
        label: 'Mintie',
        value: '#ABF5D1',
        border: DEFAULT_BORDER_COLOR,
      })(editorView.state);
      expect(spy).toBeCalledWith(
        PanelType.CUSTOM,
        { color: '#ABF5D1' } as PanelOptions,
        true,
      );
    });
  });
});
