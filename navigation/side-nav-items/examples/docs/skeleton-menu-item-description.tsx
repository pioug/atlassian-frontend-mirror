/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Stack, Text } from '@atlaskit/primitives/compiled';
import { SkeletonMenuItem } from '@atlaskit/side-nav-items/skeleton';
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

export function SkeletonMenuItemDescriptionExample(): React.JSX.Element {
	return (
		<MockSideNav>
			<Stack space="space.300" xcss={wrapperStyles.root}>
				<Stack space="space.050">
					<Text size="small" color="color.text.subtlest">
						Without description
					</Text>
					<SkeletonMenuItem />
				</Stack>
				<Stack space="space.050">
					<Text size="small" color="color.text.subtlest">
						With description
					</Text>
					<SkeletonMenuItem hasDescription />
				</Stack>
			</Stack>
		</MockSideNav>
	);
}

export default SkeletonMenuItemDescriptionExample;
