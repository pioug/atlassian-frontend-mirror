/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { usePreviousState } from '@atlaskit/editor-common/hooks';
import { toolbarMessages } from '@atlaskit/editor-common/messages';
import {
	buttonGroupStyle,
	separatorStyles,
	wrapperStyle,
} from '@atlaskit/editor-common/styles';
import type {
	ExtractInjectionAPI,
	TextFormattingState,
	ToolbarSize,
} from '@atlaskit/editor-common/types';
import { Announcer } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { compareItemsArrays, isArrayContainsContent } from '../../editor-commands/utils';
import type { TextFormattingPlugin } from '../../textFormattingPluginType';

import { FormattingTextDropdownMenu } from './dropdown-menu';
import { useClearIcon } from './hooks/clear-formatting-icon';
import { useFormattingIcons, useHasFormattingActived } from './hooks/formatting-icons';
import {
	useResponsiveIconTypeMenu,
	useResponsiveToolbarButtons,
} from './hooks/responsive-toolbar-buttons';
import { MoreButton } from './more-button';
import { SingleToolbarButtons } from './single-toolbar-buttons';
import type { MenuIconItem, ToolbarType } from './types';

export type ToolbarFormattingProps = {
	api: ExtractInjectionAPI<TextFormattingPlugin> | undefined;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
	editorView: EditorView;
	isReducedSpacing: boolean;
	isToolbarDisabled: boolean;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	shouldUseResponsiveToolbar: boolean;
	textFormattingState: TextFormattingState;
	toolbarSize: ToolbarSize;
	toolbarType: ToolbarType;
};

const ToolbarFormatting = ({
	shouldUseResponsiveToolbar,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	editorView,
	toolbarSize,
	isReducedSpacing,
	isToolbarDisabled,
	intl,
	editorAnalyticsAPI,
	textFormattingState,
	api,
	toolbarType,
}: ToolbarFormattingProps & WrappedComponentProps) => {
	const [message, setMessage] = useState('');
	const { formattingIsPresent, ...formattingIconState } = textFormattingState;

	const defaultIcons = useFormattingIcons({
		schema: editorView.state.schema,
		intl,
		isToolbarDisabled,
		editorAnalyticsAPI,
		textFormattingState: formattingIconState,
		toolbarType,
	});
	const clearIcon = useClearIcon({
		formattingPluginInitialised: textFormattingState.isInitialised,
		formattingIsPresent,
		intl,
		editorAnalyticsAPI,
		toolbarType,
	});

	const menuIconTypeList = useResponsiveIconTypeMenu({
		toolbarSize,
		responsivenessEnabled: shouldUseResponsiveToolbar,
	});
	const hasFormattingActive = useHasFormattingActived({
		iconTypeList: menuIconTypeList,
		textFormattingState,
	});

	const { dropdownItems, singleItems } = useResponsiveToolbarButtons({
		icons: defaultIcons,
		toolbarSize,
		responsivenessEnabled: shouldUseResponsiveToolbar,
	});

	const clearFormattingStatus = intl.formatMessage(toolbarMessages.textFormattingOff);
	const superscriptOffSubscriptOnStatus = intl.formatMessage(
		toolbarMessages.superscriptOffSubscriptOn,
	);
	const subscriptOffSuperscriptOnStatus = intl.formatMessage(
		toolbarMessages.subscriptOffSuperscriptOn,
	);

	const activeItems = [...dropdownItems, ...singleItems].filter((item) => item.isActive);
	const prevActiveItems = usePreviousState(activeItems) ?? [];

	const fromSuperscriptToSubscript =
		isArrayContainsContent(activeItems, 'Subscript') &&
		isArrayContainsContent(prevActiveItems, 'Superscript');

	const fromSubscriptToSuperscript =
		isArrayContainsContent(activeItems, 'Superscript') &&
		isArrayContainsContent(prevActiveItems, 'Subscript');

	let comparedItems: Array<MenuIconItem>;
	let screenReaderMessage: string = '';

	if (prevActiveItems && activeItems.length > prevActiveItems.length) {
		comparedItems = compareItemsArrays(activeItems, prevActiveItems);
		screenReaderMessage = intl.formatMessage(toolbarMessages.on, {
			formattingType: comparedItems[0].content,
		}) as string;
	} else {
		comparedItems = compareItemsArrays(prevActiveItems, activeItems);
		if (comparedItems && comparedItems.length) {
			screenReaderMessage = intl.formatMessage(toolbarMessages.off, {
				formattingType: comparedItems[0].content,
			}) as string;
			if (activeItems[0]?.content === 'Code') {
				screenReaderMessage = intl.formatMessage(toolbarMessages.codeOn, {
					textFormattingOff:
						prevActiveItems?.length > 1 ? clearFormattingStatus : screenReaderMessage,
				});
			}
			if (fromSuperscriptToSubscript) {
				screenReaderMessage = superscriptOffSubscriptOnStatus;
			}
			if (fromSubscriptToSuperscript) {
				screenReaderMessage = subscriptOffSuperscriptOnStatus;
			}
		}
	}

	// handle 'Clear formatting' status for screen readers
	if (!activeItems?.length && prevActiveItems?.length > 1) {
		screenReaderMessage = clearFormattingStatus;
	}

	const items = useMemo(() => {
		if (!clearIcon) {
			return [{ items: dropdownItems }];
		}

		return [{ items: dropdownItems }, { items: [clearIcon] }];
	}, [clearIcon, dropdownItems]);

	const moreFormattingButtonLabel = intl.formatMessage(toolbarMessages.moreFormatting);

	const labelTextFormat = intl.formatMessage(toolbarMessages.textFormatting);

	useEffect(() => {
		if (screenReaderMessage) {
			setMessage(screenReaderMessage);
		}
	}, [screenReaderMessage]);

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<span
			css={
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
				buttonGroupStyle
			}
		>
			<div
				role="group"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={'js-text-format-wrap'}
				aria-label={labelTextFormat}
			>
				{message && (
					<Announcer ariaLive="assertive" text={message} ariaRelevant="additions" delay={250} />
				)}
				<SingleToolbarButtons
					items={singleItems}
					editorView={editorView}
					isReducedSpacing={isReducedSpacing}
				/>

				<span
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage
					css={wrapperStyle}
				>
					{isToolbarDisabled && !editorExperiment('platform_editor_controls', 'variant1') ? (
						<div>
							<MoreButton
								label={moreFormattingButtonLabel}
								isReducedSpacing={isReducedSpacing}
								isDisabled={true}
								isSelected={false}
								aria-expanded={undefined}
								aria-pressed={undefined}
							/>
						</div>
					) : (
						<FormattingTextDropdownMenu
							popupsMountPoint={popupsMountPoint}
							popupsBoundariesElement={popupsBoundariesElement}
							popupsScrollableElement={popupsScrollableElement}
							editorView={editorView}
							isReducedSpacing={isReducedSpacing}
							moreButtonLabel={moreFormattingButtonLabel}
							hasFormattingActive={hasFormattingActive}
							hasMoreButton={!editorExperiment('platform_editor_controls', 'variant1')}
							items={items}
							intl={intl}
							toolbarType={toolbarType}
							isDisabled={
								editorExperiment('platform_editor_controls', 'variant1') ? isToolbarDisabled : false
							}
						/>
					)}
				</span>
			</div>
			{!api?.primaryToolbar && (
				/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				<span css={separatorStyles} />
			)}
		</span>
	);
};

const Toolbar = ({
	popupsMountPoint,
	popupsScrollableElement,
	toolbarSize,
	isReducedSpacing,
	editorView,
	isToolbarDisabled,
	shouldUseResponsiveToolbar,
	intl,
	editorAnalyticsAPI,
	textFormattingState,
	api,
	toolbarType,
}: ToolbarFormattingProps & WrappedComponentProps) => {
	return (
		<ToolbarFormatting
			textFormattingState={textFormattingState}
			popupsMountPoint={popupsMountPoint}
			popupsScrollableElement={popupsScrollableElement}
			toolbarSize={toolbarSize}
			isReducedSpacing={isReducedSpacing}
			editorView={editorView}
			isToolbarDisabled={isToolbarDisabled}
			shouldUseResponsiveToolbar={shouldUseResponsiveToolbar}
			intl={intl}
			editorAnalyticsAPI={editorAnalyticsAPI}
			api={api}
			toolbarType={toolbarType}
		/>
	);
};

export default injectIntl(Toolbar);
