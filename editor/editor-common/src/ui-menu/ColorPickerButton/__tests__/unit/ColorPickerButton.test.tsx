import React from 'react';

import type { ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  mockCreateAnalyticsEvent,
  mockFire,
} from '@atlaskit/editor-test-helpers/mock-analytics-next';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';

import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  editorAnalyticsChannel,
  EVENT_TYPE,
} from '../../../../analytics';
import {
  DEFAULT_BORDER_COLOR,
  panelBackgroundPalette,
} from '../../../../ui-color';
import { ReactEditorViewContext } from '../../../../ui-react';
import ColorPickerButton from '../../index';

describe('color-picker-button', () => {
  const onChangeMock = jest.fn();
  const editorRef = {
    current: document.createElement('div'),
  };
  const getWrapper = (placement: string = ''): ReactWrapper =>
    mountWithIntl(
      <ReactEditorViewContext.Provider value={{ editorRef }}>
        <ColorPickerButton
          onChange={onChangeMock}
          colorPalette={panelBackgroundPalette}
          placement={placement}
        />
      </ReactEditorViewContext.Provider>,
    );

  const selectColor = (wrapper: ReactWrapper, colorLabel: string) => {
    // show popup
    wrapper.find('button').simulate('click');

    // select purple
    wrapper
      .find('Color')
      .findWhere(
        (node: ReactWrapper): boolean => node.prop('label') === colorLabel,
      )
      .find('button')
      .simulate('click');
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it('should close ColorPalette popup after clicking outside', () => {
    const wrapper = getWrapper();
    // show the popup
    wrapper.find('button').simulate('click');

    // make sure the popup and picker are shown
    expect(wrapper.find('Popup')).toHaveLength(1);

    const colorPalette = wrapper.find('ColorPalette');

    act(() => {
      (colorPalette.props as any)().handleClickOutside();
    });

    wrapper.update();
    // make sure popup is hidden
    expect(wrapper.find('Popup')).toHaveLength(0);
  });

  it('should hide popup and call onChange after selecting a color', () => {
    const wrapper = getWrapper();

    selectColor(wrapper, 'Green');

    // ensure popup is hidden
    expect(wrapper.find('Popup')).toHaveLength(0);

    // ensure callback was called
    expect(onChangeMock).toBeCalledWith({
      label: 'Green',
      value: colors.G75,
      border: token('color.border', DEFAULT_BORDER_COLOR),
    });
  });

  it('analytics', async () => {
    const wrapper = getWrapper('ConfigPanel');
    selectColor(wrapper, 'White');
    expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
      action: ACTION.UPDATED,
      actionSubject: ACTION_SUBJECT.PICKER,
      actionSubjectId: ACTION_SUBJECT_ID.PICKER_COLOR,
      attributes: {
        color: '#FFFFFF',
        label: 'White',
        placement: 'ConfigPanel',
      },
      eventType: EVENT_TYPE.TRACK,
    });
    expect(mockFire).toHaveBeenCalledWith(editorAnalyticsChannel);
  });
});
