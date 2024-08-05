import React, { type ReactElement, useCallback, useState } from 'react';

import { IconButton, TooltipLinkList, WithTooltip } from '@storybook/components';
import {
	BottomBarIcon,
	CircleHollowIcon,
	CircleIcon,
	CrossIcon,
	MirrorIcon,
	SidebarIcon,
} from '@storybook/icons';
import { useGlobals } from '@storybook/manager-api';

import { TOOL_ID } from './constants';
import { type Themes } from './types';

interface ThemeOption {
	id: Themes;
	title: string;
	icon: ReactElement;
}

const themeOptions: ThemeOption[] = [
	{ id: 'auto', title: 'Same as system', icon: <MirrorIcon /> },
	{ id: 'light', title: 'Light theme', icon: <CircleHollowIcon /> },
	{ id: 'dark', title: 'Dark theme', icon: <CircleIcon /> },
	{ id: 'split', title: 'Side by side', icon: <SidebarIcon /> },
	{ id: 'stack', title: 'Stacked', icon: <BottomBarIcon /> },
	{ id: 'none', title: 'Disable (Unsafe)', icon: <CrossIcon /> },
];

/**
 * __Tool__
 *
 * ADS Toolbar UI, visible in the topbar of the storybook UI.
 */
const Tool = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [{ adsTheme }, updateGlobals] = useGlobals();

	const setTheme = useCallback(
		(theme: Themes) => updateGlobals({ adsTheme: theme }),
		[updateGlobals],
	);

	return (
		<WithTooltip
			placement="top"
			trigger="click"
			// closeOnClick
			onVisibleChange={setIsVisible}
			tooltip={({ onHide }: { onHide: () => void }) => (
				<TooltipLinkList
					links={themeOptions.map(({ id, title, icon }) => ({
						id,
						title,
						active: adsTheme === id,
						icon: icon,
						onClick: () => {
							setTheme(id);
							onHide();
						},
					}))}
				/>
			)}
		>
			{/* @ts-ignore */}
			<IconButton key={TOOL_ID} active={isVisible} title="Apply ADS themes to your story">
				{themeOptions.find(({ id }) => adsTheme === id)?.icon}
				{'\xa0ADS Theme'}
			</IconButton>
		</WithTooltip>
	);
};

export default Tool;
