import React from 'react';

import { render, screen } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import AddIcon from '../../../../../core/add';
import type { IconTileAppearance } from '../../../../types';
import IconTile from '../../index';

describe('IconTile Accessibility', () => {
	describe('aXe audits', () => {
		it('should not fail with default props', async () => {
			const { container } = render(<IconTile icon={AddIcon} label="Add" appearance="blue" />);
			await axe(container);
		});

		it('should not fail with empty label (decorative)', async () => {
			const { container } = render(<IconTile icon={AddIcon} label="" appearance="gray" />);
			await axe(container);
		});

		it('should not fail with different sizes', async () => {
			const { container: smallContainer } = render(
				<IconTile icon={AddIcon} label="Small tile" appearance="blue" size="small" />,
			);
			await axe(smallContainer);

			const { container: mediumContainer } = render(
				<IconTile icon={AddIcon} label="Medium tile" appearance="blue" size="medium" />,
			);
			await axe(mediumContainer);

			const { container: largeContainer } = render(
				<IconTile icon={AddIcon} label="Large tile" appearance="blue" size="large" />,
			);
			await axe(largeContainer);
		});

		it('should not fail with different appearances', async () => {
			const appearances: IconTileAppearance[] = [
				'blue',
				'green',
				'red',
				'yellow',
				'purple',
				'teal',
				'orange',
				'magenta',
				'lime',
				'gray',
				'blueBold',
				'greenBold',
				'redBold',
				'yellowBold',
				'purpleBold',
				'tealBold',
				'orangeBold',
				'magentaBold',
				'limeBold',
				'grayBold',
			];

			// Test each appearance sequentially to avoid axe concurrency issues
			for (const appearance of appearances) {
				const { container } = render(
					<IconTile icon={AddIcon} label={`${appearance} tile`} appearance={appearance} />,
				);
				await axe(container);
			}
		});

		it('should not fail with testId', async () => {
			const { container } = render(
				<IconTile icon={AddIcon} label="Test tile" appearance="blue" testId="icon-tile-test" />,
			);
			await axe(container);
		});
	});

	describe('accessible names', () => {
		const testId = 'icon-tile-test';

		it('should support custom labels', () => {
			const customLabel = 'Create a new document';
			render(<IconTile icon={AddIcon} label={customLabel} appearance="blue" />);
			const element = screen.getByLabelText(customLabel);
			expect(element).toBeInTheDocument();
		});
		it('should support empty labels (decorative)', () => {
			render(<IconTile icon={AddIcon} label="" appearance="blue" testId={testId} />);
			const element = screen.getByTestId(testId);
			expect(element).toHaveAccessibleName('');
		});
	});
});
