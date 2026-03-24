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
	marginTop: token('space.0'),
	marginBottom: token('space.0'),
	marginLeft: token('space.100'),
	marginRight: token('space.100'),
	userSelect: 'none',
	backgroundColor: token('color.background.neutral.hovered'),
});

export function ToolbarSeparator(): JSX.Element {
	return <span css={separatorStyles} data-testid="editor-toolbar-seperator" />;
}
