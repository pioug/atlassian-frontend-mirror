/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX, ReactNode } from 'react';

// Preserve the template card's inherited font and existing hover treatment.
// These values are outside the bounded @atlaskit/css API.
import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const cardStyles = css({
	border: `${token('border.width')} solid ${token('color.border')}`,
	paddingTop: token('space.100'),
	paddingRight: token('space.100'),
	paddingBottom: token('space.100'),
	paddingLeft: token('space.100'),
	marginBottom: token('space.100'),
	borderRadius: token('radius.medium', '6px'),
	'&:hover': {
		backgroundColor: token('color.background.accent.gray.subtler'),
	},
});

const buttonStyles = css({
	display: 'block',
	width: '100%',
	textAlign: 'left',
	background: 'none',
	cursor: 'pointer',
	font: 'inherit',
	transition: token('motion.button.hovered'),
});

type TemplateCardProps = {
	as?: 'button' | 'div';
	children: ReactNode;
	onSelect: () => void;
};

export const TemplateCard = ({
	as = 'button',
	children,
	onSelect,
}: TemplateCardProps): JSX.Element => {
	if (as === 'div') {
		return (
			<div
				css={cardStyles}
				role="button"
				tabIndex={0}
				onClick={onSelect}
				onKeyDown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						onSelect();
					}
				}}
			>
				{children}
			</div>
		);
	}

	return (
		<button type="button" css={[cardStyles, buttonStyles]} onClick={onSelect}>
			{children}
		</button>
	);
};
