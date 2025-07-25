import React, { type ReactNode } from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import GrowVerticalIcon from '@atlaskit/icon/core/grow-vertical';
import { token } from '@atlaskit/tokens';

type TListMembership = 'first' | 'last' | 'only' | 'standard';

function getType({ index, listSize }: { index: number; listSize: number }): TListMembership {
	if (listSize <= 1) {
		return 'only';
	}
	if (index === 0) {
		return 'first';
	}
	if (index === listSize - 1) {
		return 'last';
	}
	return 'standard';
}

export function ReorderActionMenu({
	index,
	listSize,
	onMoveToTop,
	onMoveUp,
	onMoveDown,
	onMoveToBottom,
	label,
}: {
	index: number;
	listSize: number;
	onMoveToTop: () => void;
	onMoveUp: () => void;
	onMoveDown: () => void;
	onMoveToBottom: () => void;
	label: ReactNode;
}) {
	const type = getType({ index, listSize });

	return (
		<DropdownMenu
			shouldRenderToParent
			placement="right-start"
			trigger={({ triggerRef, ...triggerProps }) => (
				<DropdownItem
					{...triggerProps}
					ref={triggerRef}
					elemBefore={<GrowVerticalIcon label="" />}
					elemAfter={<ChevronRightIcon color={token('color.icon.subtle')} label="" size="small" />}
					// No movement operations available when there is only one item
					isDisabled={type === 'only'}
				>
					<span>{label}</span>
				</DropdownItem>
			)}
		>
			<DropdownItemGroup>
				<DropdownItem isDisabled={type === 'first'} onClick={() => onMoveToTop()}>
					Move to top
				</DropdownItem>
				<DropdownItem isDisabled={type === 'first'} onClick={() => onMoveUp()}>
					Move up
				</DropdownItem>
				<DropdownItem isDisabled={type === 'last'} onClick={() => onMoveDown()}>
					Move down
				</DropdownItem>
				<DropdownItem isDisabled={type === 'last'} onClick={() => onMoveToBottom()}>
					Move to bottom
				</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	);
}
