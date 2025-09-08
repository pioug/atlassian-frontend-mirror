/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { PureComponent, type KeyboardEvent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, type SerializedStyles } from '@emotion/react';

import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import LinkSearchListItem, { ForwardedLinkSearchListItemNextWithIntl } from './LinkSearchListItem';
import type { LinkSearchListItemData } from './types';

const listContainer = css({
	paddingTop: 0,
	marginTop: token('space.150', '12px'),
	borderTop: `1px solid ${token('color.border')}`,
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

export interface PropsNext {
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

export const LinkSearchListNext = ({
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
}: PropsNext) => {
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

export interface Props {
	ariaControls?: string;
	id?: string;
	isLoading: boolean;
	items?: LinkSearchListItemData[];
	onMouseEnter?: (objectId: string) => void;
	onMouseLeave?: (objectId: string) => void;
	onMouseMove?: (objectId: string) => void;
	onSelect: (href: string, text: string) => void;
	role?: string;
	selectedIndex: number;
}

/**
 * *Warning:* With `platform_editor_a11y_insert_link_item_focus` enabled this component is no longer used and is replaced with `<LinkSearchListNext />`.
 *
 * If making changes to this component please ensure to also update `<LinkSearchListNext />`.
 */
// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class LinkSearchList extends PureComponent<Props, Object> {
	render() {
		const {
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
		} = this.props;

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
						<LinkSearchListItem
							id={`link-search-list-item-${index}`}
							role={role && 'option'}
							item={item}
							selected={selectedIndex === index}
							onMouseMove={onMouseMove}
							onMouseEnter={onMouseEnter}
							onMouseLeave={onMouseLeave}
							onSelect={onSelect}
							key={item.objectId}
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
	}
}
