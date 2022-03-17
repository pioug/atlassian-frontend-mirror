import React from 'react';
import { mount } from 'enzyme';

import {
  FlashAnimation,
  Props,
  flashAnimationTestId,
  flashAnimation,
} from '../../../components/FlashAnimation';

jest.useFakeTimers();

describe('Flash', () => {
  const renderFlash = (props: Partial<Props> = {}) => (
    <FlashAnimation {...props}>
      <span>my background will flash</span>
    </FlashAnimation>
  );

  it('should not include flash class', () => {
    const flash = mount(renderFlash());
    const elem = flash.find(`div[data-testid="${flashAnimationTestId}"]`);
    expect(
      getComputedStyle(elem.getDOMNode()).getPropertyValue('animation'),
    ).toBeFalsy();
  });

  it('should include flash class', () => {
    const flash = mount(renderFlash({ flash: true }));
    const elem = flash.find(`div[data-testid="${flashAnimationTestId}"]`);
    expect(
      getComputedStyle(elem.getDOMNode()).getPropertyValue('animation'),
    ).toBe(`${flashAnimation.name} 700ms ease-in-out`);
  });
});
