import React from 'react';

import { screen } from '@testing-library/react';

import { DecisionItem } from '../../../';
import { renderWithIntl } from '../_testing-library';

describe('<DecisionItem/>', () => {
	it('should render children', () => {
		const { container } = renderWithIntl(
			<DecisionItem>
				Hello <b>world</b>
			</DecisionItem>,
		);

		expect(container.querySelector('[data-component="content"]')).toHaveTextContent('Hello world');
	});

	it('should render callback with ref', () => {
		let contentRef: HTMLElement | null = null;
		const handleContentRef = (ref: HTMLElement | null) => (contentRef = ref);

		const { container } = renderWithIntl(
			<DecisionItem contentRef={handleContentRef}>
				Hello <b>world</b>
			</DecisionItem>,
		);

		expect(container.querySelector('[data-component="content"]')).toHaveTextContent('Hello world');
		expect(contentRef).not.toBeNull();
		expect(contentRef).toHaveTextContent('Hello world');
	});

	describe('showPlaceholder', () => {
		it('should render placeholder if decision is empty', () => {
			renderWithIntl(<DecisionItem showPlaceholder={true} placeholder="cheese" />);

			expect(screen.getByTestId('task-decision-item-placeholder')).toBeInTheDocument();
		});

		it('should not render placeholder if decision is not empty', () => {
			renderWithIntl(
				<DecisionItem showPlaceholder={true} placeholder="cheese">
					Hello <b>world</b>
				</DecisionItem>,
			);

			expect(screen.queryByTestId('task-decision-item-placeholder')).not.toBeInTheDocument();
		});
	});

	describe('Image labels', () => {
		it('should render aria-label as Undefined decision when the placeholder is showing', () => {
			renderWithIntl(<DecisionItem showPlaceholder={true} placeholder="cheese" />);

			expect(screen.getByRole('img', { name: 'Undefined decision' })).toBeInTheDocument();
			expect(screen.queryByRole('img', { name: 'Decision' })).not.toBeInTheDocument();
		});

		it('should render aria-label as Decision when the placeholder is not showing', () => {
			renderWithIntl(
				<DecisionItem showPlaceholder={true} placeholder="cheese">
					Hello <b>world</b>
				</DecisionItem>,
			);

			expect(screen.getByRole('img', { name: 'Decision' })).toBeInTheDocument();
			expect(screen.queryByRole('img', { name: 'Undefined decision' })).not.toBeInTheDocument();
		});
	});
});
