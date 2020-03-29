import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { AkSearchDrawer } from '../../..';
import { drawerIconOffset } from '../../../shared-variables';
import Drawer from '../../../components/js/Drawer';
import requiredProps from '../_drawer-util';

configure({ adapter: new Adapter() });

describe('<SearchDrawer />', () => {
  describe('the inner Drawer', () => {
    it('isFullWidth should pass width="full" to the inner drawer', () => {
      expect(
        mount(<AkSearchDrawer {...requiredProps} isFullWidth />)
          .find(Drawer)
          .props().width,
      ).toBe('full');
    });
    it('isFullWidth={false} should pass width="wide" to the inner drawer', () => {
      expect(
        mount(<AkSearchDrawer {...requiredProps} isFullWidth={false} />)
          .find(Drawer)
          .props().width,
      ).toBe('wide');
    });
    it('should render the backIcon in the correct position default to false', () => {
      expect(
        mount(<AkSearchDrawer {...requiredProps} />)
          .find(Drawer)
          .props().iconOffset,
      ).toBe(drawerIconOffset);
    });
  });
});
