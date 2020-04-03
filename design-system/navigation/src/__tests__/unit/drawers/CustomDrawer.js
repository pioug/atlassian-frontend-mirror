import { mount, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { AkCustomDrawer } from '../../..';
import { drawerIconOffset } from '../../../shared-variables';
import Drawer from '../../../components/js/Drawer';
import requiredProps from '../_drawer-util';

configure({ adapter: new Adapter() });

describe('<CustomDrawer />', () => {
  describe('the inner Drawer', () => {
    it('width="narrow" should pass width="narrow" to the inner drawer', () => {
      expect(
        mount(<AkCustomDrawer {...requiredProps} width="narrow" />)
          .find(Drawer)
          .props().width,
      ).toBe('narrow');
    });
    it('width="wide" should pass width="wide" to the inner drawer', () => {
      expect(
        mount(<AkCustomDrawer {...requiredProps} width="wide" />)
          .find(Drawer)
          .props().width,
      ).toBe('wide');
    });
    it('width="medium" should pass width="medium" to the inner drawer', () => {
      expect(
        mount(<AkCustomDrawer {...requiredProps} width="medium" />)
          .find(Drawer)
          .props().width,
      ).toBe('medium');
    });
    it('width="full" should pass width="full" to the inner drawer', () => {
      expect(
        mount(<AkCustomDrawer {...requiredProps} width="full" />)
          .find(Drawer)
          .props().width,
      ).toBe('full');
    });
    it('no width set should pass width="wide" to the inner drawer', () => {
      expect(
        mount(<AkCustomDrawer {...requiredProps} />)
          .find(Drawer)
          .props().width,
      ).toBe('wide');
    });
    it('should render the backIcon in the correct position default to false', () => {
      expect(
        mount(<AkCustomDrawer {...requiredProps} />)
          .find(Drawer)
          .props().iconOffset,
      ).toBe(drawerIconOffset);
    });
  });
});
