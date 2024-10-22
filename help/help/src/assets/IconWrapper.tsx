import React from 'react';

import { token } from '@atlaskit/tokens';
import { Flex } from '@atlaskit/primitives';
import { IconTile, type IconProps, type UNSAFE_NewCoreIconProps } from '@atlaskit/icon';
import { fg } from '@atlaskit/platform-feature-flags';

type IconWrapperProps = {
	Icon: React.FC<UNSAFE_NewCoreIconProps>;
	LegacyIcon: ({ label, primaryColor, secondaryColor, size, testId }: IconProps) => JSX.Element;
	appearance: string;
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
