/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import type {
	Command,
	DropdownOptionT,
	ExtractInjectionAPI,
	FloatingToolbarOverflowDropdown,
} from '@atlaskit/editor-common/types';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import DatabaseIcon from '@atlaskit/icon/core/database';
import DeleteIcon from '@atlaskit/icon/core/delete';
import EyeOpenIcon from '@atlaskit/icon/core/eye-open';
import LinkIcon from '@atlaskit/icon/core/link';
import Toggle from '@atlaskit/toggle';

import type { EditorPluginNativeEmbedsPlugin } from '../../nativeEmbedsPluginType';
import {
	createCopyLinkCommand,
	createDeleteCommand,
	createToggleAlwaysShowTitle,
	getAlwaysShowTitleState,
} from '../commands';

const noopCommand: Command = () => {
	return true;
};

const toggleButtonStyles = css({
	display: 'flex',
	alignItems: 'center',
	cursor: 'default',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
	'&&': {
		background: 'none',
		border: 'none',
		padding: 0,
		minHeight: 'unset',
	},
});

type DeleteHoverProps = Pick<
	DropdownOptionT<Command>,
	'onMouseEnter' | 'onMouseLeave' | 'onFocus' | 'onBlur'
>;

/**
 * Returns the "More options" overflow dropdown configuration for the native embed floating toolbar.
 */
export const getMoreOptionsDropdown = (
	api: ExtractInjectionAPI<EditorPluginNativeEmbedsPlugin> | undefined,
	selectedNativeEmbed: ContentNodeWithPos,
	deleteHoverProps: DeleteHoverProps,
): FloatingToolbarOverflowDropdown<Command> => {
	const toggleAlwaysShowTitle = createToggleAlwaysShowTitle(api, selectedNativeEmbed);
	return {
		id: 'native-embed-more-options-button',
		type: 'overflow-dropdown',
		dropdownWidth: 250,
		options: [
			{
				id: 'native-embed-always-show-title',
				title: 'Always show title',
				icon: <EyeOpenIcon color="currentColor" spacing="spacious" label="" />,
				elemAfter: (
					<button
						type="button"
						css={toggleButtonStyles}
						onClick={(e) => {
							e.stopPropagation();
							toggleAlwaysShowTitle();
						}}
					>
						<Toggle
							isChecked={getAlwaysShowTitleState(selectedNativeEmbed)}
							label="Always show title"
						/>
					</button>
				),
				onClick: () => {
					toggleAlwaysShowTitle();
					return true;
				},
			},
			{
				id: 'native-embed-set-embed-type',
				title: 'Set embed type',
				icon: <DatabaseIcon color="currentColor" spacing="spacious" label="" />,
				onClick: noopCommand,
			},
			{ type: 'separator' },
			{
				id: 'native-embed-copy-link',
				title: 'Copy link',
				icon: <LinkIcon color="currentColor" spacing="spacious" label="" />,
				onClick: createCopyLinkCommand(selectedNativeEmbed),
			},
			{
				id: 'native-embed-delete',
				title: 'Delete',
				icon: <DeleteIcon color="currentColor" spacing="spacious" label="" />,
				onClick: createDeleteCommand(selectedNativeEmbed),
				...deleteHoverProps,
			},
		],
	};
};
