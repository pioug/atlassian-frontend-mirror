import React, { type ReactNode } from 'react';
import { TabContainer, TabLabels, TabLabel } from './styled';
import { Inline, Text } from '@atlaskit/primitives';

interface TabProps {
	label: string;
	index: number;
	onClick: (index: number) => void;
	isActive: boolean;
	icon: ReactNode;
}

interface TabsProps {
	activeTab: number;
	onTabClick: (index: number) => void;
	tabs: { label: string; icon: ReactNode }[];
}

const Tab: React.FC<TabProps> = ({ label, index, onClick, isActive, icon }) => {
	return (
		<TabLabel isActive={isActive} onClick={() => onClick(index)}>
			<Inline space="space.100" alignBlock="center" alignInline="center">
				{icon}
				<Text color={isActive ? 'color.text.selected' : 'color.text'}>{label}</Text>
			</Inline>
		</TabLabel>
	);
};

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabClick, tabs }) => {
	return (
		<TabContainer>
			<TabLabels>
				{tabs.map((tab, index) => {
					return (
						<Tab
							key={index}
							label={tab.label}
							index={index}
							onClick={onTabClick}
							isActive={activeTab === index}
							icon={tab.icon}
						/>
					);
				})}
			</TabLabels>
		</TabContainer>
	);
};

export { Tabs };
