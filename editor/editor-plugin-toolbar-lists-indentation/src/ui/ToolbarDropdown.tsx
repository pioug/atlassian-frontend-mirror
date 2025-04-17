/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { useIntl } from 'react-intl-next';

import { jsx } from '@atlaskit/css';
import {
	toggleBulletList as toggleBulletListKeymap,
	indent as toggleIndentKeymap,
	toggleOrderedList as toggleOrderedListKeymap,
	outdent as toggleOutdentKeymap,
	tooltip,
} from '@atlaskit/editor-common/keymaps';
import { indentationMessages, listMessages } from '@atlaskit/editor-common/messages';
import {
	Shortcut,
	ToolbarDropdownTriggerWrapper,
	ToolbarDropdownWrapper,
	ToolbarExpandIcon,
	ToolbarSeparator,
} from '@atlaskit/editor-common/ui';
import {
	DropdownMenuWithKeyboardNavigation as DropdownMenu,
	ToolbarButton,
} from '@atlaskit/editor-common/ui-menu';
import type { DropdownItem } from '@atlaskit/editor-plugin-block-type';
import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';
import ListNumberedIcon from '@atlaskit/icon/core/list-numbered';
import BulletListIcon from '@atlaskit/icon/core/migration/list-bulleted--editor-bullet-list';
import TextIndentLeftIcon from '@atlaskit/icon/core/text-indent-left';
import TextIndentRightIcon from '@atlaskit/icon/core/text-indent-right';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { type ButtonName, type ToolbarProps, ToolbarType } from '../types';

export type DropdownProps = ToolbarProps & {
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	toolbarType: ToolbarType;
};

export function ToolbarDropdown(props: DropdownProps) {
	const { formatMessage } = useIntl();
	const {
		disabled,
		isReducedSpacing,
		bulletListActive,
		orderedListActive,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		onItemActivated,
		pluginInjectionApi,
	} = props;
	const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
	const [isOpenedByKeyboard, setOpenedByKeyboard] = React.useState(false);

	const labelLists = formatMessage(listMessages.lists);

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onOpenChange = (attrs: any) => {
		setIsDropdownOpen(attrs.isDropdownOpen);
	};

	const handleTriggerClick = () => {
		onOpenChange({ isDropdownOpen: !isDropdownOpen });
	};

	const handleOnKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			setIsDropdownOpen(!isDropdownOpen);
			setOpenedByKeyboard(true);
		}
	};

	const items = useItems(props);

	const handleOnItemActivated = ({
		item,
		shouldCloseMenu = true,
	}: {
		item: DropdownItem;
		shouldCloseMenu: boolean;
	}) => {
		setIsDropdownOpen(!shouldCloseMenu);
		return onItemActivated({
			editorView: props.editorView,
			buttonName: item.value.name as ButtonName,
		});
	};

	const reducedSpacing = props.toolbarType === ToolbarType.FLOATING ? 'compact' : 'none';

	let activeListIcon = null;
	let isSelected = isDropdownOpen;
	if (
		editorExperiment('platform_editor_controls', 'variant1') &&
		fg('platform_editor_controls_patch_6')
	) {
		activeListIcon = orderedListActive ? (
			<ListNumberedIcon spacing="spacious" label="" />
		) : (
			<ListBulletedIcon spacing="spacious" label="" />
		);
	} else {
		activeListIcon = <BulletListIcon color="currentColor" spacing="spacious" label={labelLists} />;
		isSelected = bulletListActive || orderedListActive || isDropdownOpen;
	}

	return (
		<ToolbarDropdownWrapper>
			<DropdownMenu
				items={items}
				onItemActivated={handleOnItemActivated}
				mountTo={popupsMountPoint}
				boundariesElement={popupsBoundariesElement}
				scrollableElement={popupsScrollableElement}
				isOpen={isDropdownOpen}
				onOpenChange={onOpenChange}
				fitHeight={188}
				fitWidth={175}
				shouldUseDefaultRole
				shouldFocusFirstItem={() => {
					if (isOpenedByKeyboard) {
						setOpenedByKeyboard(false);
					}
					return isOpenedByKeyboard;
				}}
			>
				<ToolbarButton
					spacing={isReducedSpacing ? reducedSpacing : 'default'}
					selected={isSelected}
					aria-expanded={isDropdownOpen}
					aria-haspopup
					aria-label={labelLists}
					disabled={disabled}
					onClick={handleTriggerClick}
					onKeyDown={handleOnKeyDown}
					title={labelLists}
					iconBefore={
						<ToolbarDropdownTriggerWrapper>
							{activeListIcon}
							<ToolbarExpandIcon />
						</ToolbarDropdownTriggerWrapper>
					}
				/>
			</DropdownMenu>
			{!pluginInjectionApi?.primaryToolbar && <ToolbarSeparator />}
		</ToolbarDropdownWrapper>
	);
}

function useItems(
	props: Pick<
		DropdownProps,
		| 'bulletListDisabled'
		| 'bulletListActive'
		| 'orderedListDisabled'
		| 'orderedListActive'
		| 'indentDisabled'
		| 'outdentDisabled'
		| 'showIndentationButtons'
	>,
) {
	const { formatMessage } = useIntl();

	const labelUnorderedList = formatMessage(listMessages.unorderedList);
	const labelOrderedList = formatMessage(listMessages.orderedList);

	const items = [
		{
			key: 'unorderedList',
			content: labelUnorderedList,
			value: { name: 'bullet_list' },
			isDisabled: props.bulletListDisabled,
			isActive: Boolean(props.bulletListActive),
			elemAfter: <Shortcut>{tooltip(toggleBulletListKeymap)}</Shortcut>,
			elemBefore:
				editorExperiment('platform_editor_controls', 'variant1') &&
				fg('platform_editor_controls_patch_6') ? (
					<ListBulletedIcon label="" />
				) : undefined,
		},
		{
			key: 'orderedList',
			content: labelOrderedList,
			value: { name: 'ordered_list' },
			isDisabled: props.orderedListDisabled,
			isActive: Boolean(props.orderedListActive),
			elemAfter: <Shortcut>{tooltip(toggleOrderedListKeymap)}</Shortcut>,
			elemBefore:
				editorExperiment('platform_editor_controls', 'variant1') &&
				fg('platform_editor_controls_patch_6') ? (
					<ListNumberedIcon label="" />
				) : undefined,
		},
	];
	if (props.showIndentationButtons) {
		const labelIndent = formatMessage(indentationMessages.indent);
		const labelOutdent = formatMessage(indentationMessages.outdent);
		items.push(
			{
				key: 'outdent',
				content: labelOutdent,
				value: { name: 'outdent' },
				isDisabled: props.outdentDisabled,
				isActive: false,
				elemAfter: <Shortcut>{tooltip(toggleOutdentKeymap)}</Shortcut>,
				elemBefore:
					editorExperiment('platform_editor_controls', 'variant1') &&
					fg('platform_editor_controls_patch_6') ? (
						<TextIndentLeftIcon label="" />
					) : undefined,
			},
			{
				key: 'indent',
				content: labelIndent,
				value: { name: 'indent' },
				isDisabled: props.indentDisabled,
				isActive: false,
				elemAfter: <Shortcut>{tooltip(toggleIndentKeymap)}</Shortcut>,
				elemBefore:
					editorExperiment('platform_editor_controls', 'variant1') &&
					fg('platform_editor_controls_patch_6') ? (
						<TextIndentRightIcon label="" />
					) : undefined,
			},
		);
	}
	return [{ items }];
}
