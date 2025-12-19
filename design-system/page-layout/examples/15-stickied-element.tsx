/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	Content,
	LeftSidebarWithoutResize,
	Main,
	PageLayout,
	TopNavigation,
} from '@atlaskit/page-layout';
import { token } from '@atlaskit/tokens';

import { ScrollableContent, SlotLabel } from './common';

const topNavigationWrapperStyles = css({
	boxSizing: 'border-box',
	padding: '1rem',
	backgroundColor: token('color.background.neutral.subtle'),
	borderBlockEnd: `${token('border.width')} solid ${token('color.border')}`,
});

const leftSidebarWrapperStyles = css({
	padding: `0 ${token('space.250', '20px')}`,
});

const WithStickyElement = (): React.JSX.Element => {
	return (
		<PageLayout>
			<TopNavigation testId="topNavigation" height={60}>
				<div css={topNavigationWrapperStyles}>
					<SlotLabel>TopNavigation</SlotLabel>
				</div>
			</TopNavigation>
			<Content testId="content">
				<LeftSidebarWithoutResize testId="leftSidebar" width={250}>
					<div css={leftSidebarWrapperStyles}>
						<SlotLabel>LeftSidebar</SlotLabel>
					</div>
				</LeftSidebarWithoutResize>
				<Main testId="main">
					<SlotLabel>Main</SlotLabel>
					<ScrollableContent shouldHighlightNth />
				</Main>
			</Content>
		</PageLayout>
	);
};

export default WithStickyElement;
