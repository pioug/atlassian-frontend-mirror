/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type KeyboardEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';

import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import ForwardedLinkSearchListItemNextWithIntl from './LinkSearchListItem';
import type { LinkSearchListItemData } from './types';

const listContainer = css({
	paddingTop: 0,
	marginTop: token('space.150', '12px'),
	borderTop: `${token('border.width')} solid ${token('color.border')}`,
});

const spinnerContainer = css({
	textAlign: 'center',
	minHeight: '80px',
	marginTop: token('space.400', '32px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const linkSearchList: SerializedStyles = css({
	padding: 0,
	listStyle: 'none',
});

export interface Props {
	ariaControls?: string;
	id?: string;
	isLoading: boolean;
	items?: LinkSearchListItemData[];
	listItemRefCallback?: (el: HTMLElement | null, id: string) => void;
	onFocus?: (index: number) => void;
	onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
	onMouseEnter?: (objectId: string) => void;
	onMouseLeave?: (objectId: string) => void;
	onMouseMove?: (objectId: string) => void;
	onSelect: (href: string, text: string) => void;
	role?: string;
	selectedIndex: number;
}

const LinkSearchList = ({
	listItemRefCallback,
	onFocus,
	onKeyDown,
	onSelect,
	onMouseMove,
	onMouseEnter,
	onMouseLeave,
	items,
	selectedIndex,
	isLoading,
	ariaControls,
	role,
	id,
}: Props) => {
	let itemsContent;
	let loadingContent;

	if (items && items.length > 0) {
		itemsContent = (
			<ul
				css={linkSearchList}
				id={id}
				role={role}
				aria-controls={ariaControls}
				data-testid={`${id}--items`}
			>
				{items.map((item, index) => (
					<ForwardedLinkSearchListItemNextWithIntl
						id={`link-search-list-item-${index}`}
						item={item}
						selected={selectedIndex === index}
						onFocus={() => onFocus?.(index)}
						onKeyDown={onKeyDown}
						onMouseMove={onMouseMove}
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
						onSelect={onSelect}
						key={item.objectId}
						ref={(el) => listItemRefCallback?.(el, item.objectId)}
					/>
				))}
			</ul>
		);
	}

	if (isLoading) {
		loadingContent = (
			<div id={id} data-testid={`${id}--loading`} css={spinnerContainer}>
				<Spinner size="medium" interactionName="link-search-spinner" />
			</div>
		);
	}

	return (
		<div css={listContainer}>
			{itemsContent}
			{loadingContent}
		</div>
	);
};

export default LinkSearchList;
