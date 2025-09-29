import type { ReactNode } from 'react';
import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import {
	ToolTipContent,
	clearFormatting,
	getAriaKeyshortcuts,
	tooltip,
} from '@atlaskit/editor-common/keymaps';
import { toolbarMessages } from '@atlaskit/editor-common/messages';
import { getInputMethodFromParentKeys, TEXT_COLLAPSED_MENU } from '@atlaskit/editor-common/toolbar';
import {
	ToolbarButton,
	ToolbarDropdownItem,
	ClearFormattingIcon,
	ToolbarKeyboardShortcutHint,
	ToolbarDropdownMenu,
	MoreItemsIcon,
	ToolbarTooltip,
	ToolbarDropdownItemSection,
} from '@atlaskit/editor-toolbar';
import type { CommonComponentProps } from '@atlaskit/editor-toolbar-model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { clearFormattingWithAnalyticsNext } from '../../../editor-commands/clear-formatting';

import type { FormatComponentProps } from './utils';
import { useComponentInfo } from './utils';

export const FormatMenuItem = ({
	parents,
	api,
	optionType,
	toggleMarkWithAnalyticsCallback,
	icon,
	shortcut,
	title,
}: FormatComponentProps) => {
	const { isActive, isDisabled, isHidden, shortcutContent, onClick, ariaLabel, formatTitle } =
		useComponentInfo({
			api,
			optionType,
			title,
			shortcut,
			toggleMarkWithAnalyticsCallback,
			parents,
		});
	const Icon = icon;

	if (isHidden) {
		return null;
	}

	return (
		<ToolbarDropdownItem
			elemBefore={<Icon size="small" label="" />}
			elemAfter={shortcutContent && <ToolbarKeyboardShortcutHint shortcut={shortcutContent} />}
			isDisabled={isDisabled}
			isSelected={isActive}
			onClick={onClick}
			aria-keyshortcuts={getAriaKeyshortcuts(shortcut)}
			aria-label={ariaLabel}
		>
			{formatTitle}
		</ToolbarDropdownItem>
	);
};

export const FormatButton = ({
	parents,
	api,
	optionType,
	toggleMarkWithAnalyticsCallback,
	icon,
	shortcut,
	title,
}: FormatComponentProps) => {
	const { isActive, isDisabled, onClick, ariaLabel, formatTitle } = useComponentInfo({
		api,
		optionType,
		title,
		shortcut,
		toggleMarkWithAnalyticsCallback,
		parents,
	});

	const Icon = icon;
	return (
		<ToolbarTooltip content={<ToolTipContent description={formatTitle} keymap={shortcut} />}>
			<ToolbarButton
				iconBefore={<Icon label={ariaLabel} size="small" />}
				onClick={onClick}
				isSelected={isActive}
				isDisabled={isDisabled}
				ariaKeyshortcuts={getAriaKeyshortcuts(shortcut)}
			/>
		</ToolbarTooltip>
	);
};

export const ClearFormatMenuItem = ({
	api,
	parents,
}: Pick<FormatComponentProps, 'api' | 'parents'>) => {
	const { isInitialised, isFormattingPresent } = useSharedPluginStateWithSelector(
		api,
		['textFormatting'],
		(states) => ({
			isInitialised: states.textFormattingState?.isInitialised,
			isFormattingPresent: states.textFormattingState?.formattingIsPresent,
		}),
	);
	const { formatMessage } = useIntl();

	if (!isInitialised) {
		return null;
	}

	const formatTitle = formatMessage(toolbarMessages.clearFormatting);
	const shortcutContent = tooltip(clearFormatting);
	const onClick = () => {
		api?.core.actions.execute(
			clearFormattingWithAnalyticsNext(api?.analytics?.actions)(
				getInputMethodFromParentKeys(parents),
			),
		);
	};

	return (
		<ToolbarDropdownItem
			elemBefore={<ClearFormattingIcon label="" />}
			elemAfter={shortcutContent && <ToolbarKeyboardShortcutHint shortcut={shortcutContent} />}
			isDisabled={!isFormattingPresent}
			onClick={onClick}
			ariaKeyshortcuts={getAriaKeyshortcuts(clearFormatting)}
		>
			{formatTitle}
		</ToolbarDropdownItem>
	);
};

export const MoreFormattingMenu = ({ children }: { children?: ReactNode }) => {
	const { formatMessage } = useIntl();
	const content = formatMessage(toolbarMessages.moreFormatting);
	return expValEquals('platform_editor_toolbar_aifc_patch_6', 'isEnabled', true) ? (
		<ToolbarTooltip content={formatMessage(toolbarMessages.textFormat)}>
			<ToolbarDropdownMenu
				iconBefore={<MoreItemsIcon label="" testId="more-formatting" />}
				label={content}
			>
				{children}
			</ToolbarDropdownMenu>
		</ToolbarTooltip>
	) : (
		<ToolbarDropdownMenu
			iconBefore={<MoreItemsIcon label="" testId="more-formatting" />}
			label={content}
		>
			{children}
		</ToolbarDropdownMenu>
	);
};

export const MenuSection = ({
	children,
	title,
	parents,
}: {
	children?: ReactNode;
	parents: CommonComponentProps['parents'];
	title?: string;
}) => {
	const hasSeparator = parents.some((parent) => parent.key === TEXT_COLLAPSED_MENU.key);

	return (
		<ToolbarDropdownItemSection hasSeparator={hasSeparator} title={title}>
			{children}
		</ToolbarDropdownItemSection>
	);
};
