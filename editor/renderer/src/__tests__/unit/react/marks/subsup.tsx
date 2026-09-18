import React from 'react';

import { render, screen } from '@testing-library/react';

import SubSup from '../../../../react/marks/subsup';

describe('Renderer - React/Marks/Subsup', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<SubSup dataAttributes={{ 'data-renderer-mark': true }} type="sub">
				This is sub
			</SubSup>,
		);

		await expect(container).toBeAccessible();
	});

	describe('<Sub />', () => {
		it('should wrap content with <sub>-tag', () => {
			render(
				<SubSup dataAttributes={{ 'data-renderer-mark': true }} type="sub">
					This is sub
				</SubSup>,
			);

			expect(screen.getByText('This is sub').tagName).toBe('SUB');
		});

		it('should output correct html', () => {
			const { container } = render(
				<SubSup dataAttributes={{ 'data-renderer-mark': true }} type="sub">
					This is sub
				</SubSup>,
			);

			expect(container.querySelector('sub')?.outerHTML).toEqual(
				'<sub data-renderer-mark="true">This is sub</sub>',
			);
		});
	});

	describe('<Sup />', () => {
		it('should wrap content with <sup>-tag', () => {
			render(
				<SubSup dataAttributes={{ 'data-renderer-mark': true }} type="sup">
					This is sup
				</SubSup>,
			);

			expect(screen.getByText('This is sup').tagName).toBe('SUP');
		});

		it('should output correct html', () => {
			const { container } = render(
				<SubSup dataAttributes={{ 'data-renderer-mark': true }} type="sup">
					This is sup
				</SubSup>,
			);

			expect(container.querySelector('sup')?.outerHTML).toEqual(
				'<sup data-renderer-mark="true">This is sup</sup>',
			);
		});
	});
});
