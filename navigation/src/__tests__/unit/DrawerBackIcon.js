import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import DrawerBackIcon from '../../components/js/DrawerBackIcon';
import DrawerBackIconInner from '../../components/styled/DrawerBackIconInner';

configure({ adapter: new Adapter() });

describe('<DrawerBackIcon />', () => {
  describe('props', () => {
    it('renders children', () => {
      const icon = <em>test</em>;
      expect(
        shallow(<DrawerBackIcon>{icon}</DrawerBackIcon>).contains(icon),
      ).toBe(true);
    });
    it('isVisible controls the presence of the isVisible class', () => {
      const visibleIcon = shallow(
        <DrawerBackIcon isVisible>icon</DrawerBackIcon>,
      );
      const invisibleIcon = shallow(<DrawerBackIcon>icon</DrawerBackIcon>);

      expect(visibleIcon.find(DrawerBackIconInner).props().isVisible).toBe(
        true,
      );
      expect(invisibleIcon.find(DrawerBackIconInner).props().isVisible).toBe(
        false,
      );
    });
  });
});
