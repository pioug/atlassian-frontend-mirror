import React from 'react';

import { render, screen } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import { Box, Flex, Grid, Inline, Stack, Text } from '../../../index';
import Anchor from '../../anchor';
import Pressable from '../../pressable';

describe('Primitives', () => {
	describe('Anchor', () => {
		it('should pass an aXe audit', async () => {
			const { container } = render(<Anchor href="/home">Anchor</Anchor>);
			await axe(container);
		});

		const OPENS_NEW_WINDOW_LABEL = ', (opens new window)';
		describe(`"${OPENS_NEW_WINDOW_LABEL}" announcements`, () => {
			describe('should be appended when `target="_blank"`', () => {
				it('to `children` as visually hidden text', () => {
					render(
						<Anchor href="https://www.atlassian.com" testId="anchor" target="_blank">
							Atlassian website
						</Anchor>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName(`Atlassian website ${OPENS_NEW_WINDOW_LABEL}`);

					// Check for visually hidden styles
					const hiddenText = screen.getByText(OPENS_NEW_WINDOW_LABEL);
					expect(hiddenText).toHaveStyleDeclaration('width', '1px');
					expect(hiddenText).toHaveStyleDeclaration('height', '1px');
					expect(hiddenText).toHaveStyleDeclaration('position', 'absolute');
					expect(hiddenText).toHaveStyleDeclaration('clip', 'rect(1px, 1px, 1px, 1px)');
				});
				it('to `aria-label`', () => {
					render(
						<Anchor
							href="https://www.atlassian.com"
							testId="anchor"
							target="_blank"
							aria-label="Jira"
						/>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName(`Jira ${OPENS_NEW_WINDOW_LABEL}`);
				});
				it('to `aria-labelledby`', () => {
					render(
						<>
							<div id="the-label">Confluence</div>
							<Anchor
								href="https://www.atlassian.com"
								testId="anchor"
								target="_blank"
								aria-labelledby="the-label"
							/>
						</>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName(`Confluence ${OPENS_NEW_WINDOW_LABEL}`);
				});

				it('to `aria-label` when `children` has content', () => {
					render(
						<Anchor
							href="https://www.atlassian.com"
							testId="anchor"
							target="_blank"
							aria-label="Atlas"
						>
							Atlassian website
						</Anchor>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName(`Atlas ${OPENS_NEW_WINDOW_LABEL}`);

					// Ensure label has not been added elsewhere
					expect(anchor).not.toHaveTextContent(OPENS_NEW_WINDOW_LABEL);
					expect(anchor).not.toHaveAttribute('aria-labelledby');
				});
				it('to `aria-labelledby` when `children` has content and `aria-label` is also set', () => {
					render(
						<>
							<div id="the-label">Loom</div>
							<Anchor
								href="https://www.atlassian.com"
								testId="anchor"
								target="_blank"
								aria-label="Foo"
								aria-labelledby="the-label"
							>
								Atlassian website
							</Anchor>
						</>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName(`Loom ${OPENS_NEW_WINDOW_LABEL}`);

					// The label should be added as visually hidden text, with an ID used by `aria-labelledby`
					expect(anchor).toHaveTextContent(OPENS_NEW_WINDOW_LABEL);

					// Check for visually hidden styles
					const hiddenText = screen.getByText(OPENS_NEW_WINDOW_LABEL);
					expect(hiddenText).toHaveStyleDeclaration('width', '1px');
					expect(hiddenText).toHaveStyleDeclaration('height', '1px');
					expect(hiddenText).toHaveStyleDeclaration('position', 'absolute');
					expect(hiddenText).toHaveStyleDeclaration('clip', 'rect(1px, 1px, 1px, 1px)');

					// Ensure label has not been added elsewhere
					expect(anchor).not.toHaveAttribute('aria-label', `Foo ${OPENS_NEW_WINDOW_LABEL}`);
				});
			});

			describe('should be not appended when `target` is not `blank`', () => {
				it('to `children`', () => {
					render(
						<Anchor href="https://www.atlassian.com" testId="anchor" target="_self">
							Atlassian website
						</Anchor>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName('Atlassian website');
				});
				it('to `aria-label`', () => {
					render(
						<Anchor
							href="https://www.atlassian.com"
							testId="anchor"
							target="_self"
							aria-label="Jira"
						/>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName('Jira');
				});
				it('to `aria-labelledby`', () => {
					render(
						<>
							<div id="the-label">Confluence</div>
							<Anchor
								href="https://www.atlassian.com"
								testId="anchor"
								target="_self"
								aria-labelledby="the-label"
							/>
						</>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName('Confluence');
				});
			});
		});

		const I18N_LABEL = 'se abre en una nueva ventana';
		describe('i18n announcements', () => {
			describe('should be appended when `target="_blank"`', () => {
				it('to `children` as visually hidden text', () => {
					render(
						<Anchor
							href="https://www.atlassian.com"
							testId="anchor"
							target="_blank"
							newWindowLabel={I18N_LABEL}
						>
							Atlassian website
						</Anchor>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName(`Atlassian website , ${I18N_LABEL}`);

					// Check for visually hidden styles
					const hiddenText = screen.getByText(`, ${I18N_LABEL}`);
					expect(hiddenText).toHaveStyleDeclaration('width', '1px');
					expect(hiddenText).toHaveStyleDeclaration('height', '1px');
					expect(hiddenText).toHaveStyleDeclaration('position', 'absolute');
					expect(hiddenText).toHaveStyleDeclaration('clip', 'rect(1px, 1px, 1px, 1px)');
				});
				it('to `aria-label`', () => {
					render(
						<Anchor
							href="https://www.atlassian.com"
							testId="anchor"
							target="_blank"
							aria-label="Jira"
							newWindowLabel={I18N_LABEL}
						/>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName(`Jira , ${I18N_LABEL}`);
				});
				it('to `aria-labelledby`', () => {
					render(
						<>
							<div id="the-label">Confluence</div>
							<Anchor
								href="https://www.atlassian.com"
								testId="anchor"
								target="_blank"
								aria-labelledby="the-label"
								newWindowLabel={I18N_LABEL}
							/>
						</>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName(`Confluence , ${I18N_LABEL}`);
				});

				it('to `aria-label` when `children` has content', () => {
					render(
						<Anchor
							href="https://www.atlassian.com"
							testId="anchor"
							target="_blank"
							aria-label="Atlas"
							newWindowLabel={I18N_LABEL}
						>
							Atlassian website
						</Anchor>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName(`Atlas , ${I18N_LABEL}`);

					// Ensure label has not been added elsewhere
					expect(anchor).not.toHaveTextContent(I18N_LABEL);
					expect(anchor).not.toHaveAttribute('aria-labelledby');
				});
				it('to `aria-labelledby` when `children` has content and `aria-label` is also set', () => {
					render(
						<>
							<div id="the-label">Loom</div>
							<Anchor
								href="https://www.atlassian.com"
								testId="anchor"
								target="_blank"
								aria-label="Foo"
								aria-labelledby="the-label"
								newWindowLabel={I18N_LABEL}
							>
								Atlassian website
							</Anchor>
						</>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName(`Loom , ${I18N_LABEL}`);

					// The label should be added as visually hidden text, with an ID used by `aria-labelledby`
					expect(anchor).toHaveTextContent(I18N_LABEL);

					// Check for visually hidden styles
					const hiddenText = screen.getByText(`, ${I18N_LABEL}`);
					expect(hiddenText).toHaveStyleDeclaration('width', '1px');
					expect(hiddenText).toHaveStyleDeclaration('height', '1px');
					expect(hiddenText).toHaveStyleDeclaration('position', 'absolute');
					expect(hiddenText).toHaveStyleDeclaration('clip', 'rect(1px, 1px, 1px, 1px)');

					// Ensure label has not been added elsewhere
					expect(anchor).not.toHaveAttribute('aria-label', `Foo ${I18N_LABEL}`);
				});
			});

			describe('should be not appended when `target` is not `blank`', () => {
				it('to `children`', () => {
					render(
						<Anchor href="https://www.atlassian.com" testId="anchor" target="_self">
							Atlassian website
						</Anchor>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName('Atlassian website');
				});
				it('to `aria-label`', () => {
					render(
						<Anchor
							href="https://www.atlassian.com"
							testId="anchor"
							target="_self"
							aria-label="Jira"
						/>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName('Jira');
				});
				it('to `aria-labelledby`', () => {
					render(
						<>
							<div id="the-label">Confluence</div>
							<Anchor
								href="https://www.atlassian.com"
								testId="anchor"
								target="_self"
								aria-labelledby="the-label"
							/>
						</>,
					);

					const anchor = screen.getByTestId('anchor');
					expect(anchor).toHaveAccessibleName('Confluence');
				});
			});
		});
	});

	describe('Box', () => {
		it('should pass an aXe audit', async () => {
			const { container } = render(<Box>Box</Box>);
			await axe(container);
		});

		it('should pass an aXe audit when using `as`', async () => {
			const { container } = render(<Box as="span">Box</Box>);
			await axe(container);
		});
	});

	describe('Flex', () => {
		it('should pass an aXe audit', async () => {
			const { container } = render(<Flex>Grid</Flex>);
			await axe(container);
		});

		it('should pass an aXe audit when using `as`', async () => {
			const { container } = render(<Flex as="span">Grid</Flex>);
			await axe(container);
		});
	});

	describe('Grid', () => {
		it('should pass an aXe audit', async () => {
			const { container } = render(<Grid>Grid</Grid>);
			await axe(container);
		});

		it('should pass an aXe audit when using `as`', async () => {
			const { container } = render(<Grid as="span">Grid</Grid>);
			await axe(container);
		});

		it('should pass an aXe audit when nested', async () => {
			const { container } = render(
				<Grid testId="parent" templateAreas={['header']} templateColumns="2fr" templateRows="1fr">
					<Grid testId="child" templateRows="100px">
						Child
					</Grid>
				</Grid>,
			);
			await axe(container);
		});
	});

	describe('Inline', () => {
		it('should pass an aXe audit', async () => {
			const { container } = render(
				<Inline space="space.050">
					<Box>1</Box>
					<Box>2</Box>
				</Inline>,
			);
			await axe(container);
		});

		it('should pass an aXe audit with separator', async () => {
			const { container } = render(
				<Inline space="space.050" separator="/">
					<Box>1</Box>
					<Box>2</Box>
				</Inline>,
			);
			await axe(container);
		});
	});

	describe('Pressable', () => {
		it('should pass an aXe audit', async () => {
			const { container } = render(<Pressable>Pressable</Pressable>);
			await axe(container);
		});
	});

	describe('Stack', () => {
		it('should pass an aXe audit', async () => {
			const { container } = render(
				<Stack space="space.050">
					<Box>1</Box>
					<Box>2</Box>
				</Stack>,
			);
			await axe(container);
		});
	});

	describe('Text', () => {
		it('should pass an aXe audit', async () => {
			const { container } = render(<Text>Text</Text>);
			await axe(container);
		});

		it('should pass an aXe audit when using `as`', async () => {
			const { container } = render(<Text as="p">Text</Text>);
			await axe(container);
		});
	});
});
