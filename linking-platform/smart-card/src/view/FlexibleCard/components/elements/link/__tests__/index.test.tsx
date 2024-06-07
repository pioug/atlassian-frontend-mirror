import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { css } from '@emotion/react';
import Link from '../index';
import { SmartLinkSize, SmartLinkTheme } from '../../../../../../constants';

describe('Element: Link', () => {
	const testId = 'smart-element-link';
	const text = 'Some title';
	const url = 'https://some.url';

	it('renders element', async () => {
		const { findByTestId } = render(<Link text={text} url={url} />);

		const element = await findByTestId(testId);

		expect(element).toBeTruthy();
		expect(element.getAttribute('data-smart-element-link')).toBeTruthy();
		expect(element).toBeInstanceOf(HTMLAnchorElement);
		expect(element.getAttribute('href')).toBe(url);
		expect(element.textContent).toBe(text);
	});

	describe('size', () => {
		it.each([
			[SmartLinkSize.XLarge, '1.25rem'],
			[SmartLinkSize.Large, '0.875rem'],
			[SmartLinkSize.Medium, '0.875rem'],
			[SmartLinkSize.Small, '0.75rem'],
		])('renders element in %s size', async (size: SmartLinkSize, expectedFontSize) => {
			const { findByTestId } = render(<Link text={text} url={url} size={size} />);

			const element = await findByTestId(testId);

			expect(element).toHaveStyleDeclaration('font-size', expectedFontSize);
			expect(element).toHaveStyleDeclaration('font-weight', '400');
		});
	});

	describe('maxLines', () => {
		it('renders with default two maxLines', async () => {
			const { findByTestId } = render(<Link text={text} url={url} />);

			const element = await findByTestId(testId);

			expect(element).toHaveStyleDeclaration('-webkit-line-clamp', '2');
		});

		it('renders element to two lines when maxLines exceeds maximum', async () => {
			const { findByTestId } = render(<Link text={text} url={url} maxLines={10} />);

			const element = await findByTestId(testId);

			expect(element).toHaveStyleDeclaration('-webkit-line-clamp', '2');
		});

		it('renders element to one lines when maxLines belows minimum', async () => {
			const { findByTestId } = render(<Link text={text} url={url} maxLines={-10} />);

			const element = await findByTestId(testId);

			expect(element).toHaveStyleDeclaration('-webkit-line-clamp', '1');
		});
	});

	describe('theme', () => {
		it('renders with default theme', async () => {
			const { findByTestId } = render(<Link text={text} url={url} />);

			const element = await findByTestId(testId);

			expect(element).toHaveStyleDeclaration('color', expect.stringContaining('#0C66E4'));
		});

		it(`renders with ${SmartLinkTheme.Link} theme`, async () => {
			const { findByTestId } = render(<Link text={text} url={url} theme={SmartLinkTheme.Link} />);

			const element = await findByTestId(testId);

			expect(element).toHaveStyleDeclaration('color', expect.stringContaining('#0C66E4'));
		});

		it(`renders with ${SmartLinkTheme.Black} theme`, async () => {
			const { findByTestId } = render(<Link text={text} url={url} theme={SmartLinkTheme.Black} />);

			const element = await findByTestId(testId);

			expect(element).toHaveStyleDeclaration('color', expect.stringContaining('#44546F'));
			expect(element).toHaveStyleDeclaration('font-weight', '400');
		});
	});

	describe('truncate', () => {
		it('truncates with break-word when text contains whitespace', async () => {
			const { findByTestId } = render(<Link text="This is a sentence." url={url} />);

			const element = await findByTestId(testId);

			expect(element).toHaveStyleDeclaration('word-break', 'break-word');
		});

		it('truncates with break-all when text does not contain whitespace', async () => {
			const { findByTestId } = render(
				<Link text="https://product-fabric.atlassian.net/browse/EDM-3050" url={url} />,
			);

			const element = await findByTestId(testId);

			expect(element).toHaveStyleDeclaration('word-break', 'break-all');
		});
	});

	describe('renders with tooltip', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('shows tooltip on hover by default', async () => {
			const { findByTestId } = render(<Link text={text} url={url} />);

			const element = await findByTestId(testId);
			fireEvent.mouseOver(element);
			jest.runAllTimers();
			const tooltip = await findByTestId(`${testId}-tooltip`);

			expect(tooltip).toBeInTheDocument();
			expect(tooltip.textContent).toBe(text);
		});

		it('shows tooltip on hover when hideTooltip is false', async () => {
			const { findByTestId } = render(<Link hideTooltip={false} text={text} url={url} />);

			const element = await findByTestId(testId);
			fireEvent.mouseOver(element);
			jest.runAllTimers();
			const tooltip = await findByTestId(`${testId}-tooltip`);

			expect(tooltip).toBeInTheDocument();
			expect(tooltip.textContent).toBe(text);
		});

		it('does not show tooltip on hover when hideTooltip is true', async () => {
			const { findByTestId, queryByTestId } = render(
				<Link hideTooltip={true} text={text} url={url} />,
			);

			const element = await findByTestId(testId);
			fireEvent.mouseOver(element);
			jest.runAllTimers();
			const tooltip = queryByTestId(`${testId}-tooltip`);

			expect(tooltip).not.toBeInTheDocument();
		});
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			backgroundColor: 'blue',
		});
		const { findByTestId } = render(<Link overrideCss={overrideCss} text={text} url={url} />);

		const element = await findByTestId(testId);

		expect(element).toHaveStyleDeclaration('background-color', 'blue');
	});

	describe('target', () => {
		it('does not set target attribute when target is _self', async () => {
			const { findByTestId } = render(<Link text={text} url={url} target="_self" />);

			const element = await findByTestId(testId);

			expect(element).not.toHaveAttribute('target');
		});

		it('defaults the target attribute to be _blank', async () => {
			const { findByTestId } = render(<Link text={text} url={url} />);

			const element = await findByTestId(testId);

			expect(element).toHaveAttribute('target', '_blank');
		});

		it('respects the target attribute when it is set', async () => {
			const { findByTestId } = render(<Link text={text} url={url} target="_parent" />);

			const element = await findByTestId(testId);

			expect(element).toHaveAttribute('target', '_parent');
		});
	});
});
