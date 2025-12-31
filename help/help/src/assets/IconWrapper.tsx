import React from 'react';

import { Flex } from '@atlaskit/primitives/compiled';
import { IconTile, type NewCoreIconProps } from '@atlaskit/icon';

type IconWrapperProps = {
	appearance: string;
	Icon: (props: NewCoreIconProps) => JSX.Element;
};

export const IconWrapper = ({ Icon, appearance }: IconWrapperProps): React.JSX.Element => {
	return (
		<Flex alignItems="center" justifyContent="center">
			{/* @ts-ignore */}
			<IconTile icon={Icon} size="16" label="" appearance={appearance} />
		</Flex>
	);
};
