import React from 'react';
import { mount } from 'enzyme';
import { WidthDetectorObserver } from '../../width-detector-observer';

describe('SSR', () => {
  describe('#width-detector-observer', () => {
    it('should not call setWidth', () => {
      const setWidth = jest.fn();
      const div = document.createElement('div');
      mount(
        <>
          <WidthDetectorObserver setWidth={setWidth} />
          <span>1</span>
        </>,
        {
          // @ts-ignore
          hydrateIn: div,
        },
      );

      expect(setWidth).not.toHaveBeenCalled();
    });
  });
});
