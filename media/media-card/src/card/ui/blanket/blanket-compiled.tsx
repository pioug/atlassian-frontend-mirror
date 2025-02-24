/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N90A } from '@atlaskit/theme/colors';

export const blanketClassName = 'media-card-blanket';

export const fixedBlanketStyles = `background-color: ${token('color.blanket', N90A)};`;

const blanketStyles = css({
	position: 'absolute',
	width: '100%',
	height: '100%',
	maxHeight: '100%',
	maxWidth: '100%',
	left: 0,
	top: 0,
	transition: 'all .3s',
});

const fixedBlanketStyle = css({
	backgroundColor: token('color.blanket', N90A),
});

export interface BlanketProps {
	isFixed?: boolean;
}

export const Blanket = (props: BlanketProps) => {
	const { isFixed } = props;

	return (
		<div
			css={[blanketStyles, isFixed && fixedBlanketStyle]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={blanketClassName}
			data-testid="media-card-blanket"
		/>
	);
};

Blanket.displayName = 'Blanket';
