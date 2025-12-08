import React, { useCallback } from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { LoomIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';

import type { LoomPlugin } from '../loomPluginType';
import { executeRecordVideo } from '../pm-plugins/commands';
import type { ButtonComponentProps, LoomPluginOptions } from '../types';

interface Props extends Omit<ButtonComponentProps, 'onClickBeforeInit'> {
	disabled: boolean;
	onClick: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

const useLoomEnabled = (api: ExtractInjectionAPI<LoomPlugin> | undefined) => {
	const { loomEnabled } = useSharedPluginStateWithSelector(api, ['loom'], (states) => {
		return {
			loomEnabled: states.loomState?.isEnabled,
		};
	});

	return loomEnabled;
};

export const LoomMenuItem = ({
	api,
	renderButton,
}: {
	api: ExtractInjectionAPI<LoomPlugin> | undefined;
} & Pick<LoomPluginOptions, 'renderButton'>) => {
	const loomEnabled = useLoomEnabled(api);
	const { editorViewMode } = useEditorToolbar();

	if (editorViewMode !== 'edit' && fg('platform_editor_toolbar_aifc_overflow_menu_update')) {
		return null;
	}

	if (renderButton) {
		return renderButton(CustomisableLoomMenuItem(api));
	} else if (loomEnabled !== undefined) {
		return <DefaultLoomMenuItem api={api} />;
	}
};

const CustomisableLoomMenuItem = (api: ExtractInjectionAPI<LoomPlugin> | undefined) =>
	React.forwardRef<HTMLElement, ButtonComponentProps>(
		({ isDisabled = false, onClickBeforeInit, href, target, rel }, ref) => {
			const loomEnabled = !!useLoomEnabled(api);
			const handleOnClick = useCallback(
				(e: React.MouseEvent | React.KeyboardEvent) => {
					if (loomEnabled) {
						executeRecordVideo(api);
					} else if (onClickBeforeInit && e.type === 'click' && e.target instanceof HTMLElement) {
						onClickBeforeInit(e as React.MouseEvent<HTMLElement, MouseEvent>);
					}
				},
				[loomEnabled, onClickBeforeInit],
			);

			return (
				<MenuItemComponent
					ref={ref}
					// Ignore href if Loom is enabled so that it doesn't interfere with recording
					href={loomEnabled ? undefined : href}
					disabled={isDisabled}
					onClick={handleOnClick}
					target={target}
					rel={rel}
				/>
			);
		},
	);

const DefaultLoomMenuItem = ({ api }: { api: ExtractInjectionAPI<LoomPlugin> | undefined }) => {
	const loomEnabled = useLoomEnabled(api);
	const handleOnClick = useCallback(() => executeRecordVideo(api), [api]);

	return <MenuItemComponent disabled={!loomEnabled} onClick={handleOnClick} />;
};

const MenuItemComponent = React.forwardRef<HTMLElement, Props>(
	// eslint-disable-next-line no-unused-vars
	({ disabled, onClick, href, target, rel }, ref) => {
		const { editorAppearance } = useEditorToolbar();
		const { formatMessage } = useIntl();

		return (
			<ToolbarDropdownItem
				elemBefore={<LoomIcon size="small" label="" />}
				isDisabled={disabled}
				href={href}
				target={target}
				rel={rel}
				onClick={(e) => onClick(e)}
			>
				{formatMessage(
					editorAppearance === 'comment' ? messages.addLoomVideoComment : messages.addLoomVideo,
				)}
			</ToolbarDropdownItem>
		);
	},
);
