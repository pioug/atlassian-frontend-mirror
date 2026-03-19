import React from 'react';
import { render, screen } from '@testing-library/react';
import FontSize from '../../fontSize';

describe('Renderer - React/Marks/FontSize', () => {
	it('should render a div with the correct class names', () => {
		render(
			<FontSize dataAttributes={{ 'data-renderer-mark': true }} fontSize="small">
				Small text content
			</FontSize>,
		);

		const mark = screen.getByText('Small text content');
		expect(mark.tagName).toEqual('DIV');
		expect(mark).toHaveClass('fabric-editor-block-mark');
		expect(mark).toHaveClass('fabric-editor-font-size');
	});

	it('should set data-font-size attribute to small', () => {
		render(
			<FontSize dataAttributes={{ 'data-renderer-mark': true }} fontSize="small">
				Small text content
			</FontSize>,
		);

		const mark = screen.getByText('Small text content');
		expect(mark).toHaveAttribute('data-font-size', 'small');
	});

	it('should render children', () => {
		render(
			<FontSize dataAttributes={{ 'data-renderer-mark': true }} fontSize="small">
				<span>Nested content</span>
			</FontSize>,
		);

		expect(screen.getByText('Nested content')).toBeInTheDocument();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<FontSize dataAttributes={{ 'data-renderer-mark': true }} fontSize="small">
				<span>Nested content</span>
			</FontSize>,
		);
		await expect(container).toBeAccessible();
	});
});
