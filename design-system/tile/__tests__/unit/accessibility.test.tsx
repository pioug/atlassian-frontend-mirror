import React from 'react';

import { render, screen } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Tile from '../../src';

describe('Tile Accessibility', () => {
	describe('aXe audits', () => {
		it('should not fail with default props', async () => {
			const { container } = render(<Tile label="Tile" />);
			await axe(container);
		});

		it('should not fail with custom label', async () => {
			const { container } = render(<Tile label="Custom Pull Request" />);
			await axe(container);
		});

		it('should not fail with empty label (decorative)', async () => {
			const { container } = render(<Tile label="" />);
			await axe(container);
		});

		it('should not fail with different sizes', async () => {
			const { container: smallContainer } = render(<Tile size="small" label="Tile" />);
			await axe(smallContainer);

			const { container: mediumContainer } = render(<Tile size="medium" label="Tile" />);
			await axe(mediumContainer);
		});
	});

	describe('accessible names', () => {
		it('should support custom labels', () => {
			const customLabel = 'Create a Pull Request';
			render(<Tile label={customLabel} testId="tile-test" />);
			const element = screen.getByTestId('tile-test');
			expect(element).toHaveAccessibleName(customLabel);
		});

		it('should allow empty label for decorative use', () => {
			render(<Tile label="" testId="tile-test" />);
			const element = screen.getByTestId('tile-test');
			expect(element).toHaveAccessibleName('');
		});
	});
});
