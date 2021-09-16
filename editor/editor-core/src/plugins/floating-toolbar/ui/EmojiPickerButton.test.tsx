import React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { doc, p, panel } from '@atlaskit/editor-test-helpers/doc-builder';

import { EmojiPickerButton } from './EmojiPickerButton';
import { ReactWrapper } from 'enzyme';
import panelPlugin from '../../panel';
import { ProviderFactory } from '@atlaskit/editor-common';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { act } from 'react-dom/test-utils';

describe('emoji-picker-button', () => {
  const createEditor = createProsemirrorEditorFactory();
  let wrapper: ReactWrapper;
  let onChangeMock: jest.Mock<any, any>;

  const providerFactory = new ProviderFactory();

  const panelPreset = new Preset<LightEditorPlugin>().add([
    panelPlugin,
    {
      UNSAFE_allowCustomPanel: true,
    },
  ]);

  beforeEach(() => {
    const { editorView } = createEditor({
      doc: doc(panel({ panelType: 'info' })(p('{<>}'))),
      preset: panelPreset,
      providerFactory,
    });
    providerFactory.setProvider(
      'emojiProvider',
      Promise.resolve(getTestEmojiResource()),
    );
    onChangeMock = jest.fn();
    wrapper = mountWithIntl(
      <EmojiPickerButton
        view={editorView}
        providerFactory={providerFactory}
        onChange={onChangeMock}
      />,
    );
  });

  afterEach(() => {
    providerFactory.removeProvider('emojiProvider');
    wrapper && wrapper.unmount();
  });

  it('should render a button', () => {
    expect(wrapper.find('button')).toHaveLength(1);
    // ensure no popup is rendered
    expect(wrapper.find('Popup')).toHaveLength(0);
  });

  it('should show a EmojiPicker popup after clicking button', () => {
    // popup still not shown before the click
    wrapper.find('button').simulate('click');

    // show the popup
    expect(wrapper.find('Popup')).toHaveLength(1);
  });

  it('should close EmojiPicker popup after clicking outside', () => {
    // clicking on the button to open the popup
    wrapper.find('button').simulate('click');

    // make sure the popup and picker are shown
    expect(wrapper.find('Popup')).toHaveLength(1);

    const emojiPicker = wrapper.find('EmojiPickerInternal').instance();
    // calling click outside
    act(() => {
      (emojiPicker.props as any).handleClickOutside();
    });

    wrapper.update();
    // make sure popup is hidden
    expect(wrapper.find('Popup')).toHaveLength(0);
  });

  it('should hide popup and call onChange after selecting an emoji', () => {
    // click the button
    wrapper.find('button').simulate('click');

    // make sure the popup and picker are shown
    expect(wrapper.find('Popup')).toHaveLength(1);

    const emojiPicker = wrapper.find('EmojiPickerInternal').instance();
    // calling mock callback
    act(() => {
      (emojiPicker.props as any).onSelection({
        shortName: ':smiley:',
      });
    });
    // make sure the on change callback is called
    expect(onChangeMock).toBeCalledWith({
      shortName: ':smiley:',
    });

    wrapper.update();
    // make sure popup is hidden
    expect(wrapper.find('Popup')).toHaveLength(0);
  });
});
