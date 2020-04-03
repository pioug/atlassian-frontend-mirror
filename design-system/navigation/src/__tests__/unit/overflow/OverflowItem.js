import React from 'react';
import { mount, shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import OverflowItem from '../../../components/js/overflow/OverflowItem';
import {
  overflowGroupNamespace,
  shouldReportItemHeight,
} from '../../../components/js/overflow/shared-variables';

configure({ adapter: new Adapter() });

describe('<AkCollapseOverflowItem />', () => {
  const createContext = (
    shouldRenderItemBool,
    shouldReportItemHeightBool = false,
    reportHeightFn = () => {},
  ) => ({
    [overflowGroupNamespace]: {
      shouldRenderItem: () => shouldRenderItemBool,
      reportItemHeightToGroup: reportHeightFn,
    },
    [shouldReportItemHeight]: shouldReportItemHeightBool,
  });

  it('should render null if !context.overflowGroupNamespace.shouldRenderItem', () => {
    const wrapper = shallow(
      <OverflowItem overflowItemIndex={0}>
        <span className="test-child" />
      </OverflowItem>,
      { context: createContext(false) },
    );

    expect(wrapper.find('span.test-child').length).toBe(0);
  });

  it('should render inside a div + report height, if context.shouldReportItemHeight flag set', () => {
    const reportHeightSpy = jest.fn();
    const wrapper = mount(
      <OverflowItem overflowItemIndex={123}>
        <span className="test-child" />
      </OverflowItem>,
      { context: createContext(true, true, reportHeightSpy) },
    );

    expect(wrapper.find('div > span.test-child').length).toBe(1);
    expect(reportHeightSpy).toHaveBeenCalledTimes(1);
    expect(reportHeightSpy).toHaveBeenCalledWith(123, 0); // clientHeight returns 0 in Jest
  });

  it('should render children without wrapper div if context.shouldReportItemHeight not set', () => {
    const reportHeightSpy = jest.fn();
    const wrapper = mount(
      <OverflowItem overflowItemIndex={123}>
        <span className="test-child" />
      </OverflowItem>,
      { context: createContext(true, false, reportHeightSpy) },
    );

    expect(wrapper.find('div > span.test-child').length).toBe(0);
    expect(wrapper.find('span.test-child').length).toBe(1);
    expect(reportHeightSpy).toHaveBeenCalledTimes(0);
  });
});
