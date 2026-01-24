import React from 'react';

import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { render, screen } from '@atlassian/testing-library';

import { List } from '../../list';
import { ListItem } from '../../list-item';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
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
