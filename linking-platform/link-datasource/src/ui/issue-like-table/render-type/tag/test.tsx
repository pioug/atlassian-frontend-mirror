import React from 'react';

import type { TagType } from '@atlaskit/linking-types/datasource';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import Tag, { TAG_TYPE_TEST_ID } from './index';

describe('Tag Type', () => {
	const setup = (tag: TagType['value']) => {
		return render(<Tag tag={tag} />);
	};

	describe('renders when all fields are given', () => {
		const TEST_TEXT = 'SIMPLE TAG';
		const TEST_COLOR_OPTION = 'teal';
		const TEST_URL = 'www.test123.com.au';

		it('The tag should render correctly as colored label with link if color and url are supplied', () => {
			setup({
				text: TEST_TEXT,
				color: TEST_COLOR_OPTION,
				url: TEST_URL,
			});
			const tag = screen.getByTestId(TAG_TYPE_TEST_ID);

			expect(tag).toBeInTheDocument();
			expect(tag).toHaveTextContent(TEST_TEXT);
			expect(tag).toHaveCompiledCss({ borderColor: 'var(--tag-border-token)' });
			const linkElement = screen.getByRole('link');
			expect(linkElement).toHaveAttribute('href', TEST_URL);
		});

		it('The tag should be standard color and no link property if color and url are not supplied', () => {
			setup({
				text: TEST_TEXT,
			});

			const tag = screen.getByTestId(TAG_TYPE_TEST_ID);

			expect(tag).toBeInTheDocument();
			expect(tag).toHaveTextContent(TEST_TEXT);
			expect(tag).toHaveCompiledCss({ borderColor: 'var(--tag-border-token)' });
			expect(screen.queryByRole('link')).not.toBeInTheDocument();
		});
	});

	describe('does not render when no fields are given', () => {
		async () => {
			setup({
				text: '',
			});
			expect(screen.queryByTestId(TAG_TYPE_TEST_ID)).not.toBeInTheDocument();
		};
	});
	it('should capture and report a11y violations', async () => {
		const TEST_TEXT = 'SIMPLE TAG';
		const TEST_COLOR_OPTION = 'teal';
		const TEST_URL = 'www.test123.com.au';
		const { container } = render(
			<Tag
				tag={{
					text: TEST_TEXT,
					color: TEST_COLOR_OPTION,
					url: TEST_URL,
				}}
			/>,
		);
		await expect(container).toBeAccessible();
	});
});
