import React from 'react';

import { fireEvent, screen } from '@testing-library/react';

import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

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

			expect(styles.borderRadius).toContain('--ds-radius-full');
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

			expect(styles.borderRadius).toBe('');
			return;
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

		eeTest
			.describe('platform_editor_smart_card_otp', 'Smart Card OTP is enabled')
			.variant(true, () => {
				it('NOT renders icon skeleton when hideIconLoadingSkeleton is true', () => {
					renderWithIntl(
						<IconAndTitleLayout title="title" icon="src-loading" hideIconLoadingSkeleton={true} />,
					);

					expect(
						screen.queryByTestId('inline-card-icon-and-title-loading'),
					).not.toBeInTheDocument();
				});

				it('renders icon skeleton when hideIconLoadingSkeleton is false', () => {
					renderWithIntl(
						<IconAndTitleLayout title="title" icon="src-loading" hideIconLoadingSkeleton={false} />,
					);

					expect(screen.queryByTestId('inline-card-icon-and-title-loading')).toBeInTheDocument();
				});

				it('renders placeholder when hideIconLoadingSkeleton and url is broken', () => {
					renderWithIntl(
						<IconAndTitleLayout
							title="title"
							icon="src-error"
							defaultIcon={<span data-testid="inline-card-icon-custom-default" />}
							hideIconLoadingSkeleton={true}
						/>,
					);

					const img = screen.getByTestId('inline-card-icon-and-title-image');
					fireEvent.error(img);

					expect(screen.queryByTestId('inline-card-icon-custom-default')).toBeInTheDocument();
				});
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
	it('should capture and report a11y violations', async () => {
		const { container } = renderWithIntl(
			<IconAndTitleLayout title="some text content" testId="icon-and-title-layout" />,
		);
		await expect(container).toBeAccessible();
	});
});
