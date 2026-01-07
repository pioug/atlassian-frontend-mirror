/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, Fragment, type Ref } from 'react';

import { jsx } from '@compiled/react';
import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import AppProvider, { type RouterLinkComponentProps } from '@atlaskit/app-provider';
import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import Anchor from '../../anchor';

const testId = 'test-anchor';
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
	anchor: { textTransform: 'uppercase' },
});

type MyRouterLinkConfig = {
	to: string;
	customProp?: string;
};

const MyRouterLinkComponent: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<RouterLinkComponentProps<MyRouterLinkConfig>> &
		React.RefAttributes<HTMLAnchorElement>
> = forwardRef(
	(
		{ href, children, ...rest }: RouterLinkComponentProps<MyRouterLinkConfig>,
		ref: Ref<HTMLAnchorElement>,
	) => {
		const label = <Fragment>{children} (Router link)</Fragment>;

		if (typeof href === 'string') {
			return (
				// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
				<a ref={ref} data-test-link-type="simple" href={href} {...rest}>
					{label}
				</a>
			);
		}

		return (
			// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
			<a
				ref={ref}
				data-test-link-type="advanced"
				data-custom-attribute={href.customProp}
				href={href.to}
				{...rest}
			>
				{label}
			</a>
		);
	},
);

const testCases: Array<{
	value: string;
	type: string;
	id: string;
	shouldRouterLinkComponentBeUsed: {
		whenUndefined: boolean;
		whenDefined: boolean;
	};
}> = [
	{
		value: '/home',
		type: 'Internal link',
		id: 'internal-link',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: true,
		},
	},
	{
		value: 'http://atlassian.com',
		type: 'External link (http)',
		id: 'external-link-http',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: false,
		},
	},
	{
		value: 'https://atlassian.com',
		type: 'External link (https)',
		id: 'external-link-https',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: false,
		},
	},
	{
		value: 'mailto:test@example.com',
		type: 'Email',
		id: 'mailto-link',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: false,
		},
	},
	{
		value: 'tel:0400-000-000',
		type: 'Telephone',
		id: 'tel-link',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: false,
		},
	},
	{
		value: 'sms:0400-000-000?&body=foo',
		type: 'SMS',
		id: 'sms',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: false,
		},
	},
	{
		value: '#hash',
		type: 'Hash link (on current page)',
		id: 'hash-link-current-page',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: false,
		},
	},
	{
		value: '/home#hash',
		type: 'Hash link (on internal page)',
		id: 'hash-link-internal',
		shouldRouterLinkComponentBeUsed: {
			whenUndefined: false,
			whenDefined: true,
		},
	},
];

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Anchor', () => {
	it('should render with a given test id', () => {
		render(
			<Anchor href="/home" testId={testId}>
				Anchor with testid
			</Anchor>,
		);

		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});

	it('should render an <a>', () => {
		render(
			<Anchor href="/home" testId={testId}>
				Anchor
			</Anchor>,
		);
		expect(screen.getByTestId(testId).nodeName).toEqual('A');
	});

	it('should apply href', () => {
		render(
			<Anchor href="/home" testId={testId}>
				Anchor with href
			</Anchor>,
		);

		expect(screen.getByTestId(testId)).toHaveAttribute('href', '/home');
	});

	it('should apply target', () => {
		render(
			<Anchor href="/home" testId={testId} target="_blank">
				Anchor with target
			</Anchor>,
		);

		expect(screen.getByTestId(testId)).toHaveAttribute('target', '_blank');
	});

	it('should render plain text as children', () => {
		render(
			<Anchor href="/home" testId={testId}>
				Anchor text
			</Anchor>,
		);
		const element = screen.getByText('Anchor text');
		expect(element).toBeInTheDocument();
	});

	it('should render children', () => {
		render(
			<Anchor href="/home" testId={testId}>
				<span data-testid="test-anchor-child">Anchor children</span>
			</Anchor>,
		);
		const parent = screen.getByTestId(testId);
		expect(parent).toBeInTheDocument();
		const child = screen.getByTestId('test-anchor-child');
		expect(child).toBeInTheDocument();
	});

	it('should apply aria attributes', () => {
		render(
			<Anchor
				href="https://atlassian.design/"
				testId={testId}
				aria-label="Read the Atlassian Design System documentation"
				aria-labelledby="foo"
				aria-busy="true"
				role="link"
			>
				Anchor
			</Anchor>,
		);
		const anchor = screen.getByTestId(testId);
		expect(anchor).toHaveAttribute('aria-label', 'Read the Atlassian Design System documentation');
		expect(anchor).toHaveAttribute('aria-labelledby', 'foo');
		expect(anchor).toHaveAttribute('aria-busy', 'true');
		expect(anchor).toHaveAttribute('role', 'link');
	});

	it('should apply data attributes', () => {
		render(
			<Anchor href="https://atlassian.design/" testId={testId} data-test="foo">
				Anchor
			</Anchor>,
		);
		expect(screen.getByTestId(testId)).toHaveAttribute('data-test', 'foo');
	});

	it('should call click handler when present', () => {
		const mockOnClick = jest.fn();

		render(
			<Anchor href="/home" testId={testId} onClick={mockOnClick}>
				Click me
			</Anchor>,
		);

		fireEvent.click(screen.getByTestId(testId));

		expect(mockOnClick).toHaveBeenCalled();
	});

	describe('styles', () => {
		it('should apply styles with `xcss`', () => {
			render(
				<Anchor href="/home" testId={testId} xcss={styles.anchor}>
					Anchor with xcss styles
				</Anchor>,
			);

			expect(screen.getByTestId(testId)).toHaveCompiledCss({
				textTransform: 'uppercase',
			});
		});

		test('`xcss` should result in expected css', () => {
			render(
				<Anchor href="/required" testId={testId} xcss={styles.root}>
					child
				</Anchor>,
			);

			expect(screen.getByTestId(testId)).toHaveCompiledCss({
				// Every value in here overrides the props values
				// eg. `props.padding="space.0"` is overridden by `xcss.padding: 'space.100'`
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
				<Anchor
					href="/required"
					testId={testId}
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- This should never be done unless it's dynamic, like `props.width`
						width: '42px',
					}}
				>
					Anchor with inline styles
				</Anchor>,
			);

			expect(screen.getByTestId(testId)).toHaveStyle({ width: '42px' });
		});

		it('should have default underline', () => {
			render(
				<Anchor href="/required" testId={testId}>
					Anchor
				</Anchor>,
			);

			expect(screen.getByTestId(testId)).toHaveCompiledCss({
				textDecorationLine: 'underline',
			});
		});

		it('should override global outline styles', () => {
			render(<Anchor href="/required">Anchor</Anchor>);

			// The outline shorthand gets expanded by Compiled CSS, so we need to look for the expanded property
			expect(screen.getByRole('link')).toHaveCompiledCss('outline-style', 'none', {
				target: ':focus:not(:focus-visible)',
			});
		});
	});

	describe('should conditionally render router links or standard <a> anchors', () => {
		describe('when links are used outside an AppProvider', () => {
			testCases.forEach(({ id, type, value, shouldRouterLinkComponentBeUsed }) => {
				it(type, () => {
					render(
						<Anchor href={value} testId={id}>
							Hello world
						</Anchor>,
					);

					expect(screen.getByTestId(id)).toHaveAttribute(
						'data-is-router-link',
						`${shouldRouterLinkComponentBeUsed.whenUndefined}`,
					);
				});
			});
		});
		describe('when anchors are used inside an AppProvider, without a routerLinkComponent defined', () => {
			testCases.forEach(({ id, type, value, shouldRouterLinkComponentBeUsed }) => {
				it(type, () => {
					render(
						<AppProvider>
							<Anchor href={value} testId={id}>
								Hello world
							</Anchor>
						</AppProvider>,
					);

					expect(screen.getByTestId(id)).toHaveAttribute(
						'data-is-router-link',
						`${shouldRouterLinkComponentBeUsed.whenUndefined}`,
					);
				});
			});
		});
		describe('when anchors are used outside an AppProvider, with a routerLinkComponent defined', () => {
			testCases.forEach(({ id, type, value, shouldRouterLinkComponentBeUsed }) => {
				it(type, () => {
					render(
						<AppProvider routerLinkComponent={MyRouterLinkComponent}>
							<Anchor href={value} testId={id}>
								Hello world
							</Anchor>
						</AppProvider>,
					);

					expect(screen.getByTestId(id)).toHaveAttribute(
						'data-is-router-link',
						`${shouldRouterLinkComponentBeUsed.whenDefined}`,
					);
				});
			});
		});
	});

	describe('Custom router link objects passed to the `href` prop', () => {
		it('throws an error when anchors are used outside an AppProvider', () => {
			expect(() =>
				render(
					<AppProvider>
						<Anchor<MyRouterLinkConfig>
							href={{
								to: 'foo',
								customProp: 'bar',
							}}
							testId={testId}
						>
							Hello world
						</Anchor>
					</AppProvider>,
				),
			).toThrow(
				new Error(
					`Invariant failed: @atlaskit/primitives: Anchor primitive cannot pass an object to 'href' unless a router link is configured in the AppProvider`,
				),
			);
		});
		it('throws an error when anchors are used inside an AppProvider, without a routerLinkComponent defined', () => {
			expect(() =>
				render(
					<AppProvider>
						<Anchor<MyRouterLinkConfig>
							href={{
								to: 'foo',
								customProp: 'bar',
							}}
							testId={testId}
						>
							Hello world
						</Anchor>
					</AppProvider>,
				),
			).toThrow(
				new Error(
					`Invariant failed: @atlaskit/primitives: Anchor primitive cannot pass an object to 'href' unless a router link is configured in the AppProvider`,
				),
			);
		});
		it('are interpreted when anchors are used inside an AppProvider, with a routerLinkComponent defined', () => {
			render(
				<AppProvider routerLinkComponent={MyRouterLinkComponent}>
					<Anchor<MyRouterLinkConfig>
						href={{
							to: 'foo',
							customProp: 'bar',
						}}
						testId={testId}
					>
						Hello world
					</Anchor>
				</AppProvider>,
			);

			expect(screen.getByTestId(testId)).toHaveAttribute('href', 'foo');
			expect(screen.getByTestId(testId)).toHaveAttribute('data-custom-attribute', 'bar');
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
							<Anchor
								href="https://atlassian.com"
								testId={testId}
								onClick={(_event, analyticsEvent) => {
									analyticsEvent.fire();
								}}
							>
								Anchor
							</Anchor>
						</AnalyticsListener>
					</AnalyticsListener>
				);
			}
			render(<WithBoth />);

			const anchor = screen.getByTestId(testId);

			fireEvent.click(anchor);

			const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
				payload: {
					action: 'clicked',
					actionSubject: 'link',
					attributes: {
						componentName: 'Anchor',
						packageName,
						packageVersion,
					},
				},
				context: [
					{
						componentName: 'Anchor',
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
						<Anchor
							href="https://atlassian.com"
							testId={testId}
							analyticsContext={analyticsContext}
							onClick={(_event, analyticsEvent) => {
								analyticsEvent.fire();
							}}
						>
							Anchor
						</Anchor>
					</AnalyticsListener>
				);
			}

			const onEvent = jest.fn();
			const extraContext = { hello: 'world' };
			render(<App onEvent={onEvent} channel="atlaskit" analyticsContext={extraContext} />);
			const anchor = screen.getByTestId(testId);

			fireEvent.click(anchor);

			const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
				payload: {
					action: 'clicked',
					actionSubject: 'link',
					attributes: {
						componentName: 'Anchor',
						packageName,
						packageVersion,
					},
				},
				context: [
					{
						componentName: 'Anchor',
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
						<Anchor
							href="https://atlassian.com"
							testId={testId}
							analyticsContext={analyticsContext}
							onClick={(_event, analyticsEvent) => {
								analyticsEvent.fire();
							}}
							componentName="CustomComponent"
						>
							Anchor
						</Anchor>
					</AnalyticsListener>
				);
			}

			const onEvent = jest.fn();
			render(<App onEvent={onEvent} channel="atlaskit" />);
			const anchor = screen.getByTestId(testId);

			fireEvent.click(anchor);

			const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
				payload: {
					action: 'clicked',
					actionSubject: 'link',
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
				<Anchor href="https://atlassian.com" testId={testId} onClick={onClick}>
					Anchor
				</Anchor>,
			);

			const button = screen.getByTestId(testId);
			fireEvent.click(button);

			expect(error).not.toHaveBeenCalled();
			error.mockRestore();
		});
	});
});
