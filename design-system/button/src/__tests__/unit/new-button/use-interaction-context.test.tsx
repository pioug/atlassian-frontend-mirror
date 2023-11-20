import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import type { InteractionContextType } from '@atlaskit/interaction-context';
// eslint-disable-next-line no-duplicate-imports
import InteractionContext from '@atlaskit/interaction-context';

import variants from '../../../utils/variants';

const mockTraceInteraction = jest.fn();
const mockHold = jest.fn();
const mockOnClick = jest.fn();

const context: InteractionContextType = {
  hold: mockHold,
  tracePress: mockTraceInteraction,
};

variants.forEach(({ name, Component }) => {
  describe(`${name} press-tracing`, () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should call click handler when context is not present', () => {
      render(
        <Component onClick={mockOnClick} testId={name}>
          Button
        </Component>,
      );

      fireEvent.click(screen.getByTestId(name));

      expect(mockTraceInteraction).not.toHaveBeenCalled();
      expect(mockOnClick).toHaveBeenCalled();
    });

    it('should call click handler even when interactionName is not present', () => {
      render(
        <InteractionContext.Provider value={context}>
          <Component onClick={mockOnClick} testId={name}>
            Button
          </Component>
        </InteractionContext.Provider>,
      );

      fireEvent.click(screen.getByTestId(name));

      expect(mockTraceInteraction).toHaveBeenCalled();
      expect(mockOnClick).toHaveBeenCalled();
    });

    it('should not throw error when no click handler exists', () => {
      render(<Component testId={name}>Button</Component>);

      expect(() => {
        fireEvent.click(screen.getByTestId(name));
      }).not.toThrow();
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should trace button press with interactionName', () => {
      const interactionName = 'ufo.event';
      render(
        <InteractionContext.Provider value={context}>
          <Component
            onClick={mockOnClick}
            testId={name}
            interactionName={interactionName}
          >
            Button
          </Component>
        </InteractionContext.Provider>,
      );

      fireEvent.click(screen.getByTestId(name));

      expect(mockTraceInteraction).toHaveBeenCalled();
      expect(mockTraceInteraction).toHaveBeenCalledWith(
        interactionName,
        expect.any(Number),
      );
      expect(mockOnClick).toHaveBeenCalled();
    });
  });
});
