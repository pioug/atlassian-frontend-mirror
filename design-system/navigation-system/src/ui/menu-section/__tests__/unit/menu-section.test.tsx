import React from 'react';

import { render, screen } from '@testing-library/react';

import { Divider } from '../../divider';
import { MenuSection } from '../../menu-section';
import { MenuSectionHeading } from '../../menu-section-heading';

describe('Divider', () => {
	// We have VR coverage in addition to this
	it('should not render a semantic separator', () => {
		render(<Divider />);

		expect(screen.queryByRole('separator')).not.toBeInTheDocument();
	});
});

describe('MenuSection', () => {
	it('should be accessible when heading is provided', async () => {
		const { container } = render(
			<MenuSection>
				<MenuSectionHeading>Test title</MenuSectionHeading>
				<button>Some menu item</button>
				<Divider />
			</MenuSection>,
		);

		await expect(container).toBeAccessible();
	});

	it('should be accessible when heading is not provided', async () => {
		const { container } = render(
			<MenuSection>
				<button>Some menu item</button>
				<Divider />
			</MenuSection>,
		);

		await expect(container).toBeAccessible();
	});

	it('should display children', () => {
		render(<MenuSection>Child</MenuSection>);

		expect(screen.getByText('Child')).toBeVisible();
	});

	it('should be labelled by the MenuSectionHeading', () => {
		render(
			<MenuSection>
				<MenuSectionHeading>Test title</MenuSectionHeading>
			</MenuSection>,
		);

		expect(screen.getByRole('group', { name: 'Test title' })).toBeVisible();
	});

	describe('isMenuListItem', () => {
		it('should not be a list item when false', () => {
			render(
				<MenuSection isMenuListItem={false}>
					<MenuSectionHeading>Test title</MenuSectionHeading>
				</MenuSection>,
			);

			expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
		});

		it('should be a list item when true', () => {
			render(
				<MenuSection isMenuListItem>
					<MenuSectionHeading>Test title</MenuSectionHeading>
				</MenuSection>,
			);

			const listitem = screen.getByRole('listitem');
			const group = screen.getByRole('group', { name: 'Test title' });

			expect(listitem).toBeInTheDocument();
			expect(listitem).toContainElement(group);
		});
	});
});

describe('MenuSectionHeading', () => {
	it('should display a heading with correct name', () => {
		render(
			// Wrapping in MenuSection to provide context
			<MenuSection>
				<MenuSectionHeading>Test title</MenuSectionHeading>
			</MenuSection>,
		);

		expect(screen.getByRole('heading', { name: 'Test title' })).toBeVisible();
	});
});
