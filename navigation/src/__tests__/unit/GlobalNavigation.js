/* eslint-disable no-console */
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React, { PureComponent } from 'react';
import GlobalNavigation from '../../components/js/GlobalNavigation';
import * as presets from '../../theme/presets';
import GlobalItem from '../../components/js/GlobalItem';
import GlobalPrimaryActions from '../../components/js/GlobalPrimaryActions';
import GlobalSecondaryActions from '../../components/js/GlobalSecondaryActions';

configure({ adapter: new Adapter() });

class Child extends PureComponent {
  render() {
    return <div>Hi there</div>;
  }
}

describe('<GlobalNavigation />', () => {
  describe('renders', () => {
    it('should render <GlobalPrimaryActions />', () => {
      expect(
        mount(<GlobalNavigation />).find(GlobalPrimaryActions),
      ).toHaveLength(1);
    });
  });

  describe('props', () => {
    it('should default theme to presets.global', () => {
      expect(mount(<GlobalNavigation />).props().theme).toBe(presets.global);
    });
    it('primaryIcon prop is passed to <GlobalPrimaryActions />', () => {
      const icon = <img alt="foo" />;
      expect(
        shallow(<GlobalNavigation primaryIcon={icon} />)
          .find(GlobalPrimaryActions)
          .props().primaryIcon,
      ).toBe(icon);
    });
    it('primaryItemHref prop is passed to <GlobalPrimaryActions />', () => {
      const icon = <img alt="foo" />;
      expect(
        shallow(
          <GlobalNavigation
            primaryIcon={icon}
            primaryItemHref="http://google.com"
          />,
        )
          .find(GlobalPrimaryActions)
          .props().primaryItemHref,
      ).toBe('http://google.com');
    });
    it('primaryIcon=null means no <GlobalItem /> is rendered', () => {
      expect(shallow(<GlobalNavigation />).find(GlobalItem).length).toBe(0);
    });
    it('linkComponent is passed on to the primary <GlobalPrimaryActions/>', () => {
      const linkComponent = () => null;
      expect(
        shallow(
          <GlobalNavigation
            primaryIcon={<span>Fake icon</span>}
            linkComponent={linkComponent}
          />,
        )
          .find(GlobalPrimaryActions)
          .props().linkComponent,
      ).toBe(linkComponent);
    });
    it('should render secondary actions in the global navigation', () => {
      const wrapper = mount(
        <GlobalNavigation secondaryActions={[<Child />, <Child />]} />,
      );
      expect(wrapper.find(GlobalSecondaryActions).find(Child).length).toBe(2);
    });
    it('should not render out any secondary actions if none are provided', () => {
      const wrapper = mount(<GlobalNavigation />);
      expect(wrapper.find(GlobalSecondaryActions).length).toBe(0);
    });
  });
});
