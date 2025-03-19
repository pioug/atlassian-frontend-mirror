/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';

import { token } from '@atlaskit/tokens';
import { N40 } from '@atlaskit/theme/colors';

import { typeAheadListContainer } from './styles';
import { type EmojiTypeAheadWidth } from '../../util/shared-styles';

const typeAheadEmpty = css({
	display: 'none',
});

const typeAheadWidth: EmojiTypeAheadWidth = 350;
const typeAheadList = css({
	background: token('elevation.surface.overlay', 'white'),
	border: `1px solid ${token('color.border', N40)}`,
	borderRadius: token('border.radius.100', '3px'),
	boxShadow: token('elevation.shadow.overlay', '0 3px 6px rgba(0, 0, 0, 0.2)'),
	color: token('color.text.subtle', '#333'),
	width: `${typeAheadWidth}px`,
});

export function EmojiTypeAheadListContainerEmotion(props: {
	hasEmoji: boolean;
	loading?: boolean;
	children: React.ReactNode;
}) {
	const { hasEmoji, loading } = props;

	return (
		<div
			/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop  -- Ignored via go/DSP-18766 */
			className={'ak-emoji-typeahead-list'}
			css={[typeAheadList, !hasEmoji && !loading && typeAheadEmpty]}
		>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop */}
			<div className={typeAheadListContainer}>{props.children}</div>
		</div>
	);
}
