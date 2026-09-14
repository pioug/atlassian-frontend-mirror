import React from 'react';

import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { TopNav } from '../../../page-layout/top-nav/top-nav';
import { Button } from '../../themed/button';
import { IconButton } from '../../themed/icon-button';

const mockIcon = () => null;
const noop = () => {};

const mockTheme = { backgroundColor: '#FFF', highlightColor: '#000' };

jest.mock('@atlaskit/button/default/button', () => ({
	...jest.requireActual('@atlaskit/button/default/button'),
	__esModule: true,
	default: jest.fn(() => <button type="button">AkButton</button>),
}));
jest.mock('@atlaskit/button/icon/button', () => ({
	...jest.requireActual('@atlaskit/button/icon/button'),
	__esModule: true,
	default: jest.fn(() => <button type="button">AkIconButton</button>),
}));

jest.mock('../../themed/themed-button', () => {
	return {
		ThemedButton: jest.fn(() => <button type="button">ThemedButton</button>),
	};
});

jest.mock('../../themed/themed-icon-button', () => {
	return {
		ThemedIconButton: jest.fn(() => <button type="button">ThemedIconButton</button>),
	};
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
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
				<TopNav customTheme={mockTheme}>
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
				<TopNav customTheme={mockTheme}>
					<IconButton icon={mockIcon} label="" onClick={noop} />
				</TopNav>,
			);

			const button = screen.getByRole('button');
			expect(button).toHaveTextContent('ThemedIconButton');
		});
	});
});
