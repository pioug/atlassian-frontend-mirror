/** @jsx jsx */
import { useEffect, useRef } from 'react';

import { css, jsx } from '@emotion/react';

import { ButtonItem, Section } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

import type { QuickInsertItem } from '../provider-factory';

const itemBefore = css({
	width: '40px',
	height: '40px',
	boxSizing: 'border-box',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	marginRight: token('space.050', '4px'),
});

export const ViewMore = ({ item, focus }: { item: QuickInsertItem; focus: boolean }) => {
	const ref = useRef<HTMLElement>(null);
	useEffect(() => {
		if (ref.current && focus) {
			ref.current.focus();
		}
	}, [focus]);

	return (
		<Section hasSeparator>
			<ButtonItem
				onClick={item.action as any}
				iconBefore={<div css={itemBefore}>{item.icon!()}</div>}
				aria-describedby={item.title}
				data-testid="view-more-elements-item"
				// @ts-ignore Overriding Menu styles is not supported
				css={css({
					padding: `0px ${token('space.150', '12px')}`,
				})}
				ref={ref}
			>
				{item.title}
			</ButtonItem>
		</Section>
	);
};
