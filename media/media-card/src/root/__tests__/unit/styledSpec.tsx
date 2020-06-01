import React from 'react';
import { shallow } from 'enzyme';
import { Wrapper } from '../../styled';
import { CardDimensions } from '../../..';

describe('Root Wrapper', () => {
  const dimensions: CardDimensions = {
    width: 400,
    height: 300,
  };

  describe('File', () => {
    it('should render properly with default properties', () => {
      const file = shallow(<Wrapper />);
      expect(file).toMatchSnapshot();
    });

    it('should render properly with passed dimensions', () => {
      const defaultWithDimensions = shallow(
        <Wrapper dimensions={dimensions} />,
      );
      const auto = shallow(<Wrapper dimensions={dimensions} />);

      expect(defaultWithDimensions).toMatchSnapshot();
      expect(auto).toMatchSnapshot();
    });

    it('should apply breakpoint rules bassed on breakpointSize', () => {
      const small = shallow(<Wrapper breakpointSize="small" />);
      const medium = shallow(<Wrapper breakpointSize="medium" />);
      const large = shallow(<Wrapper breakpointSize="large" />);
      const xlarge = shallow(<Wrapper breakpointSize="xlarge" />);

      expect(small).toMatchSnapshot();
      expect(medium).toMatchSnapshot();
      expect(large).toMatchSnapshot();
      expect(xlarge).toMatchSnapshot();
    });

    it('should render right cursor when shouldUsePointerCursor is passed', () => {
      const withCursor = shallow(<Wrapper shouldUsePointerCursor />);
      const withoutCursor = shallow(<Wrapper shouldUsePointerCursor={false} />);

      expect(withCursor).toMatchSnapshot();
      expect(withoutCursor).toMatchSnapshot();
    });
  });
});
