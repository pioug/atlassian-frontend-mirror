import React from 'react';

import { render } from '@testing-library/react';

import FadeIn from '../../../entering/fade-in';
import { easeInOut } from '../../../utils/curves';

describe('<FadeIn />', () => {
  it('should ease in for the timing curve', () => {
    const { getByTestId } = render(
      <FadeIn>{(props) => <div data-testid="element" {...props} />}</FadeIn>,
    );

    expect(getByTestId('element')).toHaveStyleDeclaration(
      'animation-timing-function',
      easeInOut,
    );
  });

  it('should set a default duration', () => {
    const { getByTestId } = render(
      <FadeIn>{(props) => <div data-testid="element" {...props} />}</FadeIn>,
    );

    expect(getByTestId('element')).toHaveStyleDeclaration(
      'animation-duration',
      '700ms',
    );
  });

  it('should override the default duration', () => {
    const { getByTestId } = render(
      <FadeIn duration={1234}>
        {(props) => <div data-testid="element" {...props} />}
      </FadeIn>,
    );

    expect(getByTestId('element')).toHaveStyleDeclaration(
      'animation-duration',
      '1234ms',
    );
  });
});
