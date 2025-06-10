import React from 'react';

import { ButtonItem, MenuGroup, Section } from '@atlaskit/menu';

import ImgIcon from './common/img-icon';
import MenuGroupContainer from './common/menu-group-container';
import battery from './icons/battery.png';
import cloud from './icons/cloud.png';
import koala from './icons/koala.png';
import ui from './icons/ui.png';
import wallet from './icons/wallet.png';

export default () => {
	return (
		<MenuGroupContainer>
			<MenuGroup maxHeight={300}>
				<Section title="Recent" isScrollable>
					<ButtonItem
						iconBefore={<ImgIcon src={battery} alt="" />}
						description="Next-gen software project"
					>
						Fabric Editor
					</ButtonItem>
					<ButtonItem
						iconBefore={<ImgIcon src={cloud} alt="" />}
						description="Classic business project"
					>
						Content Services
					</ButtonItem>
					<ButtonItem
						iconBefore={<ImgIcon src={wallet} alt="" />}
						description="Next-gen software project"
					>
						Trinity Mobile
					</ButtonItem>
					<ButtonItem
						iconBefore={<ImgIcon src={koala} alt="" />}
						description="Classic service desk"
					>
						Customer Feedback
					</ButtonItem>
					<ButtonItem
						iconBefore={<ImgIcon src={ui} alt="" />}
						description="Classic software project"
					>
						Design System
					</ButtonItem>
				</Section>
				<Section hasSeparator>
					<ButtonItem>View all projects</ButtonItem>
					<ButtonItem>Create project</ButtonItem>
				</Section>
			</MenuGroup>
		</MenuGroupContainer>
	);
};
