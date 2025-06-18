import '@testing-library/jest-dom';
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import context from '../../../../../__fixtures__/flexible-ui-data-context';
import { getFlexibleCardTestWrapper } from '../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { InternalActionName, SmartLinkSize, SmartLinkStatus } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { TitleBlock } from '../../blocks';
import Container from '../index';

jest.mock('../../../../../state/renderers', () => ({
	useSmartLinkRenderers: jest.fn(),
}));

describe('Container', () => {
	const testId = 'smart-links-container';
	const url = 'https://www.link-url.com';

	const renderContainer = (props?: React.ComponentProps<typeof Container>) => {
		return render(<Container testId={testId} {...props} />, {
			wrapper: getFlexibleCardTestWrapper(context),
		});
	};

	ffTest.both('platform-linking-flexible-card-context', 'with fg', () => {
		it('renders container', async () => {
			renderContainer();

			const container = await screen.findByTestId(testId);

			expect(container).toBeTruthy();
			expect(container.getAttribute('data-smart-link-container')).toBeTruthy();
		});

		describe('size', () => {
			it.each([
				[SmartLinkSize.XLarge, '1.25rem 0', '1.5rem'],
				[SmartLinkSize.Large, '1rem 0', '1.25rem'],
				[SmartLinkSize.Medium, '.5rem 0', '1rem'],
				[SmartLinkSize.Small, '.25rem 0', '.5rem'],
				[undefined, '.5rem 0', '1rem'],
			])(
				'renders element in %s size',
				async (size: SmartLinkSize | undefined, expectedGap: string, expectedPadding: string) => {
					renderContainer({ size });

					const block = await screen.findByTestId(testId);

					expect(block).toHaveCompiledCss('gap', expectedGap);
					expect(block).toHaveCompiledCss('padding', expectedPadding);
				},
			);
		});

		describe('clickableContainer', () => {
			it('does not apply link to container by default', () => {
				renderContainer();

				const link = screen.queryByTestId(`${testId}-layered-link`);

				expect(link).toBeNull();
			});

			it('applies link to container', async () => {
				renderContainer({ clickableContainer: true });

				const link = await screen.findByTestId(`${testId}-layered-link`);

				expect(link).toBeDefined();
			});

			it('does not applies link to container', () => {
				renderContainer({ clickableContainer: false });

				const link = screen.queryByTestId(`${testId}-layered-link`);

				expect(link).toBeNull();
			});

			it('has link attributes', async () => {
				renderContainer({ clickableContainer: true });

				const link = await screen.findByTestId(`${testId}-layered-link`);

				expect(link).toHaveAttribute('href', url);
				expect(link.textContent).toBe(context.title);
			});

			it('has link attributes override from TitleBlock', async () => {
				const target = '_blank';
				const text = 'title-block-text';
				render(
					<Container clickableContainer={true} testId={testId}>
						<TitleBlock anchorTarget={target} text={text} />
					</Container>,
					{ wrapper: getFlexibleCardTestWrapper(context) },
				);

				const link = await screen.findByTestId(`${testId}-layered-link`);

				expect(link).toHaveAttribute('href', url);
				expect(link).toHaveAttribute('target', target);
				expect(link).toHaveTextContent(text);
			});

			it('triggers onClick even when link is clicked', async () => {
				const user = userEvent.setup();
				const mockOnClick = jest.fn();
				renderContainer({ clickableContainer: true, onClick: mockOnClick });

				const link = await screen.findByTestId(`${testId}-layered-link`);
				await user.click(link);

				expect(mockOnClick).toHaveBeenCalled();
			});
		});

		describe('hideBackground', () => {
			it('shows background by default', async () => {
				renderContainer();

				const container = await screen.findByTestId(testId);

				expect(container).toHaveCompiledCss('background-color', 'var(--ds-surface-raised,#fff)');
			});

			it('shows background', async () => {
				renderContainer({ hideBackground: false });

				const container = await screen.findByTestId(testId);

				expect(container).toHaveCompiledCss('background-color', 'var(--ds-surface-raised,#fff)');
			});

			it('hides background', async () => {
				renderContainer({ hideBackground: true });

				const container = await screen.findByTestId(testId);

				expect(container).not.toHaveCompiledCss('background-color', expect.any(String));
			});
		});

		describe('hideElevation', () => {
			const border = '1px solid var(--ds-border,#dfe1e6)';
			const borderRadius = 'var(--ds-border-radius-200,8px)';

			it('shows elevation by default', async () => {
				renderContainer();

				const container = await screen.findByTestId(testId);

				expect(container).toHaveCompiledCss('border', border);
				expect(container).toHaveCompiledCss('border-radius', borderRadius);
			});

			it('shows elevation', async () => {
				renderContainer({ hideElevation: false });

				const container = await screen.findByTestId(testId);

				expect(container).toHaveCompiledCss('border', border);
				expect(container).toHaveCompiledCss('border-radius', borderRadius);
			});

			it('hides elevation', async () => {
				renderContainer({ hideElevation: true });

				const container = await screen.findByTestId(testId);

				expect(container).not.toHaveCompiledCss('border', '1px solid var(--ds-border,#dfe1e6');
				expect(container).not.toHaveCompiledCss('border-radius', borderRadius);
			});
		});

		describe('hidePadding', () => {
			const padding = '1rem';

			it('shows padding by default', async () => {
				renderContainer();

				const container = await screen.findByTestId(testId);

				expect(container).toHaveCompiledCss('padding', padding);
			});

			it('shows padding', async () => {
				renderContainer({ hidePadding: false });

				const container = await screen.findByTestId(testId);

				expect(container).toHaveCompiledCss('padding', padding);
			});

			it('hides padding', async () => {
				renderContainer({ hidePadding: true });

				const container = await screen.findByTestId(testId);

				expect(container).not.toHaveStyleDeclaration('padding', padding);
			});
		});

		describe('removeBlockRestriction', () => {
			const text = 'Hello World';

			it('does not render non block element by default', async () => {
				render(
					<Container testId={testId}>
						<TitleBlock />
						<div>{text}</div>
					</Container>,
				);

				expect(screen.queryByText(text)).not.toBeInTheDocument();
			});

			it('does not render non block element when false', async () => {
				render(
					<Container removeBlockRestriction={false} testId={testId}>
						<TitleBlock />
						<div>{text}</div>
					</Container>,
				);

				expect(await screen.findByTestId(testId)).toBeInTheDocument();
				expect(screen.queryByText(text)).not.toBeInTheDocument();
			});

			it('render non block element when true', async () => {
				render(
					<Container removeBlockRestriction={true} testId={testId}>
						<TitleBlock />
						<div>{text}</div>
					</Container>,
				);

				expect(await screen.findByTestId(testId)).toBeInTheDocument();
				expect(await screen.findByText(text)).toBeInTheDocument();
			});

			it('render children without TitleBlock when true', async () => {
				render(
					<Container removeBlockRestriction={true} testId={testId}>
						<div>{text}</div>
					</Container>,
				);

				expect(await screen.findByText(text)).toBeInTheDocument();
			});
		});
	});

	ffTest.on('platform-linking-flexible-card-context', 'with fg', () => {
		describe('renderChildren', () => {
			it('renders children', async () => {
				render(
					<Container testId={testId}>
						<TitleBlock />
						<TitleBlock />
					</Container>,
				);

				const container = await screen.findByTestId(testId);
				expect(container.children.length).toEqual(4); // doubled due to compiled css
			});

			it('does not render non block element', async () => {
				render(
					<Container testId={testId}>
						<TitleBlock />
						<div data-testid="this-should-not-exist">Hello World</div>
						<TitleBlock />
					</Container>,
				);

				expect(await screen.findByTestId(testId)).toBeInTheDocument();
				expect(screen.queryByText('this-should-not-exist')).not.toBeInTheDocument();
			});

			it('does not renders non valid element', async () => {
				render(<Container testId={testId}>This is a text.</Container>);

				const container = await screen.findByTestId(testId);

				expect(container.children.length).toEqual(0);
			});

			describe('retry', () => {
				ffTest.on('platform-linking-flexible-card-unresolved-action', 'with fg', () => {
					it('renders TitleBlock with retry message', async () => {
						const onClick = jest.fn();
						render(
							<Container testId={testId}>
								<TitleBlock />
							</Container>,
							{
								wrapper: getFlexibleCardTestWrapper(
									{
										linkTitle: context.linkTitle,
										actions: {
											[InternalActionName.UnresolvedAction]: {
												descriptor: messages.cannot_find_link,
												onClick,
											},
										},
									},
									undefined,
									SmartLinkStatus.NotFound,
								),
							},
						);

						const message = await screen.findByTestId('smart-block-title-errored-view-message');
						fireEvent(message, new MouseEvent('click', { bubbles: true, cancelable: true }));

						expect(message).toHaveTextContent("Can't find link");
						expect(onClick).toHaveBeenCalled();
					});
				});
			});

			describe('status', () => {
				it('renders block with the defined status', async () => {
					const size = SmartLinkSize.Small;
					render(
						<Container size={size} testId={testId}>
							<TitleBlock />
						</Container>,
						{ wrapper: getFlexibleCardTestWrapper(context, undefined, SmartLinkStatus.Errored) },
					);

					const element = await screen.findByTestId('smart-block-title-errored-view');

					expect(element).toBeDefined();
				});
			});
		});
	});

	ffTest.off('platform-linking-flexible-card-context', 'with fg', () => {
		describe('renderChildren', () => {
			it('renders children', async () => {
				render(
					<Container testId={testId}>
						<TitleBlock />
						<TitleBlock />
					</Container>,
				);

				const container = await screen.findByTestId(testId);
				expect(container.children.length).toEqual(4); // doubled due to compiled css
			});

			it('does not render non block element', async () => {
				render(
					<Container testId={testId}>
						<TitleBlock />
						<div data-testid="this-should-not-exist">Hello World</div>
						<TitleBlock />
					</Container>,
				);

				expect(await screen.findByTestId(testId)).toBeInTheDocument();
				expect(screen.queryByText('this-should-not-exist')).not.toBeInTheDocument();
			});

			it('does not renders non valid element', async () => {
				render(<Container testId={testId}>This is a text.</Container>);

				const container = await screen.findByTestId(testId);

				expect(container.children.length).toEqual(0);
			});

			describe('retry', () => {
				it('renders TitleBlock with retry message', async () => {
					const onClick = jest.fn();
					render(
						<Container
							retry={{ descriptor: messages.cannot_find_link, onClick }}
							status={SmartLinkStatus.NotFound}
							testId={testId}
						>
							<TitleBlock />
						</Container>,
						{ wrapper: getFlexibleCardTestWrapper(context, undefined, SmartLinkStatus.NotFound) },
					);

					const message = await screen.findByTestId('smart-block-title-errored-view-message');
					fireEvent(message, new MouseEvent('click', { bubbles: true, cancelable: true }));

					expect(message).toHaveTextContent("Can't find link");
					expect(onClick).toHaveBeenCalled();
				});
			});

			describe('status', () => {
				it('renders block with the defined status', async () => {
					const size = SmartLinkSize.Small;
					render(
						<Container size={size} status={SmartLinkStatus.Errored} testId={testId}>
							<TitleBlock />
						</Container>,
						{ wrapper: getFlexibleCardTestWrapper(context, undefined, SmartLinkStatus.Errored) },
					);

					const element = await screen.findByTestId('smart-block-title-errored-view');

					expect(element).toBeDefined();
				});
			});
		});
	});
});
