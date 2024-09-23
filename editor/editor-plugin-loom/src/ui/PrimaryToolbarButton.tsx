/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type {
	EditorAppearance,
	ExtractInjectionAPI,
	ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';

import { executeRecordVideo } from '../commands';
import type { LoomPlugin } from '../plugin';
import { loomPluginKey } from '../pm-plugin';
import { type ButtonComponentProps, type LoomPluginOptions } from '../types';

import ToolbarButtonComponent from './ToolbarButtonComponent';

const CustomisableLoomToolbarButton = (
	editorView: EditorView,
	disabled: boolean,
	appearance: EditorAppearance,
	api: ExtractInjectionAPI<LoomPlugin> | undefined,
) =>
	React.forwardRef<HTMLElement, ButtonComponentProps>((props, ref) => {
		const { onClickBeforeInit, isDisabled = false, href, ...restProps } = props;
		const isLoomEnabled = loomPluginKey.getState(editorView.state)?.isEnabled;
		const handleOnClick = useCallback(
			(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
				if (isLoomEnabled) {
					executeRecordVideo(api);
				} else {
					onClickBeforeInit && onClickBeforeInit(e);
				}
			},
			[isLoomEnabled, onClickBeforeInit],
		);
		return (
			<ToolbarButtonComponent
				ref={ref}
				hideTooltip={!!(restProps.onMouseEnter || restProps.onMouseLeave)}
				// Ignore href if Loom is enabled so that it doesn't interfere with recording
				href={isLoomEnabled ? undefined : href}
				disabled={disabled || isDisabled}
				api={api}
				appearance={appearance}
				onClick={(e) => handleOnClick(e)}
				{...restProps}
			/>
		);
	});

const LoomToolbarButtonWrapper = ({
	disabled,
	api,
	appearance,
}: {
	disabled: boolean;
	api: ExtractInjectionAPI<LoomPlugin> | undefined;
	appearance: EditorAppearance;
}) => {
	const handleOnClick = useCallback(() => executeRecordVideo(api), [api]);
	const { loomState } = useSharedPluginState(api, ['loom']);
	if (!loomState) {
		return null;
	}

	return (
		<ToolbarButtonComponent
			// Disable the icon while the SDK isn't initialised
			disabled={disabled || !loomState?.isEnabled}
			api={api}
			appearance={appearance}
			onClick={handleOnClick}
		/>
	);
};

export const loomPrimaryToolbarComponent =
	(
		config: LoomPluginOptions,
		api: ExtractInjectionAPI<LoomPlugin> | undefined,
	): ToolbarUIComponentFactory =>
	({ disabled, appearance, editorView }) => {
		if (config.shouldShowToolbarButton === false) {
			return null;
		}

		if (config.renderButton) {
			return config.renderButton(
				CustomisableLoomToolbarButton(editorView, disabled, appearance, api),
			);
		}

		if (config.shouldShowToolbarButton) {
			return (
				<LoomToolbarButtonWrapper
					// Disable the icon while the SDK isn't initialised
					disabled={disabled}
					api={api}
					appearance={appearance}
				/>
			);
		}

		return null;
	};
