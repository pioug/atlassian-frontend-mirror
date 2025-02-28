/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag jsx
 */
import { type KeyboardEvent, type MouseEvent } from 'react';

import { useIntl } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import { cssMap, cx, jsx } from '@atlaskit/css';
import LinkIcon from '@atlaskit/icon/core/link';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import messages from './messages';

const styles = cssMap({
	hidden: {
		opacity: 0,
	},
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
			<Box xcss={cx(!visible && styles.hidden)}>
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
