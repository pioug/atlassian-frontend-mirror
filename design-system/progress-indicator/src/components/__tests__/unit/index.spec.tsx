import React, { type FC } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { skipA11yAudit } from '@af/accessibility-testing';
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
			render(<ProgressDots testId="progress-dots" selectedIndex={0} values={values} />);

			values.forEach((_, index) => {
				expect(screen.getByTestId(`progress-dots-ind-${index}`)).toBeInTheDocument();
			});
		});

		describe('should accept an array of any value types', () => {
			it('should accept numbers', () => {
				render(<ProgressDots testId="progress-dots" selectedIndex={0} values={defaultValues} />);

				defaultValues.forEach((_, index) => {
					expect(screen.getByTestId(`progress-dots-ind-${index}`)).toBeInTheDocument();
				});
			});

			it('should accept objects', () => {
				const values = [{ key: 'value' }, { key: 'value' }, { key: 'value' }];
				render(<ProgressDots testId="progress-dots" selectedIndex={0} values={values} />);

				values.forEach((_, index) => {
					expect(screen.getByTestId(`progress-dots-ind-${index}`)).toBeInTheDocument();
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
				expect(screen.getByTestId(`progress-dots-ind-${i}`)).toBeInTheDocument();
			});
		});

		it('should return an <ButtonIndicator /> when specified', () => {
			render(<StubComponent onSelect={__noop} />);

			expect(screen.getAllByRole('tab')).toHaveLength(3);
			// skip should be removed once DSP-17664 is fixed
			// This will skip the a11y audit in after each
			skipA11yAudit();
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
			// skip should be removed once DSP-17664 is fixed
			// This will skip the a11y audit in after each
			skipA11yAudit();
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
			// skip should be removed once DSP-17664 is fixed
			// This will skip the a11y audit in after each
			skipA11yAudit();
		});

		it('should apply default aria-controls and aria-label props', () => {
			render(<StubComponent onSelect={__noop} />);

			expect(screen.getByRole('tablist')).toBeInTheDocument();

			const buttons = screen.getAllByRole('tab');

			expect(buttons[0]).toHaveAccessibleName('tab0');
			expect(buttons[0]).toHaveAttribute('aria-controls', 'panel0');
			// skip should be removed once DSP-17664 is fixed
			// This will skip the a11y audit in after each
			skipA11yAudit();
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

			expect(buttons[0]).toHaveAccessibleName('testAriaLabel0');
			expect(buttons[0]).toHaveAttribute('aria-controls', 'testAriaControls0');
			// skip should be removed once DSP-17664 is fixed
			// This will skip the a11y audit in after each
			skipA11yAudit();
		});

		it('should apply aria-selected prop to the selected button', () => {
			render(<StubComponent onSelect={__noop} />);

			expect(screen.getByRole('tablist')).toBeInTheDocument();

			const buttons = screen.getAllByRole('tab');

			expect(buttons[0]).toHaveAttribute('aria-selected', 'true');
			expect(buttons[1]).toHaveAttribute('aria-selected', 'false');
			// skip should be removed once DSP-17664 is fixed
			// This will skip the a11y audit in after each
			skipA11yAudit();
		});
	});

	it('should add tabIndex={-1} to selected dots only', () => {
		const values = ['one', 'two', 'three'];
		render(
			<div>
				<ProgressDots onSelect={__noop} testId="progress-dots" selectedIndex={0} values={values} />,
				<div id="panel0"></div>
				<div id="panel1"></div>
				<div id="panel2"></div>
			</div>,
		);

		expect(screen.getByTestId(`progress-dots-ind-0`)).toHaveAttribute('tabIndex', '-1');
		expect(screen.getByTestId(`progress-dots-ind-1`)).not.toHaveAttribute('tabIndex');
		expect(screen.getByTestId(`progress-dots-ind-2`)).not.toHaveAttribute('tabIndex');
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
