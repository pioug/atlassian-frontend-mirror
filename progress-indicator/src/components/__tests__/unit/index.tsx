import React, { FC } from 'react';
import { mount, shallow } from 'enzyme';

import { ProgressDots as ProgressDotsWithAnalytics } from '../../..';
import { ProgressDotsWithoutAnalytics as ProgressDots } from '../../Dots';
import { IndicatorButton, IndicatorDiv } from '../../../styled/Dots';

// NOTE: "StubComponent" saves duplicating required props; avoids errors in the logs
const StubComponent: FC<{ onSelect?: () => any }> = props => (
  <ProgressDots selectedIndex={0} values={['one', 'two', 'three']} {...props} />
);

describe('Progress Indicator', () => {
  it('should be possible to create a component', () => {
    const wrapper = shallow(<StubComponent />);
    expect(wrapper).not.toBe(undefined);
  });

  describe('size property', () => {
    it('should be "default" if unspecified', () => {
      const wrapper = shallow(<StubComponent />);
      expect(wrapper.prop('size')).toBe('default');
    });
  });

  describe('appearance property', () => {
    it('should be "default" if unspecified', () => {
      const wrapper = shallow(<StubComponent />);
      expect(wrapper.prop('appearance')).toBe('default');
    });
  });

  describe('values property', () => {
    it('should render the correct number of indicators', () => {
      const wrapper = shallow(
        <ProgressDots
          selectedIndex={0}
          values={['one', 'two', 'three', 'four', 'five']}
        />,
      );
      expect(wrapper.find(IndicatorDiv)).toHaveLength(5);
    });
    it('should accept an array of any value types', () => {
      const numericValues = shallow(
        <ProgressDots selectedIndex={0} values={[1, 2, 3]} />,
      );
      const objectValues = shallow(
        <ProgressDots
          selectedIndex={0}
          values={[{ key: 'value' }, { key: 'value' }, { key: 'value' }]}
        />,
      );
      expect(numericValues.find(IndicatorDiv)).toHaveLength(3);
      expect(objectValues.find(IndicatorDiv)).toHaveLength(3);
    });
  });

  describe('onSelect property', () => {
    it('should return an <IndicatorDiv /> when NOT specified', () => {
      const wrapper = mount(<StubComponent />);
      expect(wrapper.find(IndicatorDiv).exists()).toBe(true);
    });
    it('should return an <IndicatorButton /> when specified', () => {
      const wrapper = mount(<StubComponent onSelect={() => {}} />);
      expect(wrapper.find(IndicatorButton).exists()).toBe(true);
    });
  });

  describe('selectedIndex property', () => {
    it('should return a "selected" <Indicator* /> at the correct index', () => {
      const wrapper = mount(<StubComponent />);
      expect(
        wrapper
          .find(IndicatorDiv)
          .at(1)
          .prop('selected'),
      ).toBe(false);
      expect(
        wrapper
          .find(IndicatorDiv)
          .at(0)
          .prop('selected'),
      ).toBe(true);
    });
  });
});

describe('ProgressDotsWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    (global.console.warn as jest.Mock).mockRestore();
    (global.console.error as jest.Mock).mockRestore();
  });

  it('should mount without errors', () => {
    mount(
      <ProgressDotsWithAnalytics
        selectedIndex={0}
        values={['one', 'two', 'three', 'four', 'five']}
      />,
    );
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
