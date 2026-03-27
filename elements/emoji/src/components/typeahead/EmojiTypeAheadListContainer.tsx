/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

import { typeAheadListContainer } from './styles';
import { type EmojiTypeAheadWidth } from '../../util/shared-styles';

const typeAheadEmpty = css({
	display: 'none',
});

const typeAheadWidth: EmojiTypeAheadWidth = 350;
const typeAheadList = css({
	backgroundColor: token('elevation.surface.overlay'),
	border: `${token('border.width')} solid ${token('color.border')}`,
	borderRadius: token('radius.small', '3px'),
	boxShadow: token('elevation.shadow.overlay'),
	color: token('color.text.subtle'),
	width: `${typeAheadWidth}px`,
});

export function EmojiTypeAheadListContainer(props: {
	children: React.ReactNode;
	hasEmoji: boolean;
	loading?: boolean;
}): JSX.Element {
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
