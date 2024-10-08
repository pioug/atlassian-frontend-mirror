import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import EditorAddIcon from '@atlaskit/icon/glyph/editor/add';
import { Box, Pressable, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { type InsertBlockPlugin } from '../../plugin';

const wrapperStyles = xcss({
	width: '32px',
	height: '32px',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
});

const buttonStyles = xcss({
	boxSizing: 'border-box',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	height: token('space.300'),
	width: token('space.300'),
	border: 'none',
	backgroundColor: 'color.background.neutral.subtle',
	borderRadius: 'border.radius.circle',
	color: 'color.text',
	zIndex: 'card',
	outline: 'none',

	':hover': {
		backgroundColor: 'color.background.neutral.hovered',
	},

	':active': {
		backgroundColor: 'color.background.neutral.pressed',
	},

	':focus': {
		outline: `2px solid ${token('color.border.focused')}`,
	},
});

const disabledStyles = xcss({
	color: 'color.text.disabled',
	backgroundColor: 'color.background.neutral.subtle',
	':hover': {
		backgroundColor: 'color.background.neutral.subtle',
	},

	':active': {
		backgroundColor: 'color.background.neutral.subtle',
	},
});

const activeStyles = xcss({
	backgroundColor: 'color.background.selected',
	color: 'color.text.selected',

	':hover': {
		backgroundColor: 'color.background.selected',
		color: 'color.text.selected',
	},
});

type Props = {
	onClick: () => void;
	isDisabled: boolean;
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
};

export const RightRailIcon = ({ onClick, isDisabled, api }: Props) => {
	const { formatMessage } = useIntl();
	const { insertBlockState } = useSharedPluginState(api, ['insertBlock']);

	const isOpen = insertBlockState?.menuBrowserOpen;

	return (
		<Box xcss={[wrapperStyles]}>
			<Tooltip
				content={
					<ToolTipContent
						// Re-using insertRightRailTitle for tooltip, both messages are the same
						description={formatMessage(toolbarInsertBlockMessages.insertRightRailTitle)}
						shortcutOverride="/"
					/>
				}
			>
				<Pressable
					type="button"
					aria-label={formatMessage(toolbarInsertBlockMessages.insertMenu)}
					xcss={[
						buttonStyles,
						isDisabled ? disabledStyles : undefined,
						isOpen ? activeStyles : undefined,
					]}
					onClick={onClick}
					isDisabled={isDisabled}
				>
					<EditorAddIcon
						label={formatMessage(toolbarInsertBlockMessages.insertMenu)}
						size="medium"
					/>
				</Pressable>
			</Tooltip>
		</Box>
	);
};
