import React from 'react';

import { render } from '@testing-library/react';

import ExitingPersistence from '../../../entering/exiting-persistence';
import SlideIn, { slideInAnimation } from '../../../entering/slide-in';
import { Direction, Fade, Transition } from '../../../entering/types';
import { easeIn, easeOut } from '../../../utils/curves';
import { mediumDurationMs } from '../../../utils/durations';

jest.mock('../../../utils/accessibility');

describe('<SlideIn />', () => {
  it('should default to medium duration', () => {
    const { getByTestId } = render(
      <SlideIn enterFrom="left">
        {(props) => <div data-testid="target" {...props} />}
      </SlideIn>,
    );

    expect(getByTestId('target')).toHaveStyleDeclaration(
      'animation-duration',
      `${mediumDurationMs}ms`,
    );
  });

  it('should override default duration', () => {
    const { getByTestId } = render(
      <SlideIn duration={123} enterFrom="left">
        {(props) => <div data-testid="target" {...props} />}
      </SlideIn>,
    );

    expect(getByTestId('target')).toHaveStyleDeclaration(
      'animation-duration',
      '123ms',
    );
  });

  it('should slide in easing out', () => {
    const { getByTestId } = render(
      <SlideIn enterFrom="left">
        {(props) => <div data-testid="target" {...props} />}
      </SlideIn>,
    );

    expect(getByTestId('target')).toHaveStyleDeclaration(
      'animation-timing-function',
      easeOut,
    );
  });

  it('should slide out easing in', () => {
    const { getByTestId, rerender } = render(
      <ExitingPersistence>
        <SlideIn enterFrom="left">
          {(props) => <div data-testid="target" {...props} />}
        </SlideIn>
      </ExitingPersistence>,
    );

    rerender(<ExitingPersistence>{false}</ExitingPersistence>);

    expect(getByTestId('target')).toHaveStyleDeclaration(
      'animation-timing-function',
      easeIn,
    );
  });

  ['entering', 'exiting'].forEach((state) => {
    ['top', 'right', 'bottom', 'left'].forEach((from) => {
      ['none', 'in', 'out', 'inout'].forEach((fade) => {
        it(`should animate ${state} from ${from} with fade ${fade}`, () => {
          expect(
            slideInAnimation(
              from as Direction,
              state as Transition,
              fade as Fade,
            ),
          ).toMatchSnapshot();
        });
      });
    });
  });
});
