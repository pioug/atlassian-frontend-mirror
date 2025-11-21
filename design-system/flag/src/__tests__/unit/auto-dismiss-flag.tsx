import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { Box } from '@atlaskit/primitives/compiled';

import { AUTO_DISMISS_SECONDS } from '../../auto-dismiss-flag';
import { AutoDismissFlag, FlagGroup } from '../../index';
import { type AutoDismissFlagProps } from '../../types';

describe('Auto dismiss flag', () => {
	// Helper function to generate <AutoDismissFlag /> with base required props
	const generateAutoDismissFlag = (
		extraProps?: Partial<AutoDismissFlagProps>,
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	) => <AutoDismissFlag id="" icon={<Box />} title="Flag" {...extraProps} />;

	describe('AutoDismissFlag', () => {
		it('should render a <Flag />', () => {
			render(generateAutoDismissFlag());
			expect(screen.getByText('Flag')).toBeInTheDocument();
		});

		describe('timer tests', () => {
			const runTimer = (seconds: number = AUTO_DISMISS_SECONDS) =>
				act(() => {
					jest.advanceTimersByTime(seconds * 1000);
				});

			beforeEach(() => {
				jest.useFakeTimers();
			});

			afterEach(() => {
				jest.useRealTimers();
			});

			it('should auto dismiss after 8 seconds', () => {
				const onDismissedSpy = jest.fn();
				render(<FlagGroup onDismissed={onDismissedSpy}>{generateAutoDismissFlag()}</FlagGroup>);
				expect(onDismissedSpy).not.toBeCalled();
				runTimer();
				expect(onDismissedSpy).toBeCalled();
			});

			it('should auto dismiss first flag after 8 seconds if there are 2 AutoDismissFlags', () => {
				const onDismissedSpy = jest.fn();
				render(
					<FlagGroup onDismissed={onDismissedSpy}>
						{generateAutoDismissFlag({ id: '0' })}
						{generateAutoDismissFlag({ id: '1' })}
					</FlagGroup>,
				);
				expect(onDismissedSpy).not.toBeCalled();
				runTimer();
				expect(onDismissedSpy).toBeCalledWith('0', expect.anything());
			});

			it.skip('should auto dismiss second flag after 16 seconds if there are 2 AutoDismissFlags', () => {
				const onDismissedSpy = jest.fn();
				const { rerender } = render(
					<FlagGroup onDismissed={onDismissedSpy}>
						{generateAutoDismissFlag({ id: '0' })}
						{generateAutoDismissFlag({ id: '1' })}
					</FlagGroup>,
				);
				expect(onDismissedSpy).not.toBeCalled();
				runTimer();
				rerender(
					<FlagGroup onDismissed={onDismissedSpy}>
						{generateAutoDismissFlag({ id: '1' })}
					</FlagGroup>,
				);
				runTimer();
				expect(onDismissedSpy).toBeCalledWith('1', expect.anything());
			});

			it('should not dismiss after 8 seconds if another flag is added', () => {
				const onDismissedSpy = jest.fn();
				const { rerender } = render(
					<FlagGroup onDismissed={onDismissedSpy}>
						{generateAutoDismissFlag({ id: '1' })}
					</FlagGroup>,
				);
				act(() => {
					jest.advanceTimersByTime((AUTO_DISMISS_SECONDS / 2) * 1000);
				});
				rerender(
					<FlagGroup onDismissed={onDismissedSpy}>
						{generateAutoDismissFlag({ id: '0' })}
						{generateAutoDismissFlag({ id: '1' })}
					</FlagGroup>,
				);
				act(() => {
					jest.advanceTimersByTime((AUTO_DISMISS_SECONDS / 2) * 1000);
				});
				expect(onDismissedSpy).not.toBeCalled();
			});

			it('should pause the dismiss timer on Flag mouseover, and resume on mouseout', () => {
				const onDismissedSpy = jest.fn();
				render(
					<FlagGroup onDismissed={onDismissedSpy}>
						{generateAutoDismissFlag({ testId: 'autodismiss-flag' })}
					</FlagGroup>,
				);
				const flag = screen.getByTestId('autodismiss-flag');
				fireEvent.mouseOver(flag);
				runTimer();
				expect(onDismissedSpy).not.toBeCalled();
				fireEvent.mouseOut(flag);
				runTimer();
				expect(onDismissedSpy).toBeCalled();
			});

			it('should pause the dismiss timer on Flag focus, and resume on blur', () => {
				const onDismissedSpy = jest.fn();
				render(
					<FlagGroup onDismissed={onDismissedSpy}>
						{generateAutoDismissFlag({ testId: 'autodismiss-flag' })}
					</FlagGroup>,
				);
				const flag = screen.getByTestId('autodismiss-flag');
				fireEvent.focus(flag);
				runTimer();
				expect(onDismissedSpy).not.toBeCalled();
				fireEvent.blur(flag);
				runTimer();
				expect(onDismissedSpy).toBeCalled();
			});

			it('should auto dismiss after 8 seconds and call onDismissed on the flag', () => {
				const onDismissedSpy = jest.fn();

				render(<FlagGroup>{generateAutoDismissFlag({ onDismissed: onDismissedSpy })}</FlagGroup>);
				expect(onDismissedSpy).not.toBeCalled();
				runTimer();
				expect(onDismissedSpy).toBeCalled();
			});

			it('should auto dismiss after 8 seconds and call onDismissed on the flag and the flag group', () => {
				const onDismissedSpy = jest.fn();
				const onDismissedFlagSpy = jest.fn();

				render(
					<FlagGroup onDismissed={onDismissedSpy}>
						{generateAutoDismissFlag({ onDismissed: onDismissedFlagSpy })}
					</FlagGroup>,
				);
				expect(onDismissedSpy).not.toBeCalled();
				expect(onDismissedFlagSpy).not.toBeCalled();

				runTimer();
				expect(onDismissedSpy).toBeCalled();
				expect(onDismissedFlagSpy).toBeCalled();
			});

			it('onDismissed provided by FlagGroup should be called when AutoDismissFlag is wrapped in another component', () => {
				const onDismissedSpy = jest.fn();
				const FlagWrapper = () => generateAutoDismissFlag();

				render(
					<FlagGroup onDismissed={onDismissedSpy}>
						<FlagWrapper />
					</FlagGroup>,
				);

				act(() => {
					jest.advanceTimersByTime(AUTO_DISMISS_SECONDS * 1000);
				});
				expect(onDismissedSpy).toBeCalled();
			});

			it('only the first flag in FlagGroup should be dismissed after 8 seconds (when the flag is wrapped in another component)', () => {
				const onDismissedSpy = jest.fn();
				const onDismissedFirstFlagSpy = jest.fn();
				const onDismissedSecondFlagSpy = jest.fn();

				// render two autodismiss flags wrapped inside of another component
				const { rerender } = render(
					<FlagGroup onDismissed={onDismissedSpy}>
						<Box>
							{generateAutoDismissFlag({
								id: '0',
								onDismissed: onDismissedFirstFlagSpy,
							})}
						</Box>
						<Box>
							{generateAutoDismissFlag({
								id: '1',
								onDismissed: onDismissedSecondFlagSpy,
							})}
						</Box>
					</FlagGroup>,
				);

				expect(onDismissedFirstFlagSpy).not.toBeCalled();
				expect(onDismissedSecondFlagSpy).not.toBeCalled();
				runTimer();
				expect(onDismissedFirstFlagSpy).toBeCalled();
				expect(onDismissedSecondFlagSpy).not.toBeCalled();

				rerender(
					<FlagGroup>
						<Box>
							{generateAutoDismissFlag({
								id: '1',
								onDismissed: onDismissedSecondFlagSpy,
							})}
						</Box>
					</FlagGroup>,
				);
			});

			it('should allow for custom auto-dismiss duration', () => {
				const onDismissedSpy = jest.fn();
				render(
					<FlagGroup onDismissed={onDismissedSpy}>
						{generateAutoDismissFlag({
							autoDismissSeconds: 16,
						})}
					</FlagGroup>,
				);
				expect(onDismissedSpy).not.toBeCalled();
				runTimer(16);
				expect(onDismissedSpy).toBeCalled();
			});
		});
	});
});
