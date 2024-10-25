import React from 'react';

import { screen } from '@testing-library/react';

import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';

import { expectElementWithText } from '../../../../../__tests__/__utils__/unit-helpers';
import { IconAndTitleLayout } from '../../index';


jest.mock('react-render-image');

describe('IconAndTitleLayout', () => {
	it('should render the text', async () => {
		renderWithIntl(<IconAndTitleLayout title="some text content" testId="icon-and-title-layout" />);

		await expectElementWithText('icon-and-title-layout', 'some text content');
	});

	describe('renderIcon', () => {
		it('renders icon', () => {
			renderWithIntl(
				<IconAndTitleLayout title="title" icon={<span data-testid="inline-card-icon-icon" />} />,
			);

			const icon = screen.getByTestId('inline-card-icon-icon');

			expect(icon).toBeDefined();
		});

		it('renders icon from url', () => {
			renderWithIntl(
				<IconAndTitleLayout title="title" icon="src-loaded" testId="inline-card-icon" />,
			);

			const urlIcon = screen.getByTestId('inline-card-icon-image');

			expect(urlIcon).toBeDefined();
		});

		it('renders default icon if neither icon nor url provided', () => {
			renderWithIntl(<IconAndTitleLayout title="title" testId="inline-card-icon" />);

			const defaultIcon = screen.getByTestId('inline-card-icon-default');

			expect(defaultIcon).toBeDefined();
		});

		it('renders default icon on broken url', () => {
			renderWithIntl(<IconAndTitleLayout title="title" icon="src-error" />);

			const defaultIcon = screen.getByTestId('inline-card-icon-and-title-default');

			expect(defaultIcon).toBeDefined();
		});

		it('renders provided default icon on broken url', () => {
			renderWithIntl(
				<IconAndTitleLayout
					title="title"
					icon="src-error"
					defaultIcon={<span data-testid="inline-card-icon-custom-default" />}
				/>,
			);

			const customDefaultIcon = screen.getByTestId('inline-card-icon-custom-default');

			expect(customDefaultIcon).toBeDefined();
		});

		it('renders shimmer placeholder while image is loading', () => {
			renderWithIntl(<IconAndTitleLayout title="title" icon="src-loading" />);

			const customDefaultIcon = screen.getByTestId('inline-card-icon-and-title-loading');

			expect(customDefaultIcon).toBeDefined();
		});
	});

	it('should render emoji in place of default icon when emoji is provided', () => {
		const emojiIcon = <span data-testid="emoji">😍</span>;
		renderWithIntl(
			<IconAndTitleLayout title="title" testId="inline-card-icon" emoji={emojiIcon} />,
		);

		const emoji = screen.getByTestId('emoji');
		expect(emoji).toBeDefined();
		expect(screen.queryByTestId('inline-card-icon-default')).toBeNull;
	});
});
