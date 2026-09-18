import React from 'react';

import { render, screen } from '@testing-library/react';

import { CustomOption } from '../../../components/CustomOption/main';
import { type Custom } from '../../../types';

describe('Custom Option', () => {
	const byline = 'A custom byline';
	const basicCustomOption: Custom = {
		id: 'custom-option-1',
		name: 'Custom-Option-1',
		avatarUrl: 'https://avatars.atlassian.com/team-1.png',
		type: 'custom',
		byline,
	};

	const renderCustomOption = (data: Custom = basicCustomOption, isSelected = true) =>
		render(<CustomOption data={data} isSelected={isSelected} />);

	it('renders the custom option name and avatar', async () => {
		const { container } = renderCustomOption();

		expect(screen.getByText(basicCustomOption.name)).toBeInTheDocument();
		expect(container.querySelector('img')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('renders the byline', () => {
		renderCustomOption();

		expect(screen.getByTestId('user-picker-custom-secondary-text')).toHaveTextContent(byline);
	});

	describe('icon support', () => {
		const mockIcon = <span data-testid="test-icon">Icon</span>;

		it('renders the supplied icon instead of an avatar', () => {
			renderCustomOption({ ...basicCustomOption, icon: mockIcon });

			expect(screen.getByTestId('test-icon')).toBeInTheDocument();
			expect(screen.queryByRole('img')).not.toBeInTheDocument();
		});

		it('applies iconColor to the icon container', () => {
			renderCustomOption({ ...basicCustomOption, icon: mockIcon, iconColor: '#FF0000' });

			expect(screen.getByTestId('test-icon').parentElement).toHaveStyle({ color: '#FF0000' });
		});

		it('renders a sizeable avatar when no icon is supplied', () => {
			const { container } = renderCustomOption();

			expect(container.querySelector('img')).toBeInTheDocument();
		});
	});
});
