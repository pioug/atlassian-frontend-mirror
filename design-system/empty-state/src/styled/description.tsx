/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const descriptionStyles = css({
	color: token('color.text', N800),
	marginBlockEnd: token('space.300', '24px'),
	marginBlockStart: token('space.0', '0px'),
});

/**
 * __Description__
 *
 * Description of Empty State.
 *
 * @internal
 */
const Description: FC<{ children: ReactNode }> = ({ children }) => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
	<p css={descriptionStyles}>{children}</p>
);

export default Description;
