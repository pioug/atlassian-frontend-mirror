import React from 'react';

import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { bind } from 'bind-event-listener';

import { Box } from '@atlaskit/primitives/compiled';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import FlagGroup from '../../flag-group';
import Flag from '../../index';
import { type FlagProps } from '../../types';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('FlagGroup', () => {
	const generateFlag = (extraProps?: Partial<FlagProps>) => (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		<Flag id={''} icon={<Box />} title="Flag" {...extraProps} />
	);

	beforeEach(() => {
		jest.useFakeTimers();
	});
	afterEach(() => {
		jest.useRealTimers();
	});

	it('should render Flag children in the correct place', () => {
		const { rerender } = render(
			<FlagGroup>
				{generateFlag({ testId: '0' })}
				{generateFlag({ testId: '1' })}
				{generateFlag({ testId: '2' })}
			</FlagGroup>,
		);

		expect(screen.getByTestId('0')).toBeInTheDocument();
		/* eslint-disable testing-library/no-node-access */
		const flag1Container = screen.getByTestId('1').parentElement;
		const flag2Container = screen.getByTestId('2').parentElement;
		if (flag1Container === null || flag2Container === null) {
			throw Error('Flag 1 and 1 missing container');
		}

		rerender(
			<FlagGroup>
				{generateFlag({ testId: '0' })}
				{generateFlag({ testId: '1' })}
				{generateFlag({ testId: '2' })}
			</FlagGroup>,
		);

		const flag1ContainerStyle = window.getComputedStyle(flag1Container);
		expect(flag1ContainerStyle.transform).toBe('translateX(0) translateY(100%) translateY(1pc)');

		const flag2ContainerStyle = window.getComputedStyle(flag2Container);
		expect(flag2ContainerStyle.transform).toBe('translateX(0) translateY(100%) translateY(1pc)');
	});

	it('should render FlagGroup in direct parent when shouldRenderToParent is true', () => {
		render(
			<Box role="dialog" aria-modal aria-label="flag-group">
				<FlagGroup shouldRenderToParent>
					{generateFlag({ testId: '0' })}
					{generateFlag({ testId: '1' })}
					{generateFlag({ testId: '2' })}
				</FlagGroup>
			</Box>,
		);

		const dialog = screen.getByRole('dialog');
		const flags = screen.getAllByRole('alert');
		expect(within(dialog).getAllByRole('alert')).toHaveLength(flags.length);
	});

	it('should allow falsy children', () => {
		expect(() => {
			render(<FlagGroup>{null}</FlagGroup>);
			render(<FlagGroup>{false}</FlagGroup>);
			render(<FlagGroup>{[]}</FlagGroup>);
		}).not.toThrow();
	});

	it('should move Flag children up when dismissed', () => {
		const spy = jest.fn();
		const { rerender } = render(
			<FlagGroup onDismissed={spy}>
				{generateFlag({ testId: '0', id: '0' })}
				{generateFlag({ testId: '1', id: '2' })}
				{generateFlag({ testId: '2', id: '2' })}
			</FlagGroup>,
		);

		rerender(
			<FlagGroup onDismissed={spy}>
				{generateFlag({ testId: '1', id: '2' })}
				{generateFlag({ testId: '2', id: '2' })}
			</FlagGroup>,
		);

		act(() => {
			jest.runAllTimers();
		});
		expect(screen.queryByTestId('0')).not.toBeInTheDocument();
		const flag1Container = screen.getByTestId('1').parentElement;
		const flag2Container = screen.getByTestId('2').parentElement;
		if (flag1Container === null || flag2Container === null) {
			throw Error('Flag 1 or 2 missing container');
		}

		rerender(
			<FlagGroup onDismissed={spy}>
				{generateFlag({ testId: '1', id: '2' })}
				{generateFlag({ testId: '2', id: '2' })}
			</FlagGroup>,
		);

		expect(window.getComputedStyle(flag1Container).transform).toBe('translate(0,0)');
		expect(window.getComputedStyle(flag2Container).transform).toBe(
			'translateX(0) translateY(100%) translateY(1pc)',
		);
		expect(window.getComputedStyle(flag2Container).visibility).toBe('visible');
	});

	it('should move Flag children down when new flag is added', () => {
		const spy = jest.fn();
		const { rerender } = render(
			<FlagGroup onDismissed={spy}>
				{generateFlag({ testId: '1', id: '1' })}
				{generateFlag({ testId: '2', id: '2' })}
			</FlagGroup>,
		);

		rerender(
			<FlagGroup onDismissed={spy}>
				{generateFlag({ testId: '0', id: '0' })}
				{generateFlag({ testId: '1', id: '2' })}
				{generateFlag({ testId: '2', id: '2' })}
			</FlagGroup>,
		);

		act(() => {
			jest.runAllTimers();
		});

		const flag0Container = screen.getByTestId('0').parentElement;
		const flag1Container = screen.getByTestId('1').parentElement;
		const flag2Container = screen.getByTestId('2').parentElement;
		if (flag0Container === null || flag1Container === null || flag2Container === null) {
			throw Error('Flag 0, 1 or 2 missing container');
		}

		expect(flag0Container).toHaveCompiledCss('transform', 'translate(0,0)');
		expect(flag1Container).toHaveCompiledCss(
			'transform',
			'translateX(0) translateY(100%) translateY(1pc)',
		);
		expect(flag2Container).toHaveCompiledCss(
			'transform',
			'translateX(0) translateY(100%) translateY(1pc)',
		);
	});

	it('onDismissed provided by FlagGroup should be called when child Flag is dismissed', () => {
		const spy = jest.fn();
		render(
			<FlagGroup onDismissed={spy}>
				{generateFlag({
					id: 'a',
					testId: 'a',
				})}
				{generateFlag({ id: 'b' })}
			</FlagGroup>,
		);

		fireEvent.click(screen.getByTestId('a-dismiss'));
		act(() => {
			jest.runAllTimers();
		});

		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith('a', expect.anything());
	});

	it('onDismissed provided by Flag should be called when child Flag is dismissed', () => {
		const spy = jest.fn();
		render(
			<FlagGroup>
				{generateFlag({
					id: 'a',
					testId: 'a',
					onDismissed: spy,
				})}
				{generateFlag({ id: 'b' })}
			</FlagGroup>,
		);

		fireEvent.click(screen.getByTestId('a-dismiss'));
		act(() => {
			jest.runAllTimers();
		});

		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith('a', expect.anything());
	});

	it('onDismissed provided by Flag and FlagGroup should be called when child Flag is dismissed', () => {
		const flagGroupSpy = jest.fn();
		const flagSpy = jest.fn();
		render(
			<FlagGroup onDismissed={flagGroupSpy}>
				{generateFlag({
					id: 'a',
					testId: 'a',
					onDismissed: flagSpy,
				})}
				{generateFlag({ id: 'b' })}
			</FlagGroup>,
		);

		fireEvent.click(screen.getByTestId('a-dismiss'));
		act(() => {
			jest.runAllTimers();
		});

		expect(flagGroupSpy).toHaveBeenCalledTimes(1);
		expect(flagGroupSpy).toHaveBeenCalledWith('a', expect.anything());

		expect(flagSpy).toHaveBeenCalledTimes(1);
		expect(flagSpy).toHaveBeenCalledWith('a', expect.anything());
	});

	it('should call onDismissed of the first flag and not the second when the first is dismissed', () => {
		const flagASpy = jest.fn();
		const flagBSpy = jest.fn();
		render(
			<FlagGroup>
				{generateFlag({
					id: 'a',
					testId: 'a',
					onDismissed: flagASpy,
				})}
				{generateFlag({ id: 'b', onDismissed: flagBSpy })}
			</FlagGroup>,
		);

		fireEvent.click(screen.getByTestId('a-dismiss'));
		act(() => {
			jest.runAllTimers();
		});

		expect(flagASpy).toHaveBeenCalledTimes(1);
		expect(flagASpy).toHaveBeenCalledWith('a', expect.anything());

		expect(flagBSpy).not.toHaveBeenCalled();
	});

	it('onDismissed provided by Flag should be called when child Flag wrapped within another component and dismissed', () => {
		const spy = jest.fn();
		render(
			<FlagGroup>
				<Box>
					{generateFlag({
						id: 'a',
						testId: 'a',
						onDismissed: spy,
					})}
				</Box>
				<Box>{generateFlag({ id: 'b' })}</Box>
			</FlagGroup>,
		);

		fireEvent.click(screen.getByTestId('a-dismiss'));
		act(() => {
			jest.runAllTimers();
		});

		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith('a', expect.anything());
	});

	it('should render screen reader text only when FlagGroup has children', () => {
		render(<FlagGroup>{generateFlag()}</FlagGroup>);
		expect(screen.getByText('Flag notifications')).toBeInTheDocument();
	});

	it("should not render screen reader text when FlagGroup doesn't have children", () => {
		render(<FlagGroup></FlagGroup>);
		expect(screen.queryByText('Flag notifications')).not.toBeInTheDocument();
	});

	it('should render custom screen reader text and tag from props', () => {
		render(
			<FlagGroup label="notifs" labelTag="h3">
				{generateFlag()}
			</FlagGroup>,
		);
		const screenReaderText = screen.getByText('notifs');
		expect(screenReaderText.nodeName).toBe('H3');
	});

	it('should render an id attribute when provided', () => {
		render(<FlagGroup id="my-unique-flag-group-id">{generateFlag()}</FlagGroup>);
		/**
		 * @testing-library/react doesn't have any good mechanisms for querying
		 * elements by ID, so use the `document` method instead. Note that
		 * `baseElement.querySelector` would also work, but `container.querySelector`
		 * would not, because the result is rendered in a Portal.
		 */
		const flagGroupContainer = document.getElementById('my-unique-flag-group-id');
		expect(flagGroupContainer?.nodeName).toBe('DIV');
	});

	// JRACLOUD-97876 — keyboard-only / AT users must be able to dismiss the
	// topmost flag without tabbing through the entire page.
	describe('keyboard dismiss (Escape)', () => {
		ffTest.on('platform_dst_flag_keyboard_dismiss', 'when keyboard dismiss FF is on', () => {
			it('dismisses the first (topmost) flag when Escape is pressed', () => {
				const onDismissed = jest.fn();
				render(
					<FlagGroup onDismissed={onDismissed}>
						{generateFlag({ id: 'a', testId: 'a' })}
						{generateFlag({ id: 'b' })}
					</FlagGroup>,
				);

				fireEvent.keyDown(document, { key: 'Escape' });
				act(() => {
					jest.runAllTimers();
				});

				expect(onDismissed).toHaveBeenCalledTimes(1);
				expect(onDismissed).toHaveBeenCalledWith('a', expect.anything());
			});

			it('does not dismiss when there are no flags', () => {
				const onDismissed = jest.fn();
				render(<FlagGroup onDismissed={onDismissed}>{null}</FlagGroup>);

				fireEvent.keyDown(document, { key: 'Escape' });

				expect(onDismissed).not.toHaveBeenCalled();
			});

			it('ignores non-Escape keys', () => {
				const onDismissed = jest.fn();
				render(
					<FlagGroup onDismissed={onDismissed}>{generateFlag({ id: 'a', testId: 'a' })}</FlagGroup>,
				);

				fireEvent.keyDown(document, { key: 'Enter' });
				fireEvent.keyDown(document, { key: 'a' });

				expect(onDismissed).not.toHaveBeenCalled();
			});

			it('only dismisses the first flag at a time (subsequent Escape presses dismiss the next topmost)', () => {
				const onDismissed = jest.fn();
				const { rerender } = render(
					<FlagGroup onDismissed={onDismissed}>
						{generateFlag({ id: 'a', testId: 'a' })}
						{generateFlag({ id: 'b', testId: 'b' })}
					</FlagGroup>,
				);

				fireEvent.keyDown(document, { key: 'Escape' });
				expect(onDismissed).toHaveBeenLastCalledWith('a', expect.anything());

				// Simulate the consumer removing the first flag in response to onDismissed.
				rerender(
					<FlagGroup onDismissed={onDismissed}>{generateFlag({ id: 'b', testId: 'b' })}</FlagGroup>,
				);

				fireEvent.keyDown(document, { key: 'Escape' });
				expect(onDismissed).toHaveBeenLastCalledWith('b', expect.anything());
				expect(onDismissed).toHaveBeenCalledTimes(2);
			});

			it('mentions the Escape shortcut in the visually-hidden screen reader label', () => {
				render(<FlagGroup>{generateFlag({ id: 'a' })}</FlagGroup>);

				expect(
					screen.getByText('Flag notifications. Press Escape to dismiss.'),
				).toBeInTheDocument();
			});

			it('does not respond to Escape after the flag group unmounts', () => {
				const onDismissed = jest.fn();
				const { unmount } = render(
					<FlagGroup onDismissed={onDismissed}>{generateFlag({ id: 'a', testId: 'a' })}</FlagGroup>,
				);

				unmount();
				fireEvent.keyDown(document, { key: 'Escape' });

				expect(onDismissed).not.toHaveBeenCalled();
			});

			it('ignores Escape when a capture-phase listener has called preventDefault (e.g. a modal)', () => {
				const onDismissed = jest.fn();
				render(
					<FlagGroup onDismissed={onDismissed}>{generateFlag({ id: 'a', testId: 'a' })}</FlagGroup>,
				);

				// Simulate an outer handler (e.g. a modal) consuming the Escape key
				// before it bubbles up to the document-level FlagGroup listener.
				const unbind = bind(document, {
					type: 'keydown',
					listener: (event: KeyboardEvent) => {
						if (event.key === 'Escape') {
							event.preventDefault();
						}
					},
					options: { capture: true },
				});

				try {
					fireEvent.keyDown(document, { key: 'Escape' });
				} finally {
					unbind();
				}

				expect(onDismissed).not.toHaveBeenCalled();
			});

			it('does not dismiss the flag when a modal also has an Escape listener and the modal listener fires first', () => {
				// JRACLOUD-97876: Verify FlagGroup + modal Escape coexistence.
				// When a modal's capture-phase Escape handler runs and calls
				// preventDefault, the FlagGroup should leave flags untouched so
				// both components remain independent.
				const onDismissed = jest.fn();
				const onModalClose = jest.fn();

				// Simulate a modal that closes itself on Escape (capture phase)
				// and prevents the event from reaching the FlagGroup.
				const unbind = bind(document, {
					type: 'keydown',
					listener: (event: KeyboardEvent) => {
						if (event.key === 'Escape') {
							event.preventDefault();
							onModalClose();
						}
					},
					options: { capture: true },
				});

				render(
					<FlagGroup onDismissed={onDismissed}>{generateFlag({ id: 'a', testId: 'a' })}</FlagGroup>,
				);

				try {
					fireEvent.keyDown(document, { key: 'Escape' });
				} finally {
					unbind();
				}

				// The modal closes…
				expect(onModalClose).toHaveBeenCalledTimes(1);
				// …but the flag is NOT dismissed.
				expect(onDismissed).not.toHaveBeenCalled();
			});
		});

		ffTest.off('platform_dst_flag_keyboard_dismiss', 'when keyboard dismiss FF is off', () => {
			it('does not dismiss any flag when Escape is pressed', () => {
				const onDismissed = jest.fn();
				render(
					<FlagGroup onDismissed={onDismissed}>{generateFlag({ id: 'a', testId: 'a' })}</FlagGroup>,
				);

				fireEvent.keyDown(document, { key: 'Escape' });
				act(() => {
					jest.runAllTimers();
				});

				expect(onDismissed).not.toHaveBeenCalled();
			});

			it('keeps the original screen reader label', () => {
				render(<FlagGroup>{generateFlag({ id: 'a' })}</FlagGroup>);

				expect(screen.getByText('Flag notifications')).toBeInTheDocument();
			});
		});
	});
});
