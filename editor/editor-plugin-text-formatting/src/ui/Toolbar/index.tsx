/** @jsx jsx */
import { useEffect, useMemo, useState } from 'react';

import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { usePreviousState } from '@atlaskit/editor-common/hooks';
import { toolbarMessages } from '@atlaskit/editor-common/messages';
import { buttonGroupStyle, separatorStyles, wrapperStyle } from '@atlaskit/editor-common/styles';
import type {
	ExtractInjectionAPI,
	TextFormattingState,
	ToolbarSize,
} from '@atlaskit/editor-common/types';
import { Announcer } from '@atlaskit/editor-common/ui';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { TextFormattingPlugin } from '../../plugin';
import { compareItemsArrays, isArrayContainsContent } from '../../utils';

import { FormattingTextDropdownMenu } from './dropdown-menu';
import { useClearIcon } from './hooks/clear-formatting-icon';
import { useFormattingIcons, useHasFormattingActived } from './hooks/formatting-icons';
import {
	useResponsiveIconTypeMenu,
	useResponsiveToolbarButtons,
} from './hooks/responsive-toolbar-buttons';
import { MoreButton } from './more-button';
import { SingleToolbarButtons } from './single-toolbar-buttons';
import type { MenuIconItem } from './types';

export type ToolbarFormattingProps = {
	editorView: EditorView;
	isToolbarDisabled: boolean;
	toolbarSize: ToolbarSize;
	isReducedSpacing: boolean;
	shouldUseResponsiveToolbar: boolean;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	editorAnalyticsAPI?: EditorAnalyticsAPI;
	textFormattingState: TextFormattingState | undefined;
	api: ExtractInjectionAPI<TextFormattingPlugin> | undefined;
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
}: ToolbarFormattingProps & WrappedComponentProps) => {
	const [message, setMessage] = useState('');

	const defaultIcons = useFormattingIcons({
		schema: editorView.state.schema,
		intl,
		isToolbarDisabled,
		editorAnalyticsAPI,
		textFormattingState,
	});
	const clearIcon = useClearIcon({
		textFormattingState,
		intl,
		editorAnalyticsAPI,
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

	const items: Array<MenuIconItem> = useMemo(() => {
		if (!clearIcon) {
			return dropdownItems;
		}

		return [...dropdownItems, clearIcon];
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
		<span css={buttonGroupStyle}>
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
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={wrapperStyle}>
					{isToolbarDisabled ? (
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
							items={items}
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
		/>
	);
};

export default injectIntl(Toolbar);
