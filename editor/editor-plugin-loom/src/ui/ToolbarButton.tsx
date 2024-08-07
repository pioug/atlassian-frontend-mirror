/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages';
import type { EditorAppearance, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { TOOLBAR_BUTTON, ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import { LoomIcon } from '@atlaskit/logo';
import { fg } from '@atlaskit/platform-feature-flags';
import { Text } from '@atlaskit/primitives';

import { recordVideo } from '../commands';
import type { LoomPlugin } from '../plugin';

// This const is derived from the breakpoint where the toolbar hides its icons. It is used to hide the text in the AI button.
// Derived from values from platform/packages/editor/editor-core/src/ui/Appearance/FullPage/MainToolbar.tsx
const LOOM_BUTTON_WIDTH_BREAKPOINT = 1076;

const LoomToolbarButton = ({
	disabled,
	api,
	appearance,
	intl: { formatMessage },
}: {
	disabled: boolean;
	appearance: EditorAppearance;
	api: ExtractInjectionAPI<LoomPlugin> | undefined;
} & WrappedComponentProps) => {
	const { loomState, widthState } = useSharedPluginState(api, ['loom', 'width']);
	if (!loomState) {
		return null;
	}

	const label = formatMessage(
		appearance === 'comment'
			? toolbarInsertBlockMessages.addLoomVideoComment
			: toolbarInsertBlockMessages.addLoomVideo,
	);
	const shouldShowRecordText =
		fg('platform.editor.plugin.loom.responsive-menu_4at4a') &&
		(widthState?.width || 0) > LOOM_BUTTON_WIDTH_BREAKPOINT;

	return (
		<ToolbarButton
			buttonId={TOOLBAR_BUTTON.RECORD_VIDEO}
			onClick={() =>
				api?.core?.actions.execute(
					recordVideo({
						inputMethod: INPUT_METHOD.TOOLBAR,
						editorAnalyticsAPI: api?.analytics?.actions,
					}),
				)
			}
			// Disable the icon while the SDK isn't initialised
			disabled={disabled || !loomState?.isEnabled}
			title={label}
			iconBefore={<LoomIcon label={label} size="small" />}
		>
			{shouldShowRecordText && (
				<Text>{formatMessage(toolbarInsertBlockMessages.recordLoomShortTitle)}</Text>
			)}
		</ToolbarButton>
	);
};

export default injectIntl(LoomToolbarButton);
