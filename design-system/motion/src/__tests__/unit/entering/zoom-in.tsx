import React from 'react';

import { render } from '@testing-library/react';

import ExitingPersistence from '../../../entering/exiting-persistence';
import ZoomIn, {
  shrinkOutAnimation,
  zoomInAnimation,
} from '../../../entering/zoom-in';

jest.mock('../../../utils/accessibility');

describe('<ZoomIn />', () => {
  it('should default to medium duration', () => {
    const { getByTestId } = render(
      <ZoomIn>{(props) => <div data-testid="target" {...props} />}</ZoomIn>,
    );

    expect(getByTestId('target')).toHaveStyleDeclaration(
      'animation-duration',
      '125ms',
    );
  });

  it('should override default duration', () => {
    const { getByTestId } = render(
      <ZoomIn duration={123}>
        {(props) => <div data-testid="target" {...props} />}
      </ZoomIn>,
    );

    expect(getByTestId('target')).toHaveStyleDeclaration(
      'animation-duration',
      '123ms',
    );
  });

  it('should zoom in ease in out', () => {
    const { getByTestId } = render(
      <ZoomIn>{(props) => <div data-testid="target" {...props} />}</ZoomIn>,
    );

    expect(getByTestId('target')).toHaveStyleDeclaration(
      'animation-timing-function',
      'ease-in-out',
    );
  });

  it('should zoom out easing in out', () => {
    const { getByTestId, rerender } = render(
      <ExitingPersistence>
        <ZoomIn>{(props) => <div data-testid="target" {...props} />}</ZoomIn>
      </ExitingPersistence>,
    );

    rerender(<ExitingPersistence>{false}</ExitingPersistence>);

    expect(getByTestId('target')).toHaveStyleDeclaration(
      'animation-timing-function',
      'ease-in-out',
    );
  });

  it('should generate zoom in keyframes', () => {
    const keyframes = zoomInAnimation();

    expect(keyframes).toMatchInlineSnapshot(`
        Object {
          "0%": Object {
            "opacity": 0,
            "transform": "scale(0.5)",
          },
          "100%": Object {
            "transform": "scale(1)",
          },
          "50%": Object {
            "opacity": 1,
          },
          "75%": Object {
            "transform": "scale(1.25)",
          },
        }
    `);
  });

  it('should generate zoom away keyframes', () => {
    const keyframes = shrinkOutAnimation();

    expect(keyframes).toMatchInlineSnapshot(`
      Object {
        "to": Object {
          "opacity": 0,
          "transform": "scale(0.75)",
        },
      }
    `);
  });
});
