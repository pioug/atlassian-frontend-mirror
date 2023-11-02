import React, { FC } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import __noop from '@atlaskit/ds-lib/noop';

import ProgressDots from '../../progress-dots';

const defaultValues = ['one', 'two', 'three'];
// NOTE: "StubComponent" saves duplicating required props; avoids errors in the logs
const StubComponent: FC<{ onSelect?: () => any }> = ({ onSelect }) => (
  <ProgressDots
    selectedIndex={0}
    values={defaultValues}
    onSelect={onSelect}
    testId="progress-dots"
  />
);

describe('Progress Indicator', () => {
  it('should be possible to create a component', () => {
    render(<StubComponent />);

    expect(screen.getByTestId('progress-dots')).toBeInTheDocument();
  });

  describe('values property', () => {
    it('should render the correct number of indicators', () => {
      const values = ['one', 'two', 'three', 'four', 'five'];
      render(
        <ProgressDots
          testId="progress-dots"
          selectedIndex={0}
          values={values}
        />,
      );

      values.forEach((_, index) => {
        expect(
          screen.getByTestId(`progress-dots-ind-${index}`),
        ).toBeInTheDocument();
      });
    });

    describe('should accept an array of any value types', () => {
      it('should accept numbers', () => {
        render(
          <ProgressDots
            testId="progress-dots"
            selectedIndex={0}
            values={defaultValues}
          />,
        );

        defaultValues.forEach((_, index) => {
          expect(
            screen.getByTestId(`progress-dots-ind-${index}`),
          ).toBeInTheDocument();
        });
      });

      it('should accept objects', () => {
        const values = [{ key: 'value' }, { key: 'value' }, { key: 'value' }];
        render(
          <ProgressDots
            testId="progress-dots"
            selectedIndex={0}
            values={values}
          />,
        );

        values.forEach((_, index) => {
          expect(
            screen.getByTestId(`progress-dots-ind-${index}`),
          ).toBeInTheDocument();
        });
      });
    });
  });

  describe('onSelect property', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return an <PresentationalIndicator /> when NOT specified', () => {
      render(<StubComponent />);

      defaultValues.map((_, i) => {
        expect(
          screen.getByTestId(`progress-dots-ind-${i}`),
        ).toBeInTheDocument();
      });
    });

    it('should return an <ButtonIndicator /> when specified', () => {
      render(<StubComponent onSelect={__noop} />);

      expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('should call onSelect when pressed an indicator button', async () => {
      const onSelectMock = jest.fn();
      render(<StubComponent onSelect={onSelectMock} />);

      const buttons = screen.getAllByRole('tab');
      const firstButton = buttons[0];
      const user = userEvent.setup();

      await firstButton.focus();
      await userEvent.keyboard('{enter}');
      await waitFor(() => expect(onSelectMock).toHaveBeenCalledTimes(1));

      await user.click(firstButton);
      await waitFor(() => expect(onSelectMock).toHaveBeenCalledTimes(2));
    });
  });

  describe('selectedIndex property', () => {
    it('should return a "selected" <Indicator* /> at the correct index', () => {
      render(<StubComponent />);

      const firstDotSelected = screen.getByTestId('progress-dots-ind-0');
      const secondDotNotSelected = screen.getByTestId('progress-dots-ind-1');

      expect(firstDotSelected).toHaveStyle({
        backgroundColor: 'var(--ds-icon, #091E42)',
      });
      expect(secondDotNotSelected).toHaveStyle({
        backgroundColor: 'var(--ds-background-neutral, #C1C7D0)',
      });
    });
  });

  describe('aria attributes', () => {
    it('should not apply role=tablist when not interactive', () => {
      render(<StubComponent />);

      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    });

    it('should apply role=tablist when interactive with onSelect', () => {
      render(<StubComponent onSelect={__noop} />);

      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should apply default aria-controls and aria-label props', () => {
      render(<StubComponent onSelect={__noop} />);

      expect(screen.getByRole('tablist')).toBeInTheDocument();

      const buttons = screen.getAllByRole('tab');

      expect(buttons[0]).toHaveAttribute('aria-label', 'tab0');
      expect(buttons[0]).toHaveAttribute('aria-controls', 'panel0');
    });

    it('should apply provided aria-controls and aria-label props', () => {
      render(
        <ProgressDots
          selectedIndex={0}
          values={[{ key: 'value' }, { key: 'value' }, { key: 'value' }]}
          ariaControls="testAriaControls"
          ariaLabel="testAriaLabel"
          onSelect={__noop}
        />,
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();

      const buttons = screen.getAllByRole('tab');

      expect(buttons[0]).toHaveAttribute('aria-label', 'testAriaLabel0');
      expect(buttons[0]).toHaveAttribute('aria-controls', 'testAriaControls0');
    });

    it('should apply aria-selected prop to the selected button', () => {
      render(<StubComponent onSelect={__noop} />);

      expect(screen.getByRole('tablist')).toBeInTheDocument();

      const buttons = screen.getAllByRole('tab');

      expect(buttons[0]).toHaveAttribute('aria-selected', 'true');
      expect(buttons[1]).toHaveAttribute('aria-selected', 'false');
    });
  });
});

describe('ProgressDotsWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    (global.console.warn as jest.Mock).mockRestore();
    (global.console.error as jest.Mock).mockRestore();
  });
});
