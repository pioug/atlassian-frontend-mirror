import React from 'react';
import { mount } from 'enzyme';
import { flashAnimation } from './styles';

import {
  FlashAnimation,
  FlashAnimationProps,
  RENDER_FLASHANIMATION_TESTID,
} from './FlashAnimation';

jest.useFakeTimers();

describe('@atlaskit/reactions/components/FlashAnimation', () => {
  const renderFlash = (props: Partial<FlashAnimationProps> = {}) => (
    <FlashAnimation {...props}>
      <span>my background will flash</span>
    </FlashAnimation>
  );

  it('should not include flash class', () => {
    const flash = mount(renderFlash());
    const elem = flash.find(
      `div[data-testid="${RENDER_FLASHANIMATION_TESTID}"]`,
    );
    expect(
      getComputedStyle(elem.getDOMNode()).getPropertyValue('animation'),
    ).toBeFalsy();
  });

  it('should include flash class', () => {
    const flash = mount(renderFlash({ flash: true }));
    const elem = flash.find(
      `div[data-testid="${RENDER_FLASHANIMATION_TESTID}"]`,
    );
    expect(
      getComputedStyle(elem.getDOMNode()).getPropertyValue('animation'),
    ).toBe(`${flashAnimation.name} 700ms ease-in-out`);
  });
});
