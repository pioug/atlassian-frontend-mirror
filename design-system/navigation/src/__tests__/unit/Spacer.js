import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Spacer from '../../components/js/Spacer';
import SpacerInner from '../../components/styled/SpacerInner';

configure({ adapter: new Adapter() });

describe('<Spacer />', () => {
  describe('props', () => {
    it('default width is 0', () => {
      expect(
        shallow(<Spacer />)
          .find(SpacerInner)
          .props().style.width,
      ).toBe(0);
    });
    it('width prop is reflected on as styled width', () => {
      expect(
        shallow(<Spacer width={500} />)
          .find(SpacerInner)
          .props().style.width,
      ).toBe(500);
      expect(
        shallow(<Spacer width={200} />)
          .find(SpacerInner)
          .props().style.width,
      ).toBe(200);
    });
  });
});
