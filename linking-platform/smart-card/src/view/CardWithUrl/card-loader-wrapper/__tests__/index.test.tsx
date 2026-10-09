import React, { createRef } from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import CardLoaderWrapper from '../index';

describe('CardLoaderWrapper', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<CardLoaderWrapper appearance="inline">
				<span>child content</span>
			</CardLoaderWrapper>,
		);
		await expect(container).toBeAccessible();
	});

	it('should render children', () => {
		render(
			<CardLoaderWrapper appearance="inline">
				<span>child content</span>
			</CardLoaderWrapper>,
		);
		expect(screen.getByText('child content')).toBeInTheDocument();
	});

	it('should apply the loader-wrapper class name', () => {
		render(<CardLoaderWrapper appearance="inline">content</CardLoaderWrapper>);
		expect(screen.getByText('content')).toHaveClass('loader-wrapper');
	});

	describe('when appearance is inline', () => {
		it('should render a span element', () => {
			const { container } = render(
				<CardLoaderWrapper appearance="inline">content</CardLoaderWrapper>,
			);
			expect(container.firstChild?.nodeName).toBe('SPAN');
		});
	});

	describe('when appearance is block', () => {
		it('should render a div element', () => {
			const { container } = render(
				<CardLoaderWrapper appearance="block">content</CardLoaderWrapper>,
			);
			expect(container.firstChild?.nodeName).toBe('DIV');
		});
	});

	describe('when appearance is embed', () => {
		it('should render a div element', () => {
			const { container } = render(
				<CardLoaderWrapper appearance="embed">content</CardLoaderWrapper>,
			);
			expect(container.firstChild?.nodeName).toBe('DIV');
		});
	});

	describe('ref forwarding', () => {
		it('should forward ref to the underlying span element when appearance is inline', () => {
			const ref = createRef<HTMLDivElement>();
			const { container } = render(
				<CardLoaderWrapper appearance="inline" ref={ref}>
					content
				</CardLoaderWrapper>,
			);
			expect(ref.current).toBe(container.firstChild);
			expect(ref.current?.nodeName).toBe('SPAN');
		});

		it('should forward ref to the underlying div element when appearance is block', () => {
			const ref = createRef<HTMLDivElement>();
			const { container } = render(
				<CardLoaderWrapper appearance="block" ref={ref}>
					content
				</CardLoaderWrapper>,
			);
			expect(ref.current).toBe(container.firstChild);
			expect(ref.current?.nodeName).toBe('DIV');
		});
	});
});
