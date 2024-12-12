import '@testing-library/jest-dom';

import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { fireEvent, render, screen } from '@testing-library/react';

import { SmartLinkSize, SmartLinkTheme } from '../../../../../../constants';
import Link from '../index';

describe('Element: Link', () => {
	const testId = 'smart-element-link';
	const text = 'Some title';
	const url = 'https://some.url';

	it('renders element', async () => {
		render(<Link text={text} url={url} />);

		const element = await screen.findByTestId(testId);

		expect(element).toBeTruthy();
		expect(element.getAttribute('data-smart-element-link')).toBeTruthy();
		expect(element).toBeInstanceOf(HTMLAnchorElement);
		expect(element.getAttribute('href')).toBe(url);
		expect(element).toHaveTextContent(text);
	});

	describe('size', () => {
		it.each([
			[SmartLinkSize.XLarge, '1.25rem'],
			[SmartLinkSize.Large, '0.875rem'],
			[SmartLinkSize.Medium, '0.875rem'],
			[SmartLinkSize.Small, '0.75rem'],
		])('renders element in %s size', async (size: SmartLinkSize, expectedFontSize) => {
			render(<Link text={text} url={url} size={size} />);

			const element = await screen.findByTestId(testId);

			expect(element).toHaveStyleDeclaration('font-size', expectedFontSize);
			expect(element).toHaveStyleDeclaration('font-weight', 'var(--ds-font-weight-regular, 400)');
		});
	});

	describe('maxLines', () => {
		it('renders with default two maxLines', async () => {
			render(<Link text={text} url={url} />);

			const element = await screen.findByTestId(testId);

			expect(element).toHaveStyleDeclaration('-webkit-line-clamp', '2');
		});

		it('renders element to two lines when maxLines exceeds maximum', async () => {
			render(<Link text={text} url={url} maxLines={10} />);

			const element = await screen.findByTestId(testId);

			expect(element).toHaveStyleDeclaration('-webkit-line-clamp', '2');
		});

		it('renders element to one lines when maxLines belows minimum', async () => {
			render(<Link text={text} url={url} maxLines={-10} />);

			const element = await screen.findByTestId(testId);

			expect(element).toHaveStyleDeclaration('-webkit-line-clamp', '1');
		});
	});

	describe('theme', () => {
		it('renders with default theme', async () => {
			render(<Link text={text} url={url} />);

			const element = await screen.findByTestId(testId);

			expect(element).toHaveStyleDeclaration('color', expect.stringContaining('#0C66E4'));
		});

		it(`renders with ${SmartLinkTheme.Link} theme`, async () => {
			render(<Link text={text} url={url} theme={SmartLinkTheme.Link} />);

			const element = await screen.findByTestId(testId);

			expect(element).toHaveStyleDeclaration('color', expect.stringContaining('#0C66E4'));
		});

		it(`renders with ${SmartLinkTheme.Black} theme`, async () => {
			render(<Link text={text} url={url} theme={SmartLinkTheme.Black} />);

			const element = await screen.findByTestId(testId);

			expect(element).toHaveStyleDeclaration('color', expect.stringContaining('#44546F'));
			expect(element).toHaveStyleDeclaration('font-weight', 'var(--ds-font-weight-regular, 400)');
		});
	});

	describe('truncate', () => {
		it('truncates with break-word when text contains whitespace', async () => {
			render(<Link text="This is a sentence." url={url} />);

			const element = await screen.findByTestId(testId);

			expect(element).toHaveStyleDeclaration('word-break', 'break-word');
		});

		it('truncates with break-all when text does not contain whitespace', async () => {
			render(<Link text="https://product-fabric.atlassian.net/browse/EDM-3050" url={url} />);

			const element = await screen.findByTestId(testId);

			expect(element).toHaveStyleDeclaration('word-break', 'break-all');
		});
	});

	describe('renders with tooltip', () => {
		beforeEach(() => {
			jest.useFakeTimers({ legacyFakeTimers: true });
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('shows tooltip on hover by default', async () => {
			render(<Link text={text} url={url} />);

			const element = await screen.findByTestId(testId);
			fireEvent.mouseOver(element);
			jest.runAllTimers();
			const tooltip = await screen.findByTestId(`${testId}-tooltip`);

			expect(tooltip).toBeInTheDocument();
			expect(tooltip).toHaveTextContent(text);
		});

		it('shows tooltip on hover when hideTooltip is false', async () => {
			render(<Link hideTooltip={false} text={text} url={url} />);

			const element = await screen.findByTestId(testId);
			fireEvent.mouseOver(element);
			jest.runAllTimers();
			const tooltip = await screen.findByTestId(`${testId}-tooltip`);

			expect(tooltip).toBeInTheDocument();
			expect(tooltip).toHaveTextContent(text);
		});

		it('does not show tooltip on hover when hideTooltip is true', async () => {
			render(<Link hideTooltip={true} text={text} url={url} />);

			const element = await screen.findByTestId(testId);
			fireEvent.mouseOver(element);
			jest.runAllTimers();
			const tooltip = screen.queryByTestId(`${testId}-tooltip`);

			expect(tooltip).not.toBeInTheDocument();
		});
	});

	it('renders with override css', async () => {
		const overrideCss = css({
			backgroundColor: 'blue',
		});
		render(<Link overrideCss={overrideCss} text={text} url={url} />);

		const element = await screen.findByTestId(testId);

		expect(element).toHaveStyleDeclaration('background-color', 'blue');
	});

	describe('target', () => {
		it('does not set target attribute when target is _self', async () => {
			render(<Link text={text} url={url} target="_self" />);

			const element = await screen.findByTestId(testId);

			expect(element).not.toHaveAttribute('target');
		});

		it('defaults the target attribute to be _blank', async () => {
			render(<Link text={text} url={url} />);

			const element = await screen.findByTestId(testId);

			expect(element).toHaveAttribute('target', '_blank');
		});

		it('respects the target attribute when it is set', async () => {
			render(<Link text={text} url={url} target="_parent" />);

			const element = await screen.findByTestId(testId);

			expect(element).toHaveAttribute('target', '_parent');
		});
	});
});
