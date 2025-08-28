/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type {
	EditorAppearance,
	ExtractInjectionAPI,
	ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';

import type { LoomPlugin } from '../loomPluginType';
import { executeRecordVideo } from '../pm-plugins/commands';
import { type ButtonComponentProps, type LoomPluginOptions } from '../types';

import ToolbarButtonComponent from './ToolbarButtonComponent';

const selector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<LoomPlugin>,
		'loom' | 'connectivity'
	>,
) => {
	return {
		loomEnabled: states.loomState?.isEnabled,
		connectivityMode: states.connectivityState?.mode,
	};
};

const CustomisableLoomToolbarButton = (
	disabled: boolean,
	appearance: EditorAppearance,
	api: ExtractInjectionAPI<LoomPlugin> | undefined,
) =>
	React.forwardRef<HTMLElement, ButtonComponentProps>((props, ref) => {
		const { onClickBeforeInit, isDisabled = false, href, ...restProps } = props;
		const { loomEnabled, connectivityMode } = useSharedPluginStateWithSelector(
			api,
			['loom', 'connectivity'],
			selector,
		);
		const isLoomEnabled = !!loomEnabled;
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
				disabled={disabled || isDisabled || connectivityMode === 'offline'}
				api={api}
				appearance={appearance}
				onClick={(e) => handleOnClick(e)}
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...restProps}
			/>
		);
	});

const LoomToolbarButtonWrapper = ({
	disabled,
	api,
	appearance,
}: {
	api: ExtractInjectionAPI<LoomPlugin> | undefined;
	appearance: EditorAppearance;
	disabled: boolean;
}) => {
	const handleOnClick = useCallback(() => executeRecordVideo(api), [api]);
	const { loomEnabled, connectivityMode } = useSharedPluginStateWithSelector(
		api,
		['loom', 'connectivity'],
		selector,
	);
	if (loomEnabled === undefined) {
		return null;
	}

	return (
		<ToolbarButtonComponent
			// Disable the icon while the SDK isn't initialised
			disabled={disabled || !loomEnabled || connectivityMode === 'offline'}
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
	({ disabled, appearance }) => {
		if (config.shouldShowToolbarButton === false) {
			return null;
		}

		if (config.renderButton) {
			return config.renderButton(CustomisableLoomToolbarButton(disabled, appearance, api));
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
