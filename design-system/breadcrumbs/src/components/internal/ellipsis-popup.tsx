/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX, KeyboardEvent, MouseEvent } from 'react';

import { css, jsx } from '@compiled/react';

import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';

export interface CollapsedItem {
	text: string;
	href?: string;
	onClick?: (event: MouseEvent<Element> | KeyboardEvent<Element>) => void;
	target?: string;
}

interface EllipsisPopupProps {
	collapsedItems: CollapsedItem[];
	label: string;
	onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
	testId?: string;
}

const groupWrapperStyles = css({
	maxWidth: '480px',
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default function EllipsisPopup({
	collapsedItems,
	label,
	onClick,
	testId,
}: EllipsisPopupProps): JSX.Element {
	return (
		<DropdownMenu<HTMLButtonElement>
			trigger={({ triggerRef, isSelected, testId: _triggerTestId, ...triggerProps }) => {
				const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
					triggerProps.onClick?.(event);
					onClick?.(event);
				};

				return (
					<IconButton
						{...triggerProps}
						ref={triggerRef}
						icon={ShowMoreHorizontalIcon}
						label={label}
						isSelected={isSelected}
						appearance="subtle"
						spacing="compact"
						isTooltipDisabled
						onClick={handleClick}
						testId={testId}
					/>
				);
			}}
			placement="bottom-start"
		>
			<div css={groupWrapperStyles}>
				<DropdownItemGroup>
					{collapsedItems.map((item, i) => (
						<DropdownItem key={i} href={item.href} target={item.target} onClick={item.onClick}>
							{item.text}
						</DropdownItem>
					))}
				</DropdownItemGroup>
			</div>
		</DropdownMenu>
	);
}
