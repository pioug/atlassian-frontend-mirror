import React from 'react';

import { cssMap } from '@atlaskit/css';
import ArrowRightIcon from '@atlaskit/icon/core/arrow-right';
import HeartIcon from '@atlaskit/icon/core/heart';
import { ButtonItem, HeadingItem, MenuGroup } from '@atlaskit/menu';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const IconSizing = (): React.JSX.Element => {
	return (
		<MenuGroup>
			<HeadingItem testId="heading-item">New icons</HeadingItem>
			<ButtonItem
				iconBefore={<HeartIcon label="" />}
				iconAfter={<ArrowRightIcon label="" />}
				description="Both are new icons with a 'none' spacing prop"
			>
				No spacing new icons
			</ButtonItem>
			<ButtonItem
				iconBefore={
					<Flex xcss={iconSpacingStyles.space050}>
						<HeartIcon label="" />
					</Flex>
				}
				iconAfter={
					<Flex xcss={iconSpacingStyles.space050}>
						<ArrowRightIcon label="" />
					</Flex>
				}
				description="Both are new icons with a spacious spacing prop"
			>
				Spacious new icons
			</ButtonItem>
		</MenuGroup>
	);
};

export default IconSizing;
