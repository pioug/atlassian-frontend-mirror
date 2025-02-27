/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const separatorStyles = css({
	display: 'inline-block',
	width: '1px',
	height: '24px',
	marginTop: token('space.0', '0px'),
	marginBottom: token('space.0', '0px'),
	marginLeft: token('space.100', '8px'),
	marginRight: token('space.100', '8px'),
	userSelect: 'none',
	backgroundColor: token('color.background.neutral.hovered'),
});

export function ToolbarSeparator() {
	return <span css={separatorStyles} />;
}
