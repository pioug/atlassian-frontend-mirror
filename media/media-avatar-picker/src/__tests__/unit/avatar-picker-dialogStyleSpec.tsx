import React from 'react';
import { shallow } from 'enzyme';
import { DragZone } from '../../image-navigator/styled';

describe('Avatar Picker Styles', () => {
  describe('image-navigator', () => {
    it('DragZone is dropping file', () => {
      const wrapper = shallow(
        <DragZone isDroppingFile={true} showBorder={true} />,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('DragZone is not dropping file', () => {
      const wrapper = shallow(
        <DragZone isDroppingFile={false} showBorder={true} />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
