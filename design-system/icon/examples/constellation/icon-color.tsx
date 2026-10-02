import React from 'react';

import { cssMap } from '@atlaskit/css';
import LinkIcon from '@atlaskit/icon/core/link';
import SettingsIcon from '@atlaskit/icon/core/settings';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
import WhiteboardIcon from '@atlaskit/icon/core/whiteboard';
import ButtonItem from '@atlaskit/menu/button-item';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const IconColorExample = (): React.JSX.Element => {
	const [isMenuSelected, setIsMenuSelected] = React.useState(true);
	return (
		<Stack space="space.200" alignBlock="center">
			<Inline space="space.100">
				<WhiteboardIcon color={token('color.icon.accent.teal')} label="" />
				<StatusErrorIcon color={token('color.icon.danger')} label="" />
				<LinkIcon color={token('color.link')} label="" />
			</Inline>
			<Box testId="button-items">
				<ButtonItem
					isSelected={isMenuSelected}
					iconBefore={
						<Flex xcss={iconSpacingStyles.space050}>
							<SettingsIcon label="" />
						</Flex>
					}
					onClick={() => setIsMenuSelected(!isMenuSelected)}
				>
					Settings
				</ButtonItem>
			</Box>
		</Stack>
	);
};

export default IconColorExample;
