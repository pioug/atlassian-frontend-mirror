import React from 'react';

import ArrowRightIcon from '@atlaskit/icon/core/arrow-right';
import HeartIcon from '@atlaskit/icon/core/heart';
import DepartmentIconLegacy from '@atlaskit/icon/glyph/department';
import StarIconLegacy from '@atlaskit/icon/glyph/star';

import { ButtonItem, HeadingItem, MenuGroup } from '../src';

const IconSizing = () => {
	return (
		<MenuGroup>
			<HeadingItem testId="heading-item">Legacy icons</HeadingItem>
			<ButtonItem
				iconBefore={<StarIconLegacy label="" size="small" />}
				iconAfter={<DepartmentIconLegacy label="" size="small" />}
				description="Both are legacy icons a small size prop"
			>
				Small legacy icons
			</ButtonItem>
			<ButtonItem
				iconBefore={<StarIconLegacy label="" size="medium" />}
				iconAfter={<DepartmentIconLegacy label="" size="medium" />}
				description="Both are legacy icons a medium size prop"
			>
				Medium legacy icons
			</ButtonItem>
			<ButtonItem
				iconBefore={<StarIconLegacy label="" size="large" />}
				iconAfter={<DepartmentIconLegacy label="" size="large" />}
				description="Both are legacy icons a large size prop"
			>
				Large legacy icons
			</ButtonItem>
			<ButtonItem
				iconBefore={<StarIconLegacy label="" size="xlarge" />}
				iconAfter={<DepartmentIconLegacy label="" size="xlarge" />}
				description="Both are legacy icons a xlarge size prop"
			>
				Xlarge legacy icons
			</ButtonItem>
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
