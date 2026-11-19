/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = css({
	display: 'inline-block',
	paddingBlockEnd: token('space.100'),
	paddingBlockStart: token('space.100'),
	paddingInlineEnd: token('space.100'),
	paddingInlineStart: token('space.100'),
});

export default function CssExample(): JSX.Element {
	return <div css={styles}>Styled content</div>;
}
