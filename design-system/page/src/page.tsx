/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { defaultBannerHeight } from './constants';
import type { PageProps } from './types';

const styles = cssMap({
	banner: {
		width: '100%',
		position: 'fixed',
	},
	bannerContainer: {
		width: '100%',
		position: 'relative',
		zIndex: 3,
		flex: '1 0 auto',
		transition: 'height 0.25s ease-in-out',
	},
	pageContent: {
		minWidth: 0,
		position: 'relative',
		zIndex: 1,
		flex: '1 1 auto',
	},
	wrapper: {
		display: 'flex',
		width: '100%',
		minHeight: '100%',
		flexDirection: 'column',
	},
	mainContainer: {
		display: 'flex',
		flex: '1 1 auto',
	},
	navigation: {
		position: 'relative',
		zIndex: 2,
	},
});

/**
 * __Page__
 *
 * Used to build page layouts.
 *
 * Has built in support for positioning [banners](https://atlassian.design/components/banner/examples)
 * and the deprecated `@atlaskit/navigation`.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/page)
 */
const Page = ({
	isBannerOpen = false,
	bannerHeight = defaultBannerHeight,
	banner,
	navigation,
	children,
	testId,
}: PageProps) => {
	return (
		<div css={styles.wrapper} data-testid={testId}>
			{banner ? (
				<div
					css={styles.bannerContainer}
					style={{ height: isBannerOpen ? `${bannerHeight}px` : '0' }}
					aria-hidden={!isBannerOpen}
					data-testid={testId ? `${testId}--banner-container` : undefined}
				>
					<div css={styles.banner}>{banner}</div>
				</div>
			) : null}
			<div css={styles.mainContainer}>
				<div css={styles.navigation}>{navigation}</div>
				<div css={styles.pageContent}>{children}</div>
			</div>
		</div>
	);
};

export default Page;
