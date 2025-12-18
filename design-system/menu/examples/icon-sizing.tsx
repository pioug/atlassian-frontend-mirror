import React from 'react';

import ArrowRightIcon from '@atlaskit/icon/core/arrow-right';
import HeartIcon from '@atlaskit/icon/core/heart';
import { ButtonItem, HeadingItem, MenuGroup } from '@atlaskit/menu';

const IconSizing = (): React.JSX.Element => {
	return (
		<MenuGroup>
			<HeadingItem testId="heading-item">New icons</HeadingItem>
			<ButtonItem
				iconBefore={<HeartIcon label="" spacing="none" />}
				iconAfter={<ArrowRightIcon label="" spacing="none" />}
				description="Both are new icons with a 'none' spacing prop"
			>
				No spacing new icons
			</ButtonItem>
			<ButtonItem
				iconBefore={<HeartIcon label="" spacing="spacious" />}
				iconAfter={<ArrowRightIcon label="" spacing="spacious" />}
				description="Both are new icons with a spacious spacing prop"
			>
				Spacious new icons
			</ButtonItem>
		</MenuGroup>
	);
};

export default IconSizing;
