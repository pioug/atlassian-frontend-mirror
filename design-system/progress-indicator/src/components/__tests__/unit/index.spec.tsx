/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React, { FC } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import __noop from '@atlaskit/ds-lib/noop';

import ProgressDots from '../../progress-dots';

// NOTE: "StubComponent" saves duplicating required props; avoids errors in the logs
const StubComponent: FC<{ onSelect?: () => any }> = ({ onSelect }) => (
  <ProgressDots
    selectedIndex={0}
    values={['one', 'two', 'three']}
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
      render(
        <ProgressDots
          selectedIndex={0}
          values={['one', 'two', 'three', 'four', 'five']}
        />,
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('presentation')).toHaveLength(5);
    });

    describe('should accept an array of any value types', () => {
      it('should accept numbers', () => {
        render(<ProgressDots selectedIndex={0} values={[1, 2, 3]} />);

        expect(screen.getByRole('tablist')).toBeInTheDocument();
        expect(screen.getAllByRole('presentation')).toHaveLength(3);
      });

      it('should accept objects', () => {
        render(
          <ProgressDots
            selectedIndex={0}
            values={[{ key: 'value' }, { key: 'value' }, { key: 'value' }]}
          />,
        );

        expect(screen.getByRole('tablist')).toBeInTheDocument();
        expect(screen.getAllByRole('presentation')).toHaveLength(3);
      });
    });
  });

  describe('onSelect property', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return an <PresentationalIndicator /> when NOT specified', () => {
      render(<StubComponent />);

      expect(screen.getAllByRole('presentation')).toHaveLength(3);
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

      const progressDots = screen.getAllByRole('presentation');
      const firstDotSelected = progressDots[0];
      const secondDotNotSelected = progressDots[1];

      expect(firstDotSelected).toHaveStyle({
        backgroundColor: 'var(--ds-icon, #091E42)',
      });
      expect(secondDotNotSelected).toHaveStyle({
        backgroundColor: 'var(--ds-background-neutral, #C1C7D0)',
      });
    });
  });

  describe('aria attributes', () => {
    it('should apply default aria-controls and aria-label props', () => {
      render(<StubComponent onSelect={__noop} />);

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

      const buttons = screen.getAllByRole('tab');

      expect(buttons[0]).toHaveAttribute('aria-label', 'testAriaLabel0');
      expect(buttons[0]).toHaveAttribute('aria-controls', 'testAriaControls0');
    });

    it('should apply aria-selected prop to the selected button', () => {
      render(<StubComponent onSelect={__noop} />);

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
