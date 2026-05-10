import React from 'react';

import { Flex } from '@atlaskit/primitives/compiled';
import { type NewCoreIconProps } from '@atlaskit/icon';
import { token } from '@atlaskit/tokens';

type IconWrapperProps = {
	appearance: string;
	Icon: (props: NewCoreIconProps) => JSX.Element;
};

const appearanceToColorMap: Record<string, string> = {
	blue: token('color.icon.accent.blue'),
	blueBold: token('color.icon.accent.blue'),
	gray: token('color.icon.accent.gray'),
	grayBold: token('color.icon.accent.gray'),
	green: token('color.icon.accent.green'),
	greenBold: token('color.icon.accent.green'),
	lime: token('color.icon.accent.lime'),
	limeBold: token('color.icon.accent.lime'),
	magenta: token('color.icon.accent.magenta'),
	magentaBold: token('color.icon.accent.magenta'),
	orange: token('color.icon.accent.orange'),
	orangeBold: token('color.icon.accent.orange'),
	purple: token('color.icon.accent.purple'),
	purpleBold: token('color.icon.accent.purple'),
	red: token('color.icon.accent.red'),
	redBold: token('color.icon.accent.red'),
	teal: token('color.icon.accent.teal'),
	tealBold: token('color.icon.accent.teal'),
	yellow: token('color.icon.accent.yellow'),
	yellowBold: token('color.icon.accent.yellow'),
};

export const IconWrapper = ({ Icon, appearance }: IconWrapperProps): React.JSX.Element => {
	const color = appearanceToColorMap[appearance] as NewCoreIconProps['color'];
	return (
		<Flex alignItems="center" justifyContent="center">
			<Icon label="" color={color} />
		</Flex>
	);
};
