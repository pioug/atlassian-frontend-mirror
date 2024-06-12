import React, { useCallback, useState } from 'react';

import { useGlobals } from '@storybook/api';
import { IconButton, Icons, TooltipLinkList, WithTooltip } from '@storybook/components';

import { TOOL_ID } from '../constants';
import { type Themes } from '../types';

interface ThemeOption {
	id: Themes;
	title: string;
	icon: string;
}

const themeOptions: ThemeOption[] = [
	{ id: 'auto', title: 'Same as system', icon: 'mirror' },
	{ id: 'light', title: 'Light theme', icon: 'circlehollow' },
	{ id: 'dark', title: 'Dark theme', icon: 'circle' },
	{ id: 'split', title: 'Side by side', icon: 'sidebar' },
	{ id: 'stack', title: 'Stacked', icon: 'bottombar' },
	{ id: 'none', title: 'Disable (Unsafe)', icon: 'cross' },
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
			closeOnClick
			onVisibilityChange={setIsVisible}
			tooltip={({ onHide }) => (
				<TooltipLinkList
					links={themeOptions.map(({ id, title, icon }) => ({
						id,
						title,
						active: adsTheme === id,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						right: <Icons style={{ opacity: 1 }} icon={icon as any} />,
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
				<Icons
					icon={(themeOptions.find(({ id }) => id === adsTheme)?.icon as any) || 'circlehollow'}
				/>
				{'\xa0ADS Theme'}
			</IconButton>
		</WithTooltip>
	);
};

export default Tool;
