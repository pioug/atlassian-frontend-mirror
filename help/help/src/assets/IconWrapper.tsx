import React from 'react';

import { token } from '@atlaskit/tokens';
import { Flex } from '@atlaskit/primitives/compiled';
import { IconTile, type NewCoreIconProps } from '@atlaskit/icon';
import { fg } from '@atlaskit/platform-feature-flags';

type IconWrapperProps = {
	appearance: string;
	Icon: (props: NewCoreIconProps) => JSX.Element;
};

export const IconWrapper = ({ Icon, appearance }: IconWrapperProps): React.JSX.Element => {
	return (
		<Flex alignItems="center" justifyContent="center">
			{!fg('platform-visual-refresh-icons') ? (
				<Icon label="" color={token('color.icon.inverse')} />
			) : (
				// @ts-ignore
				<IconTile icon={Icon} size="16" label="" appearance={appearance} />
			)}
		</Flex>
	);
};
