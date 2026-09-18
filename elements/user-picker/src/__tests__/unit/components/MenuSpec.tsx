import React from 'react';

import { render, screen } from '@testing-library/react';
import noop from 'lodash/noop';

import { Menu } from '../../../components/Menu';

const TestMenu = Menu as React.ComponentType<any>;

describe('Menu', () => {
	const renderMenu = (selectProps: Record<string, unknown> = {}) =>
		render(
			<TestMenu
				id="menu"
				selectProps={selectProps as any}
				getStyles={noop as any}
				cx={noop as any}
				getClassNames={noop as any}
			>
				<div>menu option</div>
			</TestMenu>,
		);

	it('renders a footer when one is passed into Menu', async () => {
		renderMenu({
			footer: (
				<div id="footer">
					<button type="button">Test</button>
				</div>
			),
		});

		expect(screen.getByText('menu option')).toBeInTheDocument();
		expect(document.querySelector('#footer')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Test' })).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('renders without a footer when one is not passed in', () => {
		renderMenu();

		expect(screen.getByText('menu option')).toBeInTheDocument();
		expect(document.querySelector('#footer')).not.toBeInTheDocument();
	});

	it('renders a header when one is passed into Menu', () => {
		renderMenu({ header: <div id="header">header</div> });

		expect(screen.getByText('menu option')).toBeInTheDocument();
		expect(screen.getByText('header')).toBeInTheDocument();
	});

	it('renders without a header when one is not passed in', () => {
		renderMenu();

		expect(screen.getByText('menu option')).toBeInTheDocument();
		expect(document.querySelector('#header')).not.toBeInTheDocument();
	});
});
