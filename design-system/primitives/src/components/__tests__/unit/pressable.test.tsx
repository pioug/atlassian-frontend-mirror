import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { xcss } from '../../../xcss/xcss';
import Pressable from '../../pressable';

const testId = 'test-pressable';
const styles = xcss({
	backgroundColor: 'color.background.brand.bold',
	padding: 'space.100',
	paddingBlock: 'space.100',
	paddingBlockStart: 'space.100',
	paddingBlockEnd: 'space.100',
	paddingInline: 'space.100',
	paddingInlineStart: 'space.100',
	paddingInlineEnd: 'space.100',
});

const pressableStyles = xcss({
	textTransform: 'uppercase',
});

describe('Pressable', () => {
	it('should render with a given test id', () => {
		render(<Pressable testId={testId}>Pressable with testid</Pressable>);

		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});

	it('should render a <button>', () => {
		render(<Pressable testId={testId}>Pressable</Pressable>);
		expect(screen.getByTestId(testId).nodeName).toEqual('BUTTON');
	});

	it('should be type `button` by default', () => {
		render(<Pressable testId={testId}>Pressable</Pressable>);
		expect(screen.getByTestId(testId)).toHaveAttribute('type', 'button');
	});

	it('should allow default type to be overridden', () => {
		render(
			<Pressable testId={testId} type="submit">
				Pressable
			</Pressable>,
		);
		expect(screen.getByTestId(testId)).toHaveAttribute('type', 'submit');
	});

	it('should render plain text as children', () => {
		render(<Pressable testId={testId}>Pressable text</Pressable>);
		const element = screen.getByText('Pressable text');
		expect(element).toBeInTheDocument();
	});

	it('should render children', () => {
		render(
			<Pressable testId={testId}>
				<span data-testid="test-pressable-child">Pressable children</span>
			</Pressable>,
		);
		const parent = screen.getByTestId(testId);
		expect(parent).toBeInTheDocument();
		const child = screen.getByTestId('test-pressable-child');
		expect(child).toBeInTheDocument();
	});

	it('should apply aria attributes', () => {
		render(
			<>
				<Pressable
					testId={testId}
					aria-label="Read the Atlassian Design System documentation"
					aria-labelledby="foo"
					role="tab"
					aria-selected="true"
					aria-controls="tabpanel-id"
				>
					Pressable
				</Pressable>
				<div id="tabpanel-id">Tab panel</div>
			</>,
		);
		const pressable = screen.getByTestId(testId);
		expect(pressable).toHaveAttribute(
			'aria-label',
			'Read the Atlassian Design System documentation',
		);
		expect(pressable).toHaveAttribute('aria-labelledby', 'foo');
		expect(pressable).toHaveAttribute('aria-selected', 'true');
		expect(pressable).toHaveAttribute('aria-controls', 'tabpanel-id');
		expect(pressable).toHaveAttribute('role', 'tab');
	});

	it('should apply data attributes', () => {
		render(
			<Pressable testId={testId} data-test="foo">
				Pressable
			</Pressable>,
		);
		expect(screen.getByTestId(testId)).toHaveAttribute('data-test', 'foo');
	});

	describe('`isDisabled` prop', () => {
		it('should disable the button', () => {
			render(
				<Pressable testId={testId} isDisabled>
					Disabled
				</Pressable>,
			);
			expect(screen.getByTestId(testId)).toBeDisabled();
		});

		it('should add not-allowed cursor', () => {
			render(
				<Pressable testId={testId} isDisabled>
					Pressable
				</Pressable>,
			);

			const styles = getComputedStyle(screen.getByTestId(testId));
			expect(styles.getPropertyValue('cursor')).toBe('not-allowed');
		});
	});

	it('should call click handler when present', () => {
		const mockOnClick = jest.fn();

		render(
			<Pressable testId={testId} onClick={mockOnClick}>
				Click me
			</Pressable>,
		);

		fireEvent.click(screen.getByTestId(testId));

		expect(mockOnClick).toHaveBeenCalled();
	});

	describe('styles', () => {
		it('should apply styles with `xcss`', () => {
			render(
				<Pressable testId={testId} xcss={pressableStyles}>
					Pressable with xcss styles
				</Pressable>,
			);

			const styles = getComputedStyle(screen.getByTestId(testId));
			expect(styles.getPropertyValue('text-transform')).toBe('uppercase');
		});

		test('`xcss` should result in expected css', () => {
			render(
				<Pressable
					testId={testId}
					backgroundColor="elevation.surface"
					padding="space.0"
					paddingBlock="space.0"
					paddingBlockStart="space.0"
					paddingBlockEnd="space.0"
					paddingInline="space.0"
					paddingInlineStart="space.0"
					paddingInlineEnd="space.0"
					xcss={styles}
				>
					child
				</Pressable>,
			);
			const element = screen.getByTestId(testId);
			expect(element).toBeInTheDocument();

			expect(element).toHaveCompiledCss({
				// Every value in here overrides the props values
				// eg. `props.padding="space.0"` is overridden by `xcss.padding: 'space.100'`
				backgroundColor: 'var(--ds-surface, #FFFFFF)',
				padding: 'var(--ds-space-100, 8px)',
				paddingBlock: 'var(--ds-space-100, 8px)',
				paddingBlockStart: 'var(--ds-space-100, 8px)',
				paddingBlockEnd: 'var(--ds-space-100, 8px)',
				paddingInline: 'var(--ds-space-100, 8px)',
				paddingInlineStart: 'var(--ds-space-100, 8px)',
				paddingInlineEnd: 'var(--ds-space-100, 8px)',
			});
		});

		it('should apply styles with `style`', () => {
			render(
				<Pressable
					testId={testId}
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						textTransform: 'uppercase',
					}}
				>
					Pressable with inline styles
				</Pressable>,
			);

			const styles = getComputedStyle(screen.getByTestId(testId));
			expect(styles.getPropertyValue('text-transform')).toBe('uppercase');
		});

		it('should have critical default styles', () => {
			render(<Pressable testId={testId}>Pressable</Pressable>);

			const styles = getComputedStyle(screen.getByTestId(testId));
			expect(styles.getPropertyValue('border')).toBe('');
			expect(styles.getPropertyValue('appearance')).toBe('none');
			expect(styles.getPropertyValue('cursor')).toBe('pointer');
		});
	});

	describe('analytics', () => {
		const packageName = process.env._PACKAGE_NAME_ as string;
		const packageVersion = process.env._PACKAGE_VERSION_ as string;

		it('should fire an event on the public channel and the internal channel', () => {
			const onPublicEvent = jest.fn();
			const onAtlaskitEvent = jest.fn();
			function WithBoth() {
				return (
					<AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
						<AnalyticsListener onEvent={onPublicEvent}>
							<Pressable
								testId={testId}
								onClick={(event, analyticsEvent) => {
									analyticsEvent.fire();
								}}
							>
								Pressable
							</Pressable>
						</AnalyticsListener>
					</AnalyticsListener>
				);
			}
			render(<WithBoth />);

			const pressable = screen.getByTestId(testId);

			fireEvent.click(pressable);

			const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
				payload: {
					action: 'clicked',
					actionSubject: 'button',
					attributes: {
						componentName: 'Pressable',
						packageName,
						packageVersion,
					},
				},
				context: [
					{
						componentName: 'Pressable',
						packageName,
						packageVersion,
					},
				],
			});

			function assert(eventMock: jest.Mock<any, any>) {
				expect(eventMock).toHaveBeenCalledTimes(1);
				expect(eventMock.mock.calls[0][0].payload).toEqual(expected.payload);
				expect(eventMock.mock.calls[0][0].context).toEqual(expected.context);
			}
			assert(onPublicEvent);
			assert(onAtlaskitEvent);
		});

		it('should allow the addition of additional context', () => {
			function App({
				onEvent,
				channel,
				analyticsContext,
			}: {
				onEvent: (...args: any[]) => void;
				channel: string | undefined;
				analyticsContext?: Record<string, any>;
			}) {
				return (
					<AnalyticsListener onEvent={onEvent} channel={channel}>
						<Pressable
							testId={testId}
							analyticsContext={analyticsContext}
							onClick={(event, analyticsEvent) => {
								analyticsEvent.fire();
							}}
						>
							Pressable
						</Pressable>
					</AnalyticsListener>
				);
			}

			const onEvent = jest.fn();
			const extraContext = { hello: 'world' };
			render(<App onEvent={onEvent} channel="atlaskit" analyticsContext={extraContext} />);
			const pressable = screen.getByTestId(testId);

			fireEvent.click(pressable);

			const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
				payload: {
					action: 'clicked',
					actionSubject: 'button',
					attributes: {
						componentName: 'Pressable',
						packageName,
						packageVersion,
					},
				},
				context: [
					{
						componentName: 'Pressable',
						packageName,
						packageVersion,
						...extraContext,
					},
				],
			});
			expect(onEvent).toHaveBeenCalledTimes(1);
			expect(onEvent.mock.calls[0][0].payload).toEqual(expected.payload);
			expect(onEvent.mock.calls[0][0].context).toEqual(expected.context);
		});

		it('should allow componentName to be overridden', () => {
			function App({
				onEvent,
				channel,
				analyticsContext,
			}: {
				onEvent: (...args: any[]) => void;
				channel: string | undefined;
				analyticsContext?: Record<string, any>;
			}) {
				return (
					<AnalyticsListener onEvent={onEvent} channel={channel}>
						<Pressable
							testId={testId}
							analyticsContext={analyticsContext}
							onClick={(event, analyticsEvent) => {
								analyticsEvent.fire();
							}}
							componentName="CustomComponent"
						>
							Pressable
						</Pressable>
					</AnalyticsListener>
				);
			}

			const onEvent = jest.fn();
			render(<App onEvent={onEvent} channel="atlaskit" />);
			const pressable = screen.getByTestId(testId);

			fireEvent.click(pressable);

			const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
				payload: {
					action: 'clicked',
					actionSubject: 'button',
					attributes: {
						componentName: 'CustomComponent',
						packageName,
						packageVersion,
					},
				},
				context: [
					{
						componentName: 'CustomComponent',
						packageName,
						packageVersion,
					},
				],
			});
			expect(onEvent).toHaveBeenCalledTimes(1);
			expect(onEvent.mock.calls[0][0].payload).toEqual(expected.payload);
			expect(onEvent.mock.calls[0][0].context).toEqual(expected.context);
		});

		it('should not error if there is no analytics provider', () => {
			const error = jest.spyOn(console, 'error');
			const onClick = jest.fn();
			render(
				<Pressable testId={testId} onClick={onClick}>
					Pressable
				</Pressable>,
			);

			const button = screen.getByTestId(testId);
			fireEvent.click(button);

			expect(error).not.toHaveBeenCalled();
			error.mockRestore();
		});
	});
});
