/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const styles = css({
	backgroundColor: token('elevation.surface'),
	border: `${token('border.width')} solid ${token('color.border.brand')}`,
	color: token('color.text'),
	font: token('font.body'),
	marginBlockEnd: token('space.050'),
	marginBlockStart: token('space.050'),
	marginInlineEnd: token('space.050'),
	marginInlineStart: token('space.050'),
	paddingBlockEnd: token('space.100'),
	paddingBlockStart: token('space.100'),
	paddingInlineEnd: token('space.100'),
	paddingInlineStart: token('space.100'),
});

const Example = (): JSX.Element => <div css={styles} />;
export default Example;
