import '@testing-library/jest-dom';
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import context from '../../../../../__fixtures__/flexible-ui-data-context';
import { SmartLinkSize, SmartLinkStatus, SmartLinkTheme } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { TitleBlock } from '../../blocks';
import Container from '../index';

describe('Container', () => {
	const testId = 'smart-links-container';
	const url = 'https://www.link-url.com';

	it('renders container', async () => {
		render(<Container testId={testId} />);

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
				render(<Container size={size} testId={testId} />);

				const block = await screen.findByTestId(testId);

				expect(block).toHaveStyleDeclaration('gap', expectedGap);
				expect(block).toHaveStyleDeclaration('padding', expectedPadding);
			},
		);
	});

	describe('clickableContainer', () => {
		it('does not apply link to container by default', () => {
			render(<Container testId={testId} />);

			const link = screen.queryByTestId(`${testId}-layered-link`);

			expect(link).toBeNull();
		});

		it('applies link to container', async () => {
			render(<Container clickableContainer={true} testId={testId} />);

			const link = await screen.findByTestId(`${testId}-layered-link`);

			expect(link).toBeDefined();
		});

		it('does not applies link to container', () => {
			render(<Container clickableContainer={false} testId={testId} />);

			const link = screen.queryByTestId(`${testId}-layered-link`);

			expect(link).toBeNull();
		});

		it('has link attributes', async () => {
			render(
				<FlexibleUiContext.Provider value={context}>
					<Container clickableContainer={true} testId={testId} />
				</FlexibleUiContext.Provider>,
			);

			const link = await screen.findByTestId(`${testId}-layered-link`);

			expect(link).toHaveAttribute('href', url);
			expect(link.textContent).toBe(context.title);
		});

		it('has link attributes override from TitleBlock', async () => {
			const target = '_blank';
			const text = 'title-block-text';
			render(
				<FlexibleUiContext.Provider value={context}>
					<Container clickableContainer={true} testId={testId}>
						<TitleBlock anchorTarget={target} text={text} />
					</Container>
				</FlexibleUiContext.Provider>,
			);

			const link = await screen.findByTestId(`${testId}-layered-link`);

			expect(link).toHaveAttribute('href', url);
			expect(link).toHaveAttribute('target', target);
			expect(link).toHaveTextContent(text);
		});

		it('triggers onClick even when link is clicked', async () => {
			const user = userEvent.setup();
			const mockOnClick = jest.fn();
			render(<Container clickableContainer={true} onClick={mockOnClick} testId={testId} />);

			const link = await screen.findByTestId(`${testId}-layered-link`);
			await user.click(link);

			expect(mockOnClick).toHaveBeenCalled();
		});
	});

	describe('hideBackground', () => {
		it('shows background by default', async () => {
			render(<Container testId={testId} />);

			const container = await screen.findByTestId(testId);

			expect(container).toHaveStyleDeclaration(
				'background-color',
				expect.stringContaining('#FFFFFF'),
			);
		});

		it('shows background', async () => {
			render(<Container hideBackground={false} testId={testId} />);

			const container = await screen.findByTestId(testId);

			expect(container).toHaveStyleDeclaration(
				'background-color',
				expect.stringContaining('#FFFFFF'),
			);
		});

		it('hides background', async () => {
			render(<Container hideBackground={true} testId={testId} />);

			const container = await screen.findByTestId(testId);

			expect(container).not.toHaveStyleDeclaration('background-color', expect.any(String));
		});
	});

	describe('hideElevation', () => {
		const border = '1px solid var(--ds-border, #DFE1E6)';
		const borderRadius = 'var(--ds-border-radius-200, 8px)';

		it('shows elevation by default', async () => {
			render(<Container testId={testId} />);

			const container = await screen.findByTestId(testId);

			expect(container).toHaveStyleDeclaration('border', border);
			expect(container).toHaveStyleDeclaration('border-radius', borderRadius);
		});

		it('shows elevation', async () => {
			render(<Container hideElevation={false} testId={testId} />);

			const container = await screen.findByTestId(testId);

			expect(container).toHaveStyleDeclaration('border', border);
			expect(container).toHaveStyleDeclaration('border-radius', borderRadius);
		});

		it('hides elevation', async () => {
			render(<Container hideElevation={true} testId={testId} />);

			const container = await screen.findByTestId(testId);

			expect(container).not.toHaveStyleDeclaration('border', border);
			expect(container).not.toHaveStyleDeclaration('border-radius', borderRadius);
		});
	});

	describe('hidePadding', () => {
		const padding = '1rem';

		it('shows padding by default', async () => {
			render(<Container testId={testId} />);

			const container = await screen.findByTestId(testId);

			expect(container).toHaveStyleDeclaration('padding', padding);
		});

		it('shows padding', async () => {
			render(<Container hidePadding={false} testId={testId} />);

			const container = await screen.findByTestId(testId);

			expect(container).toHaveStyleDeclaration('padding', padding);
		});

		it('hides padding', async () => {
			render(<Container hidePadding={true} testId={testId} />);

			const container = await screen.findByTestId(testId);

			expect(container).not.toHaveStyleDeclaration('padding', padding);
		});
	});

	describe('renderChildren', () => {
		it('renders children', async () => {
			render(
				<Container testId={testId}>
					<TitleBlock />
					<TitleBlock />
				</Container>,
			);

			const container = await screen.findByTestId(testId);

			expect(container.children.length).toEqual(2);
		});

		it('does not render non block element', async () => {
			render(
				<Container testId={testId}>
					<TitleBlock />
					<div></div>
					<TitleBlock />
				</Container>,
			);

			const container = await screen.findByTestId(testId);

			expect(container.children.length).toEqual(2);
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
					<IntlProvider locale="en">
						<Container
							retry={{ descriptor: messages.cannot_find_link, onClick }}
							status={SmartLinkStatus.NotFound}
							testId={testId}
						>
							<TitleBlock />
						</Container>
					</IntlProvider>,
				);

				const message = await screen.findByTestId('smart-block-title-errored-view-message');
				fireEvent(message, new MouseEvent('click', { bubbles: true, cancelable: true }));

				expect(message).toHaveTextContent("Can't find link");
				expect(onClick).toHaveBeenCalled();
			});
		});

		describe('size', () => {
			it('renders block with the defined size', async () => {
				const size = SmartLinkSize.Small;
				render(
					<Container size={size} status={SmartLinkStatus.Resolved} testId={testId}>
						<TitleBlock />
					</Container>,
				);

				const element = await screen.findByTestId('smart-block-title-resolved-view');

				expect(element).toHaveStyleDeclaration('gap', '0.25rem');
			});

			it('does not override block size if defined', async () => {
				render(
					<Container size={SmartLinkSize.Small} status={SmartLinkStatus.Resolved} testId={testId}>
						<TitleBlock size={SmartLinkSize.Large} />
					</Container>,
				);

				const block = await screen.findByTestId('smart-block-title-resolved-view');

				expect(block).toHaveStyleDeclaration('gap', '1rem');
			});
		});

		describe('status', () => {
			it('renders block with the defined status', async () => {
				const size = SmartLinkSize.Small;
				render(
					<Container size={size} status={SmartLinkStatus.Errored} testId={testId}>
						<TitleBlock />
					</Container>,
				);

				const element = await screen.findByTestId('smart-block-title-errored-view');

				expect(element).toBeDefined();
			});
		});

		describe('theme', () => {
			it('renders block with the defined theme', async () => {
				const theme = SmartLinkTheme.Black;
				render(
					<FlexibleUiContext.Provider value={context}>
						<Container testId={testId} theme={theme}>
							<TitleBlock />
						</Container>
					</FlexibleUiContext.Provider>,
				);

				const element = await screen.findByTestId('smart-element-link');

				expect(element).toHaveStyleDeclaration('color', expect.stringContaining('#44546F'));
				expect(element).toHaveStyleDeclaration('font-weight', 'var(--ds-font-weight-regular, 400)');
			});

			it('overrides block theme', async () => {
				render(
					<FlexibleUiContext.Provider value={context}>
						<Container testId={testId} theme={SmartLinkTheme.Link}>
							<TitleBlock theme={SmartLinkTheme.Black} />
						</Container>
					</FlexibleUiContext.Provider>,
				);

				const element = await screen.findByTestId('smart-element-link');

				expect(element).toHaveStyleDeclaration('color', expect.stringContaining('#0C66E4'));
			});
		});
	});
});
