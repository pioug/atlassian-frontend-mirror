/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type Ref, useState } from 'react';

import { jsx } from '@compiled/react';

import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import SettingsIcon from '@atlaskit/icon/core/settings';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';

import type { TTopLevelItem } from './data';
import { ReorderActionMenu } from './reorder-actions';
import { useDispatch } from './state-context';

export function TopLevelSharedMoreMenu({
	value,
	index,
	amountOfMenuItems,
}: {
	value: TTopLevelItem;
	index: number;
	amountOfMenuItems: number;
}) {
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<DropdownMenu
			shouldRenderToParent
			isOpen={isOpen}
			onOpenChange={() => setIsOpen((current) => !current)}
			trigger={({ triggerRef, ...triggerProps }) => (
				<IconButton
					ref={triggerRef as Ref<HTMLButtonElement>}
					label="More actions"
					icon={(iconProps) => <ShowMoreHorizontalIcon {...iconProps} size="small" />}
					spacing="compact"
					appearance="subtle"
					{...triggerProps}
				/>
			)}
		>
			<DropdownItemGroup hasSeparator>
				<DropdownItem elemBefore={<SettingsIcon label="" />}>Settings</DropdownItem>
			</DropdownItemGroup>
			<DropdownItemGroup hasSeparator>
				<ReorderActionMenu
					label="Reorder menu item"
					index={index}
					listSize={amountOfMenuItems}
					onMoveToTop={() => {
						dispatch({
							type: 'top-level-menu-reorder',
							trigger: 'keyboard',
							value,
							startIndex: index,
							finishIndex: 0,
						});
						setIsOpen(false);
					}}
					onMoveUp={() => {
						dispatch({
							type: 'top-level-menu-reorder',
							trigger: 'keyboard',
							value,
							startIndex: index,
							finishIndex: index - 1,
						});
						setIsOpen(false);
					}}
					onMoveDown={() => {
						dispatch({
							type: 'top-level-menu-reorder',
							trigger: 'keyboard',
							value,
							startIndex: index,
							finishIndex: index + 1,
						});
						setIsOpen(false);
					}}
					onMoveToBottom={() => {
						dispatch({
							type: 'top-level-menu-reorder',
							trigger: 'keyboard',
							value,
							startIndex: index,
							finishIndex: amountOfMenuItems - 1,
						});
						setIsOpen(false);
					}}
				/>
			</DropdownItemGroup>
		</DropdownMenu>
	);
}
