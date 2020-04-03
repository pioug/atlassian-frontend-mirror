import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import React from 'react';

import Lozenge from '../../..';

describe('Lozenge', () => {
  describe('isBold property', () => {
    it('should not be the default', () => {
      expect(mount(<Lozenge />).prop('isBold')).toBe(false);
    });

    it('should change when toggled', () => {
      expect(mount(<Lozenge isBold />).prop('isBold')).toBe(true);
    });
  });

  describe('appearance property', () => {
    it('should be "default" when not set', () => {
      expect(mount(<Lozenge />).prop('appearance')).toBe('default');
    });

    it('should change when set to an approved value: success', () => {
      expect(mount(<Lozenge appearance="success" />).prop('appearance')).toBe(
        'success',
      );
    });

    it('should render correctly with text truncated', () => {
      const wrapper = (
        <Lozenge appearance="new">Hello, I should truncate at a point.</Lozenge>
      );
      const Component = renderer.create(wrapper).toJSON();
      expect(Component).toMatchSnapshot();
    });
  });

  describe('maxWidth property', () => {
    it('should render correctly with string maxWidth', () => {
      const wrapper = <Lozenge maxWidth="100%">Hello</Lozenge>;

      const Component = renderer.create(wrapper).toJSON();
      expect(Component).toMatchSnapshot();
    });

    it('should render correctly with number maxWidth', () => {
      const wrapper = <Lozenge maxWidth={120}>Hello</Lozenge>;

      const Component = renderer.create(wrapper).toJSON();
      expect(Component).toMatchSnapshot();
    });
  });
});
