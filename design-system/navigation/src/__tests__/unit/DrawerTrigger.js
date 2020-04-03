import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import DrawerTrigger from '../../components/js/DrawerTrigger';
import GlobalItem from '../../components/js/GlobalItem';

configure({ adapter: new Adapter() });
describe('<DrawerTrigger />', () => {
  describe('interacting', () => {
    it('click should call the onActivate handler', () => {
      const spy = jest.fn();
      mount(
        <DrawerTrigger onActivate={spy}>
          <span>Test Child</span>
        </DrawerTrigger>,
      )
        .find(GlobalItem)
        .simulate('click');
      expect(spy).toHaveBeenCalled();
    });
    it('Enter key should call the onActivate handler', () => {
      const spy = jest.fn();
      mount(
        <DrawerTrigger onActivate={spy}>
          <span>Test Child</span>
        </DrawerTrigger>,
      )
        .find(GlobalItem)
        .simulate('keydown', {
          key: 'Enter',
        });
      expect(spy).toHaveBeenCalled();
    });
  });
});
