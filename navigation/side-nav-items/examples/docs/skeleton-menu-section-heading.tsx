/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { SkeletonMenuSectionHeading } from '@atlaskit/side-nav-items/skeleton';
import { token } from '@atlaskit/tokens';

import { MockSideNav } from './common/mock-side-nav';

const wrapperStyles = cssMap({
	root: {
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
	},
});

export function SkeletonMenuSectionHeadingExample(): React.JSX.Element {
	return (
		<MockSideNav>
			<div css={wrapperStyles.root}>
				<SkeletonMenuSectionHeading />
			</div>
		</MockSideNav>
	);
}

export default SkeletonMenuSectionHeadingExample;
