/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N40 } from '@atlaskit/theme/colors';

import { typeAheadListContainer } from './styles';
import { type EmojiTypeAheadWidth } from '../../util/shared-styles';

const typeAheadEmpty = css({
	display: 'none',
});

const typeAheadWidth: EmojiTypeAheadWidth = 350;
const typeAheadList = css({
	backgroundColor: token('elevation.surface.overlay', 'white'),
	border: `1px solid ${token('color.border', N40)}`,
	borderRadius: token('radius.small', '3px'),
	boxShadow: token('elevation.shadow.overlay', '0 3px 6px rgba(0, 0, 0, 0.2)'),
	color: token('color.text.subtle', '#333'),
	width: `${typeAheadWidth}px`,
});

export function EmojiTypeAheadListContainer(props: {
	children: React.ReactNode;
	hasEmoji: boolean;
	loading?: boolean;
}) {
	const { hasEmoji, loading } = props;

	return (
		<div
			/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */
			className={'ak-emoji-typeahead-list'}
			css={[typeAheadList, !hasEmoji && !loading && typeAheadEmpty]}
		>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
			<div className={typeAheadListContainer}>{props.children}</div>
		</div>
	);
}
