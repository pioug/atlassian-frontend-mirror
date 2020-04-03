import React from 'react';
import { shallow } from 'enzyme';
import { Y200, P200, B300 } from '@atlaskit/theme/colors';
import { IconWrapper } from '../../styled';

describe('CardGenericViewSmall', () => {
  describe('MediaTypeIcon', () => {
    describe('IconWrapper', () => {
      it('should render the correct color when type="image"', () => {
        const element = shallow(<IconWrapper type="image" />);
        expect(element).toHaveStyleRule('color', Y200);
      });

      it('should render the correct color when type="audio"', () => {
        const element = shallow(<IconWrapper type="audio" />);
        expect(element).toHaveStyleRule('color', P200);
      });

      it('should render the correct color when type="video"', () => {
        const element = shallow(<IconWrapper type="video" />);
        expect(element).toHaveStyleRule('color', '#ff7143');
      });

      it('should render the correct color when type="doc"', () => {
        const element = shallow(<IconWrapper type="doc" />);
        expect(element).toHaveStyleRule('color', B300);
      });

      it('should render the correct color when type="unknown"', () => {
        const element = shallow(<IconWrapper type="unknown" />);
        expect(element).toHaveStyleRule('color', '#3dc7dc');
      });
    });
  });
});
