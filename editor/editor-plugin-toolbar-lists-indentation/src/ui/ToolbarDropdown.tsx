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
import BulletListIcon from '@atlaskit/icon/core/migration/list-bulleted--editor-bullet-list';

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
					selected={bulletListActive || orderedListActive || isDropdownOpen}
					aria-expanded={isDropdownOpen}
					aria-haspopup
					aria-label={labelLists}
					disabled={disabled}
					onClick={handleTriggerClick}
					onKeyDown={handleOnKeyDown}
					title={labelLists}
					iconBefore={
						<ToolbarDropdownTriggerWrapper>
							<BulletListIcon color="currentColor" spacing="spacious" label={labelLists} />
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
		},
		{
			key: 'orderedList',
			content: labelOrderedList,
			value: { name: 'ordered_list' },
			isDisabled: props.orderedListDisabled,
			isActive: Boolean(props.orderedListActive),
			elemAfter: <Shortcut>{tooltip(toggleOrderedListKeymap)}</Shortcut>,
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
			},
			{
				key: 'indent',
				content: labelIndent,
				value: { name: 'indent' },
				isDisabled: props.indentDisabled,
				isActive: false,
				elemAfter: <Shortcut>{tooltip(toggleIndentKeymap)}</Shortcut>,
			},
		);
	}
	return [{ items }];
}
