import React, { type KeyboardEvent, type MouseEvent } from 'react';

import { useIntl } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import LinkIcon from '@atlaskit/icon/core/link';
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import messages from './messages';

const hiddenStyles = xcss({
	opacity: 0,
});

export const LinkIconButton = ({
	handleCopy,
	visible = true,
}: {
	handleCopy: (e: MouseEvent<Element, globalThis.MouseEvent> | KeyboardEvent<Element>) => void;
	visible?: boolean;
}) => {
	const { formatMessage } = useIntl();

	return (
		<>
			<Box xcss={[!visible && hiddenStyles]}>
				<IconButton
					type="button"
					onClick={handleCopy}
					icon={(iconProps) => <LinkIcon {...iconProps} color={token('color.icon')} />}
					appearance="subtle"
					spacing="compact"
					label={formatMessage(messages.copyAgentLinkLabel)}
				/>
			</Box>
		</>
	);
};
