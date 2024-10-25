import '@testing-library/jest-dom';
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { ActionName, SmartLinkDirection, SmartLinkSize } from '../../../../../../constants';
import { FlexibleUiContext } from '../../../../../../state/flexible-ui-context';
import { Title } from '../../../elements';
import ActionGroup from '../../action-group';
import ElementGroup from '../../element-group';
import Block from '../index';

describe('Block', () => {
	const testId = 'smart-block';

	it('renders block', async () => {
		render(<Block>I am a block.</Block>);

		const block = await screen.findByTestId(testId);

		expect(block).toBeTruthy();
		expect(block.getAttribute('data-smart-block')).toBeTruthy();
		expect(block.textContent).toBe('I am a block.');
		expect(block).toHaveStyleDeclaration('justify-content', 'flex-start');
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

			expect(block).toHaveStyleDeclaration('gap', expected);
		});
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

				expect(block).toHaveStyleDeclaration('flex-direction', expected);
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

				expect(element).toHaveStyleDeclaration('font-size', '0.75rem');
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

				expect(element).toHaveStyleDeclaration('font-size', '0.875rem');
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

				expect(elementGroup).toHaveStyleDeclaration('gap', '0.25rem');
			});

			it('does not override element group size', async () => {
				render(
					<Block size={SmartLinkSize.Small} testId={testId}>
						<ElementGroup size={SmartLinkSize.Large} />
					</Block>,
				);

				const elementGroup = await screen.findByTestId('smart-element-group');

				expect(elementGroup).toHaveStyleDeclaration('gap', '1rem');
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

				expect(icon).toHaveStyleDeclaration('width', '1rem');
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

				expect(icon).toHaveStyleDeclaration('width', '1.5rem');
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
