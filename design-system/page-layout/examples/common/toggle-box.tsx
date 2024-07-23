/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

type ToggleBoxProps = {
	children: ReactNode;
};

const toggleBoxStyles = css({
	padding: '1rem',
	position: 'fixed',
	zIndex: 1,
	backgroundColor: token('color.background.neutral.subtle'),
	border: `1px solid ${token('color.border')}`,
	borderRadius: token('border.radius', '3px'),
	insetBlockEnd: '1rem',
	insetInlineStart: '50%',
	transform: 'translate(-50%)',
});

const ToggleBox = ({ children }: ToggleBoxProps) => {
	return <fieldset css={toggleBoxStyles}>{children}</fieldset>;
};

export default ToggleBox;
