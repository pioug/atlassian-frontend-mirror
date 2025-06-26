/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import {
	SmartLinkAlignment,
	SmartLinkDirection,
	SmartLinkSize,
	SmartLinkWidth,
} from '../../../../../../constants';
import ElementGroup from '../index';

describe('ElementGroup', () => {
	const testId = 'smart-element-group';

	it('should capture and report a11y violations', async () => {
		const { container } = render(<ElementGroup>I am an element group.</ElementGroup>);

		await expect(container).toBeAccessible();
	});

	it('renders element group', async () => {
		render(<ElementGroup>I am an element group.</ElementGroup>);

		const elementGroup = await screen.findByTestId(testId);

		expect(elementGroup).toBeTruthy();
		expect(elementGroup.getAttribute('data-smart-element-group')).toBeTruthy();
		expect(elementGroup).toHaveTextContent('I am an element group.');
	});

	it('renders element group with custom css', async () => {
		const customStyles = css({
			lineHeight: '20rem',
		});
		render(<ElementGroup css={customStyles}>I am an element group.</ElementGroup>);

		const elementGroup = await screen.findByTestId(testId);

		expect(elementGroup).toHaveCompiledCss('line-height', '20rem');
		expect(elementGroup).toHaveCompiledCss('justify-content', 'flex-start');
	});

	describe('size', () => {
		it.each([
			[SmartLinkSize.XLarge, 'var(--ds-space-250,1.25rem)'],
			[SmartLinkSize.Large, 'var(--ds-space-200,1rem)'],
			[SmartLinkSize.Medium, 'var(--ds-space-100,.5rem)'],
			[SmartLinkSize.Small, 'var(--ds-space-050,.25rem)'],
			[undefined, 'var(--ds-space-100,.5rem)'],
		])(
			'renders element group in %s size',
			async (size: SmartLinkSize | undefined, expected: string) => {
				render(<ElementGroup size={size}>I am an element group.</ElementGroup>);

				const elementGroup = await screen.findByTestId(testId);

				expect(elementGroup).toHaveCompiledCss('gap', expected);
			},
		);
	});

	describe('direction', () => {
		it.each([
			[SmartLinkDirection.Horizontal, 'row'],
			[SmartLinkDirection.Vertical, 'column'],
			[undefined, 'row'],
		])(
			'renders children in %s',
			async (direction: SmartLinkDirection | undefined, expected: string) => {
				render(<ElementGroup direction={direction}>I am an element group.</ElementGroup>);

				const elementGroup = await screen.findByTestId(testId);

				expect(elementGroup).toHaveCompiledCss('flex-direction', expected);
			},
		);
	});

	describe('align', () => {
		it.each([
			[SmartLinkAlignment.Left, 'flex-start', 'left'],
			[SmartLinkAlignment.Right, 'flex-end', 'right'],
			[undefined, 'flex-start', 'left'],
		])(
			'aligns children %s',
			async (
				align: SmartLinkAlignment | undefined,
				expectedJustifyContent: string,
				expectedTextAlign: string,
			) => {
				render(<ElementGroup align={align}>I am an element group.</ElementGroup>);

				const elementGroup = await screen.findByTestId(testId);

				expect(elementGroup).toHaveCompiledCss('justify-content', expectedJustifyContent);
				expect(elementGroup).toHaveCompiledCss('text-align', expectedTextAlign);
			},
		);
	});

	describe('width', () => {
		it('should capture and report a11y violations', async () => {
			const { container } = render(
				<ElementGroup width={SmartLinkWidth.Flexible}>I am an element group.</ElementGroup>,
			);

			await expect(container).toBeAccessible();
		});

		it('sets flex for flexible width', async () => {
			render(<ElementGroup width={SmartLinkWidth.Flexible}>I am an element group.</ElementGroup>);

			const elementGroup = await screen.findByTestId(testId);
			expect(elementGroup).toHaveCompiledCss({
				flexGrow: '1',
				flexShrink: '3',
			});
		});
	});
});
