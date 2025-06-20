import React from 'react';

import { render, screen } from '@testing-library/react';

import { TopNav } from '../../../page-layout/top-nav/top-nav';
import { Button, IconButton } from '../../themed/migration';

const mockIcon = () => null;
const noop = () => {};

const mockTheme = { backgroundColor: '#FFF', highlightColor: '#000' };

jest.mock('@atlaskit/button/new', () => {
	return {
		__esModule: true,
		default: jest.fn(() => <button type="button">AkButton</button>),
		IconButton: jest.fn(() => <button type="button">AkIconButton</button>),
	};
});

jest.mock('../../themed/button', () => {
	return {
		ThemedButton: jest.fn(() => <button type="button">ThemedButton</button>),
		ThemedIconButton: jest.fn(() => <button type="button">ThemedIconButton</button>),
	};
});

describe('top navigation custom theming', () => {
	describe('Button', () => {
		it('should use the standard Button if no theme is provided', () => {
			render(
				<TopNav>
					<Button onClick={noop}>Hello world</Button>
				</TopNav>,
			);

			const button = screen.getByRole('button');
			expect(button).toHaveTextContent('AkButton');
		});

		it('should use the themed Button if a theme is provided', () => {
			render(
				<TopNav UNSAFE_theme={mockTheme}>
					<Button onClick={noop}>Hello world</Button>
				</TopNav>,
			);

			const button = screen.getByRole('button');
			expect(button).toHaveTextContent('ThemedButton');
		});
	});

	describe('IconButton', () => {
		it('should use the standard IconButton if no theme is provided', () => {
			render(
				<TopNav>
					<IconButton icon={mockIcon} label="" onClick={noop} />
				</TopNav>,
			);

			const button = screen.getByRole('button');
			expect(button).toHaveTextContent('AkIconButton');
		});

		it('should use the themed IconButton if a theme is provided', () => {
			render(
				<TopNav UNSAFE_theme={mockTheme}>
					<IconButton icon={mockIcon} label="" onClick={noop} />
				</TopNav>,
			);

			const button = screen.getByRole('button');
			expect(button).toHaveTextContent('ThemedIconButton');
		});
	});
});
