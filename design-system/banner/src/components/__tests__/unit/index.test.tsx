import React from 'react';

import { mount, shallow } from 'enzyme';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import WarningIcon from '@atlaskit/icon/glyph/warning';

import { getBackgroundColor } from '../../../styles';
import Banner from '../../banner';

const axeRules: JestAxeConfigureOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
  resultTypes: ['violations', 'incomplete'],
};

expect.extend(toHaveNoViolations);

describe('banner', () => {
  it('basic sanity check', () =>
    expect(shallow(<Banner />)).not.toBe(undefined));

  describe('props', () => {
    describe('appearance prop', () => {
      it('should default to warning appearance', () =>
        expect(mount(<Banner />).prop('appearance')).toBe('warning'));
      it('should apply error styles when error appearance supplied', () => {
        const appearance = 'error';
        expect(getBackgroundColor({ appearance })).toBe(
          `var(--background-boldDanger-resting, #DE350B)`,
        );
      });
    });

    it('should render children prop', () => {
      const wrapper = mount(<Banner>Testing!</Banner>);
      expect(wrapper.text()).toBe('Testing!');
    });

    it('should render icon prop', () => {
      const wrapper = shallow(
        <Banner
          icon={<WarningIcon label="Warning" secondaryColor="inherit" />}
        />,
      );
      expect(wrapper.find(WarningIcon).exists()).toBe(true);
    });

    describe('isOpen prop', () => {
      it('should default to not being open', () =>
        expect(mount(<Banner />).prop('isOpen')).toBe(false));

      it('should have height 0 on visibility component', () => {
        const wrapper = mount(<Banner>hello</Banner>);
        expect(wrapper.find('div').get(0).props.style).toEqual({
          maxHeight: '0px',
        });
      });
    });
  });

  describe('a11y', () => {
    it('should not fail an aXe audit', async () => {
      const container = mount(<Banner appearance="announcement" />);
      const results = await axe(container.getDOMNode(), axeRules);

      expect(results).toHaveNoViolations();
    });

    it('should have role=alert by default', () => {
      let wrapper = shallow(<Banner />);
      expect(wrapper.find('[role="alert"]')).toHaveLength(1);
    });

    it('should have role=alert when appearance is "error"', () => {
      let wrapper = shallow(<Banner appearance="error" />);
      expect(wrapper.find('[role="alert"]')).toHaveLength(1);
    });

    it('should have role=region when appearance is "announcement"', () => {
      let wrapper = shallow(<Banner appearance="announcement" />);
      expect(wrapper.find('[role="region"]')).toHaveLength(1);
    });

    it('should have tabIndex=0 when appearance is "announcement"', () => {
      let wrapper = shallow(<Banner appearance="announcement" />);
      expect(wrapper.find('[tabIndex=0]')).toHaveLength(1);
    });

    it('should be aria-hidden=false when isOpen is true', () => {
      let wrapper = shallow(<Banner isOpen />);
      expect(wrapper.find('[aria-hidden=false]')).toHaveLength(1);
    });

    it('should be aria-hidden=true when isOpen is false', () => {
      let wrapper = shallow(<Banner />);
      expect(wrapper.find('[aria-hidden=true]')).toHaveLength(1);
    });
  });
});
