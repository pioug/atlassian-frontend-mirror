import React from 'react';

import { shallow, ShallowWrapper } from 'enzyme';

import { TableBodyRow } from '../../../styled/TableRow';

describe('TableRow', () => {
  let shallowWrapper: ShallowWrapper;

  describe('on rendering', () => {
    beforeEach(() => {
      shallowWrapper = shallow(<TableBodyRow />);
    });

    it('should render default background color', () => {
      expect(shallowWrapper).toMatchSnapshot();
    });

    it('should render no outline without focus', () => {
      expect(shallowWrapper).not.toHaveStyleRule('outline');
      expect(shallowWrapper).not.toHaveStyleRule('outline-offset');
    });

    it('should render blue outline when focused on', () => {
      const focusOption = { modifier: ':focus' };

      expect(shallowWrapper).toHaveStyleRule(
        'outline',
        '2px solid #4C9AFF',
        focusOption,
      );
      expect(shallowWrapper).toHaveStyleRule(
        'outline-offset',
        '-2px',
        focusOption,
      );
    });
  });

  describe('on rendering with highlighted prop', () => {
    beforeEach(() => {
      shallowWrapper = shallow(<TableBodyRow isHighlighted />);
    });

    it('should render with highlighted background color', () => {
      expect(shallowWrapper).toMatchSnapshot();
    });
  });
});
