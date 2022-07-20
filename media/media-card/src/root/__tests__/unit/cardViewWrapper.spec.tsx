import React from 'react';
import { mount } from 'enzyme';

import { Wrapper } from '../../cardViewWrapper';
import { CardDimensions } from '../../..';

describe('Root Wrapper', () => {
  const dimensions: CardDimensions = {
    width: 400,
    height: 300,
  };
  const cardViewWrapperId = 'div#cardViewWrapper';

  describe('File', () => {
    it('should render properly with default properties', () => {
      const file = mount(<Wrapper />).find(cardViewWrapperId);

      expect(file).toMatchSnapshot();
    });

    it('should render properly with passed dimensions', () => {
      const defaultWithDimensions = mount(
        <Wrapper dimensions={dimensions} />,
      ).find(cardViewWrapperId);
      const auto = mount(<Wrapper dimensions={dimensions} />).find(
        cardViewWrapperId,
      );

      expect(defaultWithDimensions).toMatchSnapshot();
      expect(auto).toMatchSnapshot();
    });

    it('should apply breakpoint rules bassed on breakpointSize', () => {
      const small = mount(<Wrapper breakpointSize="small" />).find(
        cardViewWrapperId,
      );
      const medium = mount(<Wrapper breakpointSize="medium" />).find(
        cardViewWrapperId,
      );
      const large = mount(<Wrapper breakpointSize="large" />).find(
        cardViewWrapperId,
      );
      const xlarge = mount(<Wrapper breakpointSize="xlarge" />).find(
        cardViewWrapperId,
      );

      expect(small).toMatchSnapshot();
      expect(medium).toMatchSnapshot();
      expect(large).toMatchSnapshot();
      expect(xlarge).toMatchSnapshot();
    });

    it('should render right cursor when shouldUsePointerCursor is passed', () => {
      const withCursor = mount(<Wrapper shouldUsePointerCursor />).find(
        cardViewWrapperId,
      );
      const withoutCursor = mount(
        <Wrapper shouldUsePointerCursor={false} />,
      ).find(cardViewWrapperId);

      expect(withCursor).toMatchSnapshot();
      expect(withoutCursor).toMatchSnapshot();
    });
  });
});
