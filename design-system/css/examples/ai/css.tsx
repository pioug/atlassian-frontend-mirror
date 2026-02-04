/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = css({
	display: 'inline-block',
	paddingBlockEnd: token('space.100'),
	paddingBlockStart: token('space.100'),
	paddingInlineEnd: token('space.100'),
	paddingInlineStart: token('space.100'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
const _default_1: JSX.Element[] = [<div css={styles}>Styled content</div>];
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export default _default_1;
