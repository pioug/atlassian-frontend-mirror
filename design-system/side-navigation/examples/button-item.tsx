import React from 'react';

import { cssMap } from '@atlaskit/css';
import OpenIcon from '@atlaskit/icon/core/arrow-up-right';
import AddItemIcon from '@atlaskit/icon/core/shortcut';
import { Flex } from '@atlaskit/primitives/compiled';
import { ButtonItem } from '@atlaskit/side-navigation';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const Example = (): React.JSX.Element => (
	<>
		<ButtonItem>Create article</ButtonItem>
		<ButtonItem isSelected>Create article</ButtonItem>
		<ButtonItem isDisabled>Create article</ButtonItem>
		<ButtonItem
			iconAfter={
				<Flex xcss={iconSpacingStyles.space050}>
					<OpenIcon label="" />
				</Flex>
			}
		>
			Create article
		</ButtonItem>
		<ButtonItem description="Will create an article">Create article</ButtonItem>
		<ButtonItem
			iconBefore={
				<Flex xcss={iconSpacingStyles.space050}>
					<AddItemIcon label="" />
				</Flex>
			}
		>
			Create article
		</ButtonItem>
		<ButtonItem
			iconBefore={
				<Flex xcss={iconSpacingStyles.space050}>
					<AddItemIcon label="" />
				</Flex>
			}
			iconAfter={
				<Flex xcss={iconSpacingStyles.space050}>
					<OpenIcon label="" />
				</Flex>
			}
		>
			Create article
		</ButtonItem>
		<ButtonItem
			description="Will create an article"
			iconBefore={
				<Flex xcss={iconSpacingStyles.space050}>
					<AddItemIcon label="" />
				</Flex>
			}
		>
			Create article
		</ButtonItem>
		<ButtonItem
			description="Will create an article"
			iconBefore={
				<Flex xcss={iconSpacingStyles.space050}>
					<AddItemIcon label="" />
				</Flex>
			}
			iconAfter={
				<Flex xcss={iconSpacingStyles.space050}>
					<OpenIcon label="" />
				</Flex>
			}
		>
			Create article
		</ButtonItem>
	</>
);

export default Example;
