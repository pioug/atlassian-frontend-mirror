import '@testing-library/jest-dom';
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import context from '../../../../../../__fixtures__/flexible-ui-data-context';
import { getFlexibleCardTestWrapper } from '../../../../../../__tests__/__utils__/unit-testing-library-helpers';
import { ActionName, SmartLinkDirection, SmartLinkSize } from '../../../../../../constants';
import { Title } from '../../../elements';
import ActionGroup from '../../action-group';
import ElementGroup from '../../element-group';
import Block from '../index';

const testId = 'smart-block';

describe('Block', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<Block>I am a block.</Block>);

		await expect(container).toBeAccessible();
	});

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
					<Block size={SmartLinkSize.Small} testId={testId}>
						<Title />
					</Block>,
					{ wrapper: getFlexibleCardTestWrapper(context) },
				);

				const element = await screen.findByTestId('smart-element-link');

				expect(element).toHaveStyle(
					'font: var(--ds-font-body-UNSAFE_small,normal 400 9pt/1pc "Atlassian Sans",ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Ubuntu,"Helvetica Neue",sans-serif);',
				);
			});

			it('does not override element size', async () => {
				render(
					<Block size={SmartLinkSize.Small} testId={testId}>
						<Title size={SmartLinkSize.Large} />
					</Block>,
					{ wrapper: getFlexibleCardTestWrapper(context) },
				);

				const element = await screen.findByTestId('smart-element-link');

				expect(element).toHaveStyle(
					'font: var(--ds-font-body,normal 400 14px/20px "Atlassian Sans",ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Ubuntu,"Helvetica Neue",sans-serif);',
				);
			});
		});

		describe('element group', () => {
			it('should capture and report a11y violations', async () => {
				const { container } = render(
					<Block size={SmartLinkSize.Small} testId={testId}>
						<ElementGroup />
					</Block>,
				);

				await expect(container).toBeAccessible();
			});

			it('renders element group with its size', async () => {
				render(
					<Block size={SmartLinkSize.Small} testId={testId}>
						<ElementGroup />
					</Block>,
				);

				const elementGroup = await screen.findByTestId('smart-element-group');

				expect(elementGroup).toHaveStyle('gap: var(--ds-space-050,4px);');
			});

			it('does not override element group size', async () => {
				render(
					<Block size={SmartLinkSize.Small} testId={testId}>
						<ElementGroup size={SmartLinkSize.Large} />
					</Block>,
				);

				const elementGroup = await screen.findByTestId('smart-element-group');

				expect(elementGroup).toHaveStyle('gap: var(--ds-space-200,1pc);');
			});
		});

		describe('action group', () => {
			it('should capture and report a11y violations', async () => {
				const { container } = render(
					<IntlProvider locale="en">
						<Block size={SmartLinkSize.Small} testId={testId}>
							<ActionGroup items={[{ name: ActionName.DeleteAction, onClick: () => {} }]} />
						</Block>
					</IntlProvider>,
				);

				await expect(container).toBeAccessible();
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

describe('size', () => {
	it.each([
		[SmartLinkSize.XLarge, 'var(--ds-space-250,20px)'],
		[SmartLinkSize.Large, 'var(--ds-space-200,1pc)'],
		[SmartLinkSize.Medium, 'var(--ds-space-100,8px)'],
		[SmartLinkSize.Small, 'var(--ds-space-050,4px)'],
		[undefined, 'var(--ds-space-100,8px)'],
	])('renders element in %s size', async (size: SmartLinkSize | undefined, expected: string) => {
		render(<Block size={size}>I am a block.</Block>);

		const block = await screen.findByTestId(testId);

		expect(block).toHaveStyle('gap: ' + expected);
	});
});
