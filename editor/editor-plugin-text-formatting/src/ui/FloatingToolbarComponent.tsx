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
} from '@atlaskit/editor-common/hooks';
import { ToolbarSize, type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { TextFormattingPlugin } from '../textFormattingPluginType';

import { ToolbarButtonsStrong } from './Toolbar/constants';
import { FormattingTextDropdownMenu } from './Toolbar/dropdown-menu';
import {
	getCommonActiveMarks,
	hasMultiplePartsWithFormattingInSelection,
} from './Toolbar/formatting-in-selection-utils';
import { useClearIcon } from './Toolbar/hooks/clear-formatting-icon';
import { useFormattingIcons } from './Toolbar/hooks/formatting-icons';
import { useIconList } from './Toolbar/hooks/use-icon-list';
import { SingleToolbarButtons } from './Toolbar/single-toolbar-buttons';
import type { MenuIconItem } from './Toolbar/types';
import { ToolbarType } from './Toolbar/types';

type FloatingToolbarComponentProps = {
	editorView: EditorView;
	api: ExtractInjectionAPI<TextFormattingPlugin> | undefined;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
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
		const isInitialised = useSharedPluginStateSelector(api, 'textFormatting.isInitialised');
		const formattingIsPresent = useSharedPluginStateSelector(
			api,
			'textFormatting.formattingIsPresent',
		);
		const emActive = useSharedPluginStateSelector(api, 'textFormatting.emActive');
		const emDisabled = useSharedPluginStateSelector(api, 'textFormatting.emDisabled');
		const emHidden = useSharedPluginStateSelector(api, 'textFormatting.emHidden');
		const codeActive = useSharedPluginStateSelector(api, 'textFormatting.codeActive');
		const codeDisabled = useSharedPluginStateSelector(api, 'textFormatting.codeDisabled');
		const codeHidden = useSharedPluginStateSelector(api, 'textFormatting.codeHidden');
		const underlineActive = useSharedPluginStateSelector(api, 'textFormatting.underlineActive');
		const underlineDisabled = useSharedPluginStateSelector(api, 'textFormatting.underlineDisabled');
		const underlineHidden = useSharedPluginStateSelector(api, 'textFormatting.underlineHidden');
		const strikeActive = useSharedPluginStateSelector(api, 'textFormatting.strikeActive');
		const strikeDisabled = useSharedPluginStateSelector(api, 'textFormatting.strikeDisabled');
		const strikeHidden = useSharedPluginStateSelector(api, 'textFormatting.strikeHidden');
		const strongActive = useSharedPluginStateSelector(api, 'textFormatting.strongActive');
		const strongDisabled = useSharedPluginStateSelector(api, 'textFormatting.strongDisabled');
		const strongHidden = useSharedPluginStateSelector(api, 'textFormatting.strongHidden');
		const superscriptActive = useSharedPluginStateSelector(api, 'textFormatting.superscriptActive');
		const superscriptDisabled = useSharedPluginStateSelector(
			api,
			'textFormatting.superscriptDisabled',
		);
		const superscriptHidden = useSharedPluginStateSelector(api, 'textFormatting.superscriptHidden');
		const subscriptActive = useSharedPluginStateSelector(api, 'textFormatting.subscriptActive');
		const subscriptDisabled = useSharedPluginStateSelector(api, 'textFormatting.subscriptDisabled');
		const subscriptHidden = useSharedPluginStateSelector(api, 'textFormatting.subscriptHidden');
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

	let hasMultiplePartsWithFormattingSelected;
	let commonActiveMarks: string[] | undefined;

	if (editorExperiment('platform_editor_controls', 'variant1')) {
		const { selection } = editorView.state;
		const { from, to } = selection;
		const selectedContent =
			selection instanceof TextSelection
				? editorView.state.doc.slice(from, to).content.content.slice()
				: undefined;
		hasMultiplePartsWithFormattingSelected = fg('platform_editor_common_marks')
			? false
			: hasMultiplePartsWithFormattingInSelection({
					selectedContent,
				});

		if (!fg('platform_editor_common_marks')) {
			commonActiveMarks = getCommonActiveMarks({ selectedContent });
		}
	}

	const defaultIcons = useFormattingIcons({
		schema: editorView.state.schema,
		intl,
		isToolbarDisabled: FloatingToolbarSettings.disabled,
		editorAnalyticsAPI,
		textFormattingState: formattingIconState,
		toolbarType: FloatingToolbarSettings.toolbarType,
		hasMultiplePartsWithFormattingSelected: editorExperiment('platform_editor_controls', 'variant1')
			? hasMultiplePartsWithFormattingSelected
			: undefined,
		commonActiveMarks: editorExperiment('platform_editor_controls', 'variant1')
			? commonActiveMarks
			: undefined,
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
			<SingleToolbarButtons
				items={singleItems}
				editorView={editorView}
				isReducedSpacing={false}
				hasMultiplePartsWithFormattingSelected={hasMultiplePartsWithFormattingSelected}
			/>
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
				hasMultiplePartsWithFormattingSelected={hasMultiplePartsWithFormattingSelected}
			/>
		</React.Fragment>
	);
};

export const FloatingToolbarTextFormalWithIntl = injectIntl(FloatingToolbarTextFormat);
