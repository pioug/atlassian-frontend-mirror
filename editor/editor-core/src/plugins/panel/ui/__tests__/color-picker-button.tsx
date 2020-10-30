import React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { doc, p, panel } from '@atlaskit/editor-test-helpers/schema-builder';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';

import { ColorPickerButton } from '../color-picker-button';
import panelPlugin from '../../';
import { ReactWrapper } from 'enzyme';

describe('color-picker-button', () => {
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
  });

  const onChangeMock = jest.fn();
  const getWrapper = (): ReactWrapper =>
    mountWithIntl(
      <ColorPickerButton view={editorView} onChange={onChangeMock} />,
    );

  it('should render a button', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('button')).toHaveLength(1);
    // ensure no popup is rendered
    expect(wrapper.find('Popup')).toHaveLength(0);
  });

  it('should show a ColorPalette popup after clicking button', () => {
    const wrapper = getWrapper();
    // show the popup
    wrapper.find('button').simulate('click');

    expect(wrapper.find('Popup')).toHaveLength(1);
    expect(wrapper.find('ColorPalette')).toHaveLength(1);
    expect(wrapper.find('Color')).toHaveLength(21);
  });

  it('should hide popup and call onChange after selecting a color', () => {
    const wrapper = getWrapper();
    // show popup
    wrapper.find('button').simulate('click');

    // select purple
    wrapper
      .find('Color')
      .findWhere(
        (node: ReactWrapper): boolean => node.prop('label') === 'Mintie',
      )
      .find('button')
      .simulate('click');

    // ensure popup is hidden
    expect(wrapper.find('Popup')).toHaveLength(0);

    // ensure callback was called
    expect(onChangeMock).toBeCalledWith(colors.G75);
  });
});
