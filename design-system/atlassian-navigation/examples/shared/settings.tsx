import React, { useState } from 'react';

import { Settings } from '@atlaskit/atlassian-navigation';
import { ButtonItem, HeadingItem, MenuGroup, Section } from '@atlaskit/menu';
import Popup from '@atlaskit/popup';

const SettingsContent = () => (
	<MenuGroup>
		<Section>
			<HeadingItem>App</HeadingItem>
			<ButtonItem>Admin settings</ButtonItem>
			<ButtonItem>Third party extensions</ButtonItem>
		</Section>
		<Section hasSeparator>
			<HeadingItem>Atlassian</HeadingItem>
			<ButtonItem>Customers</ButtonItem>
			<ButtonItem>Try Jira</ButtonItem>
		</Section>
	</MenuGroup>
);

export const DefaultSettings = (): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	const onClick = () => {
		setIsOpen(!isOpen);
	};

	const onClose = () => {
		setIsOpen(false);
	};

	return (
		<Popup
			shouldRenderToParent
			placement="bottom-start"
			content={SettingsContent}
			isOpen={isOpen}
			onClose={onClose}
			trigger={(triggerProps) => (
				<Settings onClick={onClick} isSelected={isOpen} tooltip="Settings" {...triggerProps} />
			)}
		/>
	);
};

export default DefaultSettings;
