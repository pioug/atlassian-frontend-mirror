/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import { Fragment } from 'react';

import { jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import Pressable from '../../pressable';

const testId = 'test-pressable';
const styles = cssMap({
	root: {
		backgroundColor: token('color.background.brand.bold'),
		// TODO (AFB-874): Disabling due to overriding of @compiled/property-shorthand-sorting
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
		padding: token('space.100'),
		paddingBlock: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInline: token('space.100'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
	},
	pressable: {
		textTransform: 'uppercase',
	},
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
			<Fragment>
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
			</Fragment>,
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

			const element = screen.getByTestId(testId);
			expect(element).toBeDisabled();
			expect(element).toHaveCompiledCss({ cursor: 'not-allowed' });
		});
	});

	describe('tabIndex', () => {
		it('should not set tabIndex to 0 by default', () => {
			render(<Pressable testId={testId}>Pressable</Pressable>);
			expect(screen.getByTestId(testId)).not.toHaveAttribute('tabindex');
		});

		it('should set tabIndex to 0 by default for Safari ', () => {
			const orginalNavigator = window.navigator;
			Object.defineProperty(window.navigator, 'userAgent', { value: 'safari', writable: true });

			render(<Pressable testId={testId}>Pressable</Pressable>);
			expect(screen.getByTestId(testId)).toHaveAttribute('tabindex', '0');
			global.navigator = orginalNavigator;
		});

		it('should not have tabIndex when isDisabled is true', () => {
			render(
				<Pressable testId={testId} isDisabled>
					Disabled
				</Pressable>,
			);
			expect(screen.getByTestId(testId)).not.toHaveAttribute('tabindex');
		});

		it('should set tabIndex to the provided value', () => {
			render(
				<Pressable testId={testId} tabIndex={-1}>
					Pressable
				</Pressable>,
			);
			expect(screen.getByTestId(testId)).toHaveAttribute('tabindex', '-1');
		});
	});

	it('should call click handler when present', async () => {
		const mockOnClick = jest.fn();
		const user = userEvent.setup();

		render(
			<Pressable testId={testId} onClick={mockOnClick}>
				Click me
			</Pressable>,
		);

		await user.click(screen.getByTestId(testId));

		expect(mockOnClick).toHaveBeenCalled();
	});

	describe('styles', () => {
		it('should apply styles with `xcss`', () => {
			render(
				<Pressable testId={testId} xcss={styles.pressable}>
					Pressable with xcss styles
				</Pressable>,
			);

			expect(screen.getByTestId(testId)).toHaveCompiledCss({
				textTransform: 'uppercase',
			});
		});

		test('`xcss` should result in expected css', () => {
			render(
				<Pressable testId={testId} xcss={styles.root}>
					child
				</Pressable>,
			);
			const element = screen.getByTestId(testId);
			expect(element).toBeInTheDocument();

			expect(element).toHaveCompiledCss({
				backgroundColor: 'var(--ds-background-brand-bold,#1868db)',
				padding: 'var(--ds-space-100,8px)',
				paddingBlock: 'var(--ds-space-100,8px)',
				paddingBlockStart: 'var(--ds-space-100,8px)',
				paddingBlockEnd: 'var(--ds-space-100,8px)',
				paddingInline: 'var(--ds-space-100,8px)',
				paddingInlineStart: 'var(--ds-space-100,8px)',
				paddingInlineEnd: 'var(--ds-space-100,8px)',
			});
		});

		it('should apply styles with `style`', () => {
			render(
				<Pressable
					testId={testId}
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- This should never be done unless it's dynamic, like `props.width`
						width: '42px',
					}}
				>
					Pressable with inline styles
				</Pressable>,
			);

			expect(screen.getByTestId(testId)).toHaveStyle({ width: '42px' });
		});

		it('should have critical default styles', () => {
			render(<Pressable testId={testId}>Pressable</Pressable>);

			expect(screen.getByTestId(testId)).toHaveCompiledCss({
				border: 'none',
				appearance: 'none',
				cursor: 'pointer',
			});
		});

		it('should override global outline styles', () => {
			render(<Pressable>Pressable</Pressable>);

			// The outline shorthand gets expanded by Compiled CSS, so we need to look for the expanded property
			expect(screen.getByRole('button')).toHaveCompiledCss('outline-style', 'none', {
				target: ':focus:not(:focus-visible)',
			});
		});
	});

	describe('analytics', () => {
		const packageName = process.env._PACKAGE_NAME_ as string;
		const packageVersion = process.env._PACKAGE_VERSION_ as string;
		const user = userEvent.setup();

		it('should fire an event on the public channel and the internal channel', async () => {
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

			await user.click(pressable);

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

		it('should allow the addition of additional context', async () => {
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

			await user.click(pressable);

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

		it('should allow componentName to be overridden', async () => {
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

			await user.click(pressable);

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

		it('should not error if there is no analytics provider', async () => {
			const error = jest.spyOn(console, 'error');
			const onClick = jest.fn();
			render(
				<Pressable testId={testId} onClick={onClick}>
					Pressable
				</Pressable>,
			);

			const button = screen.getByTestId(testId);
			user.click(button);

			expect(error).not.toHaveBeenCalled();
			error.mockRestore();
		});
	});
});
