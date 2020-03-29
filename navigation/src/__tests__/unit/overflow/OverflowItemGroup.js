import React from 'react';
import { mount, shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import OverflowItemGroup from '../../../components/js/overflow/OverflowItemGroup';
import {
  overflowManagerNamespace,
  shouldReportItemHeight,
} from '../../../components/js/overflow/shared-variables';

configure({ adapter: new Adapter() });

describe('<AkCollapseOverflowItemGroup />', () => {
  const createContext = (
    isGroupVisibleInNavBool = false,
    isGroupVisibleInDropdownBool = false,
    shouldReportItemHeightBool = false, // usually true only when in nav, not dropdown
    reportGroupHeightToManagerFn = argsObj => {}, // eslint-disable-line no-unused-vars
  ) => ({
    [overflowManagerNamespace]: {
      isGroupVisibleInNav: () => isGroupVisibleInNavBool,
      isGroupVisibleInDropdown: () => isGroupVisibleInDropdownBool,
      isGroupItemVisibleInNav: () => true,
      reportGroupHeightToManager: argsObj =>
        reportGroupHeightToManagerFn(argsObj),
    },
    [shouldReportItemHeight]: shouldReportItemHeightBool,
  });

  describe('rendering null if told to by context', () => {
    it('should render null when in nav and context tells it not to render', () => {
      const wrapper = shallow(
        <OverflowItemGroup overflowGroupIndex={0} itemCount={2}>
          <span className="test-child" />
        </OverflowItemGroup>,
        { context: createContext(false, false, true) },
      );

      expect(wrapper.children().length).toBe(0);
    });

    it('should render when in nav and context tells it to render', () => {
      const wrapper = shallow(
        <OverflowItemGroup overflowGroupIndex={0} itemCount={2}>
          <span className="test-child" />
        </OverflowItemGroup>,
        { context: createContext(true, false, true) },
      );

      expect(wrapper.find('.test-child').length).toBe(1);
    });

    it('should render null when not in nav and context tells it not to render', () => {
      const wrapper = shallow(
        <OverflowItemGroup overflowGroupIndex={0} itemCount={2}>
          <span className="test-child" />
        </OverflowItemGroup>,
        { context: createContext() },
      );

      expect(wrapper.children().length).toBe(0);
    });

    it('should render when not in nav and context tells it to render', () => {
      const wrapper = shallow(
        <OverflowItemGroup overflowGroupIndex={0} itemCount={2}>
          <span className="test-child" />
        </OverflowItemGroup>,
        { context: createContext(false, true, false) },
      );

      expect(wrapper.find('.test-child').length).toBe(1);
    });
  });

  describe('renders children in a div if shouldReportItemHeight', () => {
    it('should render with wrapper div that stores ref, if context.shouldReportItemHeight is true', () => {
      const wrapper = mount(
        <OverflowItemGroup overflowGroupIndex={0} itemCount={2}>
          <span className="test-child" />
        </OverflowItemGroup>,
        { context: createContext(true, false, true) },
      );
      wrapper.update(); // needed to trigger ref

      expect(wrapper.find('div > .test-child').length).toBe(1);
      expect(wrapper.instance().rootNode).not.toBe(undefined);
    });

    it('should render without a wrapper div if context.shouldReportItemHeight is false', () => {
      const wrapper = mount(
        <OverflowItemGroup overflowGroupIndex={0} itemCount={2}>
          <span className="test-child" />
        </OverflowItemGroup>,
        { context: createContext(false, true, false) },
      );

      expect(wrapper.find('div > .test-child').length).toBe(0);
      expect(wrapper.find('.test-child').length).toBe(1);
    });
  });

  describe('height reporting to overflow manager', () => {
    let wrapper;
    let reportSpy;
    let instance;

    beforeEach(() => {
      reportSpy = jest.fn();
      wrapper = mount(
        <OverflowItemGroup overflowGroupIndex={0} itemCount={2}>
          <span className="test-child" />
        </OverflowItemGroup>,
        { context: createContext(true, false, true, reportSpy) },
      );
      instance = wrapper.instance();
      wrapper.update();
      jest.spyOn(wrapper.instance(), 'groupHeight').mockReturnValue(100);
    });

    it('should report height of items and non-item height to the overflow manager via context', () => {
      instance.handleItemHeightReport(0, 40);
      instance.handleItemHeightReport(1, 50);
      expect(reportSpy).toHaveBeenCalledTimes(1);
      expect(reportSpy).toHaveBeenCalledWith({
        groupIndex: 0,
        itemHeights: [40, 50],
        nonItemHeight: 10,
      });
    });

    it('should not report height of items to manager until all item heights are known', () => {
      instance.handleItemHeightReport(0, 40);
      expect(reportSpy).toHaveBeenCalledTimes(0);

      instance.handleItemHeightReport(0, 40);
      expect(reportSpy).toHaveBeenCalledTimes(0);

      instance.handleItemHeightReport(1, 50);
      expect(reportSpy).toHaveBeenCalledTimes(1);
    });

    it('should not report height of items to manager not in navigation (i.e. when in dropdown)', () => {
      wrapper.setContext(createContext(false, true, false, reportSpy));
      instance.handleItemHeightReport(0, 40);
      instance.handleItemHeightReport(1, 50);

      expect(reportSpy).toHaveBeenCalledTimes(0);
    });
  });
});
