import React from 'react';

import ErrorIcon from '@atlaskit/icon/core/error';
import LinkIcon from '@atlaskit/icon/core/link';
import SettingsIcon from '@atlaskit/icon/core/settings';
import WhiteboardIcon from '@atlaskit/icon/core/whiteboard';
import { ButtonItem } from '@atlaskit/menu';
import { Box, Inline, Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const IconColorExample = () => {
	const [isMenuSelected, setIsMenuSelected] = React.useState(true);
	return (
		<Stack space="space.200" alignBlock="center">
			<Inline space="space.100">
				<WhiteboardIcon color={token('color.icon.accent.teal')} label="" />
				<ErrorIcon color={token('color.icon.danger')} label="" />
				<LinkIcon color={token('color.link')} label="" />
			</Inline>
			<Box testId="button-items">
				<ButtonItem
					isSelected={isMenuSelected}
					iconBefore={<SettingsIcon spacing="spacious" label="" />}
					onClick={() => setIsMenuSelected(!isMenuSelected)}
				>
					Settings
				</ButtonItem>
			</Box>
		</Stack>
	);
};

export default IconColorExample;
