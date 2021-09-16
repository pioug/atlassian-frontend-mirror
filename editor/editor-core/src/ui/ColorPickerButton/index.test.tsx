import React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import { DEFAULT_BORDER_COLOR } from '../ColorPalette/Palettes';
import { panelBackgroundPalette } from '../ColorPalette/Palettes/panelBackgroundPalette';
import {
  mockCreateAnalyticsEvent,
  mockFire,
} from '@atlaskit/editor-test-helpers/mock-analytics-next';
import ColorPickerButton from './index';
import { ReactWrapper } from 'enzyme';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../../plugins/analytics/types';
import { editorAnalyticsChannel } from '../../plugins/analytics/consts';
import { act } from 'react-dom/test-utils';

describe('color-picker-button', () => {
  const onChangeMock = jest.fn();
  const getWrapper = (placement: string = ''): ReactWrapper =>
    mountWithIntl(
      <ColorPickerButton
        onChange={onChangeMock}
        colorPalette={panelBackgroundPalette}
        placement={placement}
      />,
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

    const colorPalette = wrapper.find('InjectIntl(ColorPalette)').instance();
    act(() => {
      (colorPalette.props as any).handleClickOutside();
    });

    wrapper.update();
    // make sure popup is hidden
    expect(wrapper.find('Popup')).toHaveLength(0);
  });

  it('should hide popup and call onChange after selecting a color', () => {
    const wrapper = getWrapper();

    selectColor(wrapper, 'Mintie');

    // ensure popup is hidden
    expect(wrapper.find('Popup')).toHaveLength(0);

    // ensure callback was called
    expect(onChangeMock).toBeCalledWith({
      label: 'Mintie',
      value: colors.G75,
      border: DEFAULT_BORDER_COLOR,
    });
  });

  it('analytics', async () => {
    const wrapper = getWrapper('ConfigPanel');
    selectColor(wrapper, 'Doctor');
    expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
      action: ACTION.UPDATED,
      actionSubject: ACTION_SUBJECT.PICKER,
      actionSubjectId: ACTION_SUBJECT_ID.PICKER_COLOR,
      attributes: {
        color: '#FFFFFF',
        label: 'Doctor',
        placement: 'ConfigPanel',
      },
      eventType: EVENT_TYPE.TRACK,
    });
    expect(mockFire).toHaveBeenCalledWith(editorAnalyticsChannel);
  });
});
