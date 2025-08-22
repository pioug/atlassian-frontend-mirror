/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { type EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	useSharedPluginState,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import { ToolbarSize, type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { TextFormattingPlugin } from '../textFormattingPluginType';

import { ToolbarButtonsStrong } from './Toolbar/constants';
import { FormattingTextDropdownMenu } from './Toolbar/dropdown-menu';
import { useClearIcon } from './Toolbar/hooks/clear-formatting-icon';
import { useFormattingIcons } from './Toolbar/hooks/formatting-icons';
import { useIconList } from './Toolbar/hooks/use-icon-list';
import { SingleToolbarButtons } from './Toolbar/single-toolbar-buttons';
import type { MenuIconItem } from './Toolbar/types';
import { ToolbarType } from './Toolbar/types';

type FloatingToolbarComponentProps = {
	api: ExtractInjectionAPI<TextFormattingPlugin> | undefined;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
	editorView: EditorView;
} & WrappedComponentProps;

const FloatingToolbarSettings = {
	disabled: false,
	isReducedSpacing: true,
	shouldUseResponsiveToolbar: false,
	toolbarSize: ToolbarSize.S,
	hasMoreButton: false,
	moreButtonLabel: '',
	toolbarType: ToolbarType.FLOATING,
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: ExtractInjectionAPI<TextFormattingPlugin> | undefined) => {
		const {
			codeActive,
			codeDisabled,
			codeHidden,
			emActive,
			emDisabled,
			emHidden,
			formattingIsPresent,
			isInitialised,
			strikeActive,
			strikeDisabled,
			strikeHidden,
			strongActive,
			strongDisabled,
			strongHidden,
			subscriptActive,
			subscriptDisabled,
			subscriptHidden,
			superscriptActive,
			superscriptDisabled,
			superscriptHidden,
			underlineActive,
			underlineDisabled,
			underlineHidden,
		} = useSharedPluginStateWithSelector(api, ['textFormatting'], (states) => ({
			isInitialised: states.textFormattingState?.isInitialised,
			formattingIsPresent: states.textFormattingState?.formattingIsPresent,
			emActive: states.textFormattingState?.emActive,
			emDisabled: states.textFormattingState?.emDisabled,
			emHidden: states.textFormattingState?.emHidden,
			codeActive: states.textFormattingState?.codeActive,
			codeDisabled: states.textFormattingState?.codeDisabled,
			codeHidden: states.textFormattingState?.codeHidden,
			underlineActive: states.textFormattingState?.underlineActive,
			underlineDisabled: states.textFormattingState?.underlineDisabled,
			underlineHidden: states.textFormattingState?.underlineHidden,
			strikeActive: states.textFormattingState?.strikeActive,
			strikeDisabled: states.textFormattingState?.strikeDisabled,
			strikeHidden: states.textFormattingState?.strikeHidden,
			strongActive: states.textFormattingState?.strongActive,
			strongDisabled: states.textFormattingState?.strongDisabled,
			strongHidden: states.textFormattingState?.strongHidden,
			superscriptActive: states.textFormattingState?.superscriptActive,
			superscriptDisabled: states.textFormattingState?.superscriptDisabled,
			superscriptHidden: states.textFormattingState?.superscriptHidden,
			subscriptActive: states.textFormattingState?.subscriptActive,
			subscriptDisabled: states.textFormattingState?.subscriptDisabled,
			subscriptHidden: states.textFormattingState?.subscriptHidden,
		}));
		return {
			isInitialised: Boolean(isInitialised),
			formattingIsPresent,
			emActive,
			emDisabled,
			emHidden,
			codeActive,
			codeDisabled,
			codeHidden,
			underlineActive,
			underlineDisabled,
			underlineHidden,
			strikeActive,
			strikeDisabled,
			strikeHidden,
			strongActive,
			strongDisabled,
			strongHidden,
			superscriptActive,
			superscriptDisabled,
			superscriptHidden,
			subscriptActive,
			subscriptDisabled,
			subscriptHidden,
		};
	},
	(api: ExtractInjectionAPI<TextFormattingPlugin> | undefined) => {
		const { textFormattingState } = useSharedPluginState(api, ['textFormatting']);
		return {
			isInitialised: Boolean(textFormattingState?.isInitialised),
			formattingIsPresent: textFormattingState?.formattingIsPresent,
			emActive: textFormattingState?.emActive,
			emDisabled: textFormattingState?.emDisabled,
			emHidden: textFormattingState?.emHidden,
			codeActive: textFormattingState?.codeActive,
			codeDisabled: textFormattingState?.codeDisabled,
			codeHidden: textFormattingState?.codeHidden,
			underlineActive: textFormattingState?.underlineActive,
			underlineDisabled: textFormattingState?.underlineDisabled,
			underlineHidden: textFormattingState?.underlineHidden,
			strikeActive: textFormattingState?.strikeActive,
			strikeDisabled: textFormattingState?.strikeDisabled,
			strikeHidden: textFormattingState?.strikeHidden,
			strongActive: textFormattingState?.strongActive,
			strongDisabled: textFormattingState?.strongDisabled,
			strongHidden: textFormattingState?.strongHidden,
			superscriptActive: textFormattingState?.superscriptActive,
			superscriptDisabled: textFormattingState?.superscriptDisabled,
			superscriptHidden: textFormattingState?.superscriptHidden,
			subscriptActive: textFormattingState?.subscriptActive,
			subscriptDisabled: textFormattingState?.subscriptDisabled,
			subscriptHidden: textFormattingState?.subscriptHidden,
		};
	},
);

const FloatingToolbarTextFormat = ({
	api,
	editorAnalyticsAPI,
	editorView,
	intl,
}: FloatingToolbarComponentProps) => {
	const textFormattingState = useSharedState(api);
	const { formattingIsPresent, ...formattingIconState } = textFormattingState;

	const defaultIcons = useFormattingIcons({
		schema: editorView.state.schema,
		intl,
		isToolbarDisabled: FloatingToolbarSettings.disabled,
		editorAnalyticsAPI,
		textFormattingState: formattingIconState,
		toolbarType: FloatingToolbarSettings.toolbarType,
	});

	const { dropdownItems, singleItems } = useIconList({
		icons: defaultIcons,
		iconTypeList: ToolbarButtonsStrong,
	});

	const clearIcon = useClearIcon({
		formattingPluginInitialised: textFormattingState.isInitialised,
		formattingIsPresent,
		intl,
		editorAnalyticsAPI,
		toolbarType: FloatingToolbarSettings.toolbarType,
	});

	const items = useMemo(() => {
		if (!clearIcon) {
			return [{ items: dropdownItems }];
		}

		return [{ items: dropdownItems }, { items: [clearIcon] }];
	}, [clearIcon, dropdownItems]);

	return (
		<React.Fragment>
			<SingleToolbarButtons items={singleItems} editorView={editorView} isReducedSpacing={false} />
			<FormattingTextDropdownMenu
				editorView={editorView}
				items={
					items as {
						items: MenuIconItem[];
					}[]
				}
				isReducedSpacing={
					editorExperiment('platform_editor_controls', 'variant1')
						? false
						: FloatingToolbarSettings.isReducedSpacing
				}
				moreButtonLabel={FloatingToolbarSettings.moreButtonLabel}
				hasFormattingActive={FloatingToolbarSettings.hasMoreButton}
				hasMoreButton={FloatingToolbarSettings.hasMoreButton}
				intl={intl}
				toolbarType={FloatingToolbarSettings.toolbarType}
			/>
		</React.Fragment>
	);
};

export const FloatingToolbarTextFormalWithIntl = injectIntl(FloatingToolbarTextFormat);
