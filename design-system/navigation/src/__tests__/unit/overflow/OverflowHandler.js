import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { replaceRaf } from 'raf-stub';
import OverflowHandler from '../../../components/js/overflow/OverflowHandler';
import OverflowItem from '../../../components/js/overflow/OverflowItem';
import OverflowItemGroup from '../../../components/js/overflow/OverflowItemGroup';
import OverflowDropdown from '../../../components/js/overflow/OverflowDropdown';
import {
  dropdownHeight,
  reservedGapHeight,
} from '../../../components/js/overflow/shared-variables';

configure({ adapter: new Adapter() });

describe('<AkCollapseOverflow />', () => {
  describe('calculateBreakItem', () => {
    let instance;
    beforeEach(() => {
      instance = mount(
        <OverflowHandler groupCount={1}>
          <OverflowItemGroup itemCount={7} overflowGroupIndex={0}>
            <OverflowItem overflowItemIndex={0}>0</OverflowItem>
            <OverflowItem overflowItemIndex={1}>1</OverflowItem>
            <OverflowItem overflowItemIndex={2}>2</OverflowItem>
            <OverflowItem overflowItemIndex={3}>3</OverflowItem>
            <OverflowItem overflowItemIndex={4}>4</OverflowItem>
            <OverflowItem overflowItemIndex={5}>5</OverflowItem>
            <OverflowItem overflowItemIndex={6}>6</OverflowItem>
          </OverflowItemGroup>
        </OverflowHandler>,
      ).instance();
    });

    it('should break on first item if availableHeight equals total content height', () => {
      instance.handleItemGroupHeightReport({
        groupIndex: 0,
        itemHeights: [10, 10, 10, 10, 10, 10, 10],
        nonItemHeight: 32,
      });
      instance.handleAvailableHeightChange(
        dropdownHeight + reservedGapHeight + 32 + 10,
      );
      expect(instance.state.breakAt).toEqual({ group: 0, item: 0 });
    });
    it('should break on 2nd item if availableHeight is 1px bigger than total content height', () => {
      instance.handleItemGroupHeightReport({
        groupIndex: 0,
        itemHeights: [10, 10, 10, 10, 10, 10, 10],
        nonItemHeight: 32,
      });
      instance.handleAvailableHeightChange(
        dropdownHeight + reservedGapHeight + 32 + 10 + 1,
      );
      expect(instance.state.breakAt).toEqual({ group: 0, item: 1 });
    });
    it('should include all items if there is enough space', () => {
      instance.handleItemGroupHeightReport({
        groupIndex: 0,
        itemHeights: [10, 10, 10, 10, 10, 10, 10],
        nonItemHeight: 32,
      });
      instance.handleAvailableHeightChange(500);
      expect(instance.state.breakAt).toEqual({ group: 999, item: 999 });
    });
    it('should not recalculate heights if some groups have not reported their item heights yet', () => {
      expect(instance.state.breakAt).toEqual({ group: 999, item: 999 });
      instance.handleAvailableHeightChange(
        dropdownHeight + reservedGapHeight + 32 + 10,
      );

      instance.handleItemGroupHeightReport({
        groupIndex: 0,
        itemHeights: [10, 10, 10, 10, 10, 10, 10],
        nonItemHeight: 32,
      });
      expect(instance.state.breakAt).toEqual({ group: 0, item: 0 });
    });
  });

  describe('dropdown rendering', () => {
    let wrapper;
    let instance;

    beforeEach(() => {
      replaceRaf();
      wrapper = mount(
        <OverflowHandler groupCount={1}>
          <OverflowItemGroup itemCount={7} overflowGroupIndex={0}>
            <OverflowItem overflowItemIndex={0}>0</OverflowItem>
            <OverflowItem overflowItemIndex={1}>1</OverflowItem>
            <OverflowItem overflowItemIndex={2}>2</OverflowItem>
            <OverflowItem overflowItemIndex={3}>3</OverflowItem>
            <OverflowItem overflowItemIndex={4}>4</OverflowItem>
            <OverflowItem overflowItemIndex={5}>5</OverflowItem>
            <OverflowItem overflowItemIndex={6}>6</OverflowItem>
          </OverflowItemGroup>
        </OverflowHandler>,
      );
      instance = wrapper.instance();
      requestAnimationFrame.step(); // needed for SizeDetector
    });

    it('should render dropdown only if break is needed', () => {
      instance.handleAvailableHeightChange(
        dropdownHeight + reservedGapHeight + 32 + 10,
      );
      expect(wrapper.find(OverflowDropdown).length).toBe(0);
      instance.handleItemGroupHeightReport({
        groupIndex: 0,
        itemHeights: [10, 10, 10, 10, 10, 10, 10],
        nonItemHeight: 32,
      });

      wrapper.update();
      expect(instance.state.breakAt).toEqual({ group: 0, item: 0 });
      expect(wrapper.find(OverflowDropdown).length).toBe(1);
      instance.handleAvailableHeightChange(999);
      wrapper.update();
      expect(wrapper.find(OverflowDropdown).length).toBe(0);
    });
  });
});
