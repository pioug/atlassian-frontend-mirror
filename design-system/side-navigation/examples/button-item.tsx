import React from 'react';

import OpenIcon from '@atlaskit/icon/core/arrow-up-right';
import AddItemIcon from '@atlaskit/icon/core/shortcut';
import { ButtonItem } from '@atlaskit/side-navigation';

const Example = (): React.JSX.Element => (
	<>
		<ButtonItem>Create article</ButtonItem>
		<ButtonItem isSelected>Create article</ButtonItem>
		<ButtonItem isDisabled>Create article</ButtonItem>
		<ButtonItem iconAfter={<OpenIcon spacing="spacious" label="" />}>Create article</ButtonItem>
		<ButtonItem description="Will create an article">Create article</ButtonItem>
		<ButtonItem iconBefore={<AddItemIcon spacing="spacious" label="" />}>Create article</ButtonItem>
		<ButtonItem
			iconBefore={<AddItemIcon spacing="spacious" label="" />}
			iconAfter={<OpenIcon spacing="spacious" label="" />}
		>
			Create article
		</ButtonItem>
		<ButtonItem
			description="Will create an article"
			iconBefore={<AddItemIcon spacing="spacious" label="" />}
		>
			Create article
		</ButtonItem>
		<ButtonItem
			description="Will create an article"
			iconBefore={<AddItemIcon spacing="spacious" label="" />}
			iconAfter={<OpenIcon spacing="spacious" label="" />}
		>
			Create article
		</ButtonItem>
	</>
);

export default Example;
