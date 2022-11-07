import React from 'react';
import { screen } from '@testing-library/react';
import {
  mockReactDomWarningGlobal,
  renderWithIntl,
} from '../../__tests__/_testing-library';
import {
  FlashAnimation,
  FlashAnimationProps,
  RENDER_FLASHANIMATION_TESTID,
} from './FlashAnimation';
import { flashAnimation } from './styles';

describe('@atlaskit/reactions/components/FlashAnimation', () => {
  const renderFlash = (props: Partial<FlashAnimationProps> = {}) => (
    <FlashAnimation {...props}>
      <span>my background will flash</span>
    </FlashAnimation>
  );
  mockReactDomWarningGlobal();
  jest.useFakeTimers();

  it('should not include flash class', async () => {
    renderWithIntl(renderFlash());
    const elem = await screen.findByTestId(RENDER_FLASHANIMATION_TESTID);
    expect(elem).toBeInTheDocument();
    expect(getComputedStyle(elem).getPropertyValue('animation')).toBeFalsy();
  });

  it('should include flash class', async () => {
    renderWithIntl(renderFlash({ flash: true }));
    const elem = await screen.findByTestId(RENDER_FLASHANIMATION_TESTID);
    expect(getComputedStyle(elem).getPropertyValue('animation')).toBe(
      `${flashAnimation.name} 700ms ease-in-out`,
    );
  });
});
