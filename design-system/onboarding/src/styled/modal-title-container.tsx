/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const modalTitleContainerStyles = css({
	marginBlockEnd: token('space.100'),
});

/**
 * __Modal title container__
 *
 * Keeps the heading's bottom margin (rather than padding) around `ModalTitle`, so spacing
 * collapses with the body exactly as the original heading did.
 */
export const ModalTitleContainer = ({ children }: { children: ReactNode }): JSX.Element => (
	<div css={modalTitleContainerStyles}>{children}</div>
);
