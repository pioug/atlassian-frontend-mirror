import React from 'react';

import { render, screen } from '@testing-library/react';

import { List } from '../../list';
import { ListItem } from '../../list-item';

describe('List', () => {
	describe('renders for correct semantic components', () => {
		const originalNodeEnv = process.env.NODE_ENV;

		beforeEach(() => {
			process.env.NODE_ENV = originalNodeEnv;
		});

		it('should render for list items', () => {
			render(
				<List>
					<ListItem>Hello world</ListItem>
				</List>,
			);

			expect(screen.getByText('Hello world')).toBeInTheDocument();
		});

		it('should render for non list item children', () => {
			render(
				<List>
					<button type="button">Hello world</button>
				</List>,
			);

			expect(screen.getByText('Hello world')).toBeInTheDocument();
		});

		it('should render in production', () => {
			process.env.NODE_ENV = 'production';

			render(
				<List>
					<button type="button">Hello world</button>
				</List>,
			);

			expect(screen.getByText('Hello world')).toBeInTheDocument();
		});

		it('should render for non list item children wrapped in non-semantic divs', () => {
			render(
				<List>
					<div>
						<button type="button">Hello world</button>
					</div>
				</List>,
			);

			expect(screen.getByText('Hello world')).toBeInTheDocument();
		});

		it('should render for each violating child', () => {
			render(
				<List>
					<ListItem>Apple</ListItem>
					<button type="button">Banana</button>
					<button type="button">Cherry</button>
				</List>,
			);

			expect(screen.getByText('Apple')).toBeInTheDocument();
			expect(screen.getByText('Banana')).toBeInTheDocument();
			expect(screen.getByText('Cherry')).toBeInTheDocument();
		});
	});
});
