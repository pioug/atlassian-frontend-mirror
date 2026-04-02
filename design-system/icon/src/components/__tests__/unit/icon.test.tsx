import React from 'react';

import { render, screen } from '@testing-library/react';

import { IconNew } from '../../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('@atlaskit/icon/base-new', () => {
	describe('dangerouslySetGlyph prop', () => {
		const id = 'customPath';
		const customPathString = `<path data-testid="${id}" d=""></path>`;

		it('should render a path provided as a string', () => {
			render(
				<IconNew testId="test-icon" dangerouslySetGlyph={customPathString} label="hello-world" />,
			);
			const path = screen.getByTestId(id);
			expect(path).toBeInTheDocument();
			expect(path.nodeName).toEqual('path');
		});

		it('should present itself as an image when label is defined', () => {
			render(<IconNew dangerouslySetGlyph={customPathString} label="hello-world" />);

			const element = screen.getByRole('img');
			expect(element).toHaveAttribute('aria-label', 'hello-world');
		});

		it('should present as hidden, without a role when the label is an empty string', () => {
			const testId = 'test-icon';
			render(<IconNew testId={testId} dangerouslySetGlyph={customPathString} label="" />);

			const element = screen.getByTestId(testId);
			expect(element).not.toHaveAttribute('role');
			expect(element).not.toHaveAttribute('aria-label');
			expect(element).toHaveAttribute('aria-hidden', 'true');
		});
	});
});
