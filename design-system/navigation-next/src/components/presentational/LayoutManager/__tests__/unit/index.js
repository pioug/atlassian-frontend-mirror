import React from 'react';

import { mount } from 'enzyme';

import { NavigationProvider } from '../../../../../index';
import LayoutManager from '../../index';

const GlobalNavigation = () => null;
const ProductNavigation = () => null;

const defaultProps = {
  globalNavigation: GlobalNavigation,
  productNavigation: ProductNavigation,
  containerNavigation: null,
  children: <div>Page content</div>,
};

const mountWithContext = (tree) =>
  mount(<NavigationProvider>{tree}</NavigationProvider>);

describe('LayoutManager', () => {
  describe('Exposing refs', () => {
    it('should expose a ref to the expand/collapse affordance', () => {
      const getRefs = jest.fn();
      mountWithContext(<LayoutManager {...defaultProps} getRefs={getRefs} />);
      const refs = getRefs.mock.calls[0][0];
      expect(refs).toHaveProperty('expandCollapseAffordance');
    });
  });
});
