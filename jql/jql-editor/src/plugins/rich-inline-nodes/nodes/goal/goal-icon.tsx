import React, { type ComponentProps } from 'react';

import { IconTile } from '@atlaskit/icon';
import KeyResultIcon from '@atlaskit/icon/core/key-result';
import ObjectiveIcon from '@atlaskit/icon/core/objective';
import { token } from '@atlaskit/tokens';

const goalAppearances = ['DEFAULT', 'ON_TRACK', 'AT_RISK', 'OFF_TRACK', 'MENU'] as const;

type GoalAppearance = (typeof goalAppearances)[number];

const GOAL_ICON_KEYS = ['GOAL', 'OBJECTIVE', 'KEY_RESULT'] as const;

export type GoalIconKey = (typeof GOAL_ICON_KEYS)[number];

const isGoalAppearance = (value: string): value is GoalAppearance =>
	(goalAppearances as ReadonlyArray<string>).includes(value.toLocaleUpperCase());

export const isGoalIconKey = (value: string): value is GoalIconKey =>
	(GOAL_ICON_KEYS as readonly string[]).includes(value);

interface GoalIconProps {
	iconKey?: GoalIconKey;
	size?: ComponentProps<typeof IconTile>['size'];
	status: string;
}

const appearanceToColorMap = {
	DEFAULT: 'gray',
	MENU: 'gray',
	OFF_TRACK: 'red',
	AT_RISK: 'yellow',
	ON_TRACK: 'green',
} as const;

const appearanceToNewColorMap = {
	MENU: token('color.icon'),
	DEFAULT: token('color.icon.accent.gray'),
	OFF_TRACK: token('color.icon.danger'),
	AT_RISK: token('color.icon.warning'),
	ON_TRACK: token('color.icon.success'),
} as const;

const keyToIconMap = {
	GOAL: ObjectiveIcon,
	OBJECTIVE: ObjectiveIcon,
	KEY_RESULT: KeyResultIcon,
};

export const GoalIcon = ({ status, size, iconKey = 'GOAL' }: GoalIconProps): React.JSX.Element => {
	const Icon = keyToIconMap[iconKey as keyof typeof keyToIconMap] ?? keyToIconMap.GOAL;
	const appearance = isGoalAppearance(status) ? status : 'DEFAULT';

	// Icon tile no longer supports a 16px size
	if (size === 'xsmall') {
		return <Icon label="" size="medium" color={appearanceToNewColorMap[appearance]} />;
	}

	return (
		<IconTile
			size={size}
			icon={Icon}
			label=""
			appearance={appearanceToColorMap[appearance as keyof typeof appearanceToColorMap]}
		/>
	);
};
