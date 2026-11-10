import React, { forwardRef, useCallback } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import { isOfflineMode } from '@atlaskit/editor-common/connectivity/isOfflineMode';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import { LoomIcon } from '@atlaskit/editor-toolbar/loom-icon';
import { ToolbarButton } from '@atlaskit/editor-toolbar/toolbar-button';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';

import type { LoomPlugin } from '../loomPluginType';
import { executeRecordVideo } from '../pm-plugins/commands';
import type { ButtonComponent, ButtonComponentProps } from '../types';
import { useLoomToolbarButtonState } from './LoomToolbarButtonGroup';

const messages = defineMessages({
	recordLoom: {
		id: 'editor-plugin-loom.LoomToolbarButtonWrapper.recordLoom',
		defaultMessage: 'Record a Loom',
		description:
			'Tooltip and accessible label for the Loom recording button in the pinned editor toolbar. Clicking opens the recorder or the flow to get access to Loom.',
	},
});

export const createToolbarButton = (
	api: ExtractInjectionAPI<LoomPlugin> | undefined,
): ButtonComponent =>
	forwardRef<HTMLElement, ButtonComponentProps>(function LoomButton(
		{ isDisabled = false, onClickBeforeInit, selected, onBlur, onFocus },
		ref,
	) {
		const { formatMessage } = useIntl();
		const { loomEnabled, connectivityMode } = useSharedPluginStateWithSelector(
			api,
			['loom', 'connectivity'],
			(states) => ({
				loomEnabled: states.loomState?.isEnabled,
				connectivityMode: states.connectivityState?.mode,
			}),
		);
		const label = formatMessage(messages.recordLoom);
		const handleRef = useCallback(
			(button: HTMLButtonElement | null) => {
				if (typeof ref === 'function') {
					return ref(button);
				}
				if (ref) {
					ref.current = button;
				}
			},
			[ref],
		);
		const handleClick = useCallback(
			(event: React.MouseEvent<HTMLButtonElement>) => {
				if (loomEnabled) {
					executeRecordVideo(api);
				} else {
					onClickBeforeInit?.(event);
				}
			},
			[loomEnabled, onClickBeforeInit],
		);

		return (
			<ToolbarTooltip content={label}>
				<ToolbarButton
					ref={handleRef}
					iconBefore={<LoomIcon label="" size="small" />}
					label={label}
					testId="editor-toolbar-loom-button"
					isSelected={selected}
					isDisabled={
						isDisabled || isOfflineMode(connectivityMode) || (!loomEnabled && !onClickBeforeInit)
					}
					onBlur={onBlur}
					onFocus={onFocus}
					onClick={handleClick}
				/>
			</ToolbarTooltip>
		);
	});

export const LoomToolbarButtonWrapper = ({
	buttonComponent: LoomButton,
}: {
	buttonComponent: ButtonComponent;
}): React.JSX.Element => {
	const buttonState = useLoomToolbarButtonState();
	return (
		<LoomButton
			ref={buttonState?.buttonRef}
			isDisabled={buttonState?.buttonProps.isDisabled}
			onClickBeforeInit={buttonState?.buttonProps.onClickBeforeInit}
			selected={buttonState?.buttonProps.selected}
			onBlur={buttonState?.buttonProps.onBlur}
			onFocus={buttonState?.buttonProps.onFocus}
		/>
	);
};
