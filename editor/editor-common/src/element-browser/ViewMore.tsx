/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
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

export const ViewMore = ({ item, focus }: { focus: boolean; item: QuickInsertItem }) => {
	const ref = useRef<HTMLElement>(null);
	useEffect(() => {
		if (ref.current && focus) {
			ref.current.focus();
		}
	}, [focus]);

	return (
		<Section hasSeparator>
			<ButtonItem
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onClick={item.action as any}
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				iconBefore={<div css={itemBefore}>{item.icon!()}</div>}
				aria-describedby={item.title}
				data-testid="view-more-elements-item"
				// @ts-ignore Overriding Menu styles is not supported
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
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
