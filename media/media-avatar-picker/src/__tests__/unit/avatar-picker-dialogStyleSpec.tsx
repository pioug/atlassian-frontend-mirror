import React from 'react';
import { render } from 'enzyme';
import { DragZone } from '../../image-navigator/dragZone';

describe('Avatar Picker Styles', () => {
  describe('image-navigator', () => {
    it('DragZone is dropping file', () => {
      const dragZone = render(
        <DragZone isDroppingFile={true} showBorder={true} />,
      );

      expect(dragZone).toMatchSnapshot();
    });

    it('DragZone is not dropping file', () => {
      const dragZone = render(
        <DragZone isDroppingFile={false} showBorder={true} />,
      );

      expect(dragZone).toMatchSnapshot();
    });
  });
});
