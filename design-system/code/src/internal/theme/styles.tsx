import { token } from '@atlaskit/tokens';

export const getLineNumWidth = (numLines: number) => {
	return !numLines ? '1ch' : `${numLines.toFixed(0).length}ch`;
};

// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
/**
 * @deprecated
 */
export const getCodeStyles = () => {
	return {
		display: 'inline',
		padding: '2px 0.5ch',
		backgroundColor: `var(--ds--code--bg-color,${token('color.background.neutral')})`,
		borderRadius: token('border.radius', '3px'),
		borderStyle: 'none',
		boxDecorationBreak: 'clone',
		color: token('color.text'),
		fontFamily: token('font.family.code'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '0.875em',
		fontWeight: token('font.weight.regular'),
		overflow: 'auto',
		overflowWrap: 'break-word',
		whiteSpace: 'pre-wrap',
	};
};
