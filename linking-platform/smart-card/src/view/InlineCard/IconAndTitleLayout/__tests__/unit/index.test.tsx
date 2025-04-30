import React from 'react';

import { screen } from '@testing-library/react';

import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { fg } from '@atlaskit/platform-feature-flags';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { expectElementWithText } from '../../../../../__tests__/__utils__/unit-helpers';
import { IconAndTitleLayout } from '../../index';

jest.mock('react-render-image', () => ({
	...jest.requireActual('react-render-image'),
	__esModule: true,
	default: jest.fn(({ loaded, loading, errored, src }) => {
		if (src === 'src-error') {
			return <>{errored}</>;
		}
		if (src === 'src-loading') {
			return <>{loading}</>;
		}
		if (src === 'src-loaded') {
			return <>{loaded}</>;
		}
		return null;
	}),
}));

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

		ffTest.both('platform-linking-visual-refresh-v1', '', () => {
			ffTest.both('platform-linking-visual-refresh-v2', '', () => {
				it('should render round image if profile type', () => {
					renderWithIntl(
						<IconAndTitleLayout
							title="title"
							icon="src-loaded"
							testId="inline-card-icon"
							type={['Document', 'Profile']}
						/>,
					);

					const urlIcon = screen.getByTestId('inline-card-icon-image');
					const styles = window.getComputedStyle(urlIcon);

					if (fg('platform-linking-visual-refresh-v2')) {
						expect(styles.borderRadius).toContain('--ds-border-radius-circle');
						return;
					}

					if (fg('platform-linking-visual-refresh-v1')) {
						expect(styles.borderRadius).toBe('');
						return;
					}

					expect(styles.borderRadius).toBe('2px');
				});

				it('should not render round image if type is not profile', () => {
					renderWithIntl(
						<IconAndTitleLayout
							title="title"
							icon="src-loaded"
							testId="inline-card-icon"
							type={['Document', 'SomethingElse']}
						/>,
					);

					const urlIcon = screen.getByTestId('inline-card-icon-image');
					const styles = window.getComputedStyle(urlIcon);

					if (fg('platform-linking-visual-refresh-v1')) {
						expect(styles.borderRadius).toBe('');
						return;
					}

					expect(styles.borderRadius).toBe('2px');
				});
			});
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
