/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useIntl } from 'react-intl-next';

import { css, jsx } from '@atlaskit/css';
import { selectionToolbarMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import PinIcon from '@atlaskit/icon/core/pin';
import PinFilledIcon from '@atlaskit/icon/core/pin-filled';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

const buttonStyles = css({
	paddingTop: token('space.075'),
	paddingBottom: token('space.075'),
	paddingLeft: token('space.075'),
	paddingRight: token('space.075'),
});

type PrimaryToolbarComponentProps = {
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>;
	disabled?: boolean;
};

/**
 * A component used to renderer a pin/unpin
 * button to the toolbar to the or make it in-line.
 */
export const PrimaryToolbarComponent = ({ api, disabled }: PrimaryToolbarComponentProps) => {
	const intl = useIntl();
	const mode = useSharedPluginStateSelector(api, 'connectivity.mode');
	const isOffline = mode === 'offline' || false;
	const isDockedToTop = fg('platform_editor_use_preferences_plugin')
		? api?.userPreferences?.sharedState.currentState()?.preferences?.toolbarDockingPosition ===
			'top'
		: api?.selectionToolbar.sharedState.currentState()?.toolbarDocking === 'top';
	if (isDockedToTop) {
		return (
			<ToolbarButton
				aria-label={intl.formatMessage(selectionToolbarMessages.toolbarPositionPinedAtTop)}
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
				css={buttonStyles}
				disabled={disabled || isOffline}
				iconBefore={<PinFilledIcon label="" spacing="spacious" />}
				onClick={() => {
					return api?.selectionToolbar.actions?.setToolbarDocking?.('none') ?? false;
				}}
				title={intl.formatMessage(selectionToolbarMessages.toolbarPositionPinedAtTop)}
			/>
		);
	}

	return (
		<ToolbarButton
			aria-label={intl.formatMessage(selectionToolbarMessages.toolbarPositionUnpined)}
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
			css={buttonStyles}
			disabled={disabled || isOffline}
			iconBefore={<PinIcon label="" spacing="spacious" />}
			onClick={() => {
				return api?.selectionToolbar.actions?.setToolbarDocking?.('top') ?? false;
			}}
			title={intl.formatMessage(selectionToolbarMessages.toolbarPositionUnpined)}
		/>
	);
};
