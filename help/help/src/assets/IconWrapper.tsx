import React from 'react';

import { token } from '@atlaskit/tokens';
import { Flex } from '@atlaskit/primitives/compiled';
import { IconTile, type IconProps, type NewCoreIconProps } from '@atlaskit/icon';
import { fg } from '@atlaskit/platform-feature-flags';

type IconWrapperProps = {
	appearance: string;
	Icon: React.FC<NewCoreIconProps>;
	LegacyIcon: ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => JSX.Element;
};

export const IconWrapper = ({ Icon, LegacyIcon, appearance }: IconWrapperProps) => {
	return (
		<Flex alignItems="center" justifyContent="center">
			{!fg('platform-visual-refresh-icons') ? (
				<Icon LEGACY_fallbackIcon={LegacyIcon} label="" color={token('color.icon.inverse')} />
			) : (
				// @ts-ignore
				<IconTile icon={Icon} size="16" label="" appearance={appearance} />
			)}
		</Flex>
	);
};
