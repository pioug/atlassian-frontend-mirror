import React from 'react';
import { mount, shallow } from 'enzyme';
import ScreenTracker, { ScreenTrackerBase } from '../../index';

describe('ScreenTracker', () => {
  const mockAnalyticsEvent = {
    payload: {},
    update: jest.fn(),
    fire: jest.fn(),
  };
  const mockCreateAnalyticsEvent = jest.fn(() => mockAnalyticsEvent);

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render correctly', () => {
    const wrapper = mount(<ScreenTracker name="test" isVisible={false} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should fire a screen event on mount when isVisible is initially true', () => {
    shallow(
      <ScreenTrackerBase
        name="test"
        isVisible
        createAnalyticsEvent={mockCreateAnalyticsEvent}
      />,
    );

    expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
      eventType: 'screen',
      name: 'test',
    });
  });

  it('should fire a screen event when isVisible changes from false to true', () => {
    const wrapper = shallow(
      <ScreenTrackerBase
        name="test"
        isVisible={false}
        createAnalyticsEvent={mockCreateAnalyticsEvent}
      />,
    );

    expect(mockCreateAnalyticsEvent).not.toHaveBeenCalled();

    wrapper.setProps({ isVisible: true });

    expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
      eventType: 'screen',
      name: 'test',
    });
  });

  it('should NOT fire a screen event when isVisible changes from true to false', () => {
    const wrapper = shallow(
      <ScreenTrackerBase
        name="test"
        isVisible
        createAnalyticsEvent={mockCreateAnalyticsEvent}
      />,
    );

    expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);

    wrapper.setProps({ isVisible: false });

    expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
  });

  it('should fire a new screen event when isVisible is toggled back to true', () => {
    const wrapper = shallow(
      <ScreenTrackerBase
        name="test"
        isVisible
        createAnalyticsEvent={mockCreateAnalyticsEvent}
      />,
    );

    expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
      eventType: 'screen',
      name: 'test',
    });
    expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);

    wrapper.setProps({ isVisible: false });
    expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);

    wrapper.setProps({ isVisible: true });
    expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(2);
    expect(mockCreateAnalyticsEvent).toHaveBeenLastCalledWith({
      eventType: 'screen',
      name: 'test',
    });
  });
});
