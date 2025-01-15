import '@testing-library/jest-dom';
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { ActionName, SmartLinkDirection, SmartLinkSize } from '../../../../../../constants';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import { Title } from '../../../elements';
import ActionGroup from '../../action-group';
import ElementGroup from '../../element-group';
import Block from '../index';

const testId = 'smart-block';

ffTest.both('bandicoots-compiled-migration-smartcard', '', () => {
	describe('Block', () => {
		it('renders block', async () => {
			render(<Block>I am a block.</Block>);

			const block = await screen.findByTestId(testId);

			expect(block).toBeTruthy();
			expect(block.getAttribute('data-smart-block')).toBeTruthy();
			expect(block).toHaveTextContent('I am a block.');
			expect(block).toHaveStyle('justify-content: flex-start');
		});

		it('calls OnRender', async () => {
			const onRender = jest.fn();
			render(<Block onRender={onRender}></Block>);
			await screen.findByTestId(testId);

			expect(onRender).toHaveBeenCalledTimes(1);
		});

		it('calls OnTransitionEnd', async () => {
			const onTransitionEnd = jest.fn();
			render(<Block onTransitionEnd={onTransitionEnd}></Block>);
			const block = await screen.findByTestId(testId);
			fireEvent.transitionEnd(block);

			expect(onTransitionEnd).toHaveBeenCalledTimes(1);
		});

		it('returns ref to block', async () => {
			let ref = { current: null };
			render(<Block blockRef={ref}></Block>);
			const block = await screen.findByTestId(testId);

			expect(ref.current).toEqual(block);
		});

		describe('direction', () => {
			it.each([
				[SmartLinkDirection.Horizontal, 'row'],
				[SmartLinkDirection.Vertical, 'column'],
				[undefined, 'row'],
			])(
				'renders children in %s',
				async (direction: SmartLinkDirection | undefined, expected: string) => {
					render(<Block direction={direction}>I am a block.</Block>);

					const block = await screen.findByTestId(testId);

					expect(block).toHaveStyle('flex-direction: ' + expected);
				},
			);
		});

		describe('renderChildren', () => {
			it('renders children', async () => {
				render(
					<Block testId={testId}>
						<div></div>
						<div></div>
					</Block>,
				);

				const container = await screen.findByTestId(testId);

				expect(container.children.length).toEqual(2);
			});

			describe('element', () => {
				it('renders element with its size', async () => {
					render(
						<FlexibleUiContext.Provider value={context}>
							<Block size={SmartLinkSize.Small} testId={testId}>
								<Title />
							</Block>
						</FlexibleUiContext.Provider>,
					);

					const element = await screen.findByTestId('smart-element-link');

					expect(element).toHaveStyle(
						'font: var(--ds-font-body-UNSAFE_small, normal 400 12px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif)',
					);
				});

				it('does not override element size', async () => {
					render(
						<FlexibleUiContext.Provider value={context}>
							<Block size={SmartLinkSize.Small} testId={testId}>
								<Title size={SmartLinkSize.Large} />
							</Block>
						</FlexibleUiContext.Provider>,
					);

					const element = await screen.findByTestId('smart-element-link');

					expect(element).toHaveStyle(
						'font: var(--ds-font-body, normal 400 14px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif)',
					);
				});
			});

			describe('element group', () => {
				it('renders element group with its size', async () => {
					render(
						<Block size={SmartLinkSize.Small} testId={testId}>
							<ElementGroup />
						</Block>,
					);

					const elementGroup = await screen.findByTestId('smart-element-group');

					expect(elementGroup).toHaveStyle('gap: 0.25rem');
				});

				it('does not override element group size', async () => {
					render(
						<Block size={SmartLinkSize.Small} testId={testId}>
							<ElementGroup size={SmartLinkSize.Large} />
						</Block>,
					);

					const elementGroup = await screen.findByTestId('smart-element-group');

					expect(elementGroup).toHaveStyle('gap: 1rem');
				});
			});

			describe('action group', () => {
				it('renders action group with its size', async () => {
					render(
						<IntlProvider locale="en">
							<Block size={SmartLinkSize.Small} testId={testId}>
								<ActionGroup items={[{ name: ActionName.DeleteAction, onClick: () => {} }]} />
							</Block>
						</IntlProvider>,
					);

					const icon = await screen.findByTestId('smart-action-delete-action-icon');

					expect(icon).toHaveStyle('width: 1rem');
				});

				it('does not override element group size', async () => {
					render(
						<IntlProvider locale="en">
							<Block size={SmartLinkSize.Small} testId={testId}>
								<ActionGroup
									items={[{ name: ActionName.DeleteAction, onClick: () => {} }]}
									size={SmartLinkSize.Large}
								/>
							</Block>
						</IntlProvider>,
					);

					const icon = await screen.findByTestId('smart-action-delete-action-icon');

					expect(icon).toHaveStyle('width: 1.5rem');
				});
			});

			it('does not pass its props to non element/element group', async () => {
				const size = SmartLinkSize.Small;

				const fn = jest.fn();
				const RandomComponent = (props: any) => {
					fn(props);
					return <div data-testid="random-node"></div>;
				};

				render(
					<Block size={size} testId={testId}>
						<RandomComponent />
					</Block>,
				);

				await screen.findByTestId('random-node');

				expect(fn).not.toHaveBeenCalledWith(expect.objectContaining({ size }));
			});
		});
	});
});

ffTest.off('bandicoots-compiled-migration-smartcard', '', () => {
	describe('size', () => {
		it.each([
			[SmartLinkSize.XLarge, '1.25rem'],
			[SmartLinkSize.Large, '1rem'],
			[SmartLinkSize.Medium, '0.5rem'],
			[SmartLinkSize.Small, '0.25rem'],
			[undefined, '0.5rem'],
		])('renders element in %s size', async (size: SmartLinkSize | undefined, expected: string) => {
			render(<Block size={size}>I am a block.</Block>);

			const block = await screen.findByTestId(testId);

			expect(block).toHaveStyle('gap: ' + expected);
		});
	});
});

ffTest.on('bandicoots-compiled-migration-smartcard', '', () => {
	describe('size', () => {
		it.each([
			[SmartLinkSize.XLarge, '1.25rem'],
			[SmartLinkSize.Large, '1rem'],
			[SmartLinkSize.Medium, '.5rem'],
			[SmartLinkSize.Small, '.25rem'],
			[undefined, '.5rem'],
		])('renders element in %s size', async (size: SmartLinkSize | undefined, expected: string) => {
			render(<Block size={size}>I am a block.</Block>);

			const block = await screen.findByTestId(testId);

			expect(block).toHaveStyle('gap: ' + expected);
		});
	});
});
