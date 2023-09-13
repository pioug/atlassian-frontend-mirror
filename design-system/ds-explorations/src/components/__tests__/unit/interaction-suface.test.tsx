import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import {
  UNSAFE_InteractionSurface as InteractionSurface,
  UNSAFE_Text as Text,
} from '../../../index';

describe('InteractionSurface component', () => {
  it('should render by itself', () => {
    const { getByTestId } = render(
      <InteractionSurface testId="basic">
        <></>
      </InteractionSurface>,
    );
    expect(getByTestId('basic')).toBeInTheDocument();
  });
  it('should render given a neutral hover interaction by default', () => {
    const { getByTestId } = render(
      <div style={{ position: 'relative' }}>
        <InteractionSurface testId="surface">hello</InteractionSurface>
      </div>,
    );

    const surfaceElement = getByTestId('surface');
    expect(getComputedStyle(surfaceElement).backgroundColor).toBe('');
    act(() => {
      fireEvent.mouseOver(surfaceElement);
      expect(surfaceElement).toHaveStyle(
        `background-color: ${token('color.background.neutral.bold.hovered')}`,
      );
    });
  });

  it('should render given a brand hover interaction by if set as brand', () => {
    const { getByTestId } = render(
      <div style={{ position: 'relative' }}>
        <InteractionSurface appearance="brand.bold" testId="surface">
          hello
        </InteractionSurface>
      </div>,
    );

    const surfaceElement = getByTestId('surface');
    expect(getComputedStyle(surfaceElement).backgroundColor).toBe('');
    act(() => {
      fireEvent.mouseOver(surfaceElement);
      expect(surfaceElement).toHaveStyle(
        `background-color: ${token('color.background.brand.bold.hovered')}`,
      );
    });
  });

  it('should render an inherited hover state if a Box context is present', () => {
    const { getByTestId } = render(
      <Box backgroundColor="color.background.brand.bold">
        <InteractionSurface testId="surface">
          <Text>hello</Text>
        </InteractionSurface>
      </Box>,
    );

    const surfaceElement = getByTestId('surface');
    expect(getComputedStyle(surfaceElement).backgroundColor).toBe('');
    act(() => {
      fireEvent.mouseOver(surfaceElement);
      expect(surfaceElement).toHaveStyle(
        `background-color: ${token('color.background.brand.bold.hovered')}`,
      );
    });
  });
});
