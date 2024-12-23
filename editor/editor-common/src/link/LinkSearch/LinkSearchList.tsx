/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { PureComponent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import LinkSearchListItem from './LinkSearchListItem';
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
export const linkSearchList = css({
	padding: 0,
	listStyle: 'none',
});

export interface Props {
	items?: LinkSearchListItemData[];
	isLoading: boolean;
	selectedIndex: number;
	onSelect: (href: string, text: string) => void;
	onMouseMove?: (objectId: string) => void;
	onMouseEnter?: (objectId: string) => void;
	onMouseLeave?: (objectId: string) => void;
	ariaControls?: string;
	role?: string;
	id?: string;
}

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
				<ul css={linkSearchList} id={id} role={role} aria-controls={ariaControls}>
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
				<div data-testid={`${id}-loading`} css={spinnerContainer}>
					<Spinner size="medium" />
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
