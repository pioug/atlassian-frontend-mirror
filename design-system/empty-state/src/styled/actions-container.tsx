/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const actionsStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	marginBlockEnd: token('space.100', '8px'),
	paddingInlineStart: token('space.500', '40px'),
});

/**
 * __Actions container__
 *
 * A container for actions: primary action, secondary action, and tertiary action.
 *
 * @internal
 */
const ActionsContainer: FC<{ children: ReactNode }> = ({ children }) => (
	<div css={actionsStyles}>{children}</div>
);

export default ActionsContainer;
